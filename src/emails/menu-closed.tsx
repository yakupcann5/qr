import { Text, Button } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface MenuClosedEmailProps {
  name: string;
  loginUrl: string;
}

export default function MenuClosedEmail({
  name,
  loginUrl,
}: MenuClosedEmailProps) {
  return (
    <EmailLayout preview="Menunuz yayindan kaldirildi">
      <Text className="text-xl font-semibold text-red-600">
        Menunuz Yayindan Kaldirildi
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, odeme suresi doldugu icin menunuz yayindan
        kaldirilmistir.
      </Text>
      <Text className="text-gray-600">
        QR kodunuz artik calismiyor. Menunuzu tekrar aktif etmek icin giris
        yapip odeme yapabilirsiniz.
      </Text>
      <Text className="text-gray-600">
        Verileriniz guvendedir ve odeme yaptiginizda menunuz tekrar yayina
        alinacaktir.
      </Text>
      <Button
        href={loginUrl}
        className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
      >
        Giris Yap ve Aktif Et
      </Button>
    </EmailLayout>
  );
}
