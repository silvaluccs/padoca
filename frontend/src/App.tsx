import React, { useState } from 'react';
import { Container, Box } from '@mui/material';

// Components
import ProductCard from './components/product/ProductCard';
import ComboCard from './components/product/ComboCard';
import CartFab from './components/cart/CartFab';
import CartDrawer from './components/cart/CartDrawer';
import OrderFormDialog from './components/order/OrderFormDialog';
import OrderReceiptDialog from './components/order/OrderReceiptDialog';
import LoadingScreen from './components/common/LoadingScreen';
import SuccessSnackbar from './components/common/SuccessSnackbar';

// Hooks
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useOrderForm } from './hooks/useOrderForm';

// Services
import { createOrder, generateWhatsAppLink } from './services/orderService';

// Types
import type { Item, CreatedOrder, CartItem } from './types';

export default function App() {
  // Data fetching
  const { data, loading } = useProducts();
  
  // Cart management
  const { cart, addToCart, updateQuantity, clearCart, totalValue, totalItems } = useCart();
  
  // Form management
  const { formData, updateField, isValid } = useOrderForm();
  
  // UI State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  // Order state
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [lastOrderItems, setLastOrderItems] = useState<CartItem[]>([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  
  // Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  // Handlers
  const handleAddToCart = (item: Item, quantity: number) => {
    addToCart(item, quantity);
    setMessage(`${quantity}x ${item.name} adicionado!`);
    setOpenSnackbar(true);
  };

  const handleOpenCheckout = () => {
    setIsDrawerOpen(false);
    setIsFormOpen(true);
  };

  const handleCreateOrder = async () => {
    if (!isValid()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoadingCheckout(true);

    try {
      const order = await createOrder(formData, cart);
      setCreatedOrder(order);
      setLastOrderItems([...cart]);
      clearCart();
      setIsFormOpen(false);
      setIsReceiptOpen(true);
    } catch (error) {
      console.error("Erro ao criar pedido", error);
      alert("Erro ao processar pedido.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!createdOrder) return;
    
    try {
      const whatsappUrl = await generateWhatsAppLink(createdOrder.id);
      window.open(whatsappUrl, '_blank');
      setIsReceiptOpen(false);
    } catch (error) {
      console.error("Erro ao gerar link whatsapp", error);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative', minHeight: '100vh' }}>
      
      {/* Product Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {data.products?.map((product) => (
          <ProductCard 
            key={`prod-${product.id}`} 
            produto={product} 
            onAdd={handleAddToCart} 
          />
        ))}
        
        {data.combos?.map((combo) => (
          <ComboCard 
            key={`combo-${combo.id}`} 
            combo={combo} 
            onAdd={handleAddToCart} 
          />
        ))}
      </Box>

      {/* Cart FAB */}
      <CartFab 
        totalItems={totalItems} 
        onClick={() => setIsDrawerOpen(true)} 
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cart={cart}
        totalValue={totalValue}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleOpenCheckout}
      />

      {/* Order Form */}
      <OrderFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formData={formData}
        onUpdateField={updateField}
        onSubmit={handleCreateOrder}
        loading={loadingCheckout}
      />

      {/* Receipt */}
      <OrderReceiptDialog
        open={isReceiptOpen}
        order={createdOrder}
        items={lastOrderItems}
        customerName={formData.name}
        deliveryDate={formData.deliveryDate}
        onSendWhatsApp={handleSendWhatsApp}
      />

      {/* Success Notification */}
      <SuccessSnackbar
        open={openSnackbar}
        message={message}
        onClose={() => setOpenSnackbar(false)}
      />
    </Container>
  );
}
