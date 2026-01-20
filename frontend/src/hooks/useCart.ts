import { useState, useCallback, useMemo } from 'react';
import type { CartItem, Item } from '../types';


export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Item, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.product.name === item.name);
      if (existingItem) {
        return prev.map((i) => 
          i.product.name === item.name 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      }
      return [...prev, { product: item, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((itemName: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.name === itemName) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: Math.max(0, newQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalValue = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
    [cart]
  );

  const totalItems = useMemo(() => 
    cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  return {
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    totalValue,
    totalItems
  };
};
