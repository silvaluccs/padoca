class AddDeliveryAndPaymentFieldsToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :delivery_type, :string, default: 0, null: false
    add_column :orders, :payment_method, :string, default: 0, null: false
    add_column :orders, :delivery_date, :datetime
    add_column :orders, :phone, :string
  end
end
