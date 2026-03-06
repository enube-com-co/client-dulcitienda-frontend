"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useSession, signOut } from "@convex-dev/auth/react";
import { ShoppingCart, Menu, X, Phone, MapPin, Mail, ChevronRight, Star, Truck, Shield, Clock, User } from "lucide-react";
import SearchDropdown from "@/components/SearchDropdown";
import { SLOGAN } from "@/lib/brand";

export default function Home() {
  const session = useSession();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't block on auth - show content even if session is loading
  const showLoading = !mounted || products === undefined || categories === undefined;
  
  if (showLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-600 border-t-transparent mx-auto"></div>
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
    "gaseosas": "from-red-500 to-pink-600",
    "snacks": "from-yellow-400 to-orange-500",
    "dulces": "from-pink-400 to-pink-600",
    "licores": "from-purple-500 to-pink-600"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - Exact Dulcitienda colors */}
      <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-300 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="font-bold">🚚 Envío gratis en Neiva en pedidos mayores a $200.000</p>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+573132309867" className="flex items-center gap-2 hover:text-yellow-100 transition-colors">
              <Phone size={14} /> +57 313 2309867
            </a>
            <span className="text-white/50">|</span>
            <span>Cra 3 # 7-12 Centro, Neiva</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Dulcitienda exact style */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 via-pink-500 to-yellow-300 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-yellow-200">
                🍬
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                  Dulcitienda
                </h1>
                <p className="text-xs font-bold text-pink-500 -mt-1">{SLOGAN}</p>
              </div>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <SearchDropdown />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href="/carrito" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                <ShoppingCart size={24} />
                <span className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center cart-count">0</span>
              </Link>
              
              {/* Login / User Button */}
              {session ? (
                <Link href="/perfil" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </Link>
              ) : (
                <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-full font-medium hover:shadow-lg transition-all">
                  <User size={18} />
                  Entrar
                </Link>
              )}
              
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
                Catálogo
              </Link>
              {categories?.slice(0, 4).map((cat) => (
                <Link 
                  key={cat._id} 
                  href={`/catalogo?categoria=${cat._id}`}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/carrito" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Carrito
              </Link>
            </div>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link href="/catalogo" className="block py-2 text-gray-700">Catálogo</Link>
              {categories?.slice(0, 4).map((cat) => (
                <Link key={cat._id} href={`/catalogo?categoria=${cat._id}`} className="block py-2 text-gray-700">
                  {cat.name}
                </Link>
              ))}
              <Link href="/carrito" className="block py-2 text-gray-700">Carrito</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero - Fondo azul como el logo oficial */}
      <section className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-pink-500/20 backdrop-blur-sm rounded-full text-sm font-bold mb-6 border border-pink-300/30">
                ✨ {SLOGAN}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Distribuidora de <span className="text-yellow-200">Abarrotes</span> al Por Mayor
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Gaseosas, snacks, dulces y licores con los mejores precios mayoristas para tu negocio en Neiva y el Huila
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalogo">
                  <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                    Ver Catálogo <ChevronRight size={20} />
                  </button>
                </Link>
                <a href="https://wa.me/573132309867">
                  <button className="px-8 py-4 bg-yellow-300 hover:bg-yellow-400 text-blue-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    💬 Pedir por WhatsApp
                  </button>
                </a>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "385+", label: "Clientes", icon: "👥" },
                { number: "550+", label: "Productos", icon: "📦" },
                { number: "535+", label: "Entregas/mes", icon: "🚚" },
                { number: "3+", label: "Años", icon: "⭐" },
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
              { icon: Truck, title: "Envío Gratis", desc: "En Neiva +$200k" },
              { icon: Shield, title: "Garantía", desc: "Productos frescos" },
              { icon: Clock, title: "Entrega Rápida", desc: "24-48 horas" },
              { icon: Star, title: "Calidad", desc: "Marcas originales" },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-xl flex items-center justify-center text-pink-600">
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
            {categories?.slice(0, 4).map((category, idx) => (
              <Link key={category._id} href={`/catalogo?categoria=${category._id}`}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className={`h-48 bg-gradient-to-br ${categoryColors[category.slug] || 'from-pink-400 to-yellow-400'} flex items-center justify-center`}>
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
              <Link key={product._id} href={`/producto/${product.sku}`}>
                <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-pink-50 group-hover:to-yellow-50 transition-colors relative">
                    <span className="text-5xl group-hover:scale-110 transition-transform">📦</span>
                    {product.isFeatured && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-bold rounded-full">
                        DESTACADO
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-pink-600">
                        ${product.basePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10 md:hidden">
            <Link href="/catalogo">
              <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-full font-semibold">
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
            <div className="bg-gradient-to-br from-pink-100 to-yellow-100 rounded-3xl p-8 md:p-12">
              <div className="text-6xl mb-6">🍬</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {SLOGAN}
              </h2>
              <p className="text-gray-600 mb-6">
                Somos una empresa con la misión de ponerle el toque dulce a la vida. 
                Tenemos más de 3 años siendo los mejores aliados de pequeñas y grandes 
                empresas con sueños y metas de crecimiento, a quienes les hemos brindado 
                nuestro apoyo con la distribución de dulces, chocolates, gomas y licores 
                con precios de mayoristas en Neiva y el Huila.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Precios de mayorista", "Entrega a domicilio", "Atención personalizada", "Más de 550 productos"].map((item, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🏆", title: "Calidad Garantizada", desc: "Productos originales" },
                { icon: "🚚", title: "Entrega Rápida", desc: "24-48 horas en Neiva" },
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

      {/* CTA - Colores exactos del logo */}
      <section className="py-16 bg-gradient-to-r from-blue-800 via-blue-700 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para surtir tu negocio?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contáctanos y recibe atención personalizada para tu pedido en Neiva
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/573132309867">
              <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                💬 WhatsApp
              </button>
            </a>
            <a href="tel:+573132309867">
              <button className="px-8 py-4 bg-yellow-300 hover:bg-yellow-400 text-blue-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
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
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-lg flex items-center justify-center text-xl">
                  🍬
                </div>
                <span className="text-xl font-bold">Dulcitienda</span>
              </div>
              <p className="text-gray-400 text-sm">
                {SLOGAN} Distribuidora de dulces, chocolates, gomas, licores y mucho más a nivel nacional.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Categorías</h3>
              <ul className="space-y-2 text-gray-400">
                {categories?.slice(0, 4).map((cat) => (
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
                  <MapPin size={16} /> Cra 3 # 7-12 Centro, Neiva
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} /> +57 313 2309867
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} /> dulcitiendajm@gmail.com
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Síguenos</h3>
              <div className="flex gap-3">
                <a href="https://web.facebook.com/dulcitienda/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-400 transition-all text-sm">
                  F
                </a>
                <a href="https://www.instagram.com/midulcitienda/?hl=es" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-400 transition-all text-sm">
                  I
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 Dulcitienda. {SLOGAN} Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
