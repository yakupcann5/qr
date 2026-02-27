import { Text, Button } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

export default function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="QR Menu'ye hos geldiniz!">
      <Text className="text-xl font-semibold text-gray-900">
        Hos Geldiniz, {name}!
      </Text>
      <Text className="text-gray-600">
        QR Menu platformuna basariyla kayit oldunuz. 14 gunluk ucretsiz deneme
        sureniz baslamistir. Bu sure zarfinda Profesyonel paket ozelliklerini
        kullanabilirsiniz.
      </Text>
      <Text className="text-gray-600">
        Hemen giris yaparak menunuzu olusturmaya baslayabilirsiniz.
      </Text>
      <Button
        href={loginUrl}
        className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
      >
        Giris Yap
      </Button>
    </EmailLayout>
  );
}
