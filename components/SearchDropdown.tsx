"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { getProductImageUrl, categoryColors } from "@/lib/product-images";

interface SearchDropdownProps {
  onClose?: () => void;
}

export default function SearchDropdown({ onClose }: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useQuery(
    api.products.searchProducts,
    query.length >= 2 ? { query } : { query: "" },
  );
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getCategorySlug = (categoryId: string) => {
    const cat = categories?.find((c) => c._id === categoryId);
    return cat?.slug || "";
  };

  const handleSelect = () => {
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length >= 2);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Busca tu antojo..."
          className="w-full pl-4 pr-12 py-3 bg-[#FFFBF0] text-[#1E1012] border-2 border-[#1E1012]/10 rounded-full focus:border-[#7C3AED] focus:outline-none transition-colors"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#7C3AED] text-white rounded-full flex items-center justify-center">
          <Search size={18} />
        </div>

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
          />

          {/* Results */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto z-50">
            {searchResults === undefined ? (
              <div className="p-4 text-center text-gray-500">Buscando...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No encontramos nada... pero tenemos 550+ cosas más
              </div>
            ) : (
              <>
                <div className="p-3 text-sm text-gray-500 border-b">
                  {searchResults.length} resultado
                  {searchResults.length !== 1 ? "s" : ""}
                </div>

                {searchResults.map((product) => {
                  const categorySlug = getCategorySlug(product.categoryId);
                  const imageData = getProductImageUrl(
                    product.name,
                    categorySlug,
                  );

                  return (
                    <Link
                      key={product._id}
                      href={`/producto/${product.sku}`}
                      onClick={handleSelect}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b last:border-0"
                    >
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br ${categoryColors[categorySlug] || "from-gray-100 to-gray-200"} flex items-center justify-center flex-shrink-0`}
                      >
                        {imageData.isReal ? (
                          <img
                            src={imageData.url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">{imageData.url}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-display font-medium text-gray-800 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </p>
                      </div>

                      <p className="font-bold text-[#1E1012]">
                        ${product.basePrice.toLocaleString()}
                      </p>
                    </Link>
                  );
                })}

                <Link
                  href={`/buscar?q=${encodeURIComponent(query)}`}
                  onClick={handleSelect}
                  className="block p-3 text-center text-[#FF2D78] font-medium hover:bg-pink-50 transition-colors"
                >
                  Ver todos los resultados →
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
