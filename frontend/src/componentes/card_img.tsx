import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import CartIcon from './carrinho_comp';

// Mapeia cada categoria para uma cor diferente
const categoriaColors = {
  salgado: "#ff9800",  // laranja
  doce: "#e91e63",     // rosa
  bebida: "#2196f3",   // azul
  outros: "#4caf50"    // verde
};

// Função para capitalizar o nome da categoria
function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface Produto {
  name: string;
  price: number;
  image_url: string;
  category: 'salgado' | 'doce' | 'bebida' | 'outros';
}

interface ImgMediaCardProps {
  produto: Produto;
}

export default function ImgMediaCard({ produto }: ImgMediaCardProps) {
  if (!produto) return null;

  return (
    <Card sx={{
      width: {
        xs: '100%',     // No celular ocupa a largura toda
        sm: 280,        // Em telas médias, 280px (permite mais cards por linha)
        md: 320         // Em telas grandes, 320px
      },
      boxShadow: 5,
      borderRadius: 3,
      transition: 'transform 0.2s',
      '&:hover': { transform: 'scale(1.04)' },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <CardMedia
        component="img"
        alt={produto.name}
        height="180"
        image={produto.image_url}
        sx={{
          objectFit: 'cover',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {produto.name}
        </Typography>
        <Typography variant="body1" color="primary" sx={{ fontSize: 18, fontWeight: 500, mb: 0.5 }}>
          R$ {(Number(produto.price).toFixed(2)).replace('.', ',')}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 500,
            fontSize: 18,
            color: categoriaColors[produto.category] || '#333',
            letterSpacing: 1
          }}
        >
          {capitalize(produto.category)}
        </Typography>
      </CardContent>
      <CardActions sx={{
        display: 'flex',
        justifyContent: 'space-between',
        px: 2,
        pb: 2
      }}>
        <Button size="small" variant="outlined" color="primary">
          Detalhes
        </Button>
        <IconButton color="primary" aria-label="Adicionar ao carrinho" sx={{ ml: 'auto' }}>
          <CartIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

