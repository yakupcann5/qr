import { Text, Button } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Sifre sifirlama talebi">
      <Text className="text-xl font-semibold text-gray-900">
        Sifre Sifirlama
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, sifrenizi sifirlamak icin asagidaki butona tiklayin.
      </Text>
      <Button
        href={resetUrl}
        className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
      >
        Sifremi Sifirla
      </Button>
      <Text className="mt-4 text-sm text-gray-400">
        Bu link 1 saat gecerlidir. Eger bu islemi siz yapmadiyseniz bu emaili
        gormezden gelebilirsiniz.
      </Text>
    </EmailLayout>
  );
}
