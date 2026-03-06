"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Package, MapPin, LogOut, Crown, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return { label: "Administrador", color: "bg-purple-100 text-purple-700", icon: Crown };
      case "power_user":
        return { label: "Gestor de Pedidos", color: "bg-blue-100 text-blue-700", icon: Package };
      default:
        return { label: "Cliente", color: "bg-gray-100 text-gray-700", icon: User };
    }
  };

  const userRole = (session?.user as any)?.role || "customer";
  const roleInfo = getRoleLabel(userRole);
  const RoleIcon = roleInfo.icon;
  const isAdmin = userRole === "admin";
  const isPowerUser = userRole === "power_user" || isAdmin;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Dulcitienda
          </Link>
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-600">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || ""}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">{session.user.name}</h1>
              <p className="text-gray-600">{session.user.email}</p>
              
              {userRole !== "customer" ? (
                <span className={`inline-flex items-center gap-1 px-3 py-1 ${roleInfo.color} rounded-full text-sm font-medium mt-2`}>
                  <RoleIcon className="w-3 h-3" />
                  {roleInfo.label}
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1 px-3 py-1 ${roleInfo.color} rounded-full text-sm font-medium mt-2`}>
                  <RoleIcon className="w-3 h-3" />
                  {roleInfo.label}
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Menu Options */}
        <div className="space-y-4">
          <Link href="/pedidos">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">Mis Pedidos</h2>
                  <p className="text-sm text-gray-600">Ver historial de compras</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </Link>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">Direcciones</h2>
                <p className="text-sm text-gray-600">Gestionar direcciones de entrega</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>

          {/* Admin/Power User Section */}
          {(isAdmin || isPowerUser) && (
            <>
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  {isAdmin ? "Panel de Administración" : "Gestión de Pedidos"}
                </h3>
              </div>

              {isAdmin && (
                <Link href="/admin">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-purple-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Crown className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-semibold text-gray-800">Panel Admin</h2>
                        <p className="text-sm text-gray-600">Productos, inventario, usuarios</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                </Link>
              )}

              <Link href="/admin/orders">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-800">Gestionar Pedidos</h2>
                      <p className="text-sm text-gray-600">Ver y actualizar estado de pedidos</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
