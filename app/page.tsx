"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || products === undefined || categories === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-orange-800 font-medium">Cargando Dulcitienda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🍬</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Dulcitienda
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/catalogo" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Catálogo
              </Link>
              <Link href="/pedidos" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Mis Pedidos
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Contacto
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <a href="tel:+573203555663" className="hidden sm:flex items-center gap-2 text-orange-600 font-medium">
                <span>📞</span>
                <span>+57 320 355 5663</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Distribuidora Mayorista
              <br />
              <span className="text-yellow-200">de Abarrotes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Gaseosas, snacks, dulces y licores al mejor precio para tu negocio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalogo">
                <button className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  Ver Catálogo
                </button>
              </Link>
              <a href="https://wa.me/573203555663">
                <button className="px-8 py-4 bg-green-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                  <span>💬</span>
                  Pedir por WhatsApp
                </button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { number: "385+", label: "Clientes" },
              { number: "1,460+", label: "Productos" },
              { number: "535+", label: "Entregas/mes" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold drop-shadow-lg">{stat.number}</div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nuestras Categorías</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encuentra todo lo que necesitas para surtir tu negocio
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category, idx) => {
              const icons = ["🥤", "🍿", "🍬", "🍷"];
              const colors = ["from-red-400 to-red-600", "from-yellow-400 to-yellow-600", "from-pink-400 to-pink-600", "from-purple-400 to-purple-600"];
              return (
                <Link key={category._id} href={`/catalogo?categoria=${category._id}`}>
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2">
                    <div className={`h-32 bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300`}>
                      {icons[idx]}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Ver productos →</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Productos Destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Los más vendidos por nuestros clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Link key={product._id} href={`/producto/${product.sku}`}>
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-orange-200">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-orange-50 group-hover:to-amber-50 transition-colors">
                    <span className="text-6xl group-hover:scale-110 transition-transform">📦</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">SKU: {product.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">
                        ${product.basePrice.toLocaleString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? "Stock" : "Agotado"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/catalogo">
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Ver todos los productos
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Tu aliado para hacer crecer tu negocio
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Somos una empresa con la misión de ponerle el toque dulce a la vida. 
                Tenemos más de 3 años siendo los mejores aliados de pequeñas y grandes 
                empresas con sueños y metas de crecimiento.
              </p>
              <ul className="space-y-3">
                {["Precios de mayorista", "Entrega a domicilio", "Atención personalizada", "Más de 1,400 productos"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🏆", title: "Calidad", desc: "Productos garantizados" },
                { icon: "🚚", title: "Entrega", desc: "A domicilio en Bogotá" },
                { icon: "👥", title: "Atención", desc: "Personalizada 24/7" },
                { icon: "💰", title: "Precios", desc: "Los mejores del mercado" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🍬</span>
                <span className="text-2xl font-bold">Dulcitienda</span>
              </div>
              <p className="text-gray-400">
                Distribuidora de dulces, chocolates, gomas, licores y mucho más a nivel nacional.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Cra. 19a #12-63, Bogotá</li>
                <li>📞 +57 320 355 5663</li>
                <li>✉️ dulcitienda@enube.com.co</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Síguenos</h3>
              <div className="flex gap-4">
                {["Facebook", "Instagram", "WhatsApp"].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© 2025 Dulcitienda. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
