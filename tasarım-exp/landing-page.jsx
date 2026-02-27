import { useState } from "react";

const LandingPage = () => {
  const [activePlan, setActivePlan] = useState("pro");

  const plans = [
    {
      id: "starter",
      name: "Başlangıç",
      price: "499",
      desc: "Küçük işletmeler için ideal başlangıç",
      features: [
        { text: "Temel menü template", included: true },
        { text: "Branding (logo, renkler, font)", included: true },
        { text: "Tek dil desteği", included: true },
        { text: "Basit QR kod", included: true },
        { text: "Ürün ve kategori görselleri", included: false },
        { text: "Detay alanları (alerjen, kalori)", included: false },
        { text: "Özelleştirilmiş QR kod", included: false },
        { text: "Çoklu dil desteği", included: false },
      ],
    },
    {
      id: "pro",
      name: "Profesyonel",
      price: "999",
      desc: "Büyüyen işletmeler için güçlü özellikler",
      badge: "Önerilen",
      features: [
        { text: "Gelişmiş menü template'leri", included: true },
        { text: "Branding (logo, renkler, font)", included: true },
        { text: "3 dile kadar destek", included: true },
        { text: "Özelleştirilmiş QR kod", included: true },
        { text: "Ürün ve kategori görselleri", included: true },
        { text: "Detay alanları (alerjen, kalori)", included: true },
        { text: "Sınırsız dil desteği", included: false },
        { text: "Öncelikli destek", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "1.999",
      desc: "Tüm özellikler, sınırsız kullanım",
      features: [
        { text: "Tüm menü template'leri", included: true },
        { text: "Branding (logo, renkler, font)", included: true },
        { text: "Sınırsız dil desteği", included: true },
        { text: "Özelleştirilmiş QR kod", included: true },
        { text: "Ürün ve kategori görselleri", included: true },
        { text: "Detay alanları (alerjen, kalori)", included: true },
        { text: "Gelecek tüm özellikler", included: true },
        { text: "Öncelikli destek", included: true },
      ],
    },
  ];

  const features = [
    {
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75H16.5v-.75zM13.5 13.5h6v6h-6v-6z" />
        </svg>
      ),
      title: "QR Menü",
      desc: "Saniyeler içinde QR kod oluşturun. Müşterileriniz telefonlarıyla okutup menünüze ulaşsın.",
    },
    {
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
        </svg>
      ),
      title: "Çoklu Dil",
      desc: "Menünüzü birden fazla dilde sunun. Otomatik çeviri desteği ile uğraşmadan dünya dili konuşun.",
    },
    {
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
      title: "Branding",
      desc: "Logonuz, renkleriniz ve fontunuz ile kendi markanıza özel menü. İşletmenizin kimliğini yansıtın.",
    },
    {
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      ),
      title: "Kolay Yönetim",
      desc: "Sürükle-bırak ile menünüzü düzenleyin. Teknik bilgi gerektirmez, herkes kullanabilir.",
    },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF8", color: "#1A1A1A", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
        .animate-fade-up-delay-1 { animation: fadeUp 0.8s ease-out 0.1s forwards; opacity: 0; }
        .animate-fade-up-delay-2 { animation: fadeUp 0.8s ease-out 0.2s forwards; opacity: 0; }
        .animate-fade-up-delay-3 { animation: fadeUp 0.8s ease-out 0.3s forwards; opacity: 0; }
        .animate-scale { animation: scaleIn 0.6s ease-out 0.4s forwards; opacity: 0; }
        
        .phone-mockup { animation: float 6s ease-in-out infinite; }
        
        .plan-card {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .plan-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.08);
        }
        
        .cta-btn {
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(22, 101, 52, 0.25);
        }
        
        .nav-link {
          transition: color 0.2s ease;
        }
        .nav-link:hover { color: #166534; }
        
        .feature-card {
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          background: #fff;
          box-shadow: 0 12px 32px rgba(0,0,0,0.06);
        }
      `}</style>

      {/* NAVIGATION */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250, 250, 248, 0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #166534, #22c55e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 18,
            fontFamily: "'Playfair Display', serif"
          }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>QRMenus</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <a href="#features" className="nav-link" style={{ fontSize: 14, fontWeight: 500, color: "#666", textDecoration: "none" }}>Özellikler</a>
          <a href="#pricing" className="nav-link" style={{ fontSize: 14, fontWeight: 500, color: "#666", textDecoration: "none" }}>Fiyatlandırma</a>
          <a href="#" style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", textDecoration: "none" }}>Giriş Yap</a>
          <a href="#" className="cta-btn" style={{
            background: "#166534", color: "#fff", padding: "10px 22px",
            borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none"
          }}>Ücretsiz Deneyin</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        padding: "100px 48px 80px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 80,
        maxWidth: 1280, margin: "0 auto",
        minHeight: "calc(100vh - 72px)"
      }}>
        <div style={{ flex: 1, maxWidth: 560 }}>
          <div className="animate-fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 100, padding: "6px 16px 6px 8px", marginBottom: 28
          }}>
            <span style={{
              background: "#166534", color: "#fff", fontSize: 11, fontWeight: 700,
              padding: "2px 8px", borderRadius: 100
            }}>YENİ</span>
            <span style={{ fontSize: 13, color: "#166534", fontWeight: 500 }}>14 gün ücretsiz deneme</span>
          </div>
          
          <h1 className="animate-fade-up-delay-1" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 56, fontWeight: 700, lineHeight: 1.1,
            letterSpacing: "-0.03em", marginBottom: 24,
            color: "#0A0A0A"
          }}>
            Menünüzü<br />
            <span style={{ color: "#166534" }}>dijitale</span> taşıyın
          </h1>
          
          <p className="animate-fade-up-delay-2" style={{
            fontSize: 18, lineHeight: 1.7, color: "#555", marginBottom: 40, maxWidth: 440
          }}>
            QR kod ile müşterilerinize modern, hızlı ve şık bir menü deneyimi sunun. Basılı menü maliyetinden kurtulun.
          </p>
          
          <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <a href="#" className="cta-btn" style={{
              background: "#166534", color: "#fff", padding: "16px 32px",
              borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8
            }}>
              14 Gün Ücretsiz Deneyin
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <span style={{ fontSize: 13, color: "#999" }}>Kredi kartı gerekli • İstediğiniz zaman iptal</span>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="phone-mockup animate-scale" style={{ flex: "0 0 auto" }}>
          <div style={{
            width: 300, height: 600, borderRadius: 40,
            background: "#fff",
            border: "8px solid #1A1A1A",
            boxShadow: "0 40px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
            overflow: "hidden", position: "relative"
          }}>
            {/* Phone notch */}
            <div style={{
              position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
              width: 100, height: 28, background: "#1A1A1A", borderRadius: 20, zIndex: 10
            }} />
            
            {/* Menu content */}
            <div style={{ padding: "48px 20px 20px", height: "100%", overflow: "auto" }}>
              {/* Restaurant header */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "linear-gradient(135deg, #dc2626, #f97316)",
                  margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 20
                }}>C</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Café Istanbul</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Geleneksel lezzetler, modern sunum</div>
              </div>
              
              {/* Category */}
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 10, letterSpacing: "0.03em" }}>
                SICAK İÇECEKLER
              </div>
              
              {[
                { name: "Türk Kahvesi", price: "45₺", badge: "Popüler" },
                { name: "Latte", price: "65₺" },
                { name: "Cappuccino", price: "60₺" },
                { name: "Sıcak Çikolata", price: "55₺", badge: "Yeni" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid #f0f0f0"
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                      {item.name}
                      {item.badge && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: "#166534",
                          background: "#f0fdf4", padding: "2px 6px", borderRadius: 4
                        }}>{item.badge}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Klasik lezzet</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{item.price}</div>
                </div>
              ))}
              
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "20px 0 10px", letterSpacing: "0.03em" }}>
                TATLILAR
              </div>
              
              {[
                { name: "Künefe", price: "95₺", badge: "Şef Önerisi" },
                { name: "Sütlaç", price: "55₺" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid #f0f0f0"
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                      {item.name}
                      {item.badge && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: "#c2410c",
                          background: "#fff7ed", padding: "2px 6px", borderRadius: 4
                        }}>{item.badge}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{
        padding: "100px 48px",
        maxWidth: 1280, margin: "0 auto"
      }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#166534", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            ÖZELLİKLER
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 42, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16
          }}>
            İhtiyacınız olan her şey
          </h2>
          <p style={{ fontSize: 17, color: "#666", maxWidth: 500, margin: "0 auto" }}>
            Menünüzü oluşturun, özelleştirin ve müşterilerinize sunun. Hepsi tek platformda.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24
        }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{
              padding: 32, borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.5)",
              cursor: "default"
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "#f0fdf4", color: "#166534",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{
        padding: "100px 48px",
        background: "#fff",
        borderTop: "1px solid rgba(0,0,0,0.04)"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#166534", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              FİYATLANDIRMA
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 42, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16
            }}>
              İşletmenize uygun plan
            </h2>
            <p style={{ fontSize: 17, color: "#666", maxWidth: 500, margin: "0 auto" }}>
              Tüm planlar 14 gün ücretsiz deneme ile başlar. İstediğiniz zaman yükseltin veya iptal edin.
            </p>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
            maxWidth: 1040, margin: "0 auto"
          }}>
            {plans.map((plan) => (
              <div key={plan.id} className="plan-card" style={{
                padding: 36, borderRadius: 24,
                border: plan.id === "pro" ? "2px solid #166534" : "1px solid rgba(0,0,0,0.08)",
                background: plan.id === "pro" ? "linear-gradient(180deg, #f0fdf4 0%, #fff 30%)" : "#fff",
                position: "relative"
              }}>
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    background: "#166534", color: "#fff",
                    padding: "5px 18px", borderRadius: 100,
                    fontSize: 12, fontWeight: 700
                  }}>{plan.badge}</div>
                )}
                
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: "#888" }}>{plan.desc}</p>
                </div>
                
                <div style={{ marginBottom: 28 }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 48, fontWeight: 700
                  }}>{plan.price}</span>
                  <span style={{ fontSize: 15, color: "#888" }}>₺/yıl</span>
                </div>
                
                <a href="#" className="cta-btn" style={{
                  display: "block", textAlign: "center",
                  padding: "14px 0", borderRadius: 12,
                  fontSize: 15, fontWeight: 600, textDecoration: "none",
                  background: plan.id === "pro" ? "#166534" : "transparent",
                  color: plan.id === "pro" ? "#fff" : "#166534",
                  border: plan.id === "pro" ? "none" : "2px solid #166534",
                  marginBottom: 28
                }}>
                  Ücretsiz Deneyin
                </a>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                      {f.included ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span style={{ color: f.included ? "#333" : "#bbb" }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px 48px",
        maxWidth: 1280, margin: "0 auto", textAlign: "center"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #0f4c24 0%, #166534 50%, #15803d 100%)",
          borderRadius: 32, padding: "80px 48px",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)"
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,0.03)"
          }} />
          
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 40, fontWeight: 700, color: "#fff",
            marginBottom: 16, position: "relative"
          }}>
            Menünüzü dijitale taşımaya hazır mısınız?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", marginBottom: 36, position: "relative" }}>
            14 gün ücretsiz deneyin. Kredi kartı gerekli, istediğiniz zaman iptal edin.
          </p>
          <a href="#" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff", color: "#166534",
            padding: "16px 36px", borderRadius: 14,
            fontSize: 16, fontWeight: 700, textDecoration: "none",
            position: "relative",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >
            Hemen Başlayın
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "48px 48px 32px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        maxWidth: 1280, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #166534, #22c55e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14,
            fontFamily: "'Playfair Display', serif"
          }}>Q</div>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#888" }}>QRMenus</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="#" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>Gizlilik Politikası</a>
          <a href="#" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>Kullanım Şartları</a>
          <a href="#" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>İletişim</a>
        </div>
        <div style={{ fontSize: 13, color: "#aaa" }}>© 2026 QRMenus. Tüm hakları saklıdır.</div>
      </footer>
    </div>
  );
};

export default LandingPage;
