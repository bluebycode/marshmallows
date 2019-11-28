# frozen_string_literal: true

Rails.application.routes.draw do
  resource :registration, only: %i[new create] do
    post :callback
  end

  resource :login, only: %i[new create] do
    post :callback
  end

  root to: 'home#index'
end
