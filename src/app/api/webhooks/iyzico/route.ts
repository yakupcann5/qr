import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // TODO: iyzico webhook signature verification
    // iyzico webhook'tan gelen verileri doğrula

    const { paymentId, status, merchantPaymentId } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find payment by iyzico payment id
    const payment = await db.payment.findFirst({
      where: { iyzicoPaymentId: paymentId },
    });

    if (!payment) {
      console.warn(`[Webhook] Payment not found for iyzicoPaymentId: ${paymentId}`);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment status based on webhook
    const paymentStatus = status === "SUCCESS" ? "SUCCESS" : "FAILED";

    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus,
        paidAt: paymentStatus === "SUCCESS" ? new Date() : null,
        failureReason: paymentStatus === "FAILED" ? `Webhook status: ${status}` : null,
      },
    });

    console.log(
      `[Webhook] Payment ${payment.id} updated to ${paymentStatus}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Webhook] iyzico webhook processing failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
