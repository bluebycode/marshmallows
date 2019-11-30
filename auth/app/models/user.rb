# frozen_string_literal: true

class User < ApplicationRecord
  has_many :keys, dependent: :destroy
  validates :username, uniqueness: { case_sensitive: true }
  before_create :generate_invitation_token

  after_initialize do
    self.webauthn_id ||= WebAuthn.generate_user_id
  end

  def generate_invitation_token
    self.register_token = SecureRandom.alphanumeric(64)
    in_x = ENV.fetch('USER_TOKEN_EXPIRATION_MINUTES').to_i
    self.token_expiration_date = in_x.minutes.from_now
  end

  def token_valid?
    token_expiration_date.after?(Time.zone.now)
  end

  def token_invalid?
    !token_valid?
  end
end
