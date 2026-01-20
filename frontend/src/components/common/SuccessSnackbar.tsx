import { Snackbar, Alert } from '@mui/material';

interface SuccessSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessSnackbar({ open, message, onClose }: SuccessSnackbarProps) {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={2000} 
      onClose={onClose} 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert severity="success" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
