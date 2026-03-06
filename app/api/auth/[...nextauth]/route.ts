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
        const email = user.email.toLowerCase();
        let role = "customer";
        
        if (email === "andres.monje@enube.com.co") {
          role = "admin";
        } else if (email.endsWith("@enube.com.co")) {
          role = "power_user";
        }
        
        // @ts-ignore
        user.role = role;
        
        return true;
      }
      return true;
    },
    
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.userId = user.id;
        // @ts-ignore
        token.role = user.role || "customer";
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user.id = token.userId;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
