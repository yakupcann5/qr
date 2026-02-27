import { useState } from "react";

const MenuProfessional = () => {
  const [selectedLang, setSelectedLang] = useState("tr");
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const langs = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const categories = [
    {
      name: "Sıcak İçecekler",
      emoji: "☕",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=200&fit=crop",
      items: [
        { name: "Türk Kahvesi", desc: "Geleneksel köpüklü Türk kahvesi, ince öğütülmüş", price: "45", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop", badges: ["Popüler"], allergens: ["Kafein"], calories: 12, prepTime: 5 },
        { name: "Latte", desc: "Çift shot espresso ve kremsi buharlanmış süt", price: "65", image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=200&h=200&fit=crop", badges: [], allergens: ["Süt", "Kafein"], calories: 180, prepTime: 4 },
        { name: "Cappuccino", desc: "Espresso, sıcak süt ve yoğun süt köpüğü", price: "60", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop", badges: ["Yeni"], allergens: ["Süt", "Kafein"], calories: 120, prepTime: 4 },
        { name: "Matcha Latte", desc: "Japon matcha tozu ve buharlanmış süt", price: "75", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=200&h=200&fit=crop", badges: [], allergens: ["Süt"], calories: 150, prepTime: 5 },
      ]
    },
    {
      name: "Tatlılar",
      emoji: "🍰",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=200&fit=crop",
      items: [
        { name: "Künefe", desc: "Hatay usulü, tel kadayıf içinde kaymak peyniri", price: "95", image: "https://images.unsplash.com/photo-1579888944880-d98341245702?w=200&h=200&fit=crop", badges: ["Şef Önerisi"], allergens: ["Gluten", "Süt", "Fındık"], calories: 380, prepTime: 15 },
        { name: "San Sebastian", desc: "Bask usulü yanık cheesecake", price: "85", image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=200&h=200&fit=crop", badges: ["Popüler"], allergens: ["Gluten", "Süt", "Yumurta"], calories: 320, prepTime: 0 },
        { name: "Brownie", desc: "Sıcak çikolatalı, vanilyalı dondurma ile", price: "65", image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200&h=200&fit=crop", badges: [], allergens: ["Gluten", "Süt", "Yumurta"], calories: 420, prepTime: 8 },
      ]
    },
    {
      name: "Kahvaltı",
      emoji: "🥞",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=200&fit=crop",
      items: [
        { name: "Serpme Kahvaltı", desc: "2 kişilik zengin serpme kahvaltı tabağı", price: "350", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop", badges: ["Popüler"], allergens: ["Gluten", "Süt", "Yumurta", "Susam"], calories: 850, prepTime: 20 },
        { name: "Avocado Toast", desc: "Ekşi mayalı ekmek üzeri avokado, poşe yumurta", price: "85", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=200&fit=crop", badges: ["Yeni"], allergens: ["Gluten", "Yumurta"], calories: 380, prepTime: 10 },
      ]
    }
  ];

  const allergenColors = {
    "Gluten": "#F59E0B", "Süt": "#3B82F6", "Yumurta": "#EF4444",
    "Fındık": "#8B5CF6", "Kafein": "#6B7280", "Susam": "#10B981"
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#F5F1EB",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .item-card { transition: all 0.2s ease; cursor: pointer; }
        .item-card:hover { background: #FAF8F5 !important; }
        .cat-tab { transition: all 0.2s ease; cursor: pointer; white-space: nowrap; }
        .cat-tab:hover { background: rgba(139,90,43,0.08); }
        .modal-overlay { animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-content { animation: slideUp 0.3s ease; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px",
            background: "#DBEAFE", color: "#1E40AF", fontSize: 11, fontWeight: 700,
            borderRadius: 100, letterSpacing: "0.05em"
          }}>PROFESYONEL TEMPLATE — Görseller + Detay + 3 Dil</span>
        </div>

        <div style={{
          background: "#FFFDF9",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)"
        }}>
          {/* Header */}
          <div style={{
            padding: "32px 24px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "linear-gradient(135deg, #8B5A2B, #D4A76A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 22,
                fontFamily: "'Playfair Display', serif",
                boxShadow: "0 4px 12px rgba(139,90,43,0.25)"
              }}>C</div>
              <div>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22, fontWeight: 700, color: "#2C1810"
                }}>Café Istanbul</h1>
                <p style={{ fontSize: 12, color: "#A0937E" }}>Geleneksel lezzetler, modern sunum</p>
              </div>
            </div>

            {/* Language Selector */}
            <div style={{ position: "relative" }}>
              <select
                value={selectedLang}
                onChange={e => setSelectedLang(e.target.value)}
                style={{
                  padding: "8px 28px 8px 12px", borderRadius: 10,
                  border: "1.5px solid #E8E0D4", fontSize: 13,
                  background: "#FFF", color: "#2C1810", fontWeight: 500,
                  appearance: "none", cursor: "pointer"
                }}
              >
                {langs.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                ))}
              </select>
              <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#8B5A2B" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: "flex", gap: 8, padding: "0 24px 16px",
            overflowX: "auto"
          }}>
            {categories.map((cat, i) => (
              <div
                key={i}
                className="cat-tab"
                onClick={() => setActiveCategory(i)}
                style={{
                  padding: "8px 16px", borderRadius: 10,
                  background: activeCategory === i ? "#8B5A2B" : "transparent",
                  color: activeCategory === i ? "#fff" : "#8B7355",
                  fontSize: 13, fontWeight: 600,
                  border: activeCategory === i ? "none" : "1.5px solid #E8E0D4"
                }}
              >
                {cat.emoji} {cat.name}
              </div>
            ))}
          </div>

          {/* Category Banner Image */}
          <div style={{
            margin: "0 24px 20px",
            height: 120, borderRadius: 16, overflow: "hidden",
            position: "relative"
          }}>
            <img
              src={categories[activeCategory].image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(44,24,16,0.6), transparent)"
            }} />
            <h2 style={{
              position: "absolute", bottom: 14, left: 16,
              fontFamily: "'Playfair Display', serif",
              fontSize: 20, color: "#fff", fontWeight: 700
            }}>{categories[activeCategory].name}</h2>
          </div>

          {/* Items */}
          <div style={{ padding: "0 24px 16px" }}>
            {categories[activeCategory].items.map((item, i) => (
              <div
                key={i}
                className="item-card"
                onClick={() => setSelectedItem(item)}
                style={{
                  display: "flex", gap: 14, padding: 14,
                  borderRadius: 14, marginBottom: 8,
                  border: "1px solid #f0ece4"
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  style={{
                    width: 80, height: 80, borderRadius: 12,
                    objectFit: "cover", flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#2C1810" }}>{item.name}</span>
                    {item.badges.map((b, bi) => (
                      <span key={bi} style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                        background: b === "Popüler" ? "#FEF3C7" : b === "Yeni" ? "#DBEAFE" : "#FEE2E2",
                        color: b === "Popüler" ? "#92400E" : b === "Yeni" ? "#1E40AF" : "#DC2626"
                      }}>{b}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "#A0937E", lineHeight: 1.4, marginBottom: 8 }}>{item.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {item.allergens.slice(0, 3).map((a, ai) => (
                        <span key={ai} style={{
                          fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                          background: `${allergenColors[a]}15`, color: allergenColors[a]
                        }}>{a}</span>
                      ))}
                    </div>
                    <span style={{
                      fontSize: 16, fontWeight: 800, color: "#8B5A2B"
                    }}>₺{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 24px 20px", borderTop: "1px solid #f0ece4", textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "#ccc" }}>Powered by </span>
            <span style={{ fontSize: 11, color: "#A0937E", fontWeight: 600 }}>QRMenus</span>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            zIndex: 100, padding: 16
          }}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#FFFDF9", borderRadius: "24px 24px 24px 24px",
              width: "100%", maxWidth: 480, maxHeight: "80vh", overflow: "auto"
            }}
          >
            <img
              src={selectedItem.image}
              alt=""
              style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: "24px 24px 0 0" }}
            />
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#2C1810" }}>
                    {selectedItem.name}
                  </h3>
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    {selectedItem.badges.map((b, i) => (
                      <span key={i} style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                        background: b === "Popüler" ? "#FEF3C7" : b === "Yeni" ? "#DBEAFE" : "#FEE2E2",
                        color: b === "Popüler" ? "#92400E" : b === "Yeni" ? "#1E40AF" : "#DC2626"
                      }}>{b}</span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#8B5A2B" }}>₺{selectedItem.price}</span>
              </div>

              <p style={{ fontSize: 14, color: "#7A6E5D", lineHeight: 1.7, marginBottom: 20 }}>{selectedItem.desc}</p>

              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ padding: 14, borderRadius: 12, background: "#F8F5F0" }}>
                  <div style={{ fontSize: 11, color: "#A0937E", fontWeight: 600, marginBottom: 4 }}>Kalori</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#2C1810" }}>{selectedItem.calories} kcal</div>
                </div>
                <div style={{ padding: 14, borderRadius: 12, background: "#F8F5F0" }}>
                  <div style={{ fontSize: 11, color: "#A0937E", fontWeight: 600, marginBottom: 4 }}>Hazırlanma</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#2C1810" }}>{selectedItem.prepTime || "–"} dk</div>
                </div>
              </div>

              {/* Allergens */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2C1810", marginBottom: 8, letterSpacing: "0.05em" }}>ALERJENLER</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {selectedItem.allergens.map((a, i) => (
                    <span key={i} style={{
                      fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
                      background: `${allergenColors[a]}15`, color: allergenColors[a],
                      border: `1px solid ${allergenColors[a]}30`
                    }}>{a}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  width: "100%", padding: 14, borderRadius: 12,
                  background: "#8B5A2B", color: "#fff", border: "none",
                  fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}
              >Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuProfessional;
