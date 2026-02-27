import { NextResponse, type NextRequest } from "next/server";
import { addDays } from "date-fns";
import { db } from "@/server/db";
import { emailService } from "@/server/services/email.service";
import { REMINDER_DAYS } from "@/lib/constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("authorization");

  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let emailsSent = 0;
    const now = new Date();

    // Trial ending reminders (5 days, 3 days)
    for (const daysBefore of REMINDER_DAYS.trialEnding) {
      const targetDate = addDays(now, daysBefore);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const subscriptions = await db.subscription.findMany({
        where: {
          status: "TRIAL",
          trialEndsAt: { gte: startOfDay, lte: endOfDay },
        },
        include: {
          business: { include: { user: { select: { email: true, name: true } } } },
        },
      });

      for (const sub of subscriptions) {
        await emailService.send({
          to: sub.business.user.email,
          subject: `Deneme Sureniz ${daysBefore} Gun Icinde Bitiyor — QR Menu`,
          html: `<p>Merhaba ${sub.business.user.name}, deneme surenizin bitmesine ${daysBefore} gun kaldi.</p><p><a href="${APP_URL}/dashboard/subscription">Aboneligimi Yonet</a></p>`,
        });
        emailsSent++;
      }
    }

    // Subscription renewing reminders (7 days, 3 days)
    for (const daysBefore of REMINDER_DAYS.subscriptionRenewing) {
      const targetDate = addDays(now, daysBefore);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const subscriptions = await db.subscription.findMany({
        where: {
          status: "ACTIVE",
          currentPeriodEnd: { gte: startOfDay, lte: endOfDay },
        },
        include: {
          plan: true,
          business: { include: { user: { select: { email: true, name: true } } } },
        },
      });

      for (const sub of subscriptions) {
        await emailService.send({
          to: sub.business.user.email,
          subject: `Aboneliginiz ${daysBefore} Gun Icinde Yenileniyor — QR Menu`,
          html: `<p>Merhaba ${sub.business.user.name}, ${sub.plan.name} paketiniz ${daysBefore} gun icinde yenilenecektir.</p><p><a href="${APP_URL}/dashboard/subscription">Aboneligimi Yonet</a></p>`,
        });
        emailsSent++;
      }
    }

    // Grace period ending reminders (3 days, 1 day)
    for (const daysBefore of REMINDER_DAYS.graceEnding) {
      const targetDate = addDays(now, daysBefore);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const subscriptions = await db.subscription.findMany({
        where: {
          status: "GRACE_PERIOD",
          graceEndsAt: { gte: startOfDay, lte: endOfDay },
        },
        include: {
          business: { include: { user: { select: { email: true, name: true } } } },
        },
      });

      for (const sub of subscriptions) {
        await emailService.send({
          to: sub.business.user.email,
          subject: `Menunuz ${daysBefore} Gun Icinde Kapanacak — QR Menu`,
          html: `<p>Merhaba ${sub.business.user.name}, odeme yapilmadigi icin menunuzun kapanmasina ${daysBefore} gun kaldi.</p><p><a href="${APP_URL}/dashboard/subscription">Hemen Odeme Yap</a></p>`,
        });
        emailsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Reminder emails failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
