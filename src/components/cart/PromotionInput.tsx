'use client';

import { useState } from 'react';
import { usePromotions } from '@/hooks/usePromotions';
import { Id } from '@/convex/_generated/dataModel';

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: Id<"categories">;
}

interface PromotionInputProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  userId?: Id<"users">;
}

export function PromotionInput({ items, subtotal, shippingCost, userId }: PromotionInputProps) {
  const [code, setCode] = useState('');
  const { 
    appliedPromotions, 
    isLoading, 
    error, 
    successMessage, 
    applyCode, 
    removePromotion,
    calculateTotals 
  } = usePromotions();

  const cart = { items, subtotal, shippingCost };
  const totals = calculateTotals(cart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    await applyCode(code.trim(), cart, userId);
    if (!error) setCode('');
  };

  return (
    <div className="promotion-input space-y-4">
      {/* Input de código */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Código de descuento"
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Aplicando...' : 'Aplicar'}
        </button>
      </form>

      {/* Mensajes */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {/* Promociones aplicadas */}
      {appliedPromotions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Promociones aplicadas:</p>
          {appliedPromotions.map((promo) => (
            <div 
              key={promo.code}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-green-800">{promo.code}</p>
                <p className="text-sm text-green-600">{promo.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-700">
                  -${promo.discountAmount.toLocaleString()}
                </span>
                <button
                  onClick={() => removePromotion(promo.code)}
                  className="text-red-500 hover:text-red-700 text-sm underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      {totals.discount > 0 && (
        <div className="pt-3 border-t border-gray-200 space-y-1">
          <div className="flex justify-between text-green-700 font-medium">
            <span>Total ahorrado:</span>
            <span>-${totals.discount.toLocaleString()}</span>
          </div>
          {totals.shipping === 0 && shippingCost > 0 && (
            <div className="flex justify-between text-green-600 text-sm">
              <span>Envío gratis aplicado</span>
              <span>-$${shippingCost.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
