import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Stack, Button, CircularProgress 
} from '@mui/material';
import type { OrderForm } from '../../types';

interface OrderFormDialogProps {
  open: boolean;
  onClose: () => void;
  formData: OrderForm;
  onUpdateField: <K extends keyof OrderForm>(field: K, value: OrderForm[K]) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function OrderFormDialog({ 
  open, 
  onClose, 
  formData, 
  onUpdateField, 
  onSubmit,
  loading 
}: OrderFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dados do Pedido</DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField 
            label="Nome" 
            fullWidth 
            value={formData.name} 
            onChange={(e) => onUpdateField('name', e.target.value)} 
          />
          
          <TextField 
            label="WhatsApp" 
            fullWidth 
            value={formData.phone} 
            onChange={(e) => onUpdateField('phone', e.target.value)} 
          />
          
          <TextField
            label="Data e Hora da Entrega/Retirada"
            type="datetime-local"
            fullWidth
            value={formData.deliveryDate}
            onChange={(e) => onUpdateField('deliveryDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField 
            select 
            label="Entrega" 
            value={formData.deliveryType} 
            onChange={(e) => onUpdateField('deliveryType', e.target.value as 'retirada' | 'delivery')}
          >
            <MenuItem value="retirada">Retirada</MenuItem>
            <MenuItem value="delivery">Delivery</MenuItem>
          </TextField>
          
          <TextField 
            select 
            label="Pagamento" 
            value={formData.paymentMethod} 
            onChange={(e) => onUpdateField('paymentMethod', e.target.value as 'cartao' | 'dinheiro' | 'pix')}
          >
            <MenuItem value="cartao">Cartão</MenuItem>
            <MenuItem value="dinheiro">Dinheiro</MenuItem>
            <MenuItem value="pix">PIX</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Confirmar Pedido"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
