class Order < ApplicationRecord
  has_many :order_items, dependent: :destroy

  enum :delivery_type, { retirada: 0, delivery: 1 }
  enum :payment_method, { cartao: 0, dinheiro: 1, pix: 2 }

  validates :customer_name, :phone, presence: true

  before_save :calculate_total_price

  def recalculate_total_price!
    update_column(:total_price, order_items.sum(:subtotal))
  end

  private

  def calculate_total_price
    self.total_price = order_items.sum(:subtotal)
  end
end
