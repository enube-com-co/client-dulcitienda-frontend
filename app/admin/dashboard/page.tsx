"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Suspense } from "react";
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import Link from "next/link";

// Loading skeleton for stats
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-10 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

// Individual stat card
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  trendUp 
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="p-3 bg-pink-50 rounded-lg">
          <Icon className="w-6 h-6 text-pink-600" />
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}>
            {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trend}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

// Stats grid component
function DashboardStats() {
  const stats = useQuery(api.products.getDashboardStats, { period: "30d" });
  
  if (stats === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Ventas (30 días)"
        value={`$${stats.totalSales.toLocaleString()}`}
        icon={DollarSign}
        trend="+23%"
        trendUp={true}
      />
      
      <StatCard
        title="Pedidos"
        value={stats.totalOrders.toString()}
        icon={ShoppingCart}
        trend="+12%"
        trendUp={true}
      />
      
      <StatCard
        title="Clientes Nuevos"
        value={stats.newCustomers.toString()}
        icon={Users}
        trend="+8%"
        trendUp={true}
      />
      
      <StatCard
        title="Ticket Promedio"
        value={`$${stats.averageOrderValue.toLocaleString()}`}
        icon={TrendingUp}
        trend="+5%"
        trendUp={true}
      />
    </div>
  );
}

// Low stock alerts
function LowStockAlert() {
  const inventory = useQuery(api.products.getInventoryStats);
  
  if (inventory === undefined) return null;
  
  if (inventory.lowStockCount === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Package className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-green-800">Inventario en buen estado</p>
          <p className="text-sm text-green-600">Todos los productos tienen stock suficiente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="font-medium text-amber-800">⚠️ {inventory.lowStockCount} productos con stock bajo</p>
        </div>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {inventory.lowStockProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between bg-white rounded-lg p-3">
            <div>
              <p className="font-medium text-sm">{product.name}</p>
              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-red-600">{product.quantity} unidades</p>
              <p className="text-xs text-gray-500">Mín: {product.reorderLevel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Top products
function TopProducts() {
  const stats = useQuery(api.products.getDashboardStats, { period: "30d" });
  
  if (stats === undefined) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse h-64">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-pink-600" />
        Productos Más Vendidos
      </h3>
      
      {stats.topProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay ventas registradas este período</p>
      ) : (
        <div className="space-y-3">
          {stats.topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? "bg-yellow-100 text-yellow-700" :
                  index === 1 ? "bg-gray-200 text-gray-700" :
                  index === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {index + 1}
                </span>
                <span className="font-medium text-sm truncate max-w-[150px]">{product.name}</span>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-sm">${product.revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{product.quantity} vendidos</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Recent orders
function RecentOrders() {
  const orders = useQuery(api.products.getRecentOrders, { limit: 5 });
  
  if (orders === undefined) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse h-64">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded mb-2" />
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-purple-100 text-purple-700";
      case "shipped": return "bg-indigo-100 text-indigo-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado"
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-pink-600" />
          Pedidos Recientes
        </h3>
        
        <Link href="/admin/pedidos" className="text-sm text-pink-600 hover:text-pink-700">
          Ver todos →
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay pedidos aún</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Pedido #{order.orderNumber}</p>
                <p className="text-xs text-gray-500">{order.customerName}</p>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-sm">${order.totalAmount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main dashboard component
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Resumen de tu negocio en tiempo real</p>
        </div>
        
        {/* Stats Grid */}
        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>}>
          <DashboardStats />
        </Suspense>
        
        {/* Alerts */}
        <div className="mt-6">
          <LowStockAlert />
        </div>
        
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Suspense fallback={<div className="h-64 bg-gray-200 rounded-xl animate-pulse" />}>
            <TopProducts />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 bg-gray-200 rounded-xl animate-pulse" />}>
            <RecentOrders />
          </Suspense>
        </div>
        
        {/* Quick actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/productos" className="flex flex-col items-center p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
              <Package className="w-6 h-6 text-pink-600 mb-2" />
              <span className="text-sm font-medium text-pink-700">Productos</span>
            </Link>
            
            <Link href="/admin/pedidos" className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <ShoppingCart className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-700">Pedidos</span>
            </Link>
            
            <Link href="/admin/clientes" className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <Users className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-700">Clientes</span>
            </Link>
            
            <Link href="/admin/config" className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <TrendingUp className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Reportes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
