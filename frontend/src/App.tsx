import React, { useEffect, useState } from 'react';
import { Typography, Box, Container, CircularProgress } from '@mui/material';
import ImgMediaCard from './componentes/card_img';
import ComboCard from './componentes/combo_card';
import api from './services/api';

export default function App() {
  const [data, setData] = useState({ products: [], combos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/")
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando cardápio...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          alignItems: 'stretch' // Garante que cards na mesma linha tenham a mesma altura
        }}
      >
        {/* Renderiza Produtos */}
        {data.products?.map((p) => (
          <ImgMediaCard key={`prod-${p.id}`} produto={p} />
        ))}

        {/* Renderiza Combos logo em seguida, no mesmo fluxo Flexbox */}
        {data.combos?.map((c) => (
          <ComboCard key={`combo-${c.id}`} combo={c} />
        ))}
      </Box>
    </Container>
  );
}
