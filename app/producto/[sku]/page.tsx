"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Truck,
  Shield,
  Clock,
  ChevronRight,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { StickerBadge } from "@/components/StickerBadge";
import { CandyCard } from "@/components/CandyCard";

// Cart context simple
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

  useEffect(() => {
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

  return { cart, addToCart, cartCount };
}

export default function ProductoPage() {
  const params = useParams();
  const sku = params.sku as string;
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = useQuery(api.products.getProduct, { sku });
  const relatedProducts = useQuery(api.products.getFeaturedProducts, {
    limit: 4,
  });
  const { addToCart } = useCart();

  // Loading state
  if (product === undefined) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-spin inline-block">🍬</div>
          <p className="mt-4 text-[#1E1012]/60 font-display font-medium">
            Cargando cositas ricas...
          </p>
        </div>
      </div>
    );
  }

  // Product not found
  if (product === null) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-display font-bold text-[#1E1012]">
            Producto no encontrado
          </h1>
          <p className="text-[#1E1012]/50 mt-2">
            El producto que buscas no existe o no está disponible
          </p>
          <Link href="/catalogo">
            <button className="mt-6 px-6 py-3 bg-[#FF2D78] text-white rounded-full font-bold hover:brightness-110 transition-all">
              Volver al catálogo
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const inventoryAvailable = product.inventory?.quantityAvailable || 0;
  const minOrderQty = product.minimumOrderQuantity || 1;
  const totalPrice = product.basePrice * quantity;
  const isLowStock = inventoryAvailable > 0 && inventoryAvailable < 20;
  const hasImage = product.images && product.images.length > 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      sku: product.sku,
      price: product.basePrice,
      quantity: quantity,
      packSize: product.packSize,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const increaseQty = () => setQuantity((q) => q + minOrderQty);
  const decreaseQty = () =>
    setQuantity((q) => Math.max(minOrderQty, q - minOrderQty));

  return (
    <div className="min-h-screen bg-[#FFFBF0] pb-24 md:pb-0">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur border-b border-[#1E1012]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-[#1E1012]/50">
            <Link
              href="/"
              className="text-[#7C3AED] hover:underline"
            >
              Inicio
            </Link>
            <ChevronRight size={16} />
            <Link
              href="/catalogo"
              className="text-[#7C3AED] hover:underline"
            >
              Catálogo
            </Link>
            <ChevronRight size={16} />
            <span className="text-[#1E1012] font-medium truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-sm relative">
              <div className="aspect-square flex items-center justify-center relative">
                {hasImage ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
                    quality={90}
                  />
                ) : (
                  <span className="text-9xl">🍬</span>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <StickerBadge text="POPULAR" color="#FF2D78" rotation={-3} />
                )}
                {isLowStock && (
                  <StickerBadge text="VOLANDO" color="#FBBF24" rotation={2} />
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.isActive && inventoryAvailable > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.isActive && inventoryAvailable > 0
                    ? "En stock"
                    : "Agotado"}
                </span>
                <span className="text-[#1E1012]/40 text-sm">
                  SKU: {product.sku}
                </span>
              </div>
              <h1 className="font-display font-bold text-[#1E1012] text-2xl sm:text-3xl">
                {product.name}
              </h1>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#1E1012]">
                  ${product.basePrice.toLocaleString()}
                </span>
                <span className="text-[#1E1012]/50">
                  / {product.unitOfMeasure}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-[#1E1012]/50 bg-[#1E1012]/5 px-3 py-1 rounded-full">
                  Min. {minOrderQty} uds
                </span>
                <span className="text-sm text-[#1E1012]/50">
                  Pack de {product.packSize} unidades
                </span>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-display font-bold text-[#1E1012] mb-2">
                  Descripción
                </h3>
                <p className="text-[#1E1012]/70">{product.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, title: "Envío rápido", desc: "24-48h" },
                { icon: Shield, title: "Garantía", desc: "Producto fresco" },
                {
                  icon: Clock,
                  title: "Stock",
                  desc: `${inventoryAvailable} und`,
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="text-center p-4 bg-white rounded-xl shadow-sm"
                >
                  <feature.icon className="w-6 h-6 mx-auto mb-2 text-[#FF2D78]" />
                  <p className="font-display font-medium text-sm text-[#1E1012]">
                    {feature.title}
                  </p>
                  <p className="text-xs text-[#1E1012]/50">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#1E1012]/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-medium text-[#1E1012]/70">
                  Cantidad (mínimo {minOrderQty}):
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQty}
                    className="w-10 h-10 rounded-full bg-[#1E1012]/5 flex items-center justify-center hover:bg-[#FF2D78]/10 hover:text-[#FF2D78] transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-16 text-center font-bold text-xl text-[#1E1012]">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="w-10 h-10 rounded-full bg-[#1E1012]/5 flex items-center justify-center hover:bg-[#FF2D78]/10 hover:text-[#FF2D78] transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="border-t border-[#1E1012]/5 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#1E1012]/60">Total:</span>
                  <span className="text-2xl font-bold text-[#1E1012]">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={
                    !product.isActive || inventoryAvailable < quantity
                  }
                  className={`bg-[#FF2D78] text-white rounded-full py-3 text-lg font-bold w-full max-w-sm mx-auto flex items-center justify-center gap-2 hover:brightness-110 transition-all ${
                    addedToCart ? "!bg-green-500" : ""
                  } ${!product.isActive || inventoryAvailable < quantity ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={20} /> Agregado
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} /> Añadir al carrito
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-[#1E1012]/50">Empaque</p>
                <p className="font-display font-bold text-[#1E1012]">
                  {product.packSize} unidades
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-[#1E1012]/50">Mínimo de compra</p>
                <p className="font-display font-bold text-[#1E1012]">
                  {minOrderQty} {product.unitOfMeasure}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-handwritten text-2xl text-[#1E1012]">
                También se antojan de...
              </h2>
              <Link
                href="/catalogo"
                className="text-[#7C3AED] font-medium hover:underline flex items-center gap-1"
              >
                Ver todos <ChevronRight size={18} />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {relatedProducts.map((prod) => (
                <div key={prod._id} className="min-w-[220px] max-w-[260px] flex-shrink-0">
                  <CandyCard product={prod} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-[#1E1012]">
              ${product.basePrice.toLocaleString()}
            </p>
            <p className="text-xs text-[#1E1012]/50">
              Min. {product.minimumOrderQuantity} uds
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-[#FF2D78] text-white px-6 py-3 rounded-full font-bold flex-1 hover:brightness-110 transition-all"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
