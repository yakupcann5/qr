import { Text, Hr } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";

interface PaymentSuccessEmailProps {
  name: string;
  planName: string;
  amount: string;
  invoiceNumber: string;
  periodEnd: string;
}

export default function PaymentSuccessEmail({
  name,
  planName,
  amount,
  invoiceNumber,
  periodEnd,
}: PaymentSuccessEmailProps) {
  return (
    <EmailLayout preview="Odemeniz basariyla alindi">
      <Text className="text-xl font-semibold text-gray-900">
        Odeme Basarili
      </Text>
      <Text className="text-gray-600">
        Merhaba {name}, odemeniz basariyla alinmistir.
      </Text>
      <Hr className="my-4 border-gray-200" />
      <Text className="text-sm text-gray-600">
        <strong>Paket:</strong> {planName}
      </Text>
      <Text className="text-sm text-gray-600">
        <strong>Tutar:</strong> {amount} TL
      </Text>
      <Text className="text-sm text-gray-600">
        <strong>Fatura No:</strong> {invoiceNumber}
      </Text>
      <Text className="text-sm text-gray-600">
        <strong>Sonraki Odeme:</strong> {periodEnd}
      </Text>
      <Hr className="my-4 border-gray-200" />
      <Text className="text-gray-600">Iyi gunlerde kullanin!</Text>
    </EmailLayout>
  );
}
