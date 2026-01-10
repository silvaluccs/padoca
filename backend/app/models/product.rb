class Product < ApplicationRecord
  has_many :combo_products, dependent: :destroy
  has_many :combos, through: :combo_products

  enum :category, {
    salgado: "salgado",
    doce: "doce",
    bebida: "bebida",
    outros: "outros"
  }

  validates :name, :price, :category, presence: true
end
