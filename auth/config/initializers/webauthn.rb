# frozen_string_literal: true

WebAuthn.configure do |config|
  config.origin = ENV.fetch('WEB_URL')
  config.rp_name = 'MarshMallows'

  # Default algorithms: ["ES256", "PS256", "RS256"]
  # config.algorithms << "ALGORITHM_NAME"
end
