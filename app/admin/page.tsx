"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user from Convex
  const convexUser = useQuery(
    api.users.getByEmail,
    localUser?.email ? { email: localUser.email } : "skip",
  );

  useEffect(() => {
    const savedUser = localStorage.getItem("dulcitienda_user");
    if (savedUser) {
      try {
        setLocalUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("dulcitienda_user");
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  // Check if user is admin from Convex data
  const isAdmin = convexUser?.role === "admin";

  if (!localUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Acceso denegado</h1>
          <p className="text-gray-500 mb-6">
            No tienes permisos para acceder al panel de administración.
          </p>
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-pink-500 to-yellow-400">
              Volver a la tienda
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Pedidos Hoy",
      value: "12",
      change: "+20%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Ventas Hoy",
      value: "$2.4M",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Productos",
      value: "550",
      change: "0",
      trend: "neutral",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Clientes",
      value: "45",
      change: "+5",
      trend: "up",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Tienda La Esquina",
      total: "$450,000",
      status: "pending",
      time: "Hace 5 min",
    },
    {
      id: "ORD-002",
      customer: "Supermercado El Ahorro",
      total: "$1,200,000",
      status: "processing",
      time: "Hace 15 min",
    },
    {
      id: "ORD-003",
      customer: "Cafetería Dolce",
      total: "$180,000",
      status: "completed",
      time: "Hace 1 hora",
    },
    {
      id: "ORD-004",
      customer: "Bar El Rincón",
      total: "$890,000",
      status: "completed",
      time: "Hace 2 horas",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "processing":
        return "En proceso";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-500">
              Bienvenido, {convexUser?.name || localUser?.name}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Ver tienda</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : stat.trend === "down" ? (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    ) : null}
                    <span
                      className={`text-sm ${
                        stat.trend === "up"
                          ? "text-green-600"
                          : stat.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Pedidos recientes</h2>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">
                        {order.id} • {order.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.total}</p>
                    <span
                      className={`text-sm ${
                        order.status === "completed"
                          ? "text-green-600"
                          : order.status === "processing"
                            ? "text-yellow-600"
                            : "text-orange-600"
                      }`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-6">Acciones rápidas</h2>

            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2" size={18} />
                Agregar producto
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="mr-2" size={18} />
                Ver pedidos
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2" size={18} />
                Gestionar clientes
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2" size={18} />
                Ver reportes
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
