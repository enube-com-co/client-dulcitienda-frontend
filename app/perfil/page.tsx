"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Package, MapPin, LogOut, Crown, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("dulcitienda_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dulcitienda_user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-xl font-bold mb-2">No has iniciado sesión</h1>
          <p className="text-gray-500 mb-6">Inicia sesión para ver tu perfil y pedidos</p>
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
        <div className="bg-gradient-to-r from-pink-500 to-yellow-400 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-white/80">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Crown size={16} className="text-yellow-200" />
                <span className="text-sm">Cliente Bronce</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="grid gap-4">
          <Link href="/pedidos">
            <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Package className="text-pink-600" />
                </div>
                <div>
                  <h2 className="font-semibold">Mis Pedidos</h2>
                  <p className="text-sm text-gray-500">Ver historial de compras</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </Card>
          </Link>

          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <MapPin className="text-yellow-600" />
              </div>
              <div>
                <h2 className="font-semibold">Direcciones</h2>
                <p className="text-sm text-gray-500">Gestionar direcciones de envío</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </Card>

          <Button 
            variant="outline" 
            className="w-full py-6 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" size={18} />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
