import { initTRPC, TRPCError } from "@trpc/server";
import { type Session, getServerSession } from "next-auth";
import superjson from "superjson";
import { type Role } from "@prisma/client";
import { db } from "@/server/db";
import { authOptions } from "@/server/auth";

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

// Auth middleware — requires authenticated user
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Giriş yapmanız gerekiyor." });
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
