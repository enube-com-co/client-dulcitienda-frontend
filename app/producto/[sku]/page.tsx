"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductoPage() {
  const params = useParams();
  const sku = params.sku as string;
  const [quantity, setQuantity] = useState(1);
  
  const product = useQuery(api.products.getProduct, { sku });

  // Loading state
  if (product === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (product === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Producto no encontrado</h1>
          <Link href="/catalogo">
            <Button className="mt-4">Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inventoryAvailable = product.inventory?.quantityAvailable || 0;
  const minOrderQty = product.minimumOrderQuantity || 1;

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-8xl">📦</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.isActive ? "Disponible" : "No disponible"}</Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-500 mt-2">SKU: {product.sku}</p>
            </div>

            <div>
              <p className="text-4xl font-bold text-blue-600">
                ${product.basePrice.toLocaleString()}
              </p>
              <p className="text-gray-500">Por {product.unitOfMeasure}</p>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Información de pedido</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Empaque: {product.packSize} unidades</li>
                <li>Cantidad mínima: {minOrderQty} {product.unitOfMeasure}</li>
                <li>Stock disponible: {inventoryAvailable} unidades</li>
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="font-medium">Cantidad:</label>
                <Input
                  type="number"
                  min={minOrderQty}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || minOrderQty)}
                  className="w-24"
                />
                <span className="text-gray-500">{product.unitOfMeasure}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={!product.isActive || inventoryAvailable < quantity}
              >
                Agregar al carrito
              </Button>
              <Link href="/catalogo">
                <Button size="lg" variant="outline">
                  Volver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
