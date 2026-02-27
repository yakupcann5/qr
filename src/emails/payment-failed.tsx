import { Text, Button } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface PaymentFailedEmailProps {
  name: string;
  planName: string;
  amount: string;
  dashboardUrl: string;
}

export default function PaymentFailedEmail({
  name,
  planName,
  amount,
  dashboardUrl,
}: PaymentFailedEmailProps) {
  return (
    <EmailLayout preview="Odemeniz alinamadi">
      <Text className="text-xl font-semibold text-gray-900">
        Odeme Alinamadi
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, <strong>{planName}</strong> paketiniz icin{" "}
        <strong>{amount} TL</strong> tutarindaki odeme kayitli kartinizdan
        alinamadi.
      </Text>
      <Text className="text-gray-600">
        Lutfen kart bilgilerinizi guncelleyin. 15 gun icinde odeme yapilmazsa
        menunuz yayindan kaldirilacaktir.
      </Text>
      <Button
        href={dashboardUrl}
        className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
      >
        Odeme Bilgilerimi Guncelle
      </Button>
    </EmailLayout>
  );
}
