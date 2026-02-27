import { Text, Button } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface GracePeriodStartedEmailProps {
  name: string;
  graceEndDate: string;
  dashboardUrl: string;
}

export default function GracePeriodStartedEmail({
  name,
  graceEndDate,
  dashboardUrl,
}: GracePeriodStartedEmailProps) {
  return (
    <EmailLayout preview="Odemeniz alinamadi - 15 gun ek sure">
      <Text className="text-xl font-semibold text-gray-900">
        Odemeniz Alinamadi
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, abonelik odemeniz kayitli kartinizdan alinamadi.
      </Text>
      <Text className="text-gray-600">
        Menunuz su an yayinda kalmaya devam ediyor, ancak{" "}
        <strong>{graceEndDate}</strong> tarihine kadar odeme yapilmazsa
        menunuz yayindan kaldirilacaktir.
      </Text>
      <Text className="text-gray-600">
        Lutfen odeme bilgilerinizi guncelleyin.
      </Text>
      <Button
        href={dashboardUrl}
        className="rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white"
      >
        Odeme Bilgilerimi Guncelle
      </Button>
    </EmailLayout>
  );
}
