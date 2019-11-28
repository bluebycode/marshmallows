# frozen_string_literal: true

class User < ApplicationRecord
  has_many :keys, dependent: :destroy
  validates :username, presence: true, uniqueness: true

  after_initialize do
    self.webauthn_id ||= WebAuthn.generate_user_id
  end

  def can_delete_credentials?
    credentials.size > ENV.fetch('CREDENTIAL_MIN_AMOUNT', 0)
  end
end
