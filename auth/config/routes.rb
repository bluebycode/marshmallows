# frozen_string_literal: true

Rails.application.routes.draw do
  resource :registration, only: :create do
    post :callback
    post :invite
  end

  resource :login, only: :create do
    post :callback
  end

  resource :agent_registration, only: :create do
    post :check
  end

  root to: 'home#index'
end
