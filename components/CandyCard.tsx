"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";
import { StickerBadge } from "@/components/StickerBadge";
import { QuantitySelector } from "@/components/QuantitySelector";
import { cn } from "@/lib/utils";

interface Product {
  _id: string;
  _creationTime?: number;
  sku: string;
  name: string;
  basePrice: number;
  minimumOrderQuantity: number;
  images: string[];
  isFeatured: boolean;
  inventory?: { quantityAvailable: number } | null;
}

interface CandyCardProps {
  product: Product;
  priority?: boolean;
  showBadge?: boolean;
  className?: string;
}

export const CandyCard = memo(function CandyCard({
  product,
  priority = false,
  showBadge = true,
  className,
}: CandyCardProps) {
  const isLowStock =
    product.inventory != null && product.inventory.quantityAvailable < 20;
  const isNew =
    product._creationTime != null &&
    Date.now() - product._creationTime < 7 * 24 * 60 * 60 * 1000;
  const hasImage = product.images && product.images.length > 0;

  const handleAdd = useCallback((quantity: number) => {
    window.dispatchEvent(
      new CustomEvent("add-to-cart", {
        detail: {
          productId: product._id,
          sku: product.sku,
          name: product.name,
          price: product.basePrice,
          quantity,
        },
      })
    );
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }, [product]);

  // Badge priority: low stock > featured > new
  const badge = showBadge
    ? isLowStock
      ? { text: "VOLANDO", color: "#FBBF24", rotation: 2 }
      : product.isFeatured
        ? { text: "POPULAR", color: "#FF2D78", rotation: -3 }
        : isNew
          ? { text: "RECIÉN LLEGADO", color: "#34D399", rotation: -2 }
          : null
    : null;

  const stockText = product.inventory
    ? `${product.inventory.quantityAvailable} disponibles`
    : null;

  return (
    <article
      className={cn(
        "group bg-white rounded-2xl shadow-md overflow-hidden",
        "hover:-translate-y-1 hover:shadow-xl",
        "transition-all duration-300 ease-out",
        "focus-within:ring-2 focus-within:ring-[#7C3AED] focus-within:ring-offset-2",
        className
      )}
    >
      <Link
        href={`/producto/${product.sku}`}
        className="block outline-none"
        aria-label={`Ver detalles de ${product.name}`}
      >
        <div className="aspect-square relative bg-gray-50 overflow-hidden">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={priority ? "eager" : "lazy"}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              quality={85}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-pink-100 to-yellow-100">
              <span aria-hidden="true">🍬</span>
            </div>
          )}

          {badge && (
            <div className="absolute top-2 left-2">
              <StickerBadge
                text={badge.text}
                color={badge.color}
                rotation={badge.rotation}
              />
            </div>
          )}
          
          {/* Hover overlay with quick action */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="font-display font-semibold text-[#1E1012] text-sm sm:text-base line-clamp-2 mb-1 group-hover:text-[#7C3AED] transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <p className="text-lg sm:text-xl font-bold text-[#1E1012]">
              ${product.basePrice.toLocaleString()}
            </p>
            <span className="text-xs text-[#1E1012]/50">
              Min. {product.minimumOrderQuantity} uds
            </span>
          </div>
          
          {stockText && (
            <p
              className={cn(
                "text-xs mt-1",
                isLowStock ? "text-amber-600 font-medium" : "text-green-600"
              )}
              aria-live="polite"
            >
              {isLowStock && <span aria-hidden="true">🔥 </span>}
              {stockText}
            </p>
          )}
        </div>
      </Link>

      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <QuantitySelector
          initialQuantity={product.minimumOrderQuantity}
          minQuantity={product.minimumOrderQuantity}
          onAdd={handleAdd}
        />
      </div>
    </article>
  );
});

export function CandyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-2/3" />
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-1/3" />
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full" />
      </div>
    </div>
  );
}

interface CandyCardGridProps {
  products: Product[] | undefined;
  loading?: boolean;
  limit?: number;
}

export function CandyCardGrid({
  products,
  loading = false,
  limit = 8,
}: CandyCardGridProps) {
  if (loading || products === undefined) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(limit)].map((_, i) => (
          <CandyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-[#FFFBF0] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-lg font-semibold text-[#1E1012] mb-2">
          No encontramos productos
        </h3>
        <p className="text-[#1E1012]/60 max-w-md mx-auto">
          Intenta con otros términos de búsqueda o explora nuestras categorías
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, index) => (
        <CandyCard
          key={product._id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
