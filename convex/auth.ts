import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async profile(profile) {
      // Determine role based on email
      const email = profile.email?.toLowerCase() || "";
      let role: "admin" | "power_user" | "customer" = "customer";
      
      if (email === "andres.monje@enube.com.co") {
        role = "admin";
      } else if (email.endsWith("@enube.com.co")) {
        role = "power_user";
      }
      
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        role,
        customerTier: "bronze",
      };
    },
  },
});
