import { ListItem, Box, Typography, Stack, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemName: string, delta: number) => void;
}

export default function CartItem({ item, onUpdateQuantity }: CartItemProps) {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <ListItem 
      divider 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        py: 2 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        <Typography variant="body2">
          R$ {formatCurrency(product.price)}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1} 
          sx={{ bgcolor: '#f5f5f5', borderRadius: 1, px: 1 }}
        >
          <IconButton 
            size="small" 
            onClick={() => onUpdateQuantity(product.name, -1)}
          >
            {quantity === 1 ? (
              <DeleteIcon fontSize="small" color="error" />
            ) : (
              <RemoveIcon fontSize="small" />
            )}
          </IconButton>
          
          <Typography sx={{ fontWeight: 'bold' }}>
            {quantity}
          </Typography>
          
          <IconButton 
            size="small" 
            onClick={() => onUpdateQuantity(product.name, 1)} 
            color="primary"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
        
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          R$ {formatCurrency(itemTotal)}
        </Typography>
      </Box>
    </ListItem>
  );
}
