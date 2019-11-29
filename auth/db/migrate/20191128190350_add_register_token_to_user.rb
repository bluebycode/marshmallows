class AddRegisterTokenToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :register_token, :text
    add_column :users, :token_expiration_date, :datetime
  end
end
