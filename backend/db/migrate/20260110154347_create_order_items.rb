class CreateOrderItems < ActiveRecord::Migration[8.1]
  def change
    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.string :item_type, null: false
      t.bigint :item_id, null: false
      t.string :name_snapshot, null: false
      t.decimal :unit_price, precision: 10, scale: 2, null: false
      t.integer :quantity, null: false

      t.decimal :subtotal, precision: 10, scale: 2, null: false

      t.timestamps
    end

    add_index :order_items, [ :item_type, :item_id ]
  end
end
