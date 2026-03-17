"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, ArrowRight, UserPlus, LogIn, Building2, Phone } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateFromLogin);
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user exists
  const existingUser = useQuery(
    api.users.getByEmail,
    email.length > 5 ? { email } : "skip"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        // Registration - create new user
        if (existingUser) {
          setError("Este email ya está registrado. Usa 'Iniciar sesión'.");
          setLoading(false);
          return;
        }

        const userId = await createOrUpdateUser({
          email,
          name,
          phone: phone || undefined,
          company: company || undefined
        });

        // Save to localStorage
        localStorage.setItem("dulcitienda_user", JSON.stringify({
          id: userId,
          email: email.toLowerCase().trim(),
          name: name.trim(),
          phone,
          company
        }));

        router.push("/");
      } else {
        // Login - verify user exists
        if (!existingUser) {
          setError("Este email no está registrado. Usa 'Registrarse'.");
          setLoading(false);
          return;
        }

        // Save to localStorage
        localStorage.setItem("dulcitienda_user", JSON.stringify({
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          phone: existingUser.phone,
          company: existingUser.company
        }));

        router.push("/");
      }
    } catch (err) {
      setError("Error al procesar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#FF2D78] rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-4">
            🍬
          </div>
          <h1 className="font-display font-bold text-2xl text-[#1E1012]">
            Dulcitienda
          </h1>
          <p className="text-[#1E1012]/60 mt-2">
            {mode === "register" ? "Crea tu cuenta" : "Bienvenido de nuevo"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-xl shadow-md p-1 mb-6 flex">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              mode === "login"
                ? "bg-[#FF2D78] text-white"
                : "text-[#1E1012]/60 hover:bg-[#1E1012]/5"
            }`}
          >
            <LogIn size={18} />
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              mode === "register"
                ? "bg-[#FF2D78] text-white"
                : "text-[#1E1012]/60 hover:bg-[#1E1012]/5"
            }`}
          >
            <UserPlus size={18} />
            Registrarse
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#1E1012] mb-2">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1012]/40" size={20} />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="pl-10 h-12 bg-white border-2 border-[#1E1012]/10 rounded-xl focus:border-[#7C3AED] text-[#1E1012]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1012] mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1012]/40" size={20} />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 300 123 4567"
                      className="pl-10 h-12 bg-white border-2 border-[#1E1012]/10 rounded-xl focus:border-[#7C3AED] text-[#1E1012]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1012] mb-2">
                    Empresa
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1012]/40" size={20} />
                    <Input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Nombre de tu negocio"
                      className="pl-10 h-12 bg-white border-2 border-[#1E1012]/10 rounded-xl focus:border-[#7C3AED] text-[#1E1012]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1E1012] mb-2">
                Correo electrónico *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1012]/40" size={20} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-10 h-12 bg-white border-2 border-[#1E1012]/10 rounded-xl focus:border-[#7C3AED] text-[#1E1012]"
                  required
                />
              </div>
            </div>

            {mode === "login" && existingUser === null && email.length > 5 && (
              <p className="text-amber-600 text-sm">⚠️ Este email no está registrado</p>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF2D78] hover:opacity-90 text-white font-bold rounded-full"
            >
              {loading ? (
                "Procesando..."
              ) : mode === "register" ? (
                <>Crear cuenta <ArrowRight className="ml-2 inline" size={18} /></>
              ) : (
                <>Iniciar sesión <ArrowRight className="ml-2 inline" size={18} /></>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#1E1012]/60">
              {mode === "register" ? (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-[#7C3AED] hover:underline font-medium"
                  >
                    Inicia sesión
                  </button>
                </>
              ) : (
                <>
                  ¿No tienes cuenta?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="text-[#7C3AED] hover:underline font-medium"
                  >
                    Regístrate
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[#1E1012]/50 hover:text-[#7C3AED] hover:underline">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
