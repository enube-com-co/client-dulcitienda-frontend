"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Clock, 
  ChevronRight,
  Minus,
  Plus,
  Check,
  Phone,
  Menu,
  X,
  Search
} from "lucide-react";
import { getProductImage, categoryColors } from "@/lib/product-images";

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
    const saved = localStorage.getItem('dulcitienda-cart');
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);
  
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      let newCart;
      if (existing) {
        newCart = prev.map(i => 
          i.productId === item.productId 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newCart = [...prev, item];
      }
      localStorage.setItem('dulcitienda-cart', JSON.stringify(newCart));
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const product = useQuery(api.products.getProduct, { sku });
  const relatedProducts = useQuery(api.products.getFeaturedProducts, { limit: 4 });
  const { addToCart, cartCount } = useCart();

  // Loading state
  if (product === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (product === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-800">Producto no encontrado</h1>
          <p className="text-gray-500 mt-2">El producto que buscas no existe o no está disponible</p>
          <Link href="/catalogo">
            <button className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-gradient-to-r from-pink-600 via-pink-500 to-yellow-400 transition-colors">
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

  const increaseQty = () => setQuantity(q => q + minOrderQty);
  const decreaseQty = () => setQuantity(q => Math.max(minOrderQty, q - minOrderQty));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-yellow-400 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>🚚 Envío gratis en Neiva en pedidos mayores a $200.000</p>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+573132309867" className="flex items-center gap-2 hover:text-pink-200">
              <Phone size={14} /> +57 320 355 5663
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
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

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-full focus:border-pink-500 focus:outline-none transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-gradient-to-r from-pink-600 via-pink-500 to-yellow-400 transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/catalogo" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                <ShoppingCart size={24} />
                <span className="bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-pink-600">Inicio</Link>
            <ChevronRight size={16} />
            <Link href="/catalogo" className="hover:text-pink-600">Catálogo</Link>
            <ChevronRight size={16} />
            <span className="text-gray-800 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center relative">
                <span className="text-9xl">📦</span>
                {product.isFeatured && (
                  <span className="absolute top-4 left-4 px-4 py-2 bg-pink-500 text-white text-sm font-bold rounded-full">
                    ⭐ DESTACADO
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <button key={i} className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center hover:from-pink-100 hover:to-purple-100 transition-colors border-2 border-transparent hover:border-pink-300">
                  <span className="text-2xl">📦</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.isActive && inventoryAvailable > 0
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.isActive && inventoryAvailable > 0 ? '✓ En stock' : '✗ Agotado'}
                </span>
                <span className="text-gray-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{product.name}</h1>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-pink-600">
                  ${product.basePrice.toLocaleString()}
                </span>
                <span className="text-gray-500">/ {product.unitOfMeasure}</span>
              </div>              
              <p className="text-sm text-gray-500 mt-2">
                Pack de {product.packSize} unidades • Precio por unidad: ${Math.round(product.basePrice / product.packSize).toLocaleString()}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, title: "Envío rápido", desc: "24-48h" },
                { icon: Shield, title: "Garantía", desc: "Producto fresco" },
                { icon: Clock, title: "Stock", desc: `${inventoryAvailable} und` },
              ].map((feature, idx) => (
                <div key={idx} className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <feature.icon className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                  <p className="font-medium text-sm text-gray-800">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-700">Cantidad (mínimo {minOrderQty}):</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={decreaseQty}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                  <button 
                    onClick={increaseQty}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total:</span>
                  <span className="text-2xl font-bold text-pink-600">${totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleAddToCart}
                    disabled={!product.isActive || inventoryAvailable < quantity}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-pink-500 text-white hover:bg-gradient-to-r from-pink-600 via-pink-500 to-yellow-400 shadow-lg hover:shadow-xl'
                    } ${(!product.isActive || inventoryAvailable < quantity) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {addedToCart ? (
                      <><Check size={20} /> Agregado</>
                    ) : (
                      <><ShoppingCart size={20} /> Añadir al carrito</>
                    )}
                  </button>
                  
                  <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:border-pink-300 hover:text-pink-500 transition-colors">
                    <Heart size={24} />
                  </button>
                  
                  <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:border-pink-300 hover:text-pink-500 transition-colors">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Empaque</p>
                <p className="font-bold text-gray-800">{product.packSize} unidades</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Mínimo de compra</p>
                <p className="font-bold text-gray-800">{minOrderQty} {product.unitOfMeasure}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Productos relacionados</h2>
              <Link href="/catalogo" className="text-pink-600 font-medium hover:text-pink-700 flex items-center gap-1">
                Ver todos <ChevronRight size={18} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <Link key={prod._id} href={`/producto/${prod.sku}`}>
                  <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-pink-50 group-hover:to-purple-50 transition-colors">
                      <span className="text-4xl group-hover:scale-110 transition-transform">📦</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 text-sm">{prod.name}</h3>
                      <p className="text-lg font-bold text-pink-600">${prod.basePrice.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
