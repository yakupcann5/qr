import { useState } from "react";

const MenuAccordion = () => {
  const [expanded, setExpanded] = useState([0]);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggle = (i) => {
    setExpanded(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const sections = [
    {
      name: "Çorbalar",
      icon: "🍲",
      count: 3,
      items: [
        { name: "Mercimek Çorbası", desc: "Kırmızı mercimek, limon", price: "65", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop", tags: ["Vegan"] },
        { name: "Ezogelin Çorbası", desc: "Bulgur, mercimek, domates", price: "65", image: "", tags: ["Vegan"] },
        { name: "Tavuk Suyu Çorbası", desc: "Şehriyeli, limonlu", price: "70", image: "", tags: [] },
      ]
    },
    {
      name: "Salatalar",
      icon: "🥗",
      count: 4,
      items: [
        { name: "Çoban Salata", desc: "Domates, salatalık, soğan, biber, maydanoz", price: "55", image: "", tags: ["Vegan", "GF"] },
        { name: "Sezar Salata", desc: "Marul, parmesan, kruton, tavuk, sezar sos", price: "105", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=200&h=200&fit=crop", tags: [] },
        { name: "Akdeniz Salata", desc: "Roka, cherry domates, zeytinyağı, nar ekşisi", price: "80", image: "", tags: ["Vejetaryen", "GF"] },
        { name: "Ton Balıklı Salata", desc: "Ton balığı, mısır, marul, zeytinyağı", price: "95", image: "", tags: ["GF"] },
      ]
    },
    {
      name: "Ana Yemekler",
      icon: "🍖",
      count: 6,
      items: [
        { name: "Izgara Köfte", desc: "Dana köfte (4 adet), pilav, közlenmiş biber-domates", price: "185", popular: true, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop", tags: ["GF"] },
        { name: "Adana Kebap", desc: "El kıyması, acılı, lavaş, közlenmiş sebze", price: "195", popular: true, image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200&h=200&fit=crop", tags: ["GF"] },
        { name: "Tavuk Şiş", desc: "Marine tavuk, bulgur pilavı, cacık", price: "165", image: "", tags: ["GF"] },
        { name: "Kuzu Tandır", desc: "Yavaş pişirilmiş kuzu, pide ekmeği, iç pilav", price: "245", popular: true, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop", tags: [] },
        { name: "Mantı", desc: "El yapımı, yoğurtlu, sarımsaklı tereyağı", price: "145", image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=200&h=200&fit=crop", tags: [] },
        { name: "Karnıyarık", desc: "Patlıcan, kıymalı iç harç, pilav", price: "155", image: "", tags: [] },
      ]
    },
    {
      name: "Pide & Lahmacun",
      icon: "🫓",
      count: 4,
      items: [
        { name: "Kaşarlı Pide", desc: "Kaşar peyniri, tereyağı", price: "110", image: "", tags: ["Vejetaryen"] },
        { name: "Kıymalı Pide", desc: "Kıyma, domates, biber", price: "130", popular: true, image: "https://images.unsplash.com/photo-1600628421066-f6bda tried?w=200&h=200&fit=crop", tags: [] },
        { name: "Kuşbaşılı Pide", desc: "Kuşbaşı et, biber, domates", price: "155", image: "", tags: [] },
        { name: "Lahmacun", desc: "İnce hamur, kıymalı harç, limon, maydanoz", price: "65", popular: true, image: "", tags: [] },
      ]
    },
    {
      name: "Tatlılar",
      icon: "🍮",
      count: 4,
      items: [
        { name: "Künefe", desc: "Tel kadayıf, peynir, antep fıstığı, dondurma", price: "110", popular: true, image: "https://images.unsplash.com/photo-1579888944880-d98341245702?w=200&h=200&fit=crop", tags: [] },
        { name: "Sütlaç", desc: "Fırında, tarçınlı", price: "65", image: "", tags: ["Vejetaryen", "GF"] },
        { name: "Kazandibi", desc: "Karamelize süt tatlısı", price: "65", image: "", tags: ["Vejetaryen", "GF"] },
        { name: "Baklava (4 dilim)", desc: "Antep fıstıklı, ev yapımı", price: "120", image: "", tags: ["Vejetaryen"] },
      ]
    },
    {
      name: "İçecekler",
      icon: "🥤",
      count: 6,
      items: [
        { name: "Çay", desc: "Rize çayı, bardak", price: "20", image: "", tags: ["Vegan", "GF"] },
        { name: "Türk Kahvesi", desc: "Geleneksel, lokum eşliğinde", price: "45", image: "", tags: [] },
        { name: "Ayran", desc: "Ev yapımı, köpüklü", price: "30", image: "", tags: ["Vejetaryen", "GF"] },
        { name: "Limonata", desc: "Taze sıkılmış, nane", price: "50", image: "", tags: ["Vegan", "GF"] },
        { name: "Meşrubat", desc: "Coca-Cola, Fanta, Sprite", price: "40", image: "", tags: [] },
        { name: "Su (0.5L)", desc: "Erikli / Hayat", price: "15", image: "", tags: [] },
      ]
    },
  ];

  const tagColors = {
    "Vegan": { bg: "#E8F5E9", color: "#2E7D32" },
    "Vejetaryen": { bg: "#F3E5F5", color: "#7B1FA2" },
    "GF": { bg: "#FFF3E0", color: "#E65100" },
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "#F5F5F5",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center"
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .section-header { cursor: pointer; transition: background 0.15s; }
        .section-header:active { background: rgba(0,0,0,0.02); }
        .item-row { transition: background 0.15s; cursor: pointer; }
        .item-row:active { background: #FAFAFA; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .sheet-bg { animation: fadeIn 0.15s ease; }
        .sheet-body { animation: slideUp 0.25s cubic-bezier(0.32,0.72,0,1); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480, background: "#fff", minHeight: "100vh" }}>
        
        {/* Header */}
        <div style={{
          padding: "16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #F0F0F0"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "#D32F2F",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 18
            }}>AO</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A" }}>Anadolu Ocakbaşı</div>
              <div style={{ fontSize: 12, color: "#999" }}>Geleneksel Türk Mutfağı</div>
            </div>
          </div>
          <button style={{
            padding: "6px 12px", borderRadius: 8,
            background: "#F5F5F5", border: "none",
            fontSize: 13, fontWeight: 600, color: "#666", cursor: "pointer"
          }}>🇹🇷 TR ▾</button>
        </div>

        {/* Announcement */}
        <div style={{
          margin: "12px 16px 4px", padding: "10px 14px",
          background: "#FFF8E1", borderRadius: 10,
          display: "flex", alignItems: "center", gap: 8,
          border: "1px solid #FFECB3"
        }}>
          <span style={{ fontSize: 14 }}>📢</span>
          <span style={{ fontSize: 12, color: "#795548" }}>
            Hafta içi 12:00-15:00 arası öğle menüsü: Çorba + Ana Yemek + İçecek <strong>175₺</strong>
          </span>
        </div>

        {/* Accordion Sections */}
        <div style={{ padding: "8px 0" }}>
          {sections.map((section, si) => (
            <div key={si} style={{ borderBottom: "1px solid #F5F5F5" }}>
              {/* Section Header */}
              <div
                className="section-header"
                onClick={() => toggle(si)}
                style={{
                  padding: "14px 16px",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{section.icon}</span>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{section.name}</span>
                    <span style={{ fontSize: 12, color: "#bbb", marginLeft: 8 }}>{section.count} ürün</span>
                  </div>
                </div>
                <svg
                  width="18" height="18" fill="none" viewBox="0 0 24 24"
                  stroke="#999" strokeWidth={2}
                  style={{
                    transition: "transform 0.2s ease",
                    transform: expanded.includes(si) ? "rotate(180deg)" : "rotate(0)"
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              {/* Items */}
              {expanded.includes(si) && (
                <div style={{ paddingBottom: 8 }}>
                  {section.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="item-row"
                      onClick={() => setSelectedItem(item)}
                      style={{
                        display: "flex", gap: 12, padding: "10px 16px 10px 48px"
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{item.name}</span>
                          {item.popular && (
                            <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "#FFEBEE", color: "#D32F2F" }}>⭐ Favori</span>
                          )}
                        </div>
                        <p style={{
                          fontSize: 12, color: "#999", lineHeight: 1.4, marginBottom: 4,
                          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"
                        }}>{item.desc}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#D32F2F" }}>₺{item.price}</span>
                          {item.tags?.map((t, ti) => (
                            <span key={ti} style={{
                              fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
                              background: tagColors[t]?.bg || "#F5F5F5",
                              color: tagColors[t]?.color || "#666"
                            }}>{t === "GF" ? "Glutensiz" : t}</span>
                          ))}
                        </div>
                      </div>
                      {item.image && (
                        <div style={{
                          width: 64, height: 64, borderRadius: 10,
                          overflow: "hidden", flexShrink: 0
                        }}>
                          <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div style={{ padding: "16px", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#bbb", lineHeight: 1.6 }}>
            Fiyatlara KDV dahildir. Alerjen bilgisi için personelimize danışınız.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 12, marginTop: 12
          }}>
            <button style={{
              padding: "8px 16px", borderRadius: 8,
              background: "#25D366", color: "#fff", border: "none",
              fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}>💬 WhatsApp</button>
            <button style={{
              padding: "8px 16px", borderRadius: 8,
              background: "#D32F2F", color: "#fff", border: "none",
              fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}>📞 0212 XXX XX XX</button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px 16px", textAlign: "center", borderTop: "1px solid #F0F0F0" }}>
          <div style={{ fontSize: 10, color: "#ddd", fontWeight: 600 }}>Powered by QRMenus</div>
        </div>

        {/* Bottom Sheet */}
        {selectedItem && (
          <div className="sheet-bg" onClick={() => setSelectedItem(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
            zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center"
          }}>
            <div className="sheet-body" onClick={e => e.stopPropagation()} style={{
              background: "#fff", borderRadius: "20px 20px 0 0",
              width: "100%", maxWidth: 480, maxHeight: "75vh", overflow: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0E0E0" }} />
              </div>

              {selectedItem.image && (
                <div style={{ height: 200, margin: "4px 16px 0", borderRadius: 16, overflow: "hidden" }}>
                  <img src={selectedItem.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}

              <div style={{ padding: "16px 20px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{selectedItem.name}</h3>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#D32F2F" }}>₺{selectedItem.price}</span>
                </div>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginTop: 10 }}>{selectedItem.desc}</p>
                {selectedItem.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                    {selectedItem.tags.map((t, i) => (
                      <span key={i} style={{
                        fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
                        background: tagColors[t]?.bg || "#F5F5F5",
                        color: tagColors[t]?.color || "#666"
                      }}>{t === "GF" ? "Glutensiz" : t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuAccordion;
