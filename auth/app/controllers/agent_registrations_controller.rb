# frozen_string_literal: true

class AgentRegistrationsController < ApplicationController
  def create
    agent = AgentRegister.new

    if agent.save # Do not save, but check if it could be saved
      render json: { status: 'ok', token: agent.token }
    else
      render json: { status: 'error', message: 'Agent could not be created' }
    end
  end

  def check
    filtered_params = params.require(:agent_registration).permit(:token)

    agent = AgentRegister.find_by(token: filtered_params[:token])

    if agent.present? && agent.token_valid?
      agent.delete
      render json: { status: 'ok' }
    else
      render json: { status: 'error', message: 'Invalid token' }
    end
  end
end
