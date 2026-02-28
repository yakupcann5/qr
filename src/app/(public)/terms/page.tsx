import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — QR Menü",
  description:
    "QR Menü kullanım koşulları, hizmet şartları ve abonelik sözleşmesi.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Ana Sayfa
      </Link>

      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Kullanım Koşulları
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Son güncelleme: 27 Şubat 2026
      </p>

      <div className="prose prose-stone mt-8 max-w-none prose-headings:font-serif">
        <h2>1. Hizmet Tanımı</h2>
        <p>
          QR Menü (&quot;Platform&quot;), işletmelere QR kod tabanlı dijital menü oluşturma,
          yönetme ve paylaşma hizmeti sunan bir SaaS (Software as a Service)
          platformudur. Platform, yıllık abonelik modeli ile çalışmaktadır.
        </p>

        <h2>2. Hesap Oluşturma ve Sorumluluklar</h2>
        <ul>
          <li>Hesap oluşturmak için geçerli bir e-posta adresi ve vergi kimlik numarası gereklidir</li>
          <li>Verilen bilgilerin doğruluğundan kullanıcı sorumludur</li>
          <li>Her vergi kimlik numarası ile yalnızca bir hesap oluşturulabilir</li>
          <li>Hesap bilgilerinizin güvenliğinden siz sorumlusunuz</li>
          <li>Şüpheli etkinlik tespit edilmesi halinde hesabınızı derhal bildirmeniz gerekmektedir</li>
        </ul>

        <h2>3. Abonelik ve Ödeme</h2>
        <h3>3.1 Deneme Süresi</h3>
        <ul>
          <li>Tüm yeni hesaplara 14 günlük ücretsiz deneme süresi tanınır</li>
          <li>Deneme süresinde kredi kartı bilgisi istenmez</li>
          <li>Deneme sonunda aktif abonelik başlatılmazsa menü erişimi kapatılır</li>
        </ul>

        <h3>3.2 Ödeme Koşulları</h3>
        <ul>
          <li>Abonelikler yıllık olarak faturalandırılır</li>
          <li>Ödemeler iyzico altyapısı üzerinden güvenle işlenir</li>
          <li>Fiyatlar Türk Lirası (TL) cinsindendir ve KDV dahildir</li>
          <li>Başarısız ödemeler sonrası 15 günlük ek süre tanınır</li>
          <li>Ek süre sonunda ödeme yapılmazsa abonelik sona erer</li>
        </ul>

        <h3>3.3 Plan Değişikliği</h3>
        <ul>
          <li>Üst plana yükseltme anında uygulanır</li>
          <li>Alt plana geçiş mevcut dönem sonunda uygulanır</li>
          <li>Plan değişikliğinde kalan süre oransal olarak hesaplanır</li>
        </ul>

        <h3>3.4 İptal</h3>
        <ul>
          <li>Abonelik her zaman iptal edilebilir</li>
          <li>İptal sonrası mevcut dönem sonuna kadar hizmet devam eder</li>
          <li>İade politikası için müşteri hizmetleri ile iletişime geçiniz</li>
        </ul>

        <h2>4. Kullanım Kuralları</h2>
        <p>Platform kullanılırken aşağıdaki kurallara uyulması zorunludur:</p>
        <ul>
          <li>Yasalara aykırı içerik yüklenemez</li>
          <li>Üçüncü şahısların fikri mülkiyet haklarını ihlal eden içerik paylaşılamaz</li>
          <li>Platformun güvenliğini tehlikeye atacak eylemler yapılamaz</li>
          <li>Otomatik veri çekme (scraping) veya kötüye kullanım girişimleri yasaktır</li>
          <li>Tek bir hesap birden fazla işletme için kullanılamaz</li>
        </ul>

        <h2>5. İçerik Sorumluluğu</h2>
        <ul>
          <li>Menü içerikleri (ürün adları, açıklamalar, fiyatlar, görseller) tamamen işletmenin sorumluluğundadır</li>
          <li>Platform, menü içeriklerinin doğruluğunu garanti etmez</li>
          <li>Alerjen bilgilerinin doğruluğu işletmenin sorumluluğundadır</li>
          <li>Yüklenen görsellerin telif haklarından işletme sorumludur</li>
        </ul>

        <h2>6. Hizmet Seviyesi</h2>
        <ul>
          <li>Platform %99.9 uptime hedefi ile çalışmaktadır</li>
          <li>Planlı bakım çalışmaları önceden bildirilir</li>
          <li>Beklenmeyen kesintilerde mümkün olan en kısa sürede çözüm sağlanır</li>
          <li>Platform, hizmet kesintilerinden kaynaklanan dolaylı zararlardan sorumlu değildir</li>
        </ul>

        <h2>7. Fikri Mülkiyet</h2>
        <ul>
          <li>Platform yazılımı, tasarımı ve altyapısı QR Menü&apos;ye aittir</li>
          <li>İşletmelerin yüklediği içerikler işletmeye aittir</li>
          <li>Platform, işletme içeriklerini yalnızca hizmet sunumu amacıyla kullanır</li>
        </ul>

        <h2>8. Hesap Silme ve Veri İmhası</h2>
        <ul>
          <li>Hesap silme talebi ayarlar sayfasından yapılabilir</li>
          <li>Silme talebi sonrası 30 gün bekleme süresi uygulanır</li>
          <li>30 gün içinde geri dönüş yapılmazsa tüm veriler kalıcı olarak silinir</li>
          <li>Yasal saklama yükümlülüğü bulunan veriler (ödeme kayıtları) ilgili süre boyunca saklanır</li>
        </ul>

        <h2>9. Sorumluluk Sınırlaması</h2>
        <p>
          Platform, hizmetin kesintisiz veya hatasız olacağını garanti etmez.
          Platformun kullanımından doğabilecek dolaylı, arızi veya özel
          zararlardan sorumlu değildir. Platformun toplam sorumluluğu, kullanıcının
          son 12 ayda ödediği abonelik bedeli ile sınırlıdır.
        </p>

        <h2>10. Uyuşmazlık Çözümü</h2>
        <p>
          Bu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları
          uygulanır. Uyuşmazlıkların çözümünde İstanbul Mahkemeleri ve İcra
          Daireleri yetkilidir.
        </p>

        <h2>11. Değişiklikler</h2>
        <p>
          Bu kullanım koşulları zaman zaman güncellenebilir. Önemli değişiklikler
          en az 30 gün önceden e-posta ile bildirilir. Değişiklik sonrası
          platformu kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz
          anlamına gelir.
        </p>

        <h2>12. İletişim</h2>
        <p>Kullanım koşulları hakkında sorularınız için:</p>
        <ul>
          <li>E-posta: destek@qrmenu.com.tr</li>
        </ul>
      </div>
    </article>
  );
}
