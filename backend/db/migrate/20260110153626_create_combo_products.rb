class CreateComboProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :combo_products do |t|
      t.references :combo, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :quantity, null: false, default: 1

      t.timestamps
    end

      add_index :combo_products, [:combo_id, :product_id], unique: true
  end
end


