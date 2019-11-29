# frozen_string_literal: true

class RegistrationsController < ApplicationController
  def new; end

  def invite
    filtered_params = params.require(:registration).permit(:username)
    user = User.new(username: filtered_params[:username])

    if user.save
      render json: { status: 'ok', token: user.register_token }
    else
      render json: { status: 'error', message: 'User could not be created' }
    end
  end

  def create
    filtered_params = params.require(:registration).permit(:username, :token)

    if filtered_params[:token].blank?
      render json: { status: 'error', message: 'Token not found' } && return
    end

    user = User.find_by(register_token: filtered_params[:token],
                        username: filtered_params[:username])

    if user.blank?
      render json: { status: 'error', message: 'Invalid username or token' } && return
    elsif user.token_expiration_date.before?(10.minutes.ago)
      user.delete
      render json: { status: 'error', message: 'Token expired' } && return
    end

    create_options = WebAuthn::Credential.options_for_create(
      user: {
        name: user.username,
        id: user.webauthn_id
      }
    )

    if user.valid? # Do not save, but check if it could be saved
      render json: create_options
    else
      render json: { status: 'error', message: 'User already exists' }
    end
  end

  def callback
    webauthn_credential = WebAuthn::Credential.from_create(params)
    user = User.find_by(webauthn_id: params[:user][:id], username: params[:user][:name])
    webauthn_credential.verify(params[:challenge])

    key = Key.new(
      external_id: Base64.strict_encode64(webauthn_credential.raw_id),
      public_key: webauthn_credential.public_key,
      sign_count: webauthn_credential.sign_count,
      user_id: user.id
    )

    if key.save
      user.update!(register_token: nil, token_expiration_date: nil)
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
