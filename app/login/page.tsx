"use client";

import { useAuthActions, Authenticated, Unauthenticated } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useEffect } from "react";

function RedirectToHome({ router }: { router: any }) {
  useEffect(() => {
    router.push("/");
  }, [router]);
  return null;
}

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  return (
    <>
      <Authenticated>
        <RedirectToHome router={router} />
      </Authenticated>
      <Unauthenticated>
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-pink-500 to-yellow-300 rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-4">
            🍬
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
            Dulcitienda
          </h1>
          <p className="text-gray-500 mt-2">Accede a tu cuenta</p>
        </div>

        {/* Google Sign In */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full h-14 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-lg"
            variant="outline"
          >
            <Chrome className="w-6 h-6 mr-3 text-blue-500" />
            Continuar con Google
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Al continuar, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-pink-600">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
      </Unauthenticated>
    </>
  );
}
