class Order < ApplicationRecord
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items

  validates :customer_name, :total_price, :status, presence: true
end
