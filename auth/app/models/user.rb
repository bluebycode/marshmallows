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
    self.token_expiration_date = 10.minutes.from_now
  end
end
