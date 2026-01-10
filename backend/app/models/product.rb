class Product < ApplicationRecord
  has_many :combo_products, dependent: :destroy
  has_many :combos, through: :combo_products

  validates :name, :price, :category, presence: true
end
