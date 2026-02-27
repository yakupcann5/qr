import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { businessRouter } from "./routers/business";
import { categoryRouter } from "./routers/category";
import { productRouter } from "./routers/product";
import { brandingRouter } from "./routers/branding";
import { languageRouter } from "./routers/language";
import { qrRouter } from "./routers/qr";
import { menuRouter } from "./routers/menu";
import { subscriptionRouter } from "./routers/subscription";
import { paymentRouter } from "./routers/payment";
import { planRouter } from "./routers/plan";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  auth: authRouter,
  business: businessRouter,
  category: categoryRouter,
  product: productRouter,
  branding: brandingRouter,
  language: languageRouter,
  qr: qrRouter,
  menu: menuRouter,
  subscription: subscriptionRouter,
  payment: paymentRouter,
  plan: planRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
