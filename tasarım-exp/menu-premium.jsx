import { useState } from "react";

const MenuPremium = () => {
  const [selectedLang, setSelectedLang] = useState("tr");
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const langs = [
    { code: "tr", name: "TR", flag: "🇹🇷" },
    { code: "en", name: "EN", flag: "🇬🇧" },
    { code: "de", name: "DE", flag: "🇩🇪" },
    { code: "ar", name: "AR", flag: "🇸🇦" },
    { code: "ru", name: "RU", flag: "🇷🇺" },
  ];

  const categories = [
    {
      name: "Başlangıçlar",
      items: [
        { name: "Humus Tabağı", desc: "Nohut ezmesi, zeytinyağı, kırmızı biber ve taze nane ile", price: "75", image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=300&h=300&fit=crop", badges: ["Vegan"], allergens: ["Susam"], calories: 220, prepTime: 5, ingredients: "Nohut, tahin, zeytinyağı, limon suyu, sarımsak, kırmızı biber" },
        { name: "Sigara Böreği", desc: "El açması yufka, beyaz peynir ve maydanoz harcı", price: "65", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=300&fit=crop", badges: [], allergens: ["Gluten", "Süt"], calories: 280, prepTime: 12, ingredients: "Yufka, beyaz peynir, maydanoz, karabiber" },
        { name: "Közlenmiş Patlıcan", desc: "Közde pişirilmiş patlıcan, yoğurt ve nar ekşisi", price: "70", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300&h=300&fit=crop", badges: ["Şef Önerisi"], allergens: ["Süt"], calories: 150, prepTime: 15, ingredients: "Patlıcan, süzme yoğurt, nar ekşisi, zeytinyağı, sarımsak" },
      ]
    },
    {
      name: "Ana Yemekler",
      items: [
        { name: "Kuzu İncik", desc: "8 saat yavaş pişirilmiş kuzu incik, sebze rosti ile", price: "285", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop", badges: ["Şef Önerisi"], allergens: [], calories: 680, prepTime: 30, ingredients: "Kuzu incik, patates, havuç, soğan, kekik, biberiye" },
        { name: "Levrek Fileto", desc: "Tereyağında sote, enginar kalbi ve kapari sosu", price: "245", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=300&fit=crop", badges: ["Popüler"], allergens: ["Balık", "Süt"], calories: 420, prepTime: 20, ingredients: "Levrek, tereyağı, enginar, kapari, limon" },
        { name: "Mantar Risotto", desc: "Porcini ve kestane mantarı, parmesan ve truffle yağı", price: "175", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&h=300&fit=crop", badges: ["Vejetaryen"], allergens: ["Süt"], calories: 520, prepTime: 25, ingredients: "Arborio pirinç, porcini mantarı, parmesan, truffle yağı" },
      ]
    },
    {
      name: "Tatlılar",
      items: [
        { name: "Çikolatalı Sufle", desc: "Sıcak akan merkezli, vanilya dondurma eşliğinde", price: "95", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=300&fit=crop", badges: ["Popüler"], allergens: ["Gluten", "Süt", "Yumurta"], calories: 480, prepTime: 15, ingredients: "Belçika çikolatası, tereyağı, yumurta, un, vanilya dondurma" },
        { name: "Baklava", desc: "Antep fıstıklı, 40 kat yufka, hafif şerbet", price: "85", image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=300&h=300&fit=crop", badges: [], allergens: ["Gluten", "Fındık"], calories: 350, prepTime: 0, ingredients: "Yufka, Antep fıstığı, tereyağı, şeker, limon" },
      ]
    }
  ];

  const allergenColors = {
    "Gluten": "#F59E0B", "Süt": "#3B82F6", "Yumurta": "#EF4444",
    "Fındık": "#8B5CF6", "Kafein": "#6B7280", "Susam": "#10B981",
    "Balık": "#06B6D4"
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#0C0A09",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .premium-item { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); cursor: pointer; }
        .premium-item:hover { transform: scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .cat-pill { transition: all 0.2s ease; cursor: pointer; }
        .cat-pill:hover { background: rgba(212,167,106,0.15) !important; }
        .lang-btn { transition: all 0.2s ease; cursor: pointer; }
        .lang-btn:hover { background: rgba(212,167,106,0.15) !important; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-bg { animation: fadeIn 0.25s ease; }
        .modal-body { animation: slideUp 0.35s cubic-bezier(0.4,0,0.2,1); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,167,106,0.3); border-radius: 4px; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px",
            background: "rgba(212,167,106,0.15)", color: "#D4A76A", fontSize: 11, fontWeight: 700,
            borderRadius: 100, letterSpacing: "0.05em", border: "1px solid rgba(212,167,106,0.2)"
          }}>PREMIUM TEMPLATE — Sınırsız Dil + Tüm Özellikler</span>
        </div>

        <div style={{
          background: "#1A1714",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          border: "1px solid rgba(212,167,106,0.1)"
        }}>
          {/* Header */}
          <div style={{
            padding: "32px 24px 0",
            background: "linear-gradient(180deg, rgba(212,167,106,0.08) 0%, transparent 100%)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "linear-gradient(135deg, #D4A76A, #8B6914)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#1A1714", fontWeight: 700, fontSize: 24,
                  fontFamily: "'Cormorant Garamond', serif",
                  boxShadow: "0 4px 16px rgba(212,167,106,0.3)"
                }}>N</div>
                <div>
                  <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 24, fontWeight: 700, color: "#F5E6D3",
                    letterSpacing: "-0.01em"
                  }}>Nûr Restaurant</h1>
                  <p style={{ fontSize: 12, color: "rgba(212,167,106,0.6)" }}>Fine Dining & Cocktails</p>
                </div>
              </div>
            </div>

            {/* Language Pills */}
            <div style={{ display: "flex", gap: 6, marginTop: 20, paddingBottom: 20, overflowX: "auto" }}>
              {langs.map(l => (
                <div
                  key={l.code}
                  className="lang-btn"
                  onClick={() => setSelectedLang(l.code)}
                  style={{
                    padding: "6px 12px", borderRadius: 8,
                    background: selectedLang === l.code ? "rgba(212,167,106,0.2)" : "transparent",
                    border: `1px solid ${selectedLang === l.code ? "rgba(212,167,106,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: selectedLang === l.code ? "#D4A76A" : "rgba(255,255,255,0.4)",
                    fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
                  }}
                >
                  {l.flag} {l.name}
                </div>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: "flex", gap: 0,
            borderBottom: "1px solid rgba(255,255,255,0.06)"
          }}>
            {categories.map((cat, i) => (
              <div
                key={i}
                className="cat-pill"
                onClick={() => setActiveCategory(i)}
                style={{
                  flex: 1, padding: "14px 0", textAlign: "center",
                  color: activeCategory === i ? "#D4A76A" : "rgba(255,255,255,0.35)",
                  fontSize: 13, fontWeight: 600,
                  borderBottom: activeCategory === i ? "2px solid #D4A76A" : "2px solid transparent",
                  background: "transparent"
                }}
              >
                {cat.name}
              </div>
            ))}
          </div>

          {/* Items */}
          <div style={{ padding: "20px 20px 8px" }}>
            {categories[activeCategory].items.map((item, i) => (
              <div
                key={i}
                className="premium-item"
                onClick={() => setSelectedItem(item)}
                style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  marginBottom: 14,
                  background: "#211E19",
                  border: "1px solid rgba(255,255,255,0.04)"
                }}
              >
                <div style={{ position: "relative", height: 160 }}>
                  <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, #211E19 5%, rgba(33,30,25,0.4) 40%, transparent)"
                  }} />
                  {/* Badges */}
                  <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                    {item.badges.map((b, bi) => (
                      <span key={bi} style={{
                        fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                        background: b === "Şef Önerisi" ? "rgba(212,167,106,0.9)" :
                          b === "Popüler" ? "rgba(255,255,255,0.85)" :
                          b === "Vegan" ? "rgba(34,197,94,0.85)" :
                          "rgba(96,165,250,0.85)",
                        color: b === "Şef Önerisi" ? "#1A1714" :
                          b === "Popüler" ? "#1A1714" : "#fff",
                        backdropFilter: "blur(4px)"
                      }}>{b}</span>
                    ))}
                  </div>
                  {/* Price */}
                  <div style={{
                    position: "absolute", bottom: 14, right: 14,
                    fontSize: 22, fontWeight: 800, color: "#D4A76A",
                    fontFamily: "'Cormorant Garamond', serif",
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                  }}>₺{item.price}</div>
                </div>
                <div style={{ padding: "14px 16px 16px" }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 19, fontWeight: 700, color: "#F5E6D3",
                    marginBottom: 4
                  }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: 10 }}>{item.desc}</p>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {item.allergens.map((a, ai) => (
                      <span key={ai} style={{
                        fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
                        background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)"
                      }}>{a}</span>
                    ))}
                    <span style={{
                      fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
                      background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)"
                    }}>{item.calories} kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 24px 22px", textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Powered by </span>
            <span style={{ fontSize: 11, color: "rgba(212,167,106,0.4)", fontWeight: 600 }}>QRMenus</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="modal-bg"
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            zIndex: 100, padding: 16
          }}
        >
          <div
            className="modal-body"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#1A1714", borderRadius: 24,
              width: "100%", maxWidth: 480, maxHeight: "85vh", overflow: "auto",
              border: "1px solid rgba(212,167,106,0.15)"
            }}
          >
            <div style={{ position: "relative", height: 220 }}>
              <img src={selectedItem.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "24px 24px 0 0" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #1A1714 5%, transparent 50%)", borderRadius: "24px 24px 0 0" }} />
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                  border: "none", cursor: "pointer", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >✕</button>
            </div>

            <div style={{ padding: "4px 24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "#F5E6D3" }}>
                    {selectedItem.name}
                  </h3>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    {selectedItem.badges.map((b, i) => (
                      <span key={i} style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                        background: "rgba(212,167,106,0.15)", color: "#D4A76A",
                        border: "1px solid rgba(212,167,106,0.2)"
                      }}>{b}</span>
                    ))}
                  </div>
                </div>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 30, fontWeight: 800, color: "#D4A76A"
                }}>₺{selectedItem.price}</span>
              </div>

              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 24 }}>{selectedItem.desc}</p>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
                {[
                  { label: "Kalori", value: `${selectedItem.calories}`, unit: "kcal" },
                  { label: "Süre", value: selectedItem.prepTime || "–", unit: "dk" },
                  { label: "Alerjen", value: selectedItem.allergens.length, unit: "çeşit" },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: 14, borderRadius: 14,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#F5E6D3", fontFamily: "'Cormorant Garamond', serif" }}>
                      {s.value} <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{s.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              {selectedItem.ingredients && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A76A", marginBottom: 8, letterSpacing: "0.1em" }}>MALZEMELER</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{selectedItem.ingredients}</p>
                </div>
              )}

              {/* Allergens */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A76A", marginBottom: 8, letterSpacing: "0.1em" }}>ALERJENLER</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {selectedItem.allergens.map((a, i) => (
                    <span key={i} style={{
                      fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8,
                      background: `${allergenColors[a]}15`,
                      color: allergenColors[a],
                      border: `1px solid ${allergenColors[a]}30`
                    }}>{a}</span>
                  ))}
                  {selectedItem.allergens.length === 0 && (
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Bilinen alerjen içermez</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPremium;
