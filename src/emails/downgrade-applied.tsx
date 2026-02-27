import { Text, Hr } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface DowngradeAppliedEmailProps {
  name: string;
  previousPlan: string;
  newPlan: string;
}

export default function DowngradeAppliedEmail({
  name,
  previousPlan,
  newPlan,
}: DowngradeAppliedEmailProps) {
  return (
    <EmailLayout preview="Plan degisikliginiz uygulandi">
      <Text className="text-xl font-semibold text-gray-900">
        Plan Degisikligi Uygulandi
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, donem sonunuzda talep ettiginiz plan degisikligi
        uygulanmistir.
      </Text>
      <Hr className="my-4 border-gray-200" />
      <Text className="text-sm text-gray-600">
        <strong>Onceki Paket:</strong> {previousPlan}
      </Text>
      <Text className="text-sm text-gray-600">
        <strong>Yeni Paket:</strong> {newPlan}
      </Text>
      <Hr className="my-4 border-gray-200" />
      <Text className="text-gray-600">
        Yeni paketinize dahil olmayan ozellikler otomatik olarak deaktif
        edilmistir. Dilerseniz tekrar yukseltme yapabilirsiniz.
      </Text>
    </EmailLayout>
  );
}
