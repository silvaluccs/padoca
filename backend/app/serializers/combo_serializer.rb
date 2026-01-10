class ComboSerializer < Blueprinter::Base
  identifier :id
  fields :name, :price, :description, :active

  field :image_url do |combo|
    if combo.image.attached?
      # Usamos o helper diretamente pelo objeto Rails para evitar conflito de escopo
      Rails.application.routes.url_helpers.rails_blob_url(combo.image, host: 'localhost:3000')
    end
  end

  association :products, blueprint: ProductSerializer
end
