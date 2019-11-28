# frozen_string_literal: true

class RegistrationsController < ApplicationController
  def new; end

  def create
    filtered_params = params.require(:registration).permit(:username)
    user = User.new(username: filtered_params[:registration][:username])

    create_options = WebAuthn::Credential.options_for_create(
      user: {
        name: user.username,
        id: user.webauthn_id
      }
    )

    if user.valid? # Do not save, but check if it could be saved
      data = { status: 'ok', challenge: create_options.challenge, user_attributes: user.attributes }
      render json: data
    else
      render json: { status: 'error', message: 'User already exists' }
    end
  end

  def callback
    filtered_params = params.require(:registration).permit(:user, :challenge, :publicKeyCredential)
    webauthn_credential = WebAuthn::Credential.from_create(params[:registration][:publicKeyCredential])

    user = User.create!(params[:registration][:user])
    webauthn_credential.verify(filtered_params[:registration][:challenge])

    key = user.keys.build(
      external_id: Base64.strict_encode64(webauthn_credential.raw_id),
      public_key: webauthn_credential.public_key,
      sign_count: webauthn_credential.sign_count
    )

    if key.save
      render json: { status: 'ok' }
    else
      render json: { status: 'error', message: 'Key not registered' }
    end
  rescue WebAuthn::Error => e
    render json: { status: 'error', message: "Verification failed: #{e.message}" }
  rescue StandardError => e
    render json: { status: 'error', message: 'User could not be created' }
  end
end
