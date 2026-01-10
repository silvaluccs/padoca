class CreateCombos < ActiveRecord::Migration[8.1]
  def change
    create_table :combos do |t|
      t.string :name, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.text :description, null: false
      t.boolean :active, default: true, null: false

      t.timestamps
    end
  end
end
