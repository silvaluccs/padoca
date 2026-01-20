import React, { useState } from 'react';
import { 
  Card, CardActions, CardContent, CardMedia, 
  Button, Typography, IconButton, Box, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CartIcon from './CartIcon';
import type { Produto } from '../../types';
import { formatCurrency, capitalize } from '../../utils/formatters';
import { CATEGORIA_COLORS } from '../../utils/constants';
import './ProductCard.css';

interface ProductCardProps {
  produto: Produto;
  onAdd: (produto: Produto, quantity: number) => void;
}

export default function ProductCard({ produto, onAdd }: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    onAdd(produto, quantity); 
    setQuantity(1);
  };

  if (!produto) return null;

  return (
    <Box 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
      sx={{ 
        width: { xs: '100%', sm: 280, md: 320 }, 
        height: 430,
        transition: 'transform 0.3s ease-in-out', 
        '&:hover': {
          transform: 'scale(1.05)', 
          zIndex: 10 
        }
      }} 
    >
      <Box className="flip-card-inner">
        
        {/* FRENTE */}
        <Card className="flip-card-front" sx={{ borderRadius: 3, boxShadow: 5 }}>
          <CardMedia
            component="img"
            alt={produto.name}
            height="180"
            image={produto.image_url}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent sx={{ flexGrow: 1, textAlign: 'left', pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2, mb: 1 }}>
              {produto.name}
            </Typography>
            <Typography variant="body1" color="primary" sx={{ fontSize: 18, fontWeight: 600 }}>
              R$ {formatCurrency(produto.price)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: CATEGORIA_COLORS[produto.category], fontWeight: 600 }}
            >
              {capitalize(produto.category)}
            </Typography>
          </CardContent>

          {/* Seletor de Quantidade */}
          <Box sx={{ px: 2, mb: 1 }}>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={2} 
              sx={{ 
                bgcolor: '#f5f5f5', 
                borderRadius: 2, 
                width: 'fit-content',
                border: '1px solid #e0e0e0'
              }}
            >
              <IconButton size="small" onClick={handleDecrement} color="error">
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton size="small" onClick={handleIncrement} color="success">
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
            <Button size="small" variant="outlined" onClick={() => setIsFlipped(true)}>
              Detalhes
            </Button>
            <IconButton 
              color="primary" 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
              onClick={handleAddToCart}
            >
              <CartIcon />
            </IconButton>
          </CardActions>
        </Card>

        {/* VERSO */}
        <Card className="flip-card-back" sx={{ borderRadius: 3, boxShadow: 5, backgroundColor: '#fafafa' }}>
          <CardContent sx={{ flexGrow: 1, mt: 2, textAlign: 'left' }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                borderBottom: '2px solid', 
                borderColor: CATEGORIA_COLORS[produto.category] 
              }}
            >
              Detalhes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
              {produto.description || "Sem descrição disponível."}
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button size="small" variant="contained" fullWidth onClick={() => setIsFlipped(false)}>
              Voltar
            </Button>
          </CardActions>
        </Card>

      </Box>
    </Box>
  );
}
