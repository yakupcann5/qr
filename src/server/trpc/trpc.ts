import { initTRPC, TRPCError } from "@trpc/server";
import { type Session, getServerSession } from "next-auth";
import superjson from "superjson";
import { type Role } from "@prisma/client";
import { db } from "@/server/db";
import { authOptions } from "@/server/auth";
import { apiRateLimiter } from "@/lib/rate-limit";

export interface CreateContextOptions {
  session: Session | null;
}

export const createTRPCContext = async (): Promise<{
  session: Session | null;
  db: typeof db;
}> => {
  const session = await getServerSession(authOptions);
  return { session, db };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

// Auth middleware — requires authenticated user + API rate limit
const enforceAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Giriş yapmanız gerekiyor." });
  }

  // API rate limit per user
  if (apiRateLimiter) {
    const { success } = await apiRateLimiter.limit(ctx.session.user.id as string);
    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Çok fazla istek gönderildi. Lütfen biraz bekleyin.",
      });
    }
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);

// Role middleware — requires specific role
const enforceRole = (role: Role) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Giriş yapmanız gerekiyor." });
    }
    if (ctx.session.user.role !== role) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok." });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

export const adminProcedure = protectedProcedure.use(
  enforceRole("SUPER_ADMIN")
);

export const businessProcedure = protectedProcedure.use(
  enforceRole("BUSINESS_OWNER")
);

/** Assert that the input businessId matches the session user's businessId. */
export function assertBusinessAccess(
  sessionBusinessId: string | null | undefined,
  inputBusinessId: string
): asserts sessionBusinessId is string {
  if (!sessionBusinessId || inputBusinessId !== sessionBusinessId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Bu işlem için yetkiniz yok.",
    });
  }
}

/** Assert that an entity exists and belongs to the session user's business. */
export function assertEntityOwnership(
  entity: { businessId: string } | null | undefined,
  sessionBusinessId: string | null | undefined
): void {
  if (!sessionBusinessId || !entity || entity.businessId !== sessionBusinessId) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Kayıt bulunamadı.",
    });
  }
}
