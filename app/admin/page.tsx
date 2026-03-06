"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowLeft,
  Plus,
  Crown,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session } = useSession();
  
  const userRole = (session?.user as any)?.role || "customer";
  const isAdmin = userRole === "admin";

  // Mock stats
  const stats = {
    totalProducts: 550,
    totalOrders: 124,
    totalRevenue: 4500000,
    pendingOrders: 8,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/perfil">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
            </div>
          </div>
          
          <span className="text-sm text-gray-600 capitalize">
            {session?.user?.email} ({userRole})
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isAdmin && (
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Productos</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>

          {isAdmin && (
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ventas</p>
                  <p className="text-2xl font-bold text-gray-800">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6 border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Management - Available to both admin and power_user */}
          <Link href="/admin/orders">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">Gestionar Pedidos</h2>
                    <p className="text-sm text-gray-600">Ver, actualizar estado y gestionar pedidos</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-green-50">
                  Ver todos
                </Button>
              </div>
            </Card>
          </Link>

          {/* Product Management - Admin only */}
          {isAdmin && (
            <Link href="/admin/products">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-pink-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">Gestionar Productos</h2>
                      <p className="text-sm text-gray-600">Agregar, editar o eliminar productos</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo
                  </Button>
                </div>
              </Card>
            </Link>
          )}

          {/* Inventory - Admin only */}
          {isAdmin && (
            <Link href="/admin/inventory">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Settings className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">Inventario</h2>
                      <p className="text-sm text-gray-600">Control de stock y almacenes</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Gestionar
                  </Button>
                </div>
              </Card>
            </Link>
          )}

          {/* Users - Admin only */}
          {isAdmin && (
            <Link href="/admin/users">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">Usuarios</h2>
                      <p className="text-sm text-gray-600">Gestionar clientes y permisos</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver usuarios
                  </Button>
                </div>
              </Card>
            </Link>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tu Rol: {isAdmin ? "Administrador" : "Gestor de Pedidos"}</h3>
            <p className="text-sm text-blue-700">
              {isAdmin 
                ? "Tienes acceso completo al sistema: productos, pedidos, inventario y usuarios."
                : "Puedes gestionar pedidos y actualizar su estado, pero no modificar productos ni inventario."}
            </p>
          </div>

          <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Próximamente:</strong> Edición completa de productos, gestión de categorías, 
              análisis de ventas detallado, y control de inventario avanzado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
