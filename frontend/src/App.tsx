import React, { useEffect, useState } from 'react';
import { 
  Typography, Box, Container, CircularProgress, 
  Snackbar, Alert, Fab, Badge, Drawer, 
  List, ListItem, IconButton, Button, Stack, 
  TextField, MenuItem, Dialog, DialogContent, 
  DialogActions, DialogTitle, Paper
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ComboCard from './componentes/combo_card'; // Assumindo que você tem este componente

import ImgMediaCard from './componentes/card_img';

import api from './services/api';

// Interfaces
export interface Produto {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: 'salgado' | 'doce' | 'bebida' | 'outros';
  descricao?: string;
}



// --- Interfaces ---
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
}

interface CreatedOrder {
  id: number;
  customer_name: string;
  total_price: string; // Vem como string do backend as vezes
}

export default function App() {
  const [data, setData] = useState<DataState>({ products: [], combos: [] });
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado do Carrinho
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Estados de Checkout e Formulário
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false); // O "Papel SVG"
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  
  const [formData, setFormData] = useState<OrderForm>({
    name: '',
    phone: '',
    deliveryType: 'retirada',
    paymentMethod: 'pix'
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

  // --- Lógica do Carrinho ---
  const handleAddToCart = (item: Produto | Combo, quantity: number) => {
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

  // --- Lógica de Checkout ---
  
  // 1. Abre o formulário ao clicar em Finalizar no Drawer
  const handleOpenForm = () => {
    setIsDrawerOpen(false);
    setIsFormOpen(true);
  };

  // 2. Cria o Pedido no Backend
  const handleCreateOrder = async () => {
    if (!formData.name || !formData.phone) {
      alert("Por favor, preencha nome e telefone.");
      return;
    }

    setLoadingCheckout(true);

    // Mapeia os itens para o formato que o Rails aceita (attributes)
    const orderItemsAttributes = cart.map(item => {
      // Tenta inferir se é Produto ou Combo. 
      // Produtos têm 'category', combos não (baseado nas interfaces).
      const isProduct = (item.product as Produto).category !== undefined;
      
      return {
        item_type: isProduct ? "Product" : "Combo",
        item_id: item.product.id,
        quantity: item.quantity
      };
    });

    const payload = {
      order: {
        customer_name: formData.name,
        phone: formData.phone,
        delivery_type: formData.deliveryType,
        payment_method: formData.paymentMethod,
        delivery_date: new Date().toISOString(), // Data atual por enquanto
        order_items_attributes: orderItemsAttributes
      }
    };

    try {
      const response = await api.post('/orders', payload);
      setCreatedOrder(response.data);
      setCart([]); // Limpa o carrinho
      setIsFormOpen(false);
      setIsReceiptOpen(true); // Abre o "Papel" do pedido
      setLoadingCheckout(false);
    } catch (error) {
      console.error("Erro ao criar pedido", error);
      alert("Erro ao processar pedido. Tente novamente.");
      setLoadingCheckout(false);
    }
  };

  // 3. Finaliza enviando para o WhatsApp
  const handleFinalizeWhatsApp = async () => {
    if (!createdOrder) return;
    
    try {
      const response = await api.post(`/orders/${createdOrder.id}/checkout`);
      const { whatsapp_url } = response.data;
      window.open(whatsapp_url, '_blank');
      setIsReceiptOpen(false);
    } catch (error) {
      console.error("Erro ao gerar link whatsapp", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando cardápio...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative', minHeight: '100vh' }}>
      
      {/* Grade de Produtos */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {data.products?.map((p) => (
          <ImgMediaCard key={`prod-${p.id}`} produto={p} onAdd={handleAddToCart} />
        ))}
        {data.combos?.map((c) => (
          <ComboCard key={`combo-${c.id}`} combo={c} onAdd={handleAddToCart} />
        ))}
      </Box>

      {/* FAB - Botão Flutuante */}
      {totalItems > 0 && (
        <Fab 
          color="primary" 
          sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
          onClick={() => setIsDrawerOpen(true)}
        >
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}

      {/* DRAWER - Carrinho */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Meu Pedido</Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
          <List>
            {cart.map((item, index) => (
              <ListItem key={index} divider sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    R$ {Number(item.product.price).toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: '#f5f5f5', borderRadius: 1, px: 1 }}>
                    <IconButton size="small" onClick={() => handleUpdateCartQty(item.product.name, -1)} color={item.quantity === 1 ? "error" : "default"}>
                      {item.quantity === 1 ? <DeleteIcon fontSize="small" /> : <RemoveIcon fontSize="small" />}
                    </IconButton>
                    <Typography sx={{ fontWeight: 'bold', minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => handleUpdateCartQty(item.product.name, 1)} color="primary">
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
          {cart.length === 0 && (
            <Typography sx={{ textAlign: 'center', mt: 4, color: '#999' }}>Seu carrinho está vazio.</Typography>
          )}
        </Box>

        <Box sx={{ p: 3, borderTop: '1px solid #eee', bgcolor: '#fafafa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'green' }}>
              R$ {totalValue.toFixed(2).replace('.', ',')}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            color="success" 
            disabled={cart.length === 0}
            onClick={handleOpenForm}
          >
            Avançar para Dados
          </Button>
        </Box>
      </Drawer>

      {/* DIALOG 1: Formulário de Dados */}
      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Dados para Entrega</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField 
              label="Seu Nome" 
              fullWidth 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextField 
              label="Telefone (WhatsApp)" 
              fullWidth 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <TextField
              select
              label="Tipo de Entrega"
              value={formData.deliveryType}
              onChange={(e) => setFormData({...formData, deliveryType: e.target.value as any})}
            >
              <MenuItem value="retirada">Retirada no Balcão</MenuItem>
              <MenuItem value="delivery">Delivery</MenuItem>
            </TextField>
            <TextField
              select
              label="Método de Pagamento"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
            >
              <MenuItem value="cartao">Cartão</MenuItem>
              <MenuItem value="dinheiro">Dinheiro</MenuItem>
              <MenuItem value="pix">PIX</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsFormOpen(false)} color="inherit">Cancelar</Button>
          <Button 
            onClick={handleCreateOrder} 
            variant="contained" 
            disabled={loadingCheckout}
          >
            {loadingCheckout ? <CircularProgress size={24} /> : "Gerar Pedido"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG 2: Recibo de Papel (O SVG Visual) */}
      <Dialog 
        open={isReceiptOpen} 
        onClose={() => {}} // Impede fechar clicando fora para obrigar a enviar
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent', // Fundo transparente para ver o "papel"
            boxShadow: 'none'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          perspective: '1000px'
        }}>
          {/* O Papel Amarelo */}
          <Paper sx={{ 
            width: '100%', 
            bgcolor: '#fff9c4', // Amarelo papel
            p: 3, 
            position: 'relative',
            border: '2px dashed #bbb', // Borda de destaque
            transform: 'rotate(-1deg)', // Leve inclinação para realismo
            boxShadow: '10px 10px 20px rgba(0,0,0,0.2)'
          }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <ReceiptLongIcon sx={{ fontSize: 60, color: '#795548' }} />
              <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#5d4037' }}>
                PEDIDO #{createdOrder?.id}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#795548' }}>
                {formData.name}
              </Typography>
            </Box>

            <Box sx={{ borderTop: '1px solid #d7ccc8', borderBottom: '1px solid #d7ccc8', py: 2, my: 2 }}>
               <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'center' }}>
                 ITENS DO PEDIDO CONFIRMADOS
               </Typography>
               <Typography variant="h4" sx={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', mt: 1, color: '#3e2723' }}>
                 R$ {Number(createdOrder?.total_price || totalValue).toFixed(2).replace('.', ',')}
               </Typography>
            </Box>

            <Typography variant="body2" sx={{ textAlign: 'center', fontFamily: 'monospace', mb: 3 }}>
              Clique abaixo para enviar ao restaurante.
            </Typography>

            <Button 
              variant="contained" 
              color="success" 
              fullWidth 
              size="large"
              startIcon={<WhatsAppIcon />}
              onClick={handleFinalizeWhatsApp}
              sx={{ borderRadius: 0, fontWeight: 'bold' }}
            >
              Enviar para WhatsApp
            </Button>
          </Paper>
        </Box>
      </Dialog>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={2000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="success" variant="filled">{message}</Alert>
      </Snackbar>
    </Container>
  );
}
