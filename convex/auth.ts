import { GenericMutationCtx, GenericQueryCtx } from "convex/server";

/**
 * Require authenticated identity on a Convex mutation/query context.
 * Throws a user-facing error if no identity is present.
 */
export async function requireAuth(ctx: { auth: { getUserIdentity: () => Promise<any> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Autenticación requerida");
  }
  return identity;
}

/**
 * Require that the authenticated user has an admin role.
 * Looks up the user record in the database by email and checks the role field.
 */
export async function requireAdmin(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  db: any;
}) {
  const identity = await requireAuth(ctx);

  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", identity.email))
    .first();

  if (!user || user.role !== "admin") {
    throw new Error("Acceso denegado: se requiere rol de administrador");
  }

  return { identity, user };
}
