import { useState, useCallback } from 'react';
import type { OrderForm } from '../types';
import { getCurrentDateTime } from '../utils/formatters';

const initialFormState: OrderForm = {
  name: '',
  phone: '',
  deliveryType: 'retirada',
  paymentMethod: 'pix',
  deliveryDate: getCurrentDateTime()
};

export const useOrderForm = () => {
  const [formData, setFormData] = useState<OrderForm>(initialFormState);

  const updateField = useCallback(<K extends keyof OrderForm>(
    field: K, 
    value: OrderForm[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
  }, []);

  const isValid = useCallback(() => {
    return !!(formData.name && formData.phone && formData.deliveryDate);
  }, [formData]);

  return {
    formData,
    updateField,
    resetForm,
    isValid
  };
};
