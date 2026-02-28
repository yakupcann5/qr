import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/server/db";
import { loginRateLimiter } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Default: 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gerekli.");
        }

        // Rate limit by email
        if (loginRateLimiter) {
          const { success } = await loginRateLimiter.limit(credentials.email);
          if (!success) {
            throw new Error(
              "Çok fazla başarısız giriş denemesi. 15 dakika sonra tekrar deneyin."
            );
          }
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email, deletedAt: null },
          include: { business: { select: { id: true } } },
        });

        if (!user) {
          throw new Error("Geçersiz email veya şifre.");
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const isValidPassword = await compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Geçersiz email veya şifre.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          businessId: user.business?.id ?? null,
          emailVerified: true, // authorize() already rejects unverified users above
          rememberMe: credentials.rememberMe === "true",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.businessId = user.businessId;
        token.emailVerified = !!user.emailVerified;
        token.rememberMe = user.rememberMe;

        // Role-based and rememberMe token expiry
        if (user.role === "SUPER_ADMIN") {
          token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
        } else if (user.rememberMe) {
          token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
        } else {
          token.exp = Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60; // 1 day
        }
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          businessId: token.businessId as string | null,
        },
      };
    },
  },
};
