"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  initialQuantity: number;
  minQuantity: number;
  onAdd: (quantity: number) => void;
  className?: string;
  compact?: boolean;
  step?: number;
}

export function QuantitySelector({
  initialQuantity,
  minQuantity,
  onAdd,
  className = "",
  compact = false,
  step = 1,
}: QuantitySelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showCheck, setShowCheck] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (checkTimerRef.current) {
      clearTimeout(checkTimerRef.current);
      checkTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const resetAutoCollapse = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onAdd(quantity);
      setIsExpanded(false);
      setShowCheck(true);
      checkTimerRef.current = setTimeout(() => {
        setShowCheck(false);
      }, 1200);
    }, 3000);
  }, [onAdd, quantity]);

  const handleExpand = () => {
    setIsExpanded(true);
    setQuantity(initialQuantity);
    resetAutoCollapse();
  };

  const handleDecrement = () => {
    setQuantity((prev) => {
      const next = Math.max(minQuantity, prev - step);
      return next;
    });
    resetAutoCollapse();
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + step);
    resetAutoCollapse();
  };

  if (showCheck) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-2 text-green-600",
          compact && "py-1",
          className
        )}
        onClick={(e) => e.preventDefault()}
        aria-live="polite"
      >
        <Check className="w-5 h-5" aria-hidden="true" />
        <span className="sr-only">Agregado al carrito</span>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div onClick={(e) => e.preventDefault()} className={className}>
        <button
          type="button"
          onClick={handleExpand}
          className={cn(
            "bg-[#FF2D78] text-white rounded-full w-full font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D78] focus-visible:ring-offset-2",
            compact ? "py-1.5 text-xs" : "py-2 text-sm"
          )}
          aria-label={`Agregar ${initialQuantity} unidades al carrito`}
        >
          Agregar
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2",
        compact && "gap-1",
        className
      )}
      onClick={(e) => e.preventDefault()}
      role="group"
      aria-label="Selector de cantidad"
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= minQuantity}
        className={cn(
          "rounded-full bg-gray-200 text-[#1E1012] flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2",
          compact ? "w-7 h-7" : "w-8 h-8"
        )}
        aria-label="Disminuir cantidad"
      >
        <Minus className={cn("w-4 h-4", compact && "w-3 h-3")} />
      </button>
      
      <span 
        className={cn(
          "font-semibold text-[#1E1012] min-w-[2rem] text-center",
          compact ? "text-sm" : "text-sm"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      
      <button
        type="button"
        onClick={handleIncrement}
        className={cn(
          "rounded-full bg-[#FF2D78] text-white flex items-center justify-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D78] focus-visible:ring-offset-2",
          compact ? "w-7 h-7" : "w-8 h-8"
        )}
        aria-label="Aumentar cantidad"
      >
        <Plus className={cn("w-4 h-4", compact && "w-3 h-3")} />
      </button>
    </div>
  );
}
