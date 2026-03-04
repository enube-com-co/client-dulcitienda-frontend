"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, ShoppingCart, X, ChevronRight } from "lucide-react";
import { getProductImageUrl, categoryColors } from "@/lib/product-images";

interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  packSize: number;
}

function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('dulcitienda-cart');
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return { cartCount };
}

export default function BuscarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { cartCount } = useCart();
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const searchResults = useQuery(api.products.searchProducts, 
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : { query: "" }
  );
  
  const categories = useQuery(api.products.getCategories);

  const getCategorySlug = (categoryId: string) => {
    const cat = categories?.find(c => c._id === categoryId);
    return cat?.slug || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🍭
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Dulcitienda
                </h1>
              </div>
            </Link>

            <Link href="/carrito" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
              <ShoppingCart size={24} />
              <span className="bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-pink-600 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center mb-6">Buscar Productos</h1>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="w-full pl-12 pr-4 py-4 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-pink-300"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchQuery.length < 2 ? (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Escribe al menos 2 caracteres para buscar</p>
          </div>
        ) : searchResults === undefined ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto"></div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron productos para "{searchQuery}"</p>
            <Link href="/catalogo" className="text-pink-600 hover:underline mt-4 inline-block">
              Ver todo el catálogo →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => {
                const categorySlug = getCategorySlug(product.categoryId);
                const imageData = getProductImageUrl(product.name, categorySlug);
                
                return (
                  <Link key={product._id} href={`/producto/${product.sku}`}>
                    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className={`bg-gradient-to-br ${categoryColors[categorySlug] || 'from-gray-100 to-gray-200'} aspect-square flex items-center justify-center`}>
                        {imageData.isReal ? (
                          <img 
                            src={imageData.url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = imageData.fallback;
                            }}
                          />
                        ) : (
                          <span className="text-5xl">{imageData.url}</span>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
                        
                        <p className="text-lg font-bold text-pink-600">${product.basePrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
