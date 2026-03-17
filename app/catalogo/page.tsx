"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { ChevronRight, Grid3X3, List } from "lucide-react";
import { CandyCard, CandyCardSkeleton } from "@/components/CandyCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { categoryConfig, defaultCategory } from "@/lib/brand";

export default function Catalogo() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] =
    useState<Id<"categories"> | null>(null);

  const products = useQuery(api.products.getProducts, {
    categoryId: selectedCategory || undefined,
    limit: 100,
  });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || products === undefined || categories === undefined) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7C3AED] border-t-transparent mx-auto" />
          <p className="mt-4 text-[#1E1012]/60 font-medium">
            Cargando catálogo...
          </p>
        </div>
      </div>
    );
  }

  const productList = products?.page ?? [];

  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#1E1012]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-[#1E1012]/50">
            <Link href="/" className="hover:text-[#7C3AED]">
              Inicio
            </Link>
            <ChevronRight size={16} />
            <span className="text-[#1E1012] font-medium">Catálogo</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-display font-bold text-[#1E1012] mb-6">
          Catálogo
        </h1>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-[#7C3AED] text-white"
                : "border-2 border-[#7C3AED]/30 text-[#1E1012]/70 hover:border-[#7C3AED]"
            }`}
          >
            Todos
          </button>
          {categories?.map((cat) => {
            const config = categoryConfig[cat.slug] || defaultCategory;
            const isActive = selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() =>
                  setSelectedCategory(isActive ? null : cat._id)
                }
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "border-2 text-[#1E1012]/70 hover:opacity-80"
                }`}
                style={{
                  backgroundColor: isActive ? config.color : "transparent",
                  borderColor: isActive
                    ? config.color
                    : `${config.color}40`,
                }}
              >
                {config.emoji} {cat.name}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm text-[#1E1012]/60">
            Mostrando{" "}
            <span className="font-bold text-[#1E1012]">
              {productList.length}
            </span>{" "}
            antojos
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#1E1012]/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#7C3AED] text-white"
                    : "text-[#1E1012]/50 hover:bg-[#1E1012]/5"
                }`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-[#7C3AED] text-white"
                    : "text-[#1E1012]/50 hover:bg-[#1E1012]/5"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products */}
        {productList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-[#1E1012]/70">
              No encontramos nada... pero tenemos 550+ cosas más
            </h3>
          </div>
        ) : (
          <div
            className={`grid ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2"
            } gap-4 sm:gap-6`}
          >
            {productList.map((product, index) => (
              <ScrollReveal key={product._id} delay={index < 8 ? index * 0.05 : 0}>
                <CandyCard
                  product={product}
                  priority={index < 4}
                />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
