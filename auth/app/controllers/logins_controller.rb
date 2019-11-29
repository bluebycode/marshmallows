# frozen_string_literal: true

class LoginsController < ApplicationController
  def create
    filtered_params = params.require(:login).permit!
    user = User.find_by(username: filtered_params[:username])

    if user.present?
      get_options = WebAuthn::Credential.options_for_get(allow: user.keys.pluck(:external_id))

      user.update!(current_challenge: get_options.challenge)

      render json: JSON.parse(get_options.to_json).merge(user_id: user.id)
    else
      render json: { status: 'error', message: 'User does not exist' }
    end
  end

  def callback
    webauthn_credential = WebAuthn::Credential.from_get(params)

    user = User.find(params[:user_id])
    render json: { status: 'error', message: 'User does not exist' } if user.blank?

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
