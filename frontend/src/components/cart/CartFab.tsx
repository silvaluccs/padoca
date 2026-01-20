import { Fab, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface CartFabProps {
  totalItems: number;
  onClick: () => void;
}

export default function CartFab({ totalItems, onClick }: CartFabProps) {
  if (totalItems === 0) return null;

  return (
    <Fab 
      color="primary" 
      sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }} 
      onClick={onClick}
    >
      <Badge badgeContent={totalItems} color="error">
        <ShoppingCartIcon />
      </Badge>
    </Fab>
  );
}
