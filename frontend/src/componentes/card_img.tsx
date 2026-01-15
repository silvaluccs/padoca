import React, { useState } from 'react';
import { 
  Card, CardActions, CardContent, CardMedia, 
  Button, Typography, IconButton, Box 
} from '@mui/material';
import CartIcon from './carrinho_comp';
import './card_img.css'; // Importando o CSS que criamos

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

interface Produto {
  name: string;
  price: number;
  image_url: string;
  category: 'salgado' | 'doce' | 'bebida' | 'outros';
  descricao?: string;
}

interface ImgMediaCardProps {
  produto: Produto;
  onAdd: (name: string) => void;
}

export default function ImgMediaCard({ produto, onAdd }: ImgMediaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!produto) return null;

  return (
    <Box 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
      sx={{ width: { xs: '100%', sm: 280, md: 320 }, height: 400 }}
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
          <CardContent sx={{ flexGrow: 1, textAlign: 'left' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{produto.name}</Typography>
            <Typography variant="body1" color="primary" sx={{ fontSize: 18, fontWeight: 500 }}>
              R$ {Number(produto.price).toFixed(2).replace('.', ',')}
            </Typography>
            <Typography variant="body2" sx={{ color: categoriaColors[produto.category], fontWeight: 600 }}>
              {capitalize(produto.category)}
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
            <Button size="small" variant="outlined" onClick={() => setIsFlipped(true)}>
              Detalhes
            </Button>
            <IconButton color="primary" onClick={() => onAdd(produto.name)}>
              <CartIcon />
            </IconButton>
          </CardActions>
        </Card>

        {/* FACE DE TRÁS */}
        <Card className="flip-card-back" sx={{ borderRadius: 3, boxShadow: 5, backgroundColor: '#fafafa' }}>
          <CardContent sx={{ flexGrow: 1, mt: 2, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              borderBottom: '2px solid', 
              borderColor: categoriaColors[produto.category] 
            }}>
              Detalhes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
              {produto.descricao || "Sem descrição disponível."}
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button size="small" variant="contained" fullWidth onClick={() => setIsFlipped(false)}>
              Ver Menos
            </Button>
          </CardActions>
        </Card>

      </Box>
    </Box>
  );
}
