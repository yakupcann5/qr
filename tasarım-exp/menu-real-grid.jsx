import { useState } from "react";

const MenuGridView = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lang, setLang] = useState("tr");

  const categories = [
    { name: "Tümü", icon: "📋" },
    { name: "Kahveler", icon: "☕" },
    { name: "Yiyecekler", icon: "🥪" },
    { name: "Tatlılar", icon: "🧁" },
    { name: "Soğuk", icon: "🥤" },
  ];

  const items = [
    { cat: 1, name: "Espresso", desc: "Çift shot, yoğun krema tabakası", price: "45", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop", popular: true, allergens: ["Kafein"] },
    { cat: 1, name: "Latte", desc: "Espresso, kremsi buharlanmış süt", price: "70", image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&h=300&fit=crop", popular: false, allergens: ["Süt", "Kafein"] },
    { cat: 1, name: "Cappuccino", desc: "Espresso, sıcak süt, yoğun köpük", price: "65", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop", popular: false, allergens: ["Süt", "Kafein"] },
    { cat: 1, name: "Türk Kahvesi", desc: "Geleneksel, orta/sade/şekerli", price: "45", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop", popular: true, allergens: ["Kafein"] },
    { cat: 1, name: "Filtre Kahve", desc: "V60, günlük taze kavrulmuş çekirdek", price: "55", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop", popular: false, allergens: ["Kafein"] },
    { cat: 1, name: "Mocha", desc: "Espresso, çikolata, süt, krema", price: "80", image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&h=300&fit=crop", popular: false, allergens: ["Süt", "Kafein"] },
    { cat: 2, name: "Avocado Toast", desc: "Ekşi maya ekmek, avokado, poşe yumurta, chili", price: "95", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=300&fit=crop", popular: true, allergens: ["Gluten", "Yumurta"] },
    { cat: 2, name: "Tost (Kaşarlı)", desc: "Taze tost ekmeği, kaşar peyniri", price: "55", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop", popular: false, allergens: ["Gluten", "Süt"] },
    { cat: 2, name: "Sandviç", desc: "Tavuk, marul, domates, ranch sos", price: "85", image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=300&h=300&fit=crop", popular: false, allergens: ["Gluten"] },
    { cat: 2, name: "Granola Bowl", desc: "Yoğurt, granola, bal, mevsim meyveleri", price: "80", image: "https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?w=300&h=300&fit=crop", popular: true, allergens: ["Süt", "Gluten", "Fındık"] },
    { cat: 3, name: "Cheesecake", desc: "San Sebastian, karamel sos", price: "85", image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=300&h=300&fit=crop", popular: true, allergens: ["Gluten", "Süt", "Yumurta"] },
    { cat: 3, name: "Brownie", desc: "Sıcak, çikolata sosu, dondurma", price: "75", image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=300&h=300&fit=crop", popular: false, allergens: ["Gluten", "Süt", "Yumurta"] },
    { cat: 3, name: "Cookie", desc: "Çikolata parçalı, ılık servis", price: "40", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop", popular: false, allergens: ["Gluten", "Süt"] },
    { cat: 4, name: "Ice Latte", desc: "Soğuk espresso, süt, buz", price: "75", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop", popular: true, allergens: ["Süt", "Kafein"] },
    { cat: 4, name: "Limonata", desc: "Ev yapımı, taze nane", price: "50", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=300&fit=crop", popular: false, allergens: [] },
    { cat: 4, name: "Smoothie", desc: "Muz, çilek, yaban mersini, yulaf sütü", price: "70", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=300&fit=crop", popular: false, allergens: [] },
  ];

  const filtered = activeCategory === 0 ? items : items.filter(i => i.cat === activeCategory);

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
        .grid-item { transition: transform 0.2s ease; cursor: pointer; }
        .grid-item:active { transform: scale(0.97); }
        .cat-chip { transition: all 0.2s; cursor: pointer; white-space: nowrap; flex-shrink: 0; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .sheet-bg { animation: fadeIn 0.15s ease; }
        .sheet-body { animation: slideUp 0.25s cubic-bezier(0.32,0.72,0,1); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480, background: "#fff", minHeight: "100vh" }}>
        
        {/* Header with cover image */}
        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=200&fit=crop"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent)"
          }} />
          <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, border: "2px solid #fff",
                background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}>☕</div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Brew & Bite</h1>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Specialty Coffee & Brunch • Cihangir</p>
              </div>
            </div>
          </div>
          {/* Lang button */}
          <button
            style={{
              position: "absolute", top: 12, right: 12,
              padding: "6px 10px", borderRadius: 8,
              background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)",
              border: "none", color: "#fff", fontSize: 12, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 4
            }}
          >🇹🇷 TR</button>
        </div>

        {/* Sticky Category Bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 30,
          background: "#fff", borderBottom: "1px solid #F0F0F0"
        }}>
          <div className="hide-scrollbar" style={{
            display: "flex", gap: 8, padding: "12px 16px",
            overflowX: "auto"
          }}>
            {categories.map((cat, i) => (
              <div
                key={i}
                className="cat-chip"
                onClick={() => setActiveCategory(i)}
                style={{
                  padding: "7px 14px", borderRadius: 20,
                  background: activeCategory === i ? "#1B5E20" : "#F5F5F5",
                  color: activeCategory === i ? "#fff" : "#555",
                  fontSize: 13, fontWeight: 600
                }}
              >{cat.icon} {cat.name}</div>
            ))}
          </div>
        </div>

        {/* Grid Items */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 10, padding: "12px 12px"
        }}>
          {filtered.map((item, i) => (
            <div
              key={i}
              className="grid-item"
              onClick={() => setSelectedItem(item)}
              style={{
                borderRadius: 14, overflow: "hidden",
                background: "#fff",
                border: "1px solid #F0F0F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
              }}
            >
              <div style={{ height: 130, position: "relative", overflow: "hidden" }}>
                <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {item.popular && (
                  <div style={{
                    position: "absolute", top: 8, left: 8,
                    padding: "3px 7px", borderRadius: 6,
                    background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    fontSize: 10, fontWeight: 700, color: "#E65100"
                  }}>🔥 Popüler</div>
                )}
              </div>
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 }}>{item.name}</div>
                <div style={{
                  fontSize: 12, color: "#999", lineHeight: 1.4, marginBottom: 8,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>{item.desc}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1B5E20" }}>₺{item.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div style={{
          margin: "8px 12px 12px", padding: "12px 14px",
          background: "#FFF8E1", borderRadius: 12,
          display: "flex", alignItems: "center", gap: 10,
          border: "1px solid #FFE082"
        }}>
          <span style={{ fontSize: 18 }}>ℹ️</span>
          <span style={{ fontSize: 12, color: "#795548", lineHeight: 1.5 }}>
            Alerjen bilgileri için ürüne tıklayın. Tüm fiyatlara KDV dahildir.
          </span>
        </div>

        {/* Social / Contact */}
        <div style={{
          display: "flex", gap: 8, padding: "0 12px 16px", justifyContent: "center"
        }}>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 10,
            background: "#25D366", color: "#fff", border: "none",
            fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>💬 WhatsApp</button>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 10,
            background: "#E1306C", color: "#fff", border: "none",
            fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>📸 Instagram</button>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 10,
            background: "#1877F2", color: "#fff", border: "none",
            fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>📍 Konum</button>
        </div>

        {/* Footer */}
        <div style={{ padding: 16, textAlign: "center", borderTop: "1px solid #F0F0F0" }}>
          <div style={{ fontSize: 10, color: "#ccc", fontWeight: 600 }}>Powered by QRMenus</div>
        </div>

        {/* Detail Sheet */}
        {selectedItem && (
          <div className="sheet-bg" onClick={() => setSelectedItem(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
            zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center"
          }}>
            <div className="sheet-body" onClick={e => e.stopPropagation()} style={{
              background: "#fff", borderRadius: "20px 20px 0 0",
              width: "100%", maxWidth: 480, maxHeight: "80vh", overflow: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0E0E0" }} />
              </div>

              <div style={{ height: 200, margin: "4px 16px 0", borderRadius: 16, overflow: "hidden" }}>
                <img src={selectedItem.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>

              <div style={{ padding: "16px 20px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{selectedItem.name}</h3>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#1B5E20" }}>₺{selectedItem.price}</span>
                </div>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginTop: 10 }}>{selectedItem.desc}</p>

                {selectedItem.allergens.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#999", marginBottom: 6 }}>ALERJENLER</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {selectedItem.allergens.map((a, i) => (
                        <span key={i} style={{
                          fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
                          background: "#FFF3E0", color: "#E65100", border: "1px solid #FFE0B2"
                        }}>{a}</span>
                      ))}
                    </div>
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

export default MenuGridView;
