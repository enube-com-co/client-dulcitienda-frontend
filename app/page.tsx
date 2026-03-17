"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  Phone,
  ChevronRight,
  Truck,
  Shield,
  Clock,
  Star,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showLoading =
    !mounted || products === undefined || categories === undefined;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-600 via-pink-500 to-yellow-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Star className="w-4 h-4 text-yellow-300" />
              Más de 550 productos disponibles
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
              La distribuidora #1 de dulces y licores en{" "}
              <span className="text-yellow-300">Neiva</span>
            </h2>

            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              Precios mayoristas, envío gratis en la ciudad y atención
              personalizada para tu negocio.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 font-bold px-6 py-3.5 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                Ver catálogo
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="https://wa.me/573132309867"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                <Phone className="w-5 h-5" />
                Hablar por WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Envío gratis +$200k</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Garantía de calidad</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Entrega 24-48h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            Explora por categoría
          </h2>

          {showLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categories?.map((category) => {
                const categoryIcons: Record<string, string> = {
                  gaseosas: "🥤",
                  snacks: "🍿",
                  dulces: "🍬",
                  licores: "🍷",
                };

                const categoryColors: Record<string, string> = {
                  gaseosas: "from-red-500 to-pink-600",
                  snacks: "from-yellow-400 to-orange-500",
                  dulces: "from-pink-400 to-pink-600",
                  licores: "from-purple-500 to-pink-600",
                };

                return (
                  <Link
                    key={category._id}
                    href={`/catalogo?categoria=${category.slug}`}
                    className="group"
                  >
                    <div
                      className={`h-28 sm:h-32 bg-gradient-to-br ${categoryColors[category.slug] || "from-pink-500 to-purple-600"} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300`}
                    >
                      <span className="text-3xl sm:text-4xl mb-1 sm:mb-2">
                        {categoryIcons[category.slug] || "🍬"}
                      </span>
                      <span className="font-bold capitalize text-sm sm:text-base">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Productos Destacados
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Los más populares entre nuestros clientes
              </p>
            </div>
            <Link
              href="/catalogo"
              className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1 text-sm sm:text-base"
            >
              Ver todos <ChevronRight size={18} />
            </Link>
          </div>

          {showLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products?.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              ¿Por qué elegir Dulcitienda?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Somos tu aliado estratégico para abastecer tu negocio con los
              mejores productos al mejor precio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Envío Rápido",
                desc: "Gratis en Neiva por compras mayores a $200.000",
              },
              {
                icon: DollarSign,
                title: "Precios Bajos",
                desc: "Precios mayoristas que maximizan tu margen",
              },
              {
                icon: Phone,
                title: "Soporte 24/7",
                desc: "Atención personalizada vía WhatsApp",
              },
              {
                icon: Star,
                title: "Calidad Garantizada",
                desc: "Productos 100% originales y en perfecto estado",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-pink-600 via-pink-500 to-yellow-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            🚀 Únete a 200+ negocios que confían en nosotros
          </h2>

          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Crea tu cuenta mayorista hoy y accede a precios especiales, envíos
            gratis y atención prioritaria.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Crear cuenta mayorista
              <span className="text-xs font-normal text-gray-500">
                (Gratis, 2 minutos)
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
