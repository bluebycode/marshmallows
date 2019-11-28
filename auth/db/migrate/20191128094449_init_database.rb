# frozen_string_literal: true

class InitDatabase < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :username, index: { unique: true }
      t.string :current_challenge
      t.string :webauthn_id

      t.timestamps
    end

    create_table :keys do |t|
      t.string :external_id
      t.string :public_key
      t.integer :login_count, default: 0, null: false
      t.belongs_to :user, index: true

      t.timestamps
    end
  end
end
