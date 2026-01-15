import React, { useEffect, useState } from 'react'; 
import { 
  Typography, Box, Container, CircularProgress, 
  Snackbar, Alert, Fab, Badge, Drawer, 
  List, ListItem, Divider, IconButton, Button, Stack, ListItemText
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';     // Ícone +
import RemoveIcon from '@mui/icons-material/Remove'; // Ícone -
import DeleteIcon from '@mui/icons-material/Delete'; // Ícone Lixeira
import ImgMediaCard from './componentes/card_img';
import ComboCard from './componentes/combo_card';
import api from './services/api';

// Interfaces atualizadas para serem compartilhadas
export interface Produto {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: 'salgado' | 'doce' | 'bebida' | 'outros';
  descricao?: string;
}

export interface Combo {
  id: number;
  name: string;
  price: number;
  image_url: string;
  descricao?: string;
}

// Interface do Item no Carrinho
interface CartItem {
  product: Produto | Combo;
  quantity: number;
}

interface DataState {
  products: Produto[];
  combos: Combo[];
}

export default function App() {
  const [data, setData] = useState<DataState>({ products: [], combos: [] });
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado do Carrinho (Array de Objetos)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

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

  // Adiciona item vindo do Card
  const handleAddToCart = (item: Produto | Combo, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.product.name === item.name);
      if (existingItem) {
        // Se já existe, soma a quantidade
        return prev.map((i) => 
          i.product.name === item.name 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      }
      // Se não existe, adiciona novo
      return [...prev, { product: item, quantity }];
    });

    setMessage(`${quantity}x ${item.name} adicionado!`);
    setOpenSnackbar(true);
  };

  // Atualiza quantidade DENTRO do Carrinho (+ ou -)
  const handleUpdateCartQty = (itemName: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.name === itemName) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(0, newQty) }; // Não deixa ficar negativo
        }
        return item;
      }).filter((item) => item.quantity > 0); // Remove se for 0
    });
  };

  // Calcula total do carrinho
  const totalValue = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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

      {/* DRAWER - Janela do Carrinho */}
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
                
                {/* Linha 1: Nome e Preço Unitário */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    R$ {Number(item.product.price).toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>

                {/* Linha 2: Controles de Quantidade e Subtotal */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  
                  {/* Controlador +/- dentro do Carrinho */}
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

        {/* Rodapé do Carrinho */}
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
            onClick={() => alert("Indo para pagamento...")}
          >
            Finalizar Compra
          </Button>
        </Box>
      </Drawer>

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
