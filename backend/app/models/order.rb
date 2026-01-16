class Order < ApplicationRecord
  # ADICIONE A LINHA ABAIXO PARA PERMITIR SALVAR OS ITENS JUNTO COM O PEDIDO
  has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items

  enum :delivery_type, { retirada: 0, delivery: 1 }
  enum :payment_method, { cartao: 0, dinheiro: 1, pix: 2 }

  validates :customer_name, :phone, presence: true

  before_save :calculate_total_price

  def recalculate_total_price!
    update_column(:total_price, order_items.sum(:subtotal))
  end

  private

  def calculate_total_price
    # O self.order_items funciona aqui porque o accepts_nested_attributes_for
    # já terá instanciado os itens na memória antes de salvar
    self.total_price = order_items.map { |i| i.unit_price * i.quantity }.sum
  end
end
