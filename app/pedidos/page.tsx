"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ArrowLeft, Clock, CheckCircle, Truck, XCircle, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pendiente", color: "text-[#FBBF24] bg-[#FBBF24]/10", icon: Clock },
  confirmed: { label: "Confirmado", color: "text-blue-600 bg-blue-50", icon: CheckCircle },
  processing: { label: "En proceso", color: "text-[#7C3AED] bg-[#7C3AED]/10", icon: Loader2 },
  shipped: { label: "Enviado", color: "text-indigo-600 bg-indigo-50", icon: Truck },
  delivered: { label: "Entregado", color: "text-[#34D399] bg-[#34D399]/10", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "text-red-600 bg-red-50", icon: XCircle },
};

export default function PedidosPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("dulcitienda_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Get user from Convex to get the proper ID
  const convexUser = useQuery(
    api.users.getByEmail,
    user?.email ? { email: user.email } : "skip"
  );

  // Get orders for this customer
  const orders = useQuery(
    api.orders.getCustomerOrders,
    convexUser?._id ? { customerId: convexUser._id } : "skip"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF2D78]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-md">
          <div className="w-16 h-16 bg-[#FF2D78]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-[#FF2D78]" />
          </div>
          <h1 className="font-display font-bold text-xl text-[#1E1012] mb-2">Inicia sesión para ver tus pedidos</h1>
          <Link href="/login">
            <Button className="w-full bg-[#FF2D78] text-white rounded-full font-bold hover:opacity-90">
              Iniciar sesión
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/perfil" className="text-[#7C3AED] hover:underline flex items-center gap-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display font-bold text-2xl text-[#1E1012]">Mis Pedidos</h1>
            <p className="text-[#1E1012]/50">Historial de tus compras</p>
          </div>
        </div>

        {/* Orders List */}
        {orders === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF2D78]" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center bg-white rounded-2xl shadow-md">
            <div className="w-16 h-16 bg-[#1E1012]/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-[#1E1012]/30" />
            </div>
            <h2 className="font-display font-bold text-xl text-[#1E1012] mb-2">
              Aún no tienes pedidos. ¡Es hora de antojarse!
            </h2>
            <p className="text-[#1E1012]/50 mb-6">Explora nuestro catálogo y haz tu primera compra</p>
            <Link href="/catalogo">
              <Button className="bg-[#FF2D78] text-white rounded-full font-bold hover:opacity-90">
                Ver catálogo
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const orderDate = new Date(order.createdAt).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <Card key={order._id} className="p-6 bg-white rounded-2xl shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-display font-bold text-lg text-[#1E1012]">{order.orderNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.color}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-[#1E1012]/50 text-sm mb-3">{orderDate}</p>

                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-[#1E1012]/70">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-[#1E1012]/50">
                            +{order.items.length - 3} productos más
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#FF2D78]">
                        ${order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-[#1E1012]/50">
                        {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} productos
                      </p>
                      <Button variant="outline" size="sm" className="mt-3 rounded-full border-[#1E1012]/20 text-[#1E1012] hover:border-[#7C3AED] hover:text-[#7C3AED]">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
