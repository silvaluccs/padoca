import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingScreen() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        mt: 10 
      }}
    >
      <CircularProgress />
      <Typography>Carregando cardápio...</Typography>
    </Box>
  );
}
