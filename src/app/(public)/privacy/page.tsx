import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — QR Menü",
  description:
    "QR Menü gizlilik politikası, KVKK uyumluluk bilgileri ve kişisel verilerin korunması hakkında bilgilendirme.",
};

export default function PrivacyPage() {
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
        Gizlilik Politikası
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Son güncelleme: 27 Şubat 2026
      </p>

      <div className="prose prose-stone mt-8 max-w-none prose-headings:font-serif">
        <h2 id="genel">1. Genel Bilgilendirme</h2>
        <p>
          QR Menü (&quot;Platform&quot;), kafe, restoran ve benzeri işletmelere dijital menü
          hizmeti sunan bir SaaS platformudur. Bu gizlilik politikası, Platform
          üzerinden toplanan kişisel verilerin nasıl işlendiğini, korunduğunu ve
          haklarınızı açıklamaktadır.
        </p>

        <h2 id="toplanan-veriler">2. Toplanan Veriler</h2>
        <h3>2.1 İşletme Sahiplerinden Toplanan Veriler</h3>
        <ul>
          <li>Ad, soyad ve e-posta adresi</li>
          <li>İşletme adı, adresi ve telefon numarası</li>
          <li>Vergi kimlik numarası (VKN)</li>
          <li>Ödeme bilgileri (kart bilgileri iyzico tarafından işlenir, tarafımızda saklanmaz)</li>
          <li>Menü içerikleri (ürün adları, açıklamalar, görseller)</li>
        </ul>

        <h3>2.2 Son Kullanıcılardan Toplanan Veriler</h3>
        <ul>
          <li>QR menü görüntüleme için kişisel veri toplanmaz</li>
          <li>Tarayıcı dil tercihi (menü dili tespiti için)</li>
          <li>Anonim kullanım istatistikleri</li>
        </ul>

        <h2 id="veri-isleme">3. Verilerin İşlenme Amaçları</h2>
        <ul>
          <li>Hizmet sunumu ve hesap yönetimi</li>
          <li>Abonelik ve ödeme işlemlerinin gerçekleştirilmesi</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, fatura)</li>
          <li>Hizmet kalitesinin iyileştirilmesi</li>
          <li>Teknik destek sağlanması</li>
          <li>Bilgilendirme ve hatırlatma e-postaları gönderimi</li>
        </ul>

        <h2 id="kvkk">4. KVKK Kapsamında Haklarınız</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında
          aşağıdaki haklara sahipsiniz:
        </p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
          <li>KVKK madde 7&apos;deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
          <li>Düzeltme ve silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
          <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme</li>
        </ul>
        <p>
          Haklarınızı kullanmak için{" "}
          <strong>destek@qrmenu.com.tr</strong> adresine başvurabilirsiniz.
        </p>

        <h2 id="veri-guvenligi">5. Veri Güvenliği</h2>
        <ul>
          <li>Tüm veriler SSL/TLS şifreleme ile iletilir</li>
          <li>Şifreler bcrypt ile hash&apos;lenerek saklanır</li>
          <li>Ödeme bilgileri iyzico PCI-DSS sertifikalı altyapısında işlenir</li>
          <li>Veritabanı erişimleri yetkilendirme ile korunur</li>
          <li>Düzenli güvenlik güncellemeleri uygulanır</li>
        </ul>

        <h2 id="cerezler">6. Çerez Politikası</h2>
        <p>Platform aşağıdaki çerez türlerini kullanmaktadır:</p>
        <ul>
          <li>
            <strong>Zorunlu çerezler:</strong> Oturum yönetimi ve güvenlik için
            gerekli çerezler (next-auth session token)
          </li>
          <li>
            <strong>Tercih çerezleri:</strong> Dil tercihi ve arayüz ayarları
          </li>
          <li>
            <strong>Analiz çerezleri:</strong> Anonim kullanım istatistikleri
            (Sentry hata takibi)
          </li>
        </ul>

        <h2 id="veri-saklama">7. Veri Saklama Süreleri</h2>
        <ul>
          <li>Hesap verileri: Hesap silinene kadar</li>
          <li>Silinen hesaplar: 30 gün soft delete sonrası kalıcı silme</li>
          <li>Ödeme kayıtları: Yasal saklama süresi (10 yıl)</li>
          <li>Log verileri: 90 gün</li>
        </ul>

        <h2 id="ucuncu-taraf">8. Üçüncü Taraf Hizmet Sağlayıcılar</h2>
        <ul>
          <li><strong>iyzico:</strong> Ödeme işlemleri (PCI-DSS uyumlu)</li>
          <li><strong>Cloudinary:</strong> Görsel depolama ve optimizasyon</li>
          <li><strong>Google Translate API:</strong> Otomatik çeviri hizmeti</li>
          <li><strong>Resend:</strong> E-posta gönderimi</li>
          <li><strong>Sentry:</strong> Hata izleme ve raporlama</li>
          <li><strong>Upstash:</strong> Hız sınırlama (rate limiting)</li>
        </ul>

        <h2 id="degisiklikler">9. Politika Değişiklikleri</h2>
        <p>
          Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler
          olması durumunda kayıtlı e-posta adresinize bildirim gönderilecektir.
        </p>

        <h2 id="iletisim">10. İletişim</h2>
        <p>
          Gizlilik politikası ve kişisel verileriniz hakkında sorularınız için:
        </p>
        <ul>
          <li>E-posta: destek@qrmenu.com.tr</li>
        </ul>
      </div>
    </article>
  );
}
