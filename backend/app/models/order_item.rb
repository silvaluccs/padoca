class OrderItem < ApplicationRecord
  belongs_to :order

  validates :item_type, :item_id, :name_snapshot,
            :unit_price, :quantity, :subtotal, presence: true
end
