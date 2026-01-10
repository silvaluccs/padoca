class ProductSerializer < Blueprinter::Base
  identifier :id
  fields :name, :price, :category, :active

  field :image_url do |product|
    if product.image.attached?
      # Usamos rails_blob_url especificando o host manualmente
      Rails.application.routes.url_helpers.rails_blob_url(
        product.image, 
        host: 'localhost:3000'
      )
    end
  end
end
