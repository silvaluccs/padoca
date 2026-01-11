class CombosController < ApplicationController
  before_action :authorize_request, only: [ :create, :update, :destroy ]
  before_action :set_combo, only: [ :show, :update, :destroy ]

  def index
    combos = Combo.includes(:image_attachment, products: :image_attachment).all
    render json: ComboSerializer.render(combos)
  end

  def show
    render json: ComboSerializer.render(@combo)
  end

  def create
    combo = Combo.new(combo_params)

    if combo.save
      render json: ComboSerializer.render(combo), status: :created
    else
      render json: { errors: combo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @combo.update(combo_params)
      render json: ComboSerializer.render(@combo), status: :ok
    else
      render json: { errors: @combo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @combo.destroy
      head :no_content
    else
      render json: { errors: @combo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_combo
    @combo = Combo.find(params[:id])
  end

  def combo_params
    params.require(:combo).permit(:name, :price, :description, :active, :image, product_ids: [])
  end
end
