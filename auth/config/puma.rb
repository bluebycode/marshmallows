# frozen_string_literal: true

max_threads_count = ENV.fetch('RAILS_MAX_THREADS') { 5 }
min_threads_count = ENV.fetch('RAILS_MIN_THREADS') { max_threads_count }
threads min_threads_count, max_threads_count

environment ENV.fetch('RAILS_ENV') { 'development' }
pidfile ENV.fetch('PIDFILE') { 'tmp/pids/server.pid' }

if Rails.env.production?
    bind 'unix:///tmp/puma.sock'
else
    port ENV.fetch('PORT') { 3000 }
end

plugin :tmp_restart
