import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google" && user.email) {
        const email = user.email.toLowerCase();
        let role = "customer";
        
        if (email === "andres.monje@enube.com.co") {
          role = "admin";
        } else if (email.endsWith("@enube.com.co")) {
          role = "power_user";
        }
        
        user.role = role;
        
        return true;
      }
      return true;
    },
    
    async jwt({ token, user }: any) {
      if (user) {
        token.userId = user.id;
        token.role = user.role || "customer";
      }
      return token;
    },
    
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.userId;
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
};

const nextAuthHandler = NextAuth(authOptions);

export async function GET(req: NextRequest, context: any) {
  // @ts-ignore
  return nextAuthHandler(req, context);
}

export async function POST(req: NextRequest, context: any) {
  // @ts-ignore
  return nextAuthHandler(req, context);
}
