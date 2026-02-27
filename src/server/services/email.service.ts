import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "QR Menü <noreply@qrmenu.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  async send(options: SendEmailOptions): Promise<void> {
    if (!resend) {
      console.log(`[Email Dev] To: ${options.to}, Subject: ${options.subject}`);
      return;
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  },

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${APP_URL}/verify-email/${token}`;
    await this.send({
      to: email,
      subject: "Email Adresinizi Doğrulayın — QR Menü",
      html: `
        <h2>Email Doğrulama</h2>
        <p>QR Menü'ye hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki linke tıklayın:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">Email Adresimi Doğrula</a>
        <p>Bu link 24 saat geçerlidir.</p>
        <p>Bu işlemi siz yapmadıysanız bu emaili görmezden gelebilirsiniz.</p>
      `,
    });
  },

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${APP_URL}/reset-password/${token}`;
    await this.send({
      to: email,
      subject: "Şifre Sıfırlama — QR Menü",
      html: `
        <h2>Şifre Sıfırlama</h2>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">Şifremi Sıfırla</a>
        <p>Bu link 1 saat geçerlidir.</p>
        <p>Bu işlemi siz yapmadıysanız bu emaili görmezden gelebilirsiniz.</p>
      `,
    });
  },

  async sendPaymentSuccessEmail(
    email: string,
    planName: string,
    amount: string
  ): Promise<void> {
    await this.send({
      to: email,
      subject: "Ödeme Başarılı — QR Menü",
      html: `
        <h2>Ödeme Başarılı</h2>
        <p><strong>${planName}</strong> paketiniz için <strong>${amount} TL</strong> tutarındaki ödemeniz başarıyla alınmıştır.</p>
        <p>İyi günlerde kullanın!</p>
      `,
    });
  },

  async sendPaymentFailedEmail(email: string): Promise<void> {
    await this.send({
      to: email,
      subject: "Ödeme Alınamadı — QR Menü",
      html: `
        <h2>Ödeme Alınamadı</h2>
        <p>Kayıtlı kartınızdan ödeme alınamadı. Lütfen kart bilgilerinizi güncelleyin.</p>
        <p>15 gün içinde ödeme yapılmazsa menünüz yayından kaldırılacaktır.</p>
        <a href="${APP_URL}/dashboard/subscription" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">Aboneliğimi Yönet</a>
      `,
    });
  },

  async sendGracePeriodStartedEmail(email: string): Promise<void> {
    await this.send({
      to: email,
      subject: "Ödemeniz Alınamadı — QR Menü",
      html: `
        <h2>Ödemeniz Alınamadı</h2>
        <p>Abonelik ödemeniz alınamadı. Menünüz şu an yayında kalmaya devam ediyor ancak 15 gün içinde ödeme yapılmazsa yayından kaldırılacaktır.</p>
        <p>Lütfen ödeme bilgilerinizi güncelleyin.</p>
        <a href="${APP_URL}/dashboard/subscription" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">Ödeme Bilgilerimi Güncelle</a>
      `,
    });
  },

  async sendMenuClosedEmail(email: string): Promise<void> {
    await this.send({
      to: email,
      subject: "Menünüz Yayından Kaldırıldı — QR Menü",
      html: `
        <h2>Menünüz Yayından Kaldırıldı</h2>
        <p>Ödeme süreniz dolduğu için menünüz yayından kaldırılmıştır.</p>
        <p>Menünüzü tekrar aktifleştirmek için giriş yapıp ödeme yapabilirsiniz.</p>
        <a href="${APP_URL}/login" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">Giriş Yap</a>
      `,
    });
  },
};
