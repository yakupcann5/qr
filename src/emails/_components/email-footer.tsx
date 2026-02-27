import { Section, Text, Hr } from "@react-email/components";

export function EmailFooter() {
  return (
    <Section className="mt-8 text-center">
      <Hr className="border-gray-200" />
      <Text className="text-xs text-gray-400">
        Bu e-posta QR Menu platformu tarafindan gonderilmistir.
      </Text>
      <Text className="text-xs text-gray-400">
        Sorulariniz icin destek@qrmenu.com adresine yazabilirsiniz.
      </Text>
    </Section>
  );
}
