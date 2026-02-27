import { Text, Button, Hr } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface SubscriptionRenewingEmailProps {
  name: string;
  planName: string;
  amount: string;
  renewalDate: string;
  daysRemaining: number;
  dashboardUrl: string;
}

export default function SubscriptionRenewingEmail({
  name,
  planName,
  amount,
  renewalDate,
  daysRemaining,
  dashboardUrl,
}: SubscriptionRenewingEmailProps) {
  return (
    <EmailLayout
      preview={`Aboneliginiz ${daysRemaining} gun icinde yenilenecek`}
    >
      <Text className="text-xl font-semibold text-gray-900">
        Aboneliginiz Yenileniyor
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, aboneliginizin yenilenmesine{" "}
        <strong>{daysRemaining} gun</strong> kaldi.
      </Text>
      <Hr className="my-4 border-gray-200" />
      <Text className="text-sm text-gray-600">
        <strong>Paket:</strong> {planName}
      </Text>
      <Text className="text-sm text-gray-600">
        <strong>Tutar:</strong> {amount} TL
      </Text>
      <Text className="text-sm text-gray-600">
        <strong>Yenileme Tarihi:</strong> {renewalDate}
      </Text>
      <Hr className="my-4 border-gray-200" />
      <Text className="text-gray-600">
        Kayitli kartinizdan otomatik odeme alinacaktir.
      </Text>
      <Button
        href={dashboardUrl}
        className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
      >
        Aboneligimi Yonet
      </Button>
    </EmailLayout>
  );
}
