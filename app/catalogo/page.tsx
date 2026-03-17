"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import {
  ShoppingCart,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Check,
} from "lucide-react";
import { getProductImageUrl, categoryColors } from "@/lib/product-images";

interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  packSize: number;
}

function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("dulcitienda-cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      let newCart;
      if (existing) {
        newCart = prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      } else {
        newCart = [...prev, item];
      }
      localStorage.setItem("dulcitienda-cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, addToCart, cartCount, mounted };
}

export default function Catalogo() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] =
    useState<Id<"categories"> | null>(null);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const products = useQuery(api.products.getProducts, {
    categoryId: selectedCategory || undefined,
    limit: 100,
  });
  const categories = useQuery(api.products.getCategories);
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize quantities when products load
  useEffect(() => {
    if (products?.page) {
      const newQuantities: Record<string, number> = {};
      products.page.forEach((p) => {
        newQuantities[p._id] = p.minimumOrderQuantity;
      });
      setQuantities(newQuantities);
    }
  }, [products]);

  const handleAddToCart = (product: any) => {
    const qty = quantities[product._id] || product.minimumOrderQuantity;
    addToCart({
      productId: product._id,
      name: product.name,
      sku: product.sku,
      price: product.basePrice,
      quantity: qty,
      packSize: product.packSize,
    });
    setAddedProduct(product._id);
    setTimeout(() => setAddedProduct(null), 1500);
  };

  const updateQuantity = (productId: string, delta: number, minQty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(minQty, (prev[productId] || minQty) + delta),
    }));
  };

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

  const getCategorySlug = (categoryId: string) => {
    const cat = categories?.find((c) => c._id === categoryId);
    return cat?.slug || "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-pink-600">
              Inicio
            </Link>
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
                          ? "bg-pink-50 text-pink-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
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
                            ? "bg-pink-50 text-pink-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-gray-600">
                  Mostrando{" "}
                  <span className="font-bold text-gray-800">
                    {products?.page?.length || 0}
                  </span>{" "}
                  productos
                </p>
                <div className="flex items-center gap-4">
                  <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500">
                    <option>Ordenar por: Relevancia</option>
                    <option>Precio: Menor a mayor</option>
                    <option>Precio: Mayor a menor</option>
                  </select>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-pink-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <Grid3X3 size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-pink-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}

            <div
              className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
            >
              {products?.page?.map((product) => {
                const categorySlug = getCategorySlug(product.categoryId);
                const imageData = getProductImageUrl(product.name, product.sku);
                const isAdded = addedProduct === product._id;

                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative">
                      <Link href={`/producto/${product.sku}`}>
                        <div
                          className={`bg-gradient-to-br ${categoryColors[categorySlug] || "from-gray-100 to-gray-200"} flex items-center justify-center group-hover:opacity-90 transition-opacity ${viewMode === "grid" ? "aspect-square" : "h-48"}`}
                        >
                          {imageData.isReal ? (
                            <img
                              src={imageData.url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  imageData.fallback;
                              }}
                            />
                          ) : (
                            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                              {imageData.url}
                            </span>
                          )}
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
                    </div>

                    <div className="p-5">
                      <Link href={`/producto/${product.sku}`}>
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 hover:text-pink-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-3">
                        SKU: {product.sku}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-pink-600">
                          ${product.basePrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Pack x{product.packSize}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              -product.packSize,
                              product.minimumOrderQuantity,
                            )
                          }
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors"
                        >
                          <span>-</span>
                        </button>
                        <input
                          type="number"
                          min={product.minimumOrderQuantity}
                          value={
                            quantities[product._id] ||
                            product.minimumOrderQuantity
                          }
                          onChange={(e) =>
                            setQuantities((prev) => ({
                              ...prev,
                              [product._id]:
                                parseInt(e.target.value) ||
                                product.minimumOrderQuantity,
                            }))
                          }
                          className="w-16 text-center border border-gray-200 rounded-lg py-1"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              product.packSize,
                              product.minimumOrderQuantity,
                            )
                          }
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors"
                        >
                          <span>+</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isAdded}
                        className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                          isAdded
                            ? "bg-green-500 text-white"
                            : "bg-pink-500 text-white hover:bg-gradient-to-r from-pink-600 via-pink-500 to-yellow-400"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={18} /> Agregado
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} /> Añadir
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
