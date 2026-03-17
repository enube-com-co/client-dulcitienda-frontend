"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { CandyCard } from "@/components/CandyCard";

export default function BuscarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = useQuery(
    api.products.searchProducts,
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : { query: "" },
  );

  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      {/* Search Section */}
      <div className="bg-[#FFFBF0] pt-12 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-3xl text-[#1E1012] text-center mb-6">
            Buscar Productos
          </h1>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca tu antojo..."
              className="w-full pl-12 pr-12 py-4 rounded-full text-lg bg-white border-2 border-[#1E1012]/10 focus:outline-none focus:border-[#7C3AED] text-[#1E1012]"
              autoFocus
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1012]/40"
              size={24}
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E1012]/40 hover:text-[#1E1012]/70"
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
            <Search size={64} className="mx-auto text-[#1E1012]/20 mb-4" />
            <p className="text-[#1E1012]/50 text-lg">
              Escribe al menos 2 caracteres para buscar
            </p>
          </div>
        ) : searchResults === undefined ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2D78] border-t-transparent mx-auto"></div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-[#1E1012]/20 mb-4" />
            <p className="text-[#1E1012]/50 text-lg mb-2">
              No encontramos nada... pero tenemos 550+ cosas más
            </p>
            <Link
              href="/catalogo"
              className="text-[#7C3AED] hover:underline mt-4 inline-block font-medium"
            >
              Ver todo el catálogo →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[#1E1012]/60 mb-6">
              {searchResults.length} resultado
              {searchResults.length !== 1 ? "s" : ""} para "{searchQuery}"
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <CandyCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
