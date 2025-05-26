
import React, { useEffect, useState } from 'react';
import ProductForm from './ProductForm';
import { Product } from '@/types/database';

interface ProductFormSafeProps {
  product?: Product;
  categoryId?: string;
  onSave?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
}

// Questo wrapper serve per evitare problemi di race condition e remount quando si apre/chiude il form rapidamente.
const ProductFormSafe: React.FC<ProductFormSafeProps> = ({
  product,
  categoryId,
  onSave,
  onCancel,
  isOpen
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ritarda il rendering del form di un tick
    if (isOpen) {
      setIsReady(false);
      const timer = setTimeout(() => setIsReady(true), 0);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !isReady) {
    return null;
  }

  return (
    <ProductForm
      product={product}
      categoryId={categoryId}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default ProductFormSafe;
