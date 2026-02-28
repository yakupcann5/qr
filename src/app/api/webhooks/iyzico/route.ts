import { createHmac } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";

function verifyIyzicoSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secretKey = process.env.IYZICO_SECRET_KEY;
  if (!secretKey || !signatureHeader) return false;

  const expectedSignature = createHmac("sha256", secretKey)
    .update(rawBody)
    .digest("base64");

  return signatureHeader === expectedSignature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verify webhook signature
    const signature = req.headers.get("x-iyzico-signature");
    if (!verifyIyzicoSignature(rawBody, signature)) {
      console.warn("[Webhook] iyzico imza doğrulaması başarısız.");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);

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
