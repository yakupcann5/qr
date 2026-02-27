import { useState } from "react";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const totalSteps = 5;

  const steps = [
    { num: 1, label: "İşletme Bilgileri" },
    { num: 2, label: "VKN Doğrulama" },
    { num: 3, label: "KVKK Onay" },
    { num: 4, label: "Paket Seçimi" },
    { num: 5, label: "Ödeme" },
  ];

  const plans = [
    { id: "starter", name: "Başlangıç", price: "499", features: ["Temel template", "Tek dil", "Basit QR"] },
    { id: "pro", name: "Profesyonel", price: "999", badge: "Önerilen", features: ["Gelişmiş template'ler", "3 dile kadar", "Özel QR", "Görseller", "Detay alanları"] },
    { id: "premium", name: "Premium", price: "1.999", features: ["Tüm template'ler", "Sınırsız dil", "Özel QR", "Tüm özellikler", "Öncelikli destek"] },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #166534 !important; box-shadow: 0 0 0 3px rgba(22,101,52,0.1); }
        .btn-primary { transition: all 0.25s ease; cursor: pointer; border: none; }
        .btn-primary:hover { background: #15803d !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22,101,52,0.25); }
        .btn-secondary { transition: all 0.2s ease; cursor: pointer; }
        .btn-secondary:hover { background: #f5f5f5 !important; }
        .plan-option { transition: all 0.25s ease; cursor: pointer; }
        .plan-option:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "20px 48px", borderBottom: "1px solid rgba(0,0,0,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(250,250,248,0.9)", backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #166534, #22c55e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display', serif"
          }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: 20 }}>QRMenus</span>
        </div>
        <a href="#" style={{ fontSize: 14, color: "#888", textDecoration: "none" }}>
          Zaten hesabınız var mı? <span style={{ color: "#166534", fontWeight: 600 }}>Giriş yapın</span>
        </a>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48, gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: step >= s.num ? "#166534" : step > s.num ? "#166534" : "#e5e5e5",
                  color: step >= s.num ? "#fff" : "#999",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700,
                  transition: "all 0.3s ease"
                }}>
                  {step > s.num ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : s.num}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: step >= s.num ? "#166534" : "#aaa", whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 60, height: 2, background: step > s.num ? "#166534" : "#e5e5e5",
                  margin: "0 8px", marginBottom: 22, transition: "background 0.3s ease"
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: 40,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.03)"
        }}>

          {/* STEP 1 — İşletme Bilgileri */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>İşletme Bilgileri</h2>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>Hesabınız ve işletmeniz hakkında bilgileri girin</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Ad Soyad *</label>
                  <input placeholder="Ahmet Kaya" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>E-posta *</label>
                  <input type="email" placeholder="ornek@email.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Şifre *</label>
                  <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                  <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? "#f59e0b" : "#e5e5e5" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: "#f59e0b", marginTop: 2 }}>Orta güçlükte</span>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Şifre Tekrar *</label>
                  <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>İşletme Adı *</label>
                <input placeholder="Café Istanbul" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                <span style={{ fontSize: 11, color: "#aaa", marginTop: 4, display: "block" }}>Menü URL'iniz: qrmenus.com/menu/cafe-istanbul</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Telefon</label>
                  <input placeholder="0532 123 4567" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Adres</label>
                  <input placeholder="Kadıköy, İstanbul" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — VKN Doğrulama */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Vergi Numarası Doğrulama</h2>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>İşletmenizin vergi bilgilerini doğrulayın</p>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Vergi Numarası *</label>
                  <input placeholder="1234567890" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>İl *</label>
                  <select style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff", color: "#1A1A1A" }}>
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>İzmir</option>
                  </select>
                </div>
              </div>

              <button className="btn-primary" style={{
                marginTop: 20, padding: "12px 28px", borderRadius: 10,
                background: "#166534", color: "#fff", fontSize: 14, fontWeight: 600
              }}>
                GİB'den Doğrula
              </button>

              {/* Success state mockup */}
              <div style={{
                marginTop: 24, padding: 20, borderRadius: 14,
                background: "#f0fdf4", border: "1px solid #bbf7d0"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{ fontWeight: 600, color: "#166534", fontSize: 14 }}>Doğrulama Başarılı</span>
                </div>
                <p style={{ fontSize: 14, color: "#444" }}>Bu işletme size mi ait?</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>CAFÉ İSTANBUL YEMEK HİZMETLERİ LTD. ŞTİ.</p>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: 10, background: "#166534", color: "#fff", fontSize: 13, fontWeight: 600, border: "none" }}>
                    Evet, bu benim işletmem
                  </button>
                  <button className="btn-secondary" style={{ padding: "10px 24px", borderRadius: 10, background: "#fff", color: "#666", fontSize: 13, fontWeight: 600, border: "1.5px solid #e5e5e5" }}>
                    Hayır, değiştir
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — KVKK */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Yasal Onaylar</h2>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>Devam etmeden önce aşağıdaki belgeleri onaylayın</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{
                  padding: 20, borderRadius: 14, border: "1.5px solid #e5e5e5",
                  display: "flex", gap: 14, alignItems: "flex-start"
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, border: "1.5px solid #ccc",
                    flexShrink: 0, marginTop: 2, cursor: "pointer",
                    background: "#166534", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, color: "#333" }}>
                      <a href="#" style={{ color: "#166534", fontWeight: 600, textDecoration: "underline" }}>Kullanım Şartları</a>'nı okudum ve kabul ediyorum.
                    </p>
                  </div>
                </div>
                <div style={{
                  padding: 20, borderRadius: 14, border: "1.5px solid #e5e5e5",
                  display: "flex", gap: 14, alignItems: "flex-start"
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, border: "1.5px solid #ccc",
                    flexShrink: 0, marginTop: 2, cursor: "pointer",
                    background: "#166534", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, color: "#333" }}>
                      <a href="#" style={{ color: "#166534", fontWeight: 600, textDecoration: "underline" }}>Gizlilik Politikası</a>'nı okudum, kişisel verilerimin işlenmesine onay veriyorum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Paket Seçimi */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Paket Seçin</h2>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>14 gün ücretsiz deneme Profesyonel paket ile başlar</p>

              <div style={{ display: "flex", gap: 16 }}>
                {plans.map(p => (
                  <div
                    key={p.id}
                    className="plan-option"
                    onClick={() => setSelectedPlan(p.id)}
                    style={{
                      flex: 1, padding: 24, borderRadius: 16,
                      border: selectedPlan === p.id ? "2px solid #166534" : "1.5px solid #e5e5e5",
                      background: selectedPlan === p.id ? "#f0fdf4" : "#fff",
                      position: "relative"
                    }}
                  >
                    {p.badge && (
                      <span style={{
                        position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                        background: "#166534", color: "#fff", padding: "3px 12px", borderRadius: 100,
                        fontSize: 10, fontWeight: 700
                      }}>{p.badge}</span>
                    )}
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{p.name}</h3>
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{p.price}</span>
                      <span style={{ fontSize: 13, color: "#888" }}>₺/yıl</span>
                    </div>
                    {p.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555", marginBottom: 6 }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {f}
                      </div>
                    ))}
                    {selectedPlan === p.id && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        width: 24, height: 24, borderRadius: "50%", background: "#166534",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 — Ödeme */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Ödeme Bilgileri</h2>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>Kart bilgilerinizi güvenle saklıyoruz</p>

              <div style={{
                padding: 16, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0",
                marginBottom: 24, display: "flex", alignItems: "center", gap: 10
              }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#166534" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span style={{ fontSize: 13, color: "#166534", fontWeight: 500 }}>Deneme süresince ücret alınmayacaktır. 14 gün sonra {selectedPlan === "starter" ? "499" : selectedPlan === "pro" ? "999" : "1.999"}₺ tahsil edilecektir.</span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Kart Üzerindeki İsim</label>
                <input placeholder="AHMET KAYA" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff", textTransform: "uppercase" }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Kart Numarası</label>
                <input placeholder="4242 4242 4242 4242" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff", letterSpacing: "0.05em" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Son Kullanma</label>
                  <input placeholder="MM / YY" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>CVV</label>
                  <input placeholder="123" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e5e5", fontSize: 14, background: "#fff" }} />
                </div>
              </div>

              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#aaa" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Kart bilgileriniz iyzico tarafından güvenle saklanır. Biz kart bilginizi kaydetmiyoruz.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 36,
            paddingTop: 24, borderTop: "1px solid #f0f0f0"
          }}>
            {step > 1 ? (
              <button
                className="btn-secondary"
                onClick={() => setStep(step - 1)}
                style={{
                  padding: "12px 24px", borderRadius: 10, background: "#fff",
                  border: "1.5px solid #e5e5e5", fontSize: 14, fontWeight: 600, color: "#666"
                }}
              >
                ← Geri
              </button>
            ) : <div />}

            <button
              className="btn-primary"
              onClick={() => step < totalSteps ? setStep(step + 1) : alert("Kayıt tamamlandı! (mockup)")}
              style={{
                padding: "12px 28px", borderRadius: 10,
                background: "#166534", color: "#fff",
                fontSize: 14, fontWeight: 600
              }}
            >
              {step === totalSteps ? "Kaydı Tamamla" : "Devam →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
