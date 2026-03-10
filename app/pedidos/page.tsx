"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ArrowLeft, Clock, CheckCircle, Truck, XCircle, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pendiente", color: "text-amber-600 bg-amber-50", icon: Clock },
  confirmed: { label: "Confirmado", color: "text-blue-600 bg-blue-50", icon: CheckCircle },
  processing: { label: "En proceso", color: "text-purple-600 bg-purple-50", icon: Loader2 },
  shipped: { label: "Enviado", color: "text-indigo-600 bg-indigo-50", icon: Truck },
  delivered: { label: "Entregado", color: "text-green-600 bg-green-50", icon: CheckCircle },
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-xl font-bold mb-2">Inicia sesión para ver tus pedidos</h1>
          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-pink-500 to-yellow-400">
              Iniciar sesión
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/perfil">
            <Button variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
            <p className="text-gray-500">Historial de tus compras</p>
          </div>
        </div>

        {/* Orders List */}
        {orders === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-500 mb-6">Explora nuestro catálogo y haz tu primera compra</p>
            <Link href="/catalogo">
              <Button className="bg-gradient-to-r from-pink-500 to-yellow-400">
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
                <Card key={order._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg">{order.orderNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.color}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-3">{orderDate}</p>
                      
                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 3} productos más
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-600">
                        ${order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} productos
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
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
