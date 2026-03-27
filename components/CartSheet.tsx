"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";
import { StickerBadge } from "@/components/StickerBadge";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export const CartSheet = memo(function CartSheet() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());

  const handleQuantityChange = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const shipping = totalPrice > 200000 ? 0 : 15000;
  const total = totalPrice + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-display">
            <ShoppingBag className="h-5 w-5" />
            Tu Carrito {totalItems > 0 && `(${totalItems})`}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 bg-[#FFFBF0] rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-[#1E1012]/30" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#1E1012] mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-[#1E1012]/60 mb-6">
              ¡Agrega algunos productos deliciosos!
            </p>
            <Button asChild onClick={closeCart}>
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100"
                  >
                    <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍬
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/producto/${item.sku}`}
                        className="font-medium text-[#1E1012] hover:text-[#7C3AED] transition-colors line-clamp-2"
                        onClick={closeCart}
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-[#1E1012]/50">SKU: {item.sku}</p>

                      <div className="flex items-center justify-between mt-2">
                        <QuantitySelector
                          initialQuantity={item.quantity}
                          minQuantity={item.packSize}
                          step={item.packSize}
                          onAdd={(qty) => handleQuantityChange(item.productId, qty)}
                          compact
                        />

                        <div className="text-right">
                          <p className="font-bold text-[#1E1012]">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-[#1E1012]/50">
                            ${item.price.toLocaleString()} c/u
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#1E1012]/40 hover:text-red-500 flex-shrink-0"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Eliminar ${item.name} del carrito`}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 pt-4 border-t">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#1E1012]/70">Subtotal</span>
                  <span className="font-medium">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#1E1012]/70">Envío</span>
                  <span className={shipping === 0 ? "text-[#34D399] font-medium" : "font-medium"}>
                    {shipping === 0 ? "GRATIS" : `$${shipping.toLocaleString()}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#1E1012]/50">
                    Te faltan ${(200000 - totalPrice).toLocaleString()} para envío gratis
                  </p>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-display font-bold">Total</span>
                  <span className="font-display font-bold text-xl">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearCart}
                >
                  <Trash2 size={16} className="mr-2" />
                  Vaciar
                </Button>
                <Button
                  asChild
                  className="flex-[2] bg-[#FF2D78] hover:bg-[#FF2D78]/90"
                  onClick={closeCart}
                >
                  <Link href="/carrito">
                    Ver carrito
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
});
