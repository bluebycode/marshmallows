# frozen_string_literal: true

Rails.application.routes.draw do

  resource :registration, only: [:new, :create] do
    post :callback
  end

  root to: "home#index"
end
