import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { requireAdmin } from "./auth";

// ==================== QUERIES ====================

/**
 * Obtener todas las promociones (para admin)
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const promotions = await ctx.db.query("promotions").order("desc").collect();

    return promotions;
  },
});

/**
 * Obtener promociones activas (para el frontend)
 */
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const promotions = await ctx.db
      .query("promotions")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .filter((q) => q.lt(q.field("startDate"), now))
      .filter((q) => q.gt(q.field("endDate"), now))
      .order("desc")
      .collect();

    return promotions;
  },
});

/**
 * Obtener promoción por código
 */
export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const promotion = await ctx.db
      .query("promotions")
      .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
      .first();

    return promotion;
  },
});

/**
 * Obtener una promoción por ID
 */
export const getById = query({
  args: { id: v.id("promotions") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * Contar usos de una promoción por usuario
 */
export const getUserUsageCount = query({
  args: {
    promotionId: v.id("promotions"),
    userId: v.id("users"),
  },
  handler: async (ctx, { promotionId, userId }) => {
    const usages = await ctx.db
      .query("promotionUsages")
      .withIndex("by_promotion_user", (q) =>
        q.eq("promotionId", promotionId).eq("userId", userId),
      )
      .collect();

    return usages.length;
  },
});

// ==================== MUTATIONS ====================

/**
 * Crear nueva promoción
 */
export const create = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("PERCENTAGE"),
      v.literal("FIXED_AMOUNT"),
      v.literal("FREE_SHIPPING"),
    ),
    scope: v.union(
      v.literal("GLOBAL"),
      v.literal("CATEGORY"),
      v.literal("PRODUCT"),
      v.literal("USER"),
    ),
    value: v.number(),
    maxDiscount: v.optional(v.number()),
    minPurchase: v.optional(v.number()),
    applicableCategories: v.optional(v.array(v.id("categories"))),
    applicableProducts: v.optional(v.array(v.string())),
    applicableUsers: v.optional(v.array(v.id("users"))),
    excludedProducts: v.optional(v.array(v.string())),
    startDate: v.number(),
    endDate: v.number(),
    usageLimit: v.optional(v.number()),
    perUserLimit: v.optional(v.number()),
    isExclusive: v.boolean(),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAdmin(ctx);
    const now = Date.now();

    // Verificar que el código no exista
    const existing = await ctx.db
      .query("promotions")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (existing) {
      throw new Error(`El código ${args.code} ya existe`);
    }

    const promotionId = await ctx.db.insert("promotions", {
      ...args,
      code: args.code.toUpperCase(),
      usageCount: 0,
      isActive: true,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });

    return promotionId;
  },
});

/**
 * Actualizar promoción
 */
