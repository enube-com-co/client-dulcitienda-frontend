"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface QuantitySelectorProps {
  initialQuantity: number;
  minQuantity: number;
  onAdd: (quantity: number) => void;
  className?: string;
}

export function QuantitySelector({
  initialQuantity,
  minQuantity,
  onAdd,
  className = "",
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
      const next = Math.max(minQuantity, prev - 1);
      return next;
    });
    resetAutoCollapse();
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
    resetAutoCollapse();
  };

  if (showCheck) {
    return (
      <div
        className={`flex items-center justify-center py-2 ${className}`}
        onClick={(e) => e.preventDefault()}
      >
        <span className="text-green-500 font-bold text-lg">✓</span>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div onClick={(e) => e.preventDefault()} className={className}>
        <button
          type="button"
          onClick={handleExpand}
          className="bg-[#FF2D78] text-white rounded-full w-full py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Agregar
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-2 ${className}`}
      onClick={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        className="w-8 h-8 rounded-full bg-gray-200 text-[#1E1012] font-bold flex items-center justify-center hover:bg-gray-300 transition-colors"
      >
        -
      </button>
      <span className="text-sm font-semibold text-[#1E1012] min-w-[2rem] text-center">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        className="w-8 h-8 rounded-full bg-[#FF2D78] text-white font-bold flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        +
      </button>
    </div>
  );
}
