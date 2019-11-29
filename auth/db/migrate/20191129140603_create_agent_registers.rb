class CreateAgentRegisters < ActiveRecord::Migration[6.0]
  def change
    create_table :agent_registers do |t|
      t.text :token
      t.datetime :expiration_date

      t.timestamps
    end
  end
end
