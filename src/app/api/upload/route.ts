import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { uploadService } from "@/server/services/upload.service";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Check plan feature
    const subscription = await db.subscription.findUnique({
      where: { businessId },
      include: { plan: true },
    });

    if (!subscription?.plan.hasImages) {
      return NextResponse.json(
        { error: "Gorsel yukleme bu pakette mevcut degil." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "images";

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadi." },
        { status: 400 }
      );
    }

    // Validate file
    const validation = uploadService.validateFile(file.size, file.type);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const url = await uploadService.uploadImage(base64, folder, businessId);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("[Upload] Failed:", error);
    return NextResponse.json(
      { error: "Gorsel yuklenirken bir hata olustu." },
      { status: 500 }
    );
  }
}
