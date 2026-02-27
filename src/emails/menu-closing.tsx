import { Text, Button } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface MenuClosingEmailProps {
  name: string;
  daysRemaining: number;
  dashboardUrl: string;
}

export default function MenuClosingEmail({
  name,
  daysRemaining,
  dashboardUrl,
}: MenuClosingEmailProps) {
  return (
    <EmailLayout
      preview={`Menunuz ${daysRemaining} gun icinde kapanacak`}
    >
      <Text className="text-xl font-semibold text-red-600">
        Menunuz Kapanmak Uzere
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, odeme yapilmadigi icin menunuzun yayindan
        kaldirilmasina <strong>{daysRemaining} gun</strong> kaldi.
      </Text>
      <Text className="text-gray-600">
        Menunuzun aktif kalmasi icin lutfen hemen odeme yapin.
      </Text>
      <Button
        href={dashboardUrl}
        className="rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white"
      >
        Hemen Odeme Yap
      </Button>
    </EmailLayout>
  );
}
