import { router, publicProcedure } from "../trpc";
import { authService } from "@/server/services/auth.service";
import { emailService } from "@/server/services/email.service";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/lib/validators/auth";

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const { user, verificationToken } = await authService.register(input);

      await emailService.sendVerificationEmail(
        user.email,
        verificationToken
      );

      return {
        success: true,
        message:
          "Kayıt başarılı! E-posta adresinize doğrulama linki gönderdik. Giriş yapabilmek için lütfen e-postanızı onaylayın.",
      };
    }),

  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ input }) => {
      await authService.verifyEmail(input.token);
      return {
        success: true,
        message: "Email adresiniz başarıyla doğrulandı. Giriş yapabilirsiniz.",
      };
    }),

  resendVerification: publicProcedure
    .input(forgotPasswordSchema) // Same schema: just email
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email, deletedAt: null },
        select: { id: true, emailVerified: true },
      });

      if (!user || user.emailVerified) {
        // Don't reveal info
        return { success: true, message: "Doğrulama linki gönderildi." };
      }

      const token = await authService.createEmailVerificationToken(user.id);
      await emailService.sendVerificationEmail(input.email, token);

      return { success: true, message: "Doğrulama linki gönderildi." };
    }),

  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ input }) => {
      const token = await authService.requestPasswordReset(input.email);

      if (token) {
        await emailService.sendPasswordResetEmail(input.email, token);
      }

      // Always return success to not reveal email existence
      return {
        success: true,
        message:
          "Eğer bu email adresi kayıtlıysa, şifre sıfırlama linki gönderildi.",
      };
    }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
      await authService.resetPassword(input);
      return {
        success: true,
        message: "Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.",
      };
    }),
});
