import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { router, businessProcedure } from "../trpc";
import { updateBusinessSchema, deleteBusinessSchema } from "@/lib/validators/business";
import { changePasswordSchema } from "@/lib/validators/auth";
import { authService } from "@/server/services/auth.service";

export const businessRouter = router({
  get: businessProcedure.query(async ({ ctx }) => {
    const businessId = ctx.session.user.businessId;
    if (!businessId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "İşletme bulunamadı." });
    }

    return ctx.db.business.findUnique({
      where: { id: businessId, deletedAt: null },
      include: {
        subscription: { include: { plan: true } },
        languages: { where: { isActive: true } },
      },
    });
  }),

  stats: businessProcedure.query(async ({ ctx }) => {
    const businessId = ctx.session.user.businessId;
    if (!businessId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "İşletme bulunamadı." });
    }

    const [categoryCount, productCount] = await Promise.all([
      ctx.db.category.count({
        where: { businessId, isActive: true },
      }),
      ctx.db.product.count({
        where: { category: { businessId }, isActive: true },
      }),
    ]);

    return { categoryCount, productCount };
  }),

  update: businessProcedure
    .input(updateBusinessSchema)
    .mutation(async ({ ctx, input }) => {
      const businessId = ctx.session.user.businessId;
      if (!businessId || businessId !== input.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok." });
      }

      const { id, ...data } = input;
      return ctx.db.business.update({
        where: { id },
        data,
      });
    }),

  delete: businessProcedure
    .input(deleteBusinessSchema)
    .mutation(async ({ ctx, input }) => {
      const businessId = ctx.session.user.businessId;
      if (!businessId || businessId !== input.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok." });
      }

      const now = new Date();

      // Soft delete both user and business
      await ctx.db.$transaction([
        ctx.db.business.update({
          where: { id: input.id },
          data: { deletedAt: now, isActive: false },
        }),
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { deletedAt: now },
        }),
      ]);

      return {
        success: true,
        message: "Hesabınız silindi. Verileriniz 30 gün içinde kalıcı olarak silinecektir.",
      };
    }),

  changePassword: businessProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      await authService.changePassword(
        ctx.session.user.id,
        input.currentPassword,
        input.newPassword
      );
      return { success: true, message: "Şifreniz başarıyla değiştirildi." };
    }),
});
