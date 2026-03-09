"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { ShoppingCart, Menu, X, Phone, MapPin, Mail, ChevronRight, Star, Truck, Shield, Clock, User } from "lucide-react";
import SearchDropdown from "@/components/SearchDropdown";
import { SLOGAN } from "@/lib/brand";

export default function Home() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

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
              {user ? (
                <Link href="/perfil" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || "User"} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{user.name?.split(" ")[0] || "Perfil"}</span>
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
        <nav className="hidden md:block bg-pink-50 border-t border-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 h-12">
              <Link href="/catalogo" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Catálogo
              </Link>
              <Link href="/catalogo?categoria=gaseosas" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Gaseosas
              </Link>
              <Link href="/catalogo?categoria=snacks" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Snacks
              </Link>
              <Link href="/catalogo?categoria=dulces" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Dulces
              </Link>
              <Link href="/catalogo?categoria=licores" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Licores
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <div className="mb-4">
                <SearchDropdown />
              </div>
              <Link href="/catalogo" className="block py-2 text-gray-700 hover:text-pink-600">Catálogo</Link>
              <Link href="/catalogo?categoria=gaseosas" className="block py-2 text-gray-700 hover:text-pink-600">Gaseosas</Link>
              <Link href="/catalogo?categoria=snacks" className="block py-2 text-gray-700 hover:text-pink-600">Snacks</Link>
              <Link href="/catalogo?categoria=dulces" className="block py-2 text-gray-700 hover:text-pink-600">Dulces</Link>
              <Link href="/catalogo?categoria=licores" className="block py-2 text-gray-700 hover:text-pink-600">Licores</Link>
              <Link href="/carrito" className="block py-2 text-gray-700 hover:text-pink-600">Carrito</Link>
              <Link href="/login" className="block py-2 text-gray-700 hover:text-pink-600">{user ? "Mi Perfil" : "Iniciar sesión"}</Link>
            </div>
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Categorías</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link 
                key={category._id} 
                href={`/catalogo?categoria=${category.slug}`}
                className="group"
              >
                <div className={`h-32 bg-gradient-to-br ${categoryColors[category.slug] || "from-pink-500 to-purple-600"} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <span className="text-4xl mb-2">{categoryIcons[category.slug] || "🍬"}</span>
                  <span className="font-bold capitalize">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
            <Link href="/catalogo" className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
              Ver todos <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Link key={product._id} href={`/producto/${product.sku}`} className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🍬</div>
                    )}
                    {product.isFeatured && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.categoryId}</p>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-pink-600">
                        ${product.basePrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Min: {product.minimumOrderQuantity}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gradient-to-r from-pink-500 to-yellow-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <Truck size={40} className="mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Envío Gratis</h3>
              <p className="text-white/80">En pedidos mayores a $200.000 en Neiva</p>
            </div>
            
            <div>
              <Shield size={40} className="mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Productos Garantizados</h3>
              <p className="text-white/80">Calidad en todos nuestros productos</p>
            </div>
            
            <div>
              <Clock size={40} className="mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
              <p className="text-white/80">Same-day delivery en Neiva</p>
            </div>
            
            <div>
              <Star size={40} className="mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Atención Personalizada</h3>
              <p className="text-white/80">Asesoría para tu negocio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-yellow-300 rounded-xl flex items-center justify-center text-xl">
                  🍬
                </div>
                <span className="text-xl font-bold">Dulcitienda</span>
              </div>
              <p className="text-gray-400">Distribuidora mayorista de dulces, snacks y licores en Neiva.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Categorías</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/catalogo?categoria=gaseosas" className="hover:text-white">Gaseosas</Link></li>
                <li><Link href="/catalogo?categoria=snacks" className="hover:text-white">Snacks</Link></li>
                <li><Link href="/catalogo?categoria=dulces" className="hover:text-white">Dulces</Link></li>
                <li><Link href="/catalogo?categoria=licores" className="hover:text-white">Licores</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
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
              <h4 className="font-bold mb-4">Horario</h4>
              <p className="text-gray-400">Lunes a Sábado</p>
              <p className="text-gray-400">8:00 AM - 6:00 PM</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Dulcitienda. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