export const update = mutation({
  args: {
    id: v.id("promotions"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    value: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    minPurchase: v.optional(v.number()),
    applicableCategories: v.optional(v.array(v.id("categories"))),
    applicableProducts: v.optional(v.array(v.string())),
    applicableUsers: v.optional(v.array(v.id("users"))),
    excludedProducts: v.optional(v.array(v.string())),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    perUserLimit: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isExclusive: v.optional(v.boolean()),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await requireAdmin(ctx);

    const promotion = await ctx.db.get(id);
    if (!promotion) {
      throw new Error("Promoción no encontrada");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * Eliminar promoción
 */
export const remove = mutation({
  args: { id: v.id("promotions") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
    return true;
  },
});

/**
 * Registrar uso de promoción
 */
export const recordUsage = mutation({
  args: {
    promotionId: v.id("promotions"),
    userId: v.id("users"),
    orderId: v.id("orders"),
    discountAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Registrar el uso
    await ctx.db.insert("promotionUsages", {
      ...args,
      usedAt: now,
    });

    // Incrementar contador
    const promotion = await ctx.db.get(args.promotionId);
    if (promotion) {
      await ctx.db.patch(args.promotionId, {
        usageCount: promotion.usageCount + 1,
        updatedAt: now,
      });
    }

    return true;
  },
});

// ==================== ACTIONS (VALIDACIÓN) ====================

/**
 * Validar y aplicar código de promoción
 */
export const validateAndApply = action({
  args: {
    code: v.string(),
    cart: v.object({
      items: v.array(
        v.object({
          sku: v.string(),
          name: v.string(),
          price: v.number(),
          quantity: v.number(),
          categoryId: v.id("categories"),
        }),
      ),
      subtotal: v.number(),
      shippingCost: v.number(),
    }),
    userId: v.optional(v.id("users")),
    alreadyApplied: v.optional(
      v.array(
        v.object({
          promotionId: v.id("promotions"),
          code: v.string(),
          name: v.string(),
          type: v.union(
            v.literal("PERCENTAGE"),
            v.literal("FIXED_AMOUNT"),
            v.literal("FREE_SHIPPING"),
          ),
          discountAmount: v.number(),
          description: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const { code, cart, userId, alreadyApplied = [] } = args;

    // Buscar promoción
    const promotion = await ctx.runQuery(api.promotions.getByCode, { code });

    if (!promotion) {
      return {
        success: false,
        error: "Código de promoción no válido",
      };
    }

    // Verificar si ya está aplicada
    if (alreadyApplied.some((ap) => ap.code === promotion.code)) {
      return {
        success: false,
        error: "Esta promoción ya está aplicada",
      };
    }

    // Verificar exclusividad
    if (promotion.isExclusive && alreadyApplied.length > 0) {
      return {
        success: false,
        error: "Esta promoción no puede combinarse con otras",
      };
    }

    // Verificar si hay una exclusiva ya aplicada
    let hasExclusive = false;
    for (const ap of alreadyApplied) {
      const p = await ctx.runQuery(api.promotions.getById, {
        id: ap.promotionId,
      });
      if (p?.isExclusive) {
        hasExclusive = true;
        break;
      }
    }

    if (hasExclusive) {
      return {
        success: false,
        error:
          "No puedes aplicar esta promoción porque ya tienes una promoción exclusiva",
      };
    }

    // Validaciones básicas
    if (!promotion.isActive) {
      return { success: false, error: "Esta promoción no está activa" };
    }

    const now = Date.now();
    if (now < promotion.startDate) {
      return { success: false, error: "Esta promoción aún no comienza" };
    }
    if (now > promotion.endDate) {
      return { success: false, error: "Esta promoción ha expirado" };
    }

    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return {
        success: false,
        error: "Esta promoción ha alcanzado su límite de usos",
      };
    }

    if (promotion.minPurchase && cart.subtotal < promotion.minPurchase) {
      return {
        success: false,
        error: `La compra mínima para esta promoción es $${promotion.minPurchase.toLocaleString()}`,
      };
    }

    // Verificar límite por usuario
    if (userId && promotion.perUserLimit) {
      const userUsageCount = await ctx.runQuery(
        api.promotions.getUserUsageCount,
        {
          promotionId: promotion._id,
          userId,
        },
      );

      if (userUsageCount >= promotion.perUserLimit) {
        return {
          success: false,
          error: "Ya has usado esta promoción el máximo de veces permitido",
        };
      }
    }

    // Verificar alcance (scope)
    const scopeValid = checkScope(promotion, cart);
    if (!scopeValid) {
      return {
        success: false,
        error: "Esta promoción no aplica a los productos de tu carrito",
      };
    }

    // Calcular descuento
    const discountAmount = calculateDiscount(promotion, cart);

    const currentDiscount = alreadyApplied.reduce(
      (sum, ap) => sum + ap.discountAmount,
      0,
    );

    return {
      success: true,
      promotion: {
        promotionId: promotion._id,
        code: promotion.code,
        name: promotion.name,
        type: promotion.type,
        discountAmount,
        description: promotion.description,
      },
      newTotal:
        cart.subtotal + cart.shippingCost - currentDiscount - discountAmount,
      discountAmount,
    };
  },
});

// ==================== HELPERS ====================

function checkScope(promotion: any, cart: any): boolean {
  switch (promotion.scope) {
    case "GLOBAL":
      return true;

    case "CATEGORY":
      if (!promotion.applicableCategories?.length) return false;
      return cart.items.some((item: any) =>
        promotion.applicableCategories?.includes(item.categoryId),
      );

    case "PRODUCT":
      if (!promotion.applicableProducts?.length) return false;
      return cart.items.some((item: any) =>
        promotion.applicableProducts?.includes(item.sku),
      );

    case "USER":
      // Para promociones de usuario específico, requiere userId
      return true; // La validación de userId específico se hace afuera

    default:
      return false;
  }
}

function calculateDiscount(promotion: any, cart: any): number {
  switch (promotion.type) {
    case "PERCENTAGE": {
      let discount = cart.subtotal * (promotion.value / 100);
      if (promotion.maxDiscount && discount > promotion.maxDiscount) {
        discount = promotion.maxDiscount;
      }
      return Math.round(discount);
    }

    case "FIXED_AMOUNT": {
      return Math.min(promotion.value, cart.subtotal);
    }

    case "FREE_SHIPPING": {
      return cart.shippingCost;
    }

    default:
      return 0;
  }
}
