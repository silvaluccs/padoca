class OrdersController < ApplicationController
  PHONE_NUMBER = ENV["WHATSAPP_PHONE_NUMBER"]

  def show
    @order = Order.find(params[:id])
    render json: @order, include: :order_items
  end

  def create
    @order = Order.new(order_params)
    if @order.save
      render json: @order, status: :created
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @order = Order.find(params[:id])
    @order.destroy
    render json: { message: 'Order deleted successfully', status: :no_content }
  end

  def checkout
    @order = Order.find(params[:id])

    whatsapp_message = "Pedido de ##{@order.customer_name} Detalhes:\n"
    @order.order_items.each do |item|
      whatsapp_message += "- #{item.quantity} x #{item.name_snapshot} (R$ #{change_to_comma(item.subtotal)})\n"
    end

    whatsapp_message += "Total: R$ #{change_to_comma(@order.total_price)}\n"
    whatsapp_message += "Tipo de entrega: #{@order.delivery_type}\n"
    whatsapp_message += "Método de pagamento: #{@order.payment_method}\n"
    whatsapp_message += "Data e horario de entrega: #{@order.delivery_date.strftime('%d/%m/%Y às %H:%M')}\n"
    whatsapp_message += "Telefone do cliente: #{@order.phone}\n"
    whatsapp_message += ("-" * 30) + "\n"

    whatsapp_message += "Pedido feito via App de Pedidos.\n"
    whatsapp_message += "#{@order.updated_at.strftime('%d/%m/%Y às %H:%M')}"


    uri_encoded_message = ERB::Util.url_encode(whatsapp_message)

    whatsapp_url = "https://wa.me/#{PHONE_NUMBER}?text=#{uri_encoded_message}"

    render json: { whatsapp_url: whatsapp_url, order: @order, status: :ok }
  end

  private
    def change_to_comma(price)
      price.to_s.gsub(".", ",")
    end

    def order_params
      params.require(:order).permit(:id, :customer_name, :phone, :delivery_type, :payment_method, :delivery_date, order_items_attributes: [:quantity, :item_type, :item_id])
    end
end
