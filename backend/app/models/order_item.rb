
class OrderItem < ApplicationRecord
  belongs_to :order

  validates :item_type, :item_id, :quantity, presence: true

  before_validation :calculate_prices, on: :create
  after_save :update_order_total
  after_destroy :update_order_total

  private

  def update_order_total
    order.recalculate_total_price!
  end

  def calculate_prices
    case item_type
    when "Product"
      product = Product.find_by(id: item_id)
      if product.nil?
        errors.add(:item_id, "Product not found")
        return
      end
      self.name_snapshot = product.name
      self.unit_price = product.price

    when "Combo"
      combo = Combo.find_by(id: item_id)
      if combo.nil?
        errors.add(:item_id, "Combo not found")
        return

      end
      self.name_snapshot = combo.name
      self.unit_price = combo.price
    end
    self.subtotal = unit_price * quantity
  end
end
