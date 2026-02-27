import { appRouter } from "@/server/trpc";
import { createTRPCContext } from "@/server/trpc/trpc";

export const createServerCaller = async () => {
  const ctx = await createTRPCContext();
  return appRouter.createCaller(ctx);
};
