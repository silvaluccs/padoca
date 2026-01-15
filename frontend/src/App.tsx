import React, { useEffect, useState } from 'react';
import { 
  Typography, Box, Container, CircularProgress, 
  Snackbar, Alert, Fab, Badge 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Importe o ícone padrão ou o seu
import ImgMediaCard from './componentes/card_img';
import ComboCard from './componentes/combo_card';
import api from './services/api';

interface Produto {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: 'salgado' | 'doce' | 'bebida' | 'outros';
}

interface Combo {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface DataState {
  products: Produto[];
  combos: Combo[];
}

export default function App() {
  const [data, setData] = useState<DataState>({ products: [], combos: [] });
  const [loading, setLoading] = useState<boolean>(true);
  
  const [cartItems, setCartItems] = useState<string[]>([]);

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

  const handleAddToCart = (name: string) => {
    setCartItems((prev) => [...prev, name]);
    
    setMessage(`${name} adicionado ao carrinho!`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

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

      {cartItems.length > 0 && (
        <Fab 
          color="primary" 
          aria-label="carrinho"
          sx={{
            position: 'fixed',
            bottom: 32, 
            right: 32,
            zIndex: 1000
          }}
        >
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={2000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} 
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
