import React, { useState } from 'react';
import { 
  Card, CardActions, CardContent, CardMedia, 
  Button, Typography, IconButton, Box, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CartIcon from './carrinho_comp';
import './card_img.css';

// Interfaces
export interface Produto {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: 'salgado' | 'doce' | 'bebida' | 'outros';
  description?: string;
}

const categoriaColors = {
  salgado: "#ff9800",
  doce: "#e91e63",
  bebida: "#2196f3",
  outros: "#4caf50"
};

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface ImgMediaCardProps {
  produto: Produto;
  onAdd: (produto: Produto, quantity: number) => void;
}

export default function ImgMediaCard({ produto, onAdd }: ImgMediaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

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
        
        {/* FACE DA FRENTE */}
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
              R$ {Number(produto.price).toFixed(2).replace('.', ',')}
            </Typography>
            <Typography variant="body2" sx={{ color: categoriaColors[produto.category], fontWeight: 600 }}>
              {capitalize(produto.category)}
            </Typography>
          </CardContent>

          {/* SELETOR DE QUANTIDADE */}
          <Box sx={{ px: 2, mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} 
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
              onClick={() => {
                onAdd(produto, quantity); 
                setQuantity(1); 
              }}
            >
              <CartIcon />
            </IconButton>
          </CardActions>
        </Card>

        {/* FACE DE TRÁS */}
        <Card className="flip-card-back" sx={{ borderRadius: 3, boxShadow: 5, backgroundColor: '#fafafa' }}>
          <CardContent sx={{ flexGrow: 1, mt: 2, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', borderBottom: '2px solid', borderColor: categoriaColors[produto.category] 
            }}>
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
