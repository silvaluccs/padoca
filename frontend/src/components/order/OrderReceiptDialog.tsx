import { Dialog, Box, Paper, Typography, Divider, Stack, Button } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { CreatedOrder, CartItem } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

interface OrderReceiptDialogProps {
  open: boolean;
  order: CreatedOrder | null;
  items: CartItem[];
  customerName: string;
  deliveryDate: string;
  onSendWhatsApp: () => void;
}

export default function OrderReceiptDialog({ 
  open, 
  order, 
  items, 
  customerName, 
  deliveryDate,
  onSendWhatsApp 
}: OrderReceiptDialogProps) {
  if (!order) return null;

  return (
    <Dialog 
      open={open} 
      maxWidth="xs" 
      fullWidth 
      PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none' } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Paper 
          sx={{ 
            width: '100%', 
            bgcolor: '#fff9c4', 
            p: 3, 
            border: '2px dashed #bbb', 
            transform: 'rotate(-1deg)', 
            boxShadow: 5 
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <ReceiptLongIcon sx={{ fontSize: 50, color: '#795548' }} />
            <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
              PEDIDO #{order.id}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              Cliente: {customerName}
            </Typography>
          </Box>

          <Divider sx={{ my: 1, borderColor: '#d7ccc8' }} />
          
          {/* Items Summary */}
          <Box sx={{ my: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ fontFamily: 'monospace', fontWeight: 'bold', display: 'block', mb: 1 }}
            >
              RESUMO DO PEDIDO:
            </Typography>
            {items.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  {item.quantity}x {item.product.name}
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  R$ {formatCurrency(item.product.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 1, borderColor: '#d7ccc8' }} />

          {/* Total */}
          <Box sx={{ py: 1, textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#3e2723' }}
            >
              TOTAL: R$ {formatCurrency(Number(order.total_price))}
            </Typography>
            <Stack 
              direction="row" 
              justifyContent="center" 
              alignItems="center" 
              spacing={1} 
              sx={{ mt: 1, color: '#5d4037' }}
            >
              <CalendarMonthIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                {formatDateTime(deliveryDate)}
              </Typography>
            </Stack>
          </Box>

          {/* WhatsApp Button */}
          <Button 
            variant="contained" 
            color="success" 
            fullWidth 
            startIcon={<WhatsAppIcon />} 
            onClick={onSendWhatsApp} 
            sx={{ mt: 2, borderRadius: 0 }}
          >
            Enviar WhatsApp
          </Button>
        </Paper>
      </Box>
    </Dialog>
  );
}
