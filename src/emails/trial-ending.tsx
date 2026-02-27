import { Text, Button } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface TrialEndingEmailProps {
  name: string;
  daysRemaining: number;
  dashboardUrl: string;
}

export default function TrialEndingEmail({
  name,
  daysRemaining,
  dashboardUrl,
}: TrialEndingEmailProps) {
  return (
    <EmailLayout preview={`Deneme sureniz ${daysRemaining} gun icinde bitiyor`}>
      <Text className="text-xl font-semibold text-gray-900">
        Deneme Sureniz Bitiyor
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, ucretsiz deneme surenizin bitmesine{" "}
        <strong>{daysRemaining} gun</strong> kaldi.
      </Text>
      <Text className="text-gray-600">
        Deneme suresi sona erdiginde kayitli kartinizdan otomatik odeme
        alinacaktir. Devam etmek istemiyorsaniz deneme suresi icinde iptal
        edebilirsiniz.
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
