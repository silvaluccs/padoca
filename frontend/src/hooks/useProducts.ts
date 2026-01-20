
import { useState, useEffect } from 'react';
import api from '../services/api';
import type { DataState } from '../types';

export const useProducts = () => {
  const [data, setData] = useState<DataState>({ products: [], combos: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get("/")
      .then(response => {
        const products = response.data?.products || [];
        const combos = response.data?.combos || [];
        
        setData({ products, combos });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setError(err);
        setLoading(false);
        setData({ products: [], combos: [] });
      });
  }, []);

  return { data, loading, error };
};
