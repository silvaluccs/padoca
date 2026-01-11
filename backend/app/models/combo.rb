class Combo < ApplicationRecord
  has_many :combo_products, dependent: :destroy
  has_many :products, through: :combo_products

  has_one_attached :image

  validates :name, :price, presence: true
  validates :image, attached: true, content_type: [ :png, :jpg, :jpeg ], size: { less_than: 5.megabytes, message: "should be less than 5MB" }
end
