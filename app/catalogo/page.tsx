"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CatalogoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const products = useQuery(api.products.getProducts, { limit: 24 });
  const categories = useQuery(api.products.getCategories);

  // Loading state
  if (products === undefined || categories === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando catálogo...</p>
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
              <Link href="/catalogo" className="text-blue-600 font-medium">
                Catálogo
              </Link>
              <Link href="/pedidos" className="text-gray-600 hover:text-blue-600">
                Mis Pedidos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Categorías</h2>
              <div className="space-y-2">
                {categories?.map((category) => (
                  <button
                    key={category._id}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <main className="flex-1">
            <div className="mb-6">
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.page?.map((product) => (
                <Card key={product._id} className="flex flex-col">
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-4xl">📦</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-4">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    <p className="text-lg font-bold mt-2">
                      ${product.basePrice.toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <Badge variant={product.isActive ? "default" : "destructive"}>
                        {product.isActive ? "Disponible" : "No disponible"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/producto/${product.sku}`} className="w-full">
                      <Button className="w-full">Ver Producto</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {products?.isDone === false && (
              <div className="mt-8 text-center">
                <Button variant="outline">Cargar más</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
