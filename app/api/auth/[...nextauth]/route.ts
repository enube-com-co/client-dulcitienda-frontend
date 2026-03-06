import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        // Assign role based on email
        const email = user.email.toLowerCase();
        let role = "customer";
        
        if (email === "andres.monje@enube.com.co") {
          role = "admin";
        } else if (email.endsWith("@enube.com.co")) {
          role = "power_user";
        }
        
        // Store role in user object for JWT
        (user as any).role = role;
        
        // Create/update user in Convex (best effort)
        try {
          await fetch(
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
        } catch (error) {
          console.error("Failed to sync user to Convex:", error);
        }
        
        return true;
      }
      return true;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role || "customer";
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.userId;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
