# frozen_string_literal: true

# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'

ENV.fetch('MYSQL_USER')
ENV.fetch('MYSQL_PASS')
ENV.fetch('PORT'){ 3000 }
ENV.fetch('WEB_URL')
ENV.fetch('USER_TOKEN_EXPIRATION_MINUTES')
ENV.fetch('AGENT_TOKEN_EXPIRATION_MINUTES')

run Rails.application
