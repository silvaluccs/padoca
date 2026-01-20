// src/types.ts

export interface Produto {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: 'salgado' | 'doce' | 'bebida' | 'outros';
  description?: string;
}

export interface Combo {
  id: number;
  name: string;
  price: number;
  image_url: string;
  descricao?: string;
  products?: Produto[];
}

export interface CartItem {
  product: Produto | Combo;
  quantity: number;
}

export interface DataState {
  products: Produto[];
  combos: Combo[];
}

export interface OrderForm {
  name: string;
  phone: string;
  deliveryType: 'retirada' | 'delivery';
  paymentMethod: 'cartao' | 'dinheiro' | 'pix';
  deliveryDate: string;
}

export interface CreatedOrder {
  id: number;
  customer_name: string;
  total_price: string;
  delivery_date: string;
}

export type Item = Produto | Combo;
