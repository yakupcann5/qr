import { type DefaultSession, type DefaultUser } from "next-auth";
import { type Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      businessId: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    businessId: string | null;
    emailVerified?: boolean;
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    businessId: string | null;
    emailVerified?: boolean;
    rememberMe?: boolean;
  }
}
