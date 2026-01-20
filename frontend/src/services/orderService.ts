import api from './api';
import type { CartItem, OrderForm, CreatedOrder, Produto } from '../types';

interface OrderPayload {
  order: {
    customer_name: string;
    phone: string;
    delivery_type: string;
    payment_method: string;
    delivery_date: string;
    order_items_attributes: Array<{
      item_type: string;
      item_id: number;
      quantity: number;
    }>;
  };
}

export const createOrder = async (
  formData: OrderForm,
  cart: CartItem[]
): Promise<CreatedOrder> => {
  const orderItemsAttributes = cart.map(item => ({
    item_type: (item.product as Produto).category ? "Product" : "Combo",
    item_id: item.product.id,
    quantity: item.quantity
  }));

  const payload: OrderPayload = {
    order: {
      customer_name: formData.name,
      phone: formData.phone,
      delivery_type: formData.deliveryType,
      payment_method: formData.paymentMethod,
      delivery_date: formData.deliveryDate,
      order_items_attributes: orderItemsAttributes
    }
  };

  const response = await api.post('/orders', payload);
  return response.data;
};

export const generateWhatsAppLink = async (orderId: number): Promise<string> => {
  const response = await api.post(`/orders/${orderId}/checkout`);
  return response.data.whatsapp_url;
};
