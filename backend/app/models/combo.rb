class Combo < ApplicationRecord
  has_many :combo_products, dependent: :destroy
  has_many :products, through: :combo_products

  validates :name, :price, presence: true
end
