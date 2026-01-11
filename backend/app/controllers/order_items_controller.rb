class OrderItemsController < ApplicationController
  def index
    @order_items = OrderItem.all
    render json: @order_items
  end

  def show
    @order_item = OrderItem.find(params[:id])
    render json: @order_item
  end

  def create
    @order_item = OrderItem.new(order_item_params)
    if @order_item.save
      render json: @order_item, status: :created
    else
      render json: @order_item.errors, status: :unprocessable_entity
    end
  end

  def update
    @order_item = OrderItem.find(params[:id])
    if @order_item.update(order_item_params)
      render json: @order_item
    else
      render json: @order_item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @order_item = OrderItem.find(params[:id])
    @order_item.destroy
    render json: { message: 'OrderItem deleted successfully' }, status: :ok
  end

  private

  def order_item_params
    # Ajustado o require para :order_item (singular)
    params.require(:order_item).permit(:quantity, :item_type, :item_id)
  end
end
