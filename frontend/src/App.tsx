import React, { useEffect, useState } from 'react';
import { 
  Typography, Box, Container, CircularProgress, 
  Snackbar, Alert, Fab, Badge, Drawer, 
  List, ListItem, IconButton, Button, Stack, 
  TextField, MenuItem, Dialog, DialogContent, 
  DialogActions, DialogTitle, Paper, Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import ImgMediaCard from './componentes/card_img';
import ComboCard from './componentes/combo_card';
import api from './services/api';

// --- Interfaces ---
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
}

interface CartItem {
  product: Produto | Combo;
  quantity: number;
}

interface DataState {
  products: Produto[];
  combos: Combo[];
}

interface OrderForm {
  name: string;
  phone: string;
  deliveryType: 'retirada' | 'delivery';
  paymentMethod: 'cartao' | 'dinheiro' | 'pix';
  deliveryDate: string;
}

interface CreatedOrder {
  id: number;
  customer_name: string;
  total_price: string;
  delivery_date: string;
}

export default function App() {
  const [data, setData] = useState<DataState>({ products: [], combos: [] });
  const [loading, setLoading] = useState<boolean>(true);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [lastOrderItems, setLastOrderItems] = useState<CartItem[]>([]); // Para mostrar no resumo do papel
  
  const [formData, setFormData] = useState<OrderForm>({
    name: '',
    phone: '',
    deliveryType: 'retirada',
    paymentMethod: 'pix',
    deliveryDate: new Date().toISOString().slice(0, 16) // Default para agora
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    api.get("/")
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (item: Produto | Combo, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.product.name === item.name);
      if (existingItem) {
        return prev.map((i) => 
          i.product.name === item.name ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product: item, quantity }];
    });
    setMessage(`${quantity}x ${item.name} adicionado!`);
    setOpenSnackbar(true);
  };

  const handleUpdateCartQty = (itemName: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.name === itemName) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(0, newQty) };
        }
        return item;
      }).filter((item) => item.quantity > 0);
    });
  };

  const totalValue = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenForm = () => {
    setIsDrawerOpen(false);
    setIsFormOpen(true);
  };

  const handleCreateOrder = async () => {
    if (!formData.name || !formData.phone || !formData.deliveryDate) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoadingCheckout(true);

    const orderItemsAttributes = cart.map(item => ({
      item_type: (item.product as Produto).category ? "Product" : "Combo",
      item_id: item.product.id,
      quantity: item.quantity
    }));

    const payload = {
      order: {
        customer_name: formData.name,
        phone: formData.phone,
        delivery_type: formData.deliveryType,
        payment_method: formData.paymentMethod,
        delivery_date: formData.deliveryDate,
        order_items_attributes: orderItemsAttributes
      }
    };

    try {
      const response = await api.post('/orders', payload);
      setCreatedOrder(response.data);
      setLastOrderItems([...cart]); // Salva os itens para o resumo no papel
      setCart([]); 
      setIsFormOpen(false);
      setIsReceiptOpen(true);
    } catch (error) {
      console.error("Erro ao criar pedido", error);
      alert("Erro ao processar pedido.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleFinalizeWhatsApp = async () => {
    if (!createdOrder) return;
    try {
      const response = await api.post(`/orders/${createdOrder.id}/checkout`);
      window.open(response.data.whatsapp_url, '_blank');
      setIsReceiptOpen(false);
    } catch (error) {
      console.error("Erro ao gerar link whatsapp", error);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}><CircularProgress /><Typography>Carregando cardápio...</Typography></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative', minHeight: '100vh' }}>
      
      {/* Grade de Itens */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {data.products?.map((p) => <ImgMediaCard key={`prod-${p.id}`} produto={p} onAdd={handleAddToCart} />)}
        {data.combos?.map((c) => <ComboCard key={`combo-${c.id}`} combo={c} onAdd={handleAddToCart} />)}
      </Box>

      {/* FAB Carrinho */}
      {totalItems > 0 && (
        <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }} onClick={() => setIsDrawerOpen(true)}>
          <Badge badgeContent={totalItems} color="error"><ShoppingCartIcon /></Badge>
        </Fab>
      )}

      {/* Drawer Carrinho */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Meu Pedido</Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
          <List>
            {cart.map((item, index) => (
              <ListItem key={index} divider sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.product.name}</Typography>
                  <Typography variant="body2">R$ {Number(item.product.price).toFixed(2).replace('.', ',')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: '#f5f5f5', borderRadius: 1, px: 1 }}>
                    <IconButton size="small" onClick={() => handleUpdateCartQty(item.product.name, -1)}>{item.quantity === 1 ? <DeleteIcon fontSize="small" color="error" /> : <RemoveIcon fontSize="small" />}</IconButton>
                    <Typography sx={{ fontWeight: 'bold' }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => handleUpdateCartQty(item.product.name, 1)} color="primary"><AddIcon fontSize="small" /></IconButton>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ p: 3, borderTop: '1px solid #eee', bgcolor: '#fafafa' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'green', mb: 2 }}>Total: R$ {totalValue.toFixed(2).replace('.', ',')}</Typography>
          <Button variant="contained" fullWidth size="large" color="success" disabled={cart.length === 0} onClick={handleOpenForm}>Finalizar Pedido</Button>
        </Box>
      </Drawer>

      {/* Dialog Formulário */}
      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Dados do Pedido</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="Nome" fullWidth value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <TextField label="WhatsApp" fullWidth value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <TextField
              label="Data e Hora da Entrega/Retirada"
              type="datetime-local"
              fullWidth
              value={formData.deliveryDate}
              onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
            <TextField select label="Entrega" value={formData.deliveryType} onChange={(e) => setFormData({...formData, deliveryType: e.target.value as any})}>
              <MenuItem value="retirada">Retirada</MenuItem>
              <MenuItem value="delivery">Delivery</MenuItem>
            </TextField>
            <TextField select label="Pagamento" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}>
              <MenuItem value="cartao">Cartão</MenuItem>
              <MenuItem value="dinheiro">Dinheiro</MenuItem>
              <MenuItem value="pix">PIX</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsFormOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateOrder} variant="contained" disabled={loadingCheckout}>{loadingCheckout ? <CircularProgress size={24} /> : "Confirmar Pedido"}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Recibo (Papel) */}
      <Dialog open={isReceiptOpen} maxWidth="xs" fullWidth PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Paper sx={{ width: '100%', bgcolor: '#fff9c4', p: 3, border: '2px dashed #bbb', transform: 'rotate(-1deg)', boxShadow: 5 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <ReceiptLongIcon sx={{ fontSize: 50, color: '#795548' }} />
              <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>PEDIDO #{createdOrder?.id}</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>Cliente: {formData.name}</Typography>
            </Box>

            <Divider sx={{ my: 1, borderColor: '#d7ccc8' }} />
            
            {/* Resumo dos Itens */}
            <Box sx={{ my: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', display: 'block', mb: 1 }}>RESUMO DO PEDIDO:</Typography>
              {lastOrderItems.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{item.quantity}x {item.product.name}</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>R$ {(item.product.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 1, borderColor: '#d7ccc8' }} />

            <Box sx={{ py: 1, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#3e2723' }}>
                TOTAL: R$ {Number(createdOrder?.total_price).toFixed(2).replace('.', ',')}
              </Typography>
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mt: 1, color: '#5d4037' }}>
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                   {new Date(formData.deliveryDate).toLocaleString('pt-BR')}
                </Typography>
              </Stack>
            </Box>

            <Button variant="contained" color="success" fullWidth startIcon={<WhatsAppIcon />} onClick={handleFinalizeWhatsApp} sx={{ mt: 2, borderRadius: 0 }}>
              Enviar WhatsApp
            </Button>
          </Paper>
        </Box>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert severity="success" variant="filled">{message}</Alert>
      </Snackbar>
    </Container>
  );
}
