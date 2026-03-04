"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight,
  Phone,
  Menu,
  X,
  Search,
  ArrowLeft,
  Package
} from "lucide-react";

interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  packSize: number;
}

export default function CarritoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('dulcitienda-cart');
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);
  
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.productId === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem('dulcitienda-cart', JSON.stringify(newCart));
      return newCart;
    });
  };
  
  const removeItem = (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.productId !== productId);
      localStorage.setItem('dulcitienda-cart', JSON.stringify(newCart));
      return newCart;
    });
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('dulcitienda-cart');
  };
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 200000 ? 0 : 15000;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-pink-600 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>🚚 Envío gratis en Bogotá en pedidos mayores a $200.000</p>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+573203555663" className="flex items-center gap-2 hover:text-pink-200">
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

            <div className="flex items-center gap-4">
              <Link href="/catalogo" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                <ArrowLeft size={20} />
                <span className="hidden md:inline">Seguir comprando</span>
              </Link>
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
            <span className="text-gray-800 font-medium">Carrito de compras</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Carrito de compras ({itemCount} items)</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-6">¡Agrega algunos productos para comenzar tu pedido!</p>
            <Link href="/catalogo">
              <button className="px-8 py-4 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-colors">
                Ver catálogo
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {cart.map((item, index) => (
                  <div key={item.productId} className={`p-6 ${index !== cart.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">📦</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link href={`/producto/${item.sku}`}>
                              <h3 className="font-bold text-gray-800 hover:text-pink-600 transition-colors">{item.name}</h3>
                            </Link>
                            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.productId)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.productId, -item.packSize)}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-16 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.packSize)}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg text-pink-600">
                              ${(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toLocaleString()} c/u
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={clearCart}
                className="text-red-500 font-medium hover:text-red-600 flex items-center gap-2"
              >
                <Trash2 size={18} /> Vaciar carrito
              </button>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {shipping === 0 ? 'GRATIS' : `$${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-sm text-gray-500">
                      Te faltan ${(200000 - subtotal).toLocaleString()} para envío gratis
                    </p>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-pink-600">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <a href="https://wa.me/573203555663?text=Hola, quiero hacer un pedido:%0A%0A${encodeURIComponent(cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`).join('%0A'))}%0A%0ATotal: $${total.toLocaleString()}">
                  <button className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    💬 Pedir por WhatsApp
                  </button>
                </a>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  Te redirigiremos a WhatsApp para confirmar tu pedido
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
