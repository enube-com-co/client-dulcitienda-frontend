"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Phone, Filter, Grid3X3, List, ChevronRight, Heart, Eye } from "lucide-react";

export default function Catalogo() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const products = useQuery(api.products.getProducts, { 
    categoryId: selectedCategory,
    limit: 100 
  });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || products === undefined || categories === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-pink-600 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>🚚 Envío gratis en Bogotá en pedidos mayores a $200.000</p>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+573203555663" className="flex items-center gap-2 hover:text-pink-200">
              <Phone size={14} /> +57 320 355 5663
            </a>
          </div>
        </div>
      </div>

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
                <p className="text-xs text-gray-500 -mt-1">Distribuidora Mayorista</p>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-full focus:border-pink-500 focus:outline-none transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                <ShoppingCart size={24} />
                <span className="bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
              </button>
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 py-3">
              <Link href="/" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Inicio
              </Link>
              <Link href="/catalogo" className="text-pink-600 font-medium">
                Catálogo
              </Link>
              {categories?.map((cat) => (
                <Link 
                  key={cat._id} 
                  href={`/catalogo?categoria=${cat._id}`}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block py-2 text-gray-700">Inicio</Link>
              <Link href="/catalogo" className="block py-2 text-pink-600 font-medium">Catálogo</Link>
              {categories?.map((cat) => (
                <Link key={cat._id} href={`/catalogo?categoria=${cat._id}`} className="block py-2 text-gray-700">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-pink-600">Inicio</Link>
            <ChevronRight size={16} />
            <span className="text-gray-800 font-medium">Catálogo</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-pink-500" />
                <h2 className="font-bold text-gray-800">Filtros</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Categorías</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                        selectedCategory === null 
                          ? 'bg-pink-50 text-pink-600 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Todas las categorías
                    </button>
                  </li>
                  {categories?.map((cat) => (
                    <li key={cat._id}>
                      <button
                        onClick={() => setSelectedCategory(cat._id)}
                        className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                          selectedCategory === cat._id 
                            ? 'bg-pink-50 text-pink-600 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Precio</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500" />
                    <span className="text-gray-600">Menos de $20.000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500" />
                    <span className="text-gray-600">$20.000 - $50.000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500" />
                    <span className="text-gray-600">Más de $50.000</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-gray-600">
                  Mostrando <span className="font-bold text-gray-800">{products?.length || 0}</span> productos
                </p>
                <div className="flex items-center gap-4">
                  <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500">
                    <option>Ordenar por: Relevancia</option>
                    <option>Precio: Menor a mayor</option>
                    <option>Precio: Mayor a menor</option>
                    <option>Nombre: A-Z</option>
                  </select>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid3X3 size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className={`grid ${viewMode === "grid" ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {products?.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <Link href={`/producto/${product.sku}`}>
                      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-pink-50 group-hover:to-purple-50 transition-colors ${viewMode === "grid" ? 'aspect-square' : 'h-48'}`}>
                        <span className="text-5xl group-hover:scale-110 transition-transform">📦</span>
                      </div>
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isFeatured && (
                        <span className="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">
                          DESTACADO
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-pink-500 hover:shadow-lg transition-all">
                        <Heart size={18} />
                      </button>
                      <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-pink-500 hover:shadow-lg transition-all">
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <Link href={`/producto/${product.sku}`}>
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-pink-600">
                        ${product.basePrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Pack x{product.packSize}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1">
                        <input 
                          type="number" 
                          min={product.minimumOrderQuantity}
                          defaultValue={product.minimumOrderQuantity}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <button className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-2">
                        <ShoppingCart size={18} /> Añadir
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Mínimo: {product.minimumOrderQuantity} unidades
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {products && products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    Anterior
                  </button>
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
