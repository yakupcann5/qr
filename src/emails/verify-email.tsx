import { Text, Button } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface VerifyEmailProps {
  name: string;
  verifyUrl: string;
}

export default function VerifyEmail({ name, verifyUrl }: VerifyEmailProps) {
  return (
    <EmailLayout preview="Email adresinizi dogrulayin">
      <Text className="text-xl font-semibold text-gray-900">
        Email Dogrulama
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, hesabinizi aktif hale getirmek icin asagidaki butona
        tiklayarak email adresinizi dogrulayin.
      </Text>
      <Button
        href={verifyUrl}
        className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
      >
        Email Adresimi Dogrula
      </Button>
      <Text className="mt-4 text-sm text-gray-400">
        Bu link 24 saat gecerlidir. Eger bu islemi siz yapmadiyseniz bu emaili
        gormezden gelebilirsiniz.
      </Text>
    </EmailLayout>
  );
}
