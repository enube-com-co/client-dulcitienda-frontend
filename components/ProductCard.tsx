"use client";

import Image from "next/image";
import { memo } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  sku: string;
  name: string;
  basePrice: number;
  minimumOrderQuantity: number;
  images: string[];
  isFeatured: boolean;
  inventory?: {
    quantityAvailable: number;
  } | null;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  showBadge?: boolean;
}

// Memoized component for performance
export const ProductCard = memo(function ProductCard({ 
  product, 
  priority = false,
  showBadge = true
}: ProductCardProps) {
  const isLowStock = product.inventory && product.inventory.quantityAvailable < 20;
  const hasImage = product.images && product.images.length > 0;
  
  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <Link href={`/producto/${product.sku}`} className="block">
        <div className="aspect-square relative bg-gray-100 overflow-hidden">
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
              🍬
            </div>
          )}
          
          {/* Badges */}
          {showBadge && (
            <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
              {product.isFeatured && (
                <span className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  🔥 Destacado
                </span>
              )}
              
              {isLowStock && (
                <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  ⚡ Pocas unidades
                </span>
              )}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base leading-tight">
            {product.name}
          </h3>
          
          {/* Rating (placeholder for future reviews) */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <span className="text-xs text-gray-500">(4.8)</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-base sm:text-lg font-bold text-pink-600">
                ${product.basePrice.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-gray-500">
                Min: {product.minimumOrderQuantity} unidades
              </span>
              
              {product.inventory && (
                <span className={`text-[10px] sm:text-xs font-medium ${
                  isLowStock ? "text-red-500" : "text-green-600"
                }`}>
                  {product.inventory.quantityAvailable} disponibles
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Quick add button */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <button 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 opacity-90 hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            // Dispatch custom event for cart
            window.dispatchEvent(new CustomEvent('add-to-cart', { 
              detail: { productId: product._id, sku: product.sku, name: product.name, price: product.basePrice }
            }));
          }}
        >
          <span>Agregar</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </article>
  );
});

// Loading skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

// Grid component with proper loading states
interface ProductGridProps {
  products: Product[] | undefined;
  loading?: boolean;
  limit?: number;
}

export function ProductGrid({ products, loading = false, limit = 8 }: ProductGridProps) {
  if (loading || products === undefined) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(limit)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-700">No hay productos disponibles</h3>
        <p className="text-gray-500">Intenta con otra categoría o búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, index) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          priority={index < 4} // Prioritize above-fold images
        />
      ))}
    </div>
  );
}
