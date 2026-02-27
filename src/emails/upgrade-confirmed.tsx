import { Text, Hr } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface UpgradeConfirmedEmailProps {
  name: string;
  previousPlan: string;
  newPlan: string;
  proratedAmount: string;
}

export default function UpgradeConfirmedEmail({
  name,
  previousPlan,
  newPlan,
  proratedAmount,
}: UpgradeConfirmedEmailProps) {
  return (
    <EmailLayout preview="Plan yukseltmeniz tamamlandi">
      <Text className="text-xl font-semibold text-gray-900">
        Upgrade Tamamlandi
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, paketiniz basariyla yukseltildi.
      </Text>
      <Hr className="my-4 border-gray-200" />
      <Text className="text-sm text-gray-600">
        <strong>Onceki Paket:</strong> {previousPlan}
      </Text>
      <Text className="text-sm text-gray-600">
        <strong>Yeni Paket:</strong> {newPlan}
      </Text>
      <Text className="text-sm text-gray-600">
        <strong>Odenen Tutar:</strong> {proratedAmount} TL (kalan gun farki)
      </Text>
      <Hr className="my-4 border-gray-200" />
      <Text className="text-gray-600">
        Yeni paketinizin tum ozellikleri hemen aktif olmustur.
      </Text>
    </EmailLayout>
  );
}
