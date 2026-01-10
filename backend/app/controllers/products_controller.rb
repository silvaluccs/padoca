class ProductsController < ApplicationController
  before_action :authorize_request, only: [:create, :update, :destroy]

  def index
    render json: Product.all
  end

  def show
    product = Product.find(params[:id])
    render json: product
  end

  def create
    product = Product.new(product_params)

    if product.save
      render json: product, status: :created
    else
      render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update

    product = Product.find(params[:id])

    if product.update(product_params)
      render json: product, status: :ok
    else
      render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
    end

  end

  def destroy
    product = Product.find(params[:id])

    if product.destroy
      render json: { message: 'Product deleted successfully' }, status: :no_content
    else
      render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
