Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.

  post "auth/login", to: "auth#login"

  resources :products, :combos

  post "orders/:id/checkout", to: "orders#checkout", as: "checkout_order"
  resources :orders, only: [:show, :create, :destroy] do
    resources :order_items
  end

  # root "posts#index"
  root "application#index"
end
