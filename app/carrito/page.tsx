"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { validateCartItem } from "@/lib/validation";

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
  const [user, setUser] = useState<any>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  // Convex mutations
  const createOrder = useMutation(api.orders.createOrder);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("dulcitienda-cart");
    const savedUser = localStorage.getItem("dulcitienda_user");

    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter((item) => {
            const validation = validateCartItem(item);
            return validation.valid;
          });
          setCart(validItems);
          localStorage.setItem("dulcitienda-cart", JSON.stringify(validItems));
        }
      } catch {
        localStorage.removeItem("dulcitienda-cart");
        setCart([]);
      }
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Get user from Convex
  const convexUser = useQuery(
    api.users.getByEmail,
    user?.email ? { email: user.email } : "skip",
  );

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const newCart = prev.map((item) => {
        if (item.productId === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem("dulcitienda-cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.productId !== productId);
      localStorage.setItem("dulcitienda-cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("dulcitienda-cart");
  };

  const handleCheckout = async () => {
    setCreatingOrder(true);

    try {
      // Prepare order items
      const orderItems = cart.map((item) => ({
        productId: item.productId as any,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      }));

      // Create order in Convex (if user is logged in)
      if (convexUser?._id) {
        const result = await createOrder({
          customerId: convexUser._id,
          items: orderItems,
          shippingAddress: {
            name: user?.name || "Cliente",
            street: "Por confirmar",
            city: "Neiva",
            state: "Huila",
            zip: "410001",
          },
          whatsappPhone: user?.phone,
          notes: `Pedido desde carrito - Cliente: ${user?.name || "Sin registrar"}`,
        });

        console.log("Order created:", result);
      }

      setOrderCreated(true);

      // Clear cart after order is created
      clearCart();

      // Redirect to WhatsApp after a short delay
      setTimeout(() => {
        const message = encodeURIComponent(
          `¡Hola! Quiero hacer un pedido en Dulcitienda:\n\n` +
            cart
              .map(
                (item, i) =>
                  `${i + 1}. ${item.name}\n   SKU: ${item.sku}\n   Cantidad: ${item.quantity} unidades\n   Precio unitario: $${item.price.toLocaleString()}\n   Subtotal: $${(item.price * item.quantity).toLocaleString()}`,
              )
              .join("\n\n") +
            `\n\n--------------------------------\n` +
            `Subtotal: $${subtotal.toLocaleString()}\n` +
            `Envío: ${shipping === 0 ? "GRATIS" : "$" + shipping.toLocaleString()}\n` +
            `*TOTAL: $${total.toLocaleString()}*\n\n` +
            `Cliente: ${user?.name || "Sin registrar"}\n` +
            `Email: ${user?.email || "No proporcionado"}\n` +
            `${user?.phone ? `Tel: ${user.phone}\n` : ""}` +
            `\nPor favor confirmar disponibilidad y método de pago. ¡Gracias!`,
        );

        window.open(`https://wa.me/573132309867?text=${message}`, "_blank");
      }, 1500);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error al crear el pedido. Intenta de nuevo.");
    } finally {
      setCreatingOrder(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 200000 ? 0 : 15000;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center gap-4">
        <div className="text-4xl animate-spin inline-block">🍬</div>
        <p className="font-handwritten text-lg text-[#1E1012]/60">
          Cargando cositas ricas...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/catalogo"
          className="text-[#7C3AED] hover:underline text-sm font-medium"
        >
          ← Seguir comprando
        </Link>

        <h1 className="font-display font-bold text-[#1E1012] text-2xl sm:text-3xl mt-4 mb-8">
          Tu carrito {itemCount > 0 && `(${itemCount})`}
        </h1>

        {cart.length === 0 ? (
          <div>
            {orderCreated ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-[#34D399]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-[#34D399]" />
                </div>
                <h2 className="text-2xl font-display font-bold text-[#1E1012] mb-2">
                  ¡Pedido creado exitosamente!
                </h2>
                <p className="text-[#1E1012]/60 mb-6">
                  Hemos abierto WhatsApp para que confirmes tu pedido.
                </p>
                <Link href="/pedidos">
                  <button className="inline-block bg-[#FF2D78] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all">
                    Ver mis pedidos
                  </button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🍬</div>
                <h2 className="text-2xl font-display font-bold text-[#1E1012] mb-2">
                  Aquí no hay nada... todavía
                </h2>
                <p className="text-[#1E1012]/60 mb-6 font-handwritten text-xl">
                  Tu carrito está más vacío que nevera de lunes
                </p>
                <Link
                  href="/catalogo"
                  className="inline-block bg-[#FF2D78] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all"
                >
                  Ir al catálogo
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-2xl shadow-md p-4"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">📦</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/producto/${item.sku}`}>
                            <h3 className="font-display font-semibold text-[#1E1012] hover:text-[#7C3AED] transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-[#1E1012]/50">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 text-[#1E1012]/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, -item.packSize)
                            }
                            className="bg-[#FF2D78] text-white rounded-full w-8 h-8 flex items-center justify-center hover:brightness-110 transition-all"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-16 text-center font-medium text-[#1E1012]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.packSize)
                            }
                            className="bg-[#FF2D78] text-white rounded-full w-8 h-8 flex items-center justify-center hover:brightness-110 transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg text-[#1E1012]">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-[#1E1012]/50">
                            ${item.price.toLocaleString()} c/u
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-red-500 font-medium hover:text-red-600 flex items-center gap-2"
              >
                <Trash2 size={18} /> Vaciar carrito
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="font-display font-bold text-xl text-[#1E1012] mb-6">
                  Resumen del pedido
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1E1012]/70">Subtotal</span>
                    <span className="font-medium text-[#1E1012]">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#1E1012]/70">Envío</span>
                    <span
                      className={
                        shipping === 0
                          ? "text-[#34D399] font-medium"
                          : "font-medium text-[#1E1012]"
                      }
                    >
                      {shipping === 0
                        ? "GRATIS"
                        : `$${shipping.toLocaleString()}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-sm text-[#1E1012]/50">
                      Te faltan ${(200000 - subtotal).toLocaleString()} para
                      envío gratis
                    </p>
                  )}

                  <div className="border-t-2 border-dashed border-[#1E1012]/10 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#1E1012]/70">Total</span>
                      <span className="font-display font-bold text-xl text-[#1E1012]">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-amber-800">
                      💡{" "}
                      <Link href="/login" className="font-medium underline">
                        Inicia sesión
                      </Link>{" "}
                      para guardar tu historial de pedidos
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={creatingOrder}
                  className="bg-[#FF2D78] text-white rounded-full py-4 text-lg font-bold w-full hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {creatingOrder ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Creando pedido...
                    </>
                  ) : (
                    <>🚀 Hacer pedido</>
                  )}
                </button>
                <p className="text-center text-sm text-[#1E1012]/50 mt-4">
                  {user
                    ? "Tu pedido se guardará en tu historial"
                    : "Te redirigiremos a WhatsApp para confirmar tu pedido"}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
