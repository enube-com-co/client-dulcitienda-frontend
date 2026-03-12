'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: Id<"categories">;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
}

export interface AppliedPromotion {
  promotionId: Id<"promotions">;
  code: string;
  name: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountAmount: number;
  description: string;
}

interface UsePromotionsReturn {
  promotions: ReturnType<typeof useQuery<typeof api.promotions.getAll>>;
  activePromotions: ReturnType<typeof useQuery<typeof api.promotions.getActive>>;
  appliedPromotions: AppliedPromotion[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  applyCode: (code: string, cart: Cart, userId?: Id<"users">) => Promise<boolean>;
  removePromotion: (code: string) => void;
  clearPromotions: () => void;
  calculateTotals: (cart: Cart) => {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
}

export function usePromotions(): UsePromotionsReturn {
  const promotions = useQuery(api.promotions.getAll);
  const activePromotions = useQuery(api.promotions.getActive);
  const validateAndApply = useAction(api.promotions.validateAndApply);
  
  const [appliedPromotions, setAppliedPromotions] = useState<AppliedPromotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const applyCode = useCallback(async (
    code: string, 
    cart: Cart, 
    userId?: Id<"users">
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await validateAndApply({
        code,
        cart,
        userId,
        alreadyApplied: appliedPromotions,
      });

      if (!result.success) {
        setError(result.error || "Error al aplicar el código");
        return false;
      }

      if (result.promotion) {
        setAppliedPromotions(prev => [...prev, result.promotion!]);
        setSuccessMessage(
          `¡${result.promotion.name} aplicado! Ahorraste $${result.discountAmount.toLocaleString()}`
        );
      }

      return true;
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [appliedPromotions, validateAndApply]);

  const removePromotion = useCallback((code: string) => {
    setAppliedPromotions(prev => prev.filter(p => p.code !== code));
    setSuccessMessage("Promoción eliminada");
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  const clearPromotions = useCallback(() => {
    setAppliedPromotions([]);
    setError(null);
    setSuccessMessage(null);
  }, []);

  const calculateTotals = useCallback((cart: Cart) => {
    const discount = appliedPromotions.reduce((sum, promo) => sum + promo.discountAmount, 0);
    const hasFreeShipping = appliedPromotions.some(p => p.type === "FREE_SHIPPING");
    const shipping = hasFreeShipping ? 0 : cart.shippingCost;

    return {
      subtotal: cart.subtotal,
      shipping,
      discount,
      total: cart.subtotal + shipping - discount,
    };
  }, [appliedPromotions]);

  return {
    promotions,
    activePromotions,
    appliedPromotions,
    isLoading,
    error,
    successMessage,
    applyCode,
    removePromotion,
    clearPromotions,
    calculateTotals,
  };
}
