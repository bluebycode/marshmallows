# frozen_string_literal: true

class LoginController < ApplicationController
  def new; end

  def create
    filtered_params = params.require(:login).permit(:username)
    user = User.find_by(username: filtered_params[:login][:username])

    if user.present?
      get_options = WebAuthn::Credential.options_for_get(allow: user.credentials.pluck(:external_id))

      user.update!(current_challenge: get_options.challenge)

      render json: { webauthn: get_options, username: user.username }
    else
      render json: { status: 'error', message: 'User does not exist' }
    end
  end

  def callback
    filtered_params = params.require(:login).permit(:user, :challenge, :publicKeyCredential)
    webauthn_credential = WebAuthn::Credential.from_create(params[:login][:publicKeyCredential])

    user = User.find_by(username: params[:login][:username])
    render json: { status: 'error', message: 'User does not exist' } unless user

    key = user.keys.find_by(external_id: Base64.strict_encode64(webauthn_credential.raw_id))

    begin
      webauthn_credential.verify(
        user.current_challenge,
        public_key: key.public_key,
        sign_count: key.sign_count
      )

      key.update!(sign_count: webauthn_credential.sign_count)

      render json: { status: 'ok' }
    rescue WebAuthn::Error => e
      render json: { status: 'error', message: "Verification failed: #{e.message}" }
    end
  end
end
