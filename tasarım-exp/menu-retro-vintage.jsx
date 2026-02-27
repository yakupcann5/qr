import { useState } from "react";

const MenuRetroVintage = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      name: "🍳 Kahvaltı",
      items: [
        { name: "Klasik Kahvaltı Tabağı", desc: "Yumurta, peynir, zeytin, domates, bal, tereyağı, taze ekmek", price: "125", num: "01" },
        { name: "Pancake", desc: "Üç katlı, maple syrup, taze meyveler, çırpılmış krema", price: "85", num: "02", star: true },
        { name: "Eggs Benedict", desc: "İngiliz muffin, jambon, poşe yumurta, hollandaise sos", price: "95", num: "03" },
        { name: "French Toast", desc: "Tarçınlı, vanilya dondurma, karamel sos", price: "80", num: "04" },
      ]
    },
    {
      name: "🍔 Hamburger",
      items: [
        { name: "Classic Cheeseburger", desc: "150gr dana köfte, cheddar, marul, domates, turşu, özel sos", price: "145", num: "05", star: true },
        { name: "Bacon Smash", desc: "Çift köfte, çıtır bacon, karamelize soğan, BBQ sos", price: "175", num: "06" },
        { name: "Mushroom Swiss", desc: "Sote mantar, İsviçre peyniri, truffle mayo", price: "165", num: "07" },
        { name: "Veggie Burger", desc: "Ev yapımı sebze köfte, avokado, humus, roka", price: "135", num: "08" },
      ]
    },
    {
      name: "🥤 İçecekler",
      items: [
        { name: "Milkshake", desc: "Çikolata, vanilya veya çilek — gerçek dondurma ile", price: "65", num: "09", star: true },
        { name: "Limonata", desc: "Taze sıkılmış, nane yaprakları, buz", price: "45", num: "10" },
        { name: "Root Beer Float", desc: "Klasik Amerikan root beer, vanilya dondurma", price: "55", num: "11" },
        { name: "Filtre Kahve", desc: "Sınırsız refill, günlük taze kavrulmuş", price: "35", num: "12" },
      ]
    }
  ];

  return (
    <div style={{
      fontFamily: "'Courier Prime', monospace",
      background: "#2B1F1A",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Passion+One:wght@400;700;900&family=Libre+Franklin:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .retro-tab {
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }
        .retro-tab:hover {
          background: #E8C547 !important;
          color: #2B1F1A !important;
        }
        
        .menu-row {
          transition: background 0.15s ease;
        }
        .menu-row:hover {
          background: rgba(232,197,71,0.06);
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px",
            background: "#E8C547", color: "#2B1F1A", fontSize: 11,
            fontFamily: "'Libre Franklin', sans-serif",
            fontWeight: 800, borderRadius: 100, letterSpacing: "0.05em"
          }}>RETRO / VİNTAGE TEMPLATE</span>
        </div>

        <div style={{
          background: "#3D2E25",
          borderRadius: 0,
          overflow: "hidden",
          border: "3px solid #E8C547",
          boxShadow: "0 0 0 6px #3D2E25, 0 0 0 8px #E8C547, 0 16px 48px rgba(0,0,0,0.4)"
        }}>
          {/* Header */}
          <div style={{
            padding: "40px 32px 28px",
            textAlign: "center",
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(232,197,71,0.03) 3px, rgba(232,197,71,0.03) 4px)",
            borderBottom: "2px dashed rgba(232,197,71,0.3)"
          }}>
            {/* Neon-style Title */}
            <div style={{
              fontFamily: "'Passion One', cursive",
              fontSize: 56, fontWeight: 900,
              color: "#E8C547",
              textShadow: "0 0 10px rgba(232,197,71,0.4), 0 0 30px rgba(232,197,71,0.15)",
              lineHeight: 1, marginBottom: 8,
              letterSpacing: "0.02em"
            }}>RUBY'S</div>
            
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.35em",
              color: "rgba(232,197,71,0.5)", textTransform: "uppercase"
            }}>★ DINER & GRILL ★ SINCE 1967 ★</div>
            
            {/* Decorative line */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, marginTop: 18
            }}>
              <div style={{ width: 50, height: 2, background: "rgba(232,197,71,0.25)" }} />
              <div style={{
                width: 10, height: 10, border: "2px solid rgba(232,197,71,0.4)",
                transform: "rotate(45deg)"
              }} />
              <div style={{ width: 50, height: 2, background: "rgba(232,197,71,0.25)" }} />
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: "flex", padding: "16px 20px",
            gap: 8, borderBottom: "1px solid rgba(232,197,71,0.15)"
          }}>
            {categories.map((cat, i) => (
              <button
                key={i}
                className="retro-tab"
                onClick={() => setActiveCategory(i)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 0,
                  background: activeCategory === i ? "#E8C547" : "transparent",
                  color: activeCategory === i ? "#2B1F1A" : "rgba(232,197,71,0.6)",
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: 12, fontWeight: 800,
                  border: activeCategory === i ? "none" : "1px solid rgba(232,197,71,0.2)",
                  letterSpacing: "0.05em"
                }}
              >{cat.name}</button>
            ))}
          </div>

          {/* Items */}
          <div style={{ padding: "12px 0" }}>
            {categories[activeCategory].items.map((item, i) => (
              <div
                key={i}
                className="menu-row"
                style={{ padding: "18px 28px" }}
              >
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 16
                }}>
                  {/* Number */}
                  <div style={{
                    fontFamily: "'Passion One', cursive",
                    fontSize: 32, fontWeight: 700,
                    color: "rgba(232,197,71,0.15)",
                    lineHeight: 1, minWidth: 36
                  }}>{item.num}</div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 6
                    }}>
                      <h3 style={{
                        fontFamily: "'Passion One', cursive",
                        fontSize: 20, fontWeight: 700,
                        color: "#F5E6C8", letterSpacing: "0.02em"
                      }}>{item.name}</h3>
                      {item.star && (
                        <span style={{
                          fontSize: 10, fontWeight: 800,
                          padding: "2px 8px",
                          background: "#E8C547", color: "#2B1F1A",
                          fontFamily: "'Libre Franklin', sans-serif",
                          letterSpacing: "0.05em"
                        }}>★ FAVORİ</span>
                      )}
                    </div>
                    <p style={{
                      fontSize: 13, color: "rgba(245,230,200,0.4)",
                      lineHeight: 1.5
                    }}>{item.desc}</p>
                  </div>

                  {/* Price */}
                  <div style={{
                    fontFamily: "'Passion One', cursive",
                    fontSize: 24, fontWeight: 700,
                    color: "#E8C547", whiteSpace: "nowrap"
                  }}>₺{item.price}</div>
                </div>

                {/* Divider */}
                {i < categories[activeCategory].items.length - 1 && (
                  <div style={{
                    borderBottom: "1px dashed rgba(232,197,71,0.1)",
                    marginTop: 18, marginLeft: 52
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div style={{
            margin: "8px 20px 20px",
            padding: "16px 20px",
            border: "1px dashed rgba(232,197,71,0.25)",
            textAlign: "center"
          }}>
            <p style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 10, fontWeight: 600,
              letterSpacing: "0.15em", color: "rgba(232,197,71,0.35)",
              textTransform: "uppercase"
            }}>
              "İyi yemek, iyi insanlar, iyi zamanlar"
            </p>
            <p style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: 11, color: "rgba(232,197,71,0.25)", marginTop: 6
            }}>
              Tüm fiyatlara KDV dahildir • Servis ücreti alınmamaktadır
            </p>
          </div>

          {/* Footer */}
          <div style={{
            padding: "14px 28px 18px",
            borderTop: "2px dashed rgba(232,197,71,0.15)",
            textAlign: "center"
          }}>
            <span style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 9, fontWeight: 600, letterSpacing: "0.15em",
              color: "rgba(232,197,71,0.2)", textTransform: "uppercase"
            }}>Powered by QRMenus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuRetroVintage;
