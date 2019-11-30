# frozen_string_literal: true

class AgentRegister < ApplicationRecord
  before_create :set_token
  validates :token, uniqueness: { case_sensitive: true }

  def set_token
    self.token = SecureRandom.alphanumeric(64)
    in_x = ENV.fetch('AGENT_TOKEN_EXPIRATION_MINUTES').to_i
    self.expiration_date = in_x.minutes.from_now
  end

  def token_valid?
    expiration_date.after?(Time.zone.now)
  end

  def token_invalid?
    !token_valid?
  end
end
