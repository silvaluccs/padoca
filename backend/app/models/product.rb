class Product < ApplicationRecord
  has_many :combo_products, dependent: :destroy
  has_many :combos, through: :combo_products

  has_one_attached :image

  enum :category, {
    salgado: "salgado",
    doce: "doce",
    bebida: "bebida",
    outros: "outros"
  }

  validates :name, :price, :category, :description, presence: true
  validates :image, attached: true, content_type: [ :png, :jpg, :jpeg ], size: { less_than: 5.megabytes, message: "should be less than 5MB" }
end
