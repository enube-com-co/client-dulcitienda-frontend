import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "@convex-dev/auth/providers/Resend";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ResendOTP({
      // Configure Resend for email OTP
      // You need to set RESEND_API_KEY env variable
      // and configure your domain in Resend
    }),
  ],
});
