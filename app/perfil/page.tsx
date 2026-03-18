"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Package,
  MapPin,
  LogOut,
  Crown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("dulcitienda_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("dulcitienda_user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dulcitienda_user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF2D78] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-md">
          <div className="w-16 h-16 bg-[#FF2D78]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#FF2D78]" />
          </div>
          <h1 className="font-display font-bold text-xl text-[#1E1012] mb-2">
            No has iniciado sesión
          </h1>
          <p className="text-[#1E1012]/60 mb-6">
            Inicia sesión para ver tu perfil y pedidos
          </p>
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
        <div className="bg-[#7C3AED] rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User size={40} />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">
                {user.name}
              </h1>
              <p className="text-white/80">{user.email}</p>
              {user.company && (
                <p className="text-white/60 text-sm">{user.company}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Crown size={16} className="text-[#FBBF24]" />
                <span className="text-sm font-medium text-[#FBBF24]">
                  Cliente Bronce
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="grid gap-4">
          <Link href="/pedidos">
            <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-white rounded-2xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FF2D78]/10 rounded-full flex items-center justify-center">
                  <Package className="text-[#FF2D78]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-[#1E1012]">
                    Mis Pedidos
                  </h2>
                  <p className="text-sm text-[#1E1012]/50">
                    Ver historial de compras
                  </p>
                </div>
              </div>
              <ChevronRight className="text-[#1E1012]/30" />
            </Card>
          </Link>

          <Card className="p-4 flex items-center justify-between bg-white rounded-2xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FBBF24]/20 rounded-full flex items-center justify-center">
                <MapPin className="text-[#FBBF24]" />
              </div>
              <div>
                <h2 className="font-display font-bold text-[#1E1012]">
                  Direcciones
                </h2>
                <p className="text-sm text-[#1E1012]/50">
                  Gestionar direcciones de envío
                </p>
              </div>
            </div>
            <ChevronRight className="text-[#1E1012]/30" />
          </Card>

          <Button
            variant="outline"
            className="w-full py-6 text-red-600 border-red-200 hover:bg-red-50 rounded-full font-bold"
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
