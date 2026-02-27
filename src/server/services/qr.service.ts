const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface QRStyleOptions {
  primaryColor?: string;
  backgroundColor?: string;
  logoUrl?: string | null;
}

export const qrService = {
  getMenuUrl(slug: string): string {
    return `${APP_URL}/menu/${slug}`;
  },

  getBasicQRConfig(slug: string) {
    return {
      data: this.getMenuUrl(slug),
      width: 300,
      height: 300,
      type: "svg" as const,
      dotsOptions: {
        color: "#000000",
        type: "rounded" as const,
      },
      backgroundOptions: {
        color: "#FFFFFF",
      },
      cornersSquareOptions: {
        type: "extra-rounded" as const,
      },
    };
  },

  getCustomQRConfig(slug: string, options: QRStyleOptions) {
    return {
      data: this.getMenuUrl(slug),
      width: 300,
      height: 300,
      type: "svg" as const,
      dotsOptions: {
        color: options.primaryColor ?? "#000000",
        type: "rounded" as const,
      },
      backgroundOptions: {
        color: options.backgroundColor ?? "#FFFFFF",
      },
      cornersSquareOptions: {
        color: options.primaryColor ?? "#000000",
        type: "extra-rounded" as const,
      },
      ...(options.logoUrl
        ? {
            image: options.logoUrl,
            imageOptions: {
              crossOrigin: "anonymous" as const,
              margin: 10,
              imageSize: 0.3,
            },
          }
        : {}),
    };
  },
};
