import { PrismaClient } from "@prisma/client";
import { mockDeep } from "vitest-mock-extended";
import type { Session } from "next-auth";

export const mockDb = mockDeep<PrismaClient>();

export const mockBusinessSession: Session = {
  user: {
    id: "user-1",
    email: "owner@test.com",
    name: "Test Owner",
    role: "BUSINESS_OWNER",
    businessId: "biz-1",
  },
  expires: "2099-01-01",
};

export const mockAdminSession: Session = {
  user: {
    id: "admin-1",
    email: "admin@test.com",
    name: "Admin",
    role: "SUPER_ADMIN",
    businessId: null,
  },
  expires: "2099-01-01",
};

export function makeCtx(session: Session | null = null) {
  return { session, db: mockDb };
}
