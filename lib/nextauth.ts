import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          // Determine role based on email
          const email = user.email.toLowerCase();
          let role = "customer";
          
          if (email === "andres.monje@enube.com.co") {
            role = "admin";
          } else if (email.endsWith("@enube.com.co")) {
            role = "power_user";
          }
          
          // Store role in user object for JWT
          (user as any).role = role;
          
          // Create or update user in Convex
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                path: "users:createOrUpdateFromOAuth",
                args: {
                  email: user.email,
                  name: user.name,
                  googleId: user.id,
                  photo: user.image,
                },
              }),
            }
          );
          
          if (!response.ok) {
            console.error("Failed to create user in Convex");
          }
          
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = (user as any).role || "customer";
      }
      
      // Allow role updates
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};
