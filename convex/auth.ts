import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  // @ts-ignore - Type issues with createOrUpdateUser callback
  callbacks: {
    async createOrUpdateUser(ctx: any, args: any) {
      const { existingUserId, profile } = args;
      
      // Determine role based on email
      const email = (profile.email as string)?.toLowerCase() || "";
      let role: "admin" | "power_user" | "customer" = "customer";
      
      if (email === "andres.monje@enube.com.co") {
        role = "admin";
      } else if (email.endsWith("@enube.com.co")) {
        role = "power_user";
      }
      
      // If user already exists, update role
      if (existingUserId) {
        await ctx.db.patch(existingUserId, {
          role,
          customerTier: "bronze",
        });
        return existingUserId;
      }
      
      // Create new user and return the ID
      const userId = await ctx.db.insert("users", {
        email: profile.email,
        name: profile.name || profile.email?.split("@")[0],
        image: profile.image,
        role,
        customerTier: "bronze",
        isActive: true,
        createdAt: Date.now(),
      });
      
      return userId;
    },
  },
});
