"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, ArrowLeft, Eye, Loader2, Clock, CheckCircle, Truck, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  processing: { label: "En proceso", color: "bg-purple-100 text-purple-700", icon: Loader2 },
  shipped: { label: "Enviado", color: "bg-indigo-100 text-indigo-700", icon: Truck },
  delivered: { label: "Entregado", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function AdminPedidosPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const orders = useQuery(api.orders.getAllOrders);
  
  const updateStatus = useMutation(api.orders.updateOrderStatus);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    await updateStatus({ orderId: orderId as any, status: newStatus as any });
    setUpdating(null);
  };

  const filteredOrders = orders?.filter((order: any) => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
      const matchesCustomer = order.customerId.toString().toLowerCase().includes(query);
      return matchesOrderNumber || matchesCustomer;
    }
    
    return true;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
              <p className="text-gray-500">Administra todos los pedidos de la tienda</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {orders?.length || 0} pedidos totales
          </Badge>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Buscar por número de orden..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">⏳ Pendiente</SelectItem>
                  <SelectItem value="confirmed">✅ Confirmado</SelectItem>
                  <SelectItem value="processing">🔧 En proceso</SelectItem>
                  <SelectItem value="shipped">🚚 Enviado</SelectItem>
                  <SelectItem value="delivered">✓ Entregado</SelectItem>
                  <SelectItem value="cancelled">✕ Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders === undefined ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">No hay pedidos</h2>
              <p className="text-gray-500">{searchQuery || statusFilter !== "all" ? "Intenta con otros filtros" : "Los pedidos aparecerán aquí"}</p>
            </Card>
          ) : (
            filteredOrders.map((order: any) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <Card key={order._id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg">{order.orderNumber}</span>
                        <Badge className={status.color}>
                          <StatusIcon size={14} className="mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">{formatDate(order.createdAt)}</p>
                      
                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-500">+{order.items.length - 3} productos más</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-pink-600">${order.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} productos</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order._id, value)}
                          disabled={updating === order._id}
                        >
                          <SelectTrigger className="w-40">
                            {updating === order._id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <span>Cambiar estado</span>
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">⏳ Pendiente</SelectItem>
                            <SelectItem value="confirmed">✅ Confirmado</SelectItem>
                            <SelectItem value="processing">🔧 En proceso</SelectItem>
                            <SelectItem value="shipped">🚚 Enviado</SelectItem>
                            <SelectItem value="delivered">✓ Entregado</SelectItem>
                            <SelectItem value="cancelled">✕ Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button variant="outline" size="icon">
                          <Eye size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
