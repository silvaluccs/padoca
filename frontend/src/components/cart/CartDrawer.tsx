import { Drawer, Box, Typography, IconButton, List, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItemType[];
  totalValue: number;
  onUpdateQuantity: (itemName: string, delta: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ 
  open, 
  onClose, 
  cart, 
  totalValue, 
  onUpdateQuantity,
  onCheckout 
}: CartDrawerProps) {
  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose} 
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          bgcolor: 'primary.main', 
          color: 'white' 
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Meu Pedido
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Items List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        <List>
          {cart.map((item, index) => (
            <CartItem 
              key={index} 
              item={item} 
              onUpdateQuantity={onUpdateQuantity} 
            />
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 3, borderTop: '1px solid #eee', bgcolor: '#fafafa' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'green', mb: 2 }}>
          Total: R$ {formatCurrency(totalValue)}
        </Typography>
        <Button 
          variant="contained" 
          fullWidth 
          size="large" 
          color="success" 
          disabled={cart.length === 0} 
          onClick={onCheckout}
        >
          Finalizar Pedido
        </Button>
      </Box>
    </Drawer>
  );
}
