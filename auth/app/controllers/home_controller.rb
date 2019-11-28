# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    render json: { status: 'ok', version: File.read(Rails.root.join('version.txt')) }
  end
end
