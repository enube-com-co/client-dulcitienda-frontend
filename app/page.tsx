"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading state
  if (!mounted || products === undefined || categories === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando Dulcitienda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Dulcitienda
            </Link>
            <nav className="flex gap-6">
              <Link href="/catalogo" className="text-gray-600 hover:text-blue-600">
                Catálogo
              </Link>
              <Link href="/pedidos" className="text-gray-600 hover:text-blue-600">
                Mis Pedidos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Distribuidora Mayorista de Abarrotes
          </h1>
          <p className="text-xl mb-8">
            Gaseosas, snacks, dulces y licores al mejor precio
          </p>
          <Link href="/catalogo">
            <Button size="lg" variant="secondary">
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Link key={category._id} href={`/catalogo?categoria=${category._id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Productos Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card key={product._id} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">📦</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  <p className="text-lg font-bold mt-2">
                    ${product.basePrice.toLocaleString()}
                  </p>
                  <Badge variant={product.isActive ? "default" : "destructive"}>
                    {product.isActive ? "Disponible" : "No disponible"}
                  </Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/producto/${product.sku}`} className="w-full">
                    <Button className="w-full">Ver Producto</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Dulcitienda. Todos los derechos reservados.</p>
          <p className="mt-2 text-gray-400">
            {mounted ? "✅ Conectado a Convex" : "⏳ Cargando..."}
          </p>
        </div>
      </footer>
    </div>
  );
}
