"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Phone, MapPin, Mail, ChevronRight, Star, Truck, Shield, Clock } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || products === undefined || categories === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando Dulcitienda...</p>
        </div>
      </div>
    );
  }

  const categoryIcons: Record<string, string> = {
    "gaseosas": "🥤",
    "snacks": "🍿", 
    "dulces": "🍬",
    "licores": "🍷"
  };

  const categoryColors: Record<string, string> = {
    "gaseosas": "from-red-500 to-red-600",
    "snacks": "from-yellow-500 to-orange-500",
    "dulces": "from-pink-500 to-rose-500",
    "licores": "from-purple-500 to-indigo-600"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-pink-600 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>🚚 Envío gratis en Bogotá en pedidos mayores a $200.000</p>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+573203555663" className="flex items-center gap-2 hover:text-pink-200">
              <Phone size={14} /> +57 320 355 5663
            </a>
            <span className="text-pink-400">|</span>
            <span>cra.19a#12-63, Bogotá</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
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

            {/* Search - Desktop */}
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

            {/* Actions */}
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

        {/* Navigation */}
        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 py-3">
              <Link href="/catalogo" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Todo el Catálogo
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
              <Link href="/pedidos" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Mis Pedidos
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link href="/catalogo" className="block py-2 text-gray-700">Todo el Catálogo</Link>
              {categories?.map((cat) => (
                <Link key={cat._id} href={`/catalogo?categoria=${cat._id}`} className="block py-2 text-gray-700">
                  {cat.name}
                </Link>
              ))}
              <Link href="/pedidos" className="block py-2 text-gray-700">Mis Pedidos</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                ✨ Más de 1,400 productos disponibles
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Distribuidora de <span className="text-yellow-300">Abarrotes</span> al Por Mayor
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Gaseosas, snacks, dulces y licores con los mejores precios mayoristas para tu negocio
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalogo">
                  <button className="px-8 py-4 bg-white text-pink-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                    Ver Catálogo <ChevronRight size={20} />
                  </button>
                </Link>
                <a href="https://wa.me/573203555663">
                  <button className="px-8 py-4 bg-green-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    💬 Pedir por WhatsApp
                  </button>
                </a>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "385+", label: "Clientes", icon: "👥" },
                { number: "1,460+", label: "Productos", icon: "📦" },
                { number: "535+", label: "Entregas/mes", icon: "🚚" },
                { number: "3+", label: "Años de experiencia", icon: "⭐" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Envío Gratis", desc: "En Bogotá +$200k" },
              { icon: Shield, title: "Garantía", desc: "Productos frescos" },
              { icon: Clock, title: "Entrega Rápida", desc: "24-48 horas" },
              { icon: Star, title: "Calidad", desc: "Marcas originales" },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Compra por Categoría</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encuentra todo lo que necesitas para surtir tu negocio al mejor precio
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link key={category._id} href={`/catalogo?categoria=${category._id}`}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className={`h-48 bg-gradient-to-br ${categoryColors[category.slug]} flex items-center justify-center`}>
                    <span className="text-6xl group-hover:scale-125 transition-transform duration-300">
                      {categoryIcons[category.slug] || "📦"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-white/80 text-sm">Ver productos →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Productos Destacados</h2>
              <p className="text-gray-600">Los más vendidos por nuestros clientes</p>
            </div>
            <Link href="/catalogo" className="hidden md:flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700">
              Ver todos <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products?.map((product) => (
              <div key={product._id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <Link href={`/producto/${product.sku}`}>
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-pink-50 group-hover:to-purple-50 transition-colors relative">
                    <span className="text-5xl group-hover:scale-110 transition-transform">📦</span>
                    {product.isFeatured && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">
                        DESTACADO
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/producto/${product.sku}`}>
                    <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-600">
                      ${product.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full mt-4 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={18} /> Añadir
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 md:hidden">
            <Link href="/catalogo">
              <button className="px-8 py-3 bg-pink-500 text-white rounded-full font-semibold">
                Ver todos los productos
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 md:p-12">
              <div className="text-6xl mb-6">🍬</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Somos una empresa con la misión de ponerle el toque dulce a la vida
              </h2>
              <p className="text-gray-600 mb-6">
                Tenemos más de 3 años siendo los mejores aliados de pequeñas y grandes empresas 
                con sueños y metas de crecimiento, a quienes les hemos brindado nuestro apoyo 
                con la distribución de dulces, chocolates, gomas y licores con precios de mayoristas.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Precios de mayorista", "Entrega a domicilio", "Atención personalizada", "Más de 1,400 productos"].map((item, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🏆", title: "Calidad Garantizada", desc: "Productos originales" },
                { icon: "🚚", title: "Entrega Rápida", desc: "24-48 horas en Bogotá" },
                { icon: "👥", title: "Atención 24/7", desc: "Soporte personalizado" },
                { icon: "💰", title: "Mejores Precios", desc: "Precios de mayorista" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para surtir tu negocio?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contáctanos y recibe atención personalizada para tu pedido
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/573203555663">
              <button className="px-8 py-4 bg-green-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                💬 WhatsApp
              </button>
            </a>
            <a href="tel:+573203555663">
              <button className="px-8 py-4 bg-white text-pink-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                📞 Llamar
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                  🍭
                </div>
                <span className="text-xl font-bold">Dulcitienda</span>
              </div>
              <p className="text-gray-400 text-sm">
                Distribuidora de dulces, chocolates, gomas, licores y mucho más a nivel nacional.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Categorías</h3>
              <ul className="space-y-2 text-gray-400">
                {categories?.map((cat) => (
                  <li key={cat._id}>
                    <Link href={`/catalogo?categoria=${cat._id}`} className="hover:text-pink-400 transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin size={16} /> Cra. 19a #12-63, Bogotá
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} /> +57 320 355 5663
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} /> dulcitienda@enube.com.co
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Síguenos</h3>
              <div className="flex gap-3">
                {["Facebook", "Instagram", "WhatsApp"].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors text-sm">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 Dulcitienda. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
