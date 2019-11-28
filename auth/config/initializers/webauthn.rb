WebAuthn.configure do |config|
    config.origin = "http://localhost:3000"
    config.rp_name = "MarshMallows"
  
    # Default algorithms: ["ES256", "PS256", "RS256"]
    # config.algorithms << "ALGORITHM_NAME"
  end
  
  