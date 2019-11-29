# frozen_string_literal: true

Rails.application.routes.draw do
  resource :registration, only: :create do
    post :callback
    post :invite
  end

  resource :login, only: :create do
    post :callback
  end

  root to: 'home#index'
end
