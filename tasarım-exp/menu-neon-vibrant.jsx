import { useState } from "react";

const MenuNeonVibrant = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    {
      name: "Bowls",
      emoji: "🥗",
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
      items: [
        { name: "Açaí Power", desc: "Açaí, granola, muz, çilek, hindistan cevizi, bal", price: "95", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=300&fit=crop", tag: "EN SEVİLEN", tagColor: "#FF6B6B" },
        { name: "Green Machine", desc: "Avokado, kinoa, edamame, ıspanak, susam dressingi", price: "105", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop", tag: "VEG", tagColor: "#4ADE80" },
        { name: "Protein Boost", desc: "Tavuk, bulgur, avokado, kiraz domates, yumurta", price: "115", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop", tag: "", tagColor: "" },
      ]
    },
    {
      name: "Smoothies",
      emoji: "🧃",
      gradient: "linear-gradient(135deg, #A78BFA, #818CF8)",
      items: [
        { name: "Berry Blast", desc: "Böğürtlen, yaban mersini, çilek, muz, yulaf sütü", price: "65", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=300&fit=crop", tag: "YENİ", tagColor: "#A78BFA" },
        { name: "Tropical Sun", desc: "Mango, ananas, passion fruit, hindistan cevizi suyu", price: "70", image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&h=300&fit=crop", tag: "EN SEVİLEN", tagColor: "#FF6B6B" },
        { name: "Green Detox", desc: "Elma, zencefil, ıspanak, salatalık, nane, limon", price: "60", image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300&h=300&fit=crop", tag: "", tagColor: "" },
      ]
    },
    {
      name: "Bites",
      emoji: "🌮",
      gradient: "linear-gradient(135deg, #FBBF24, #F59E0B)",
      items: [
        { name: "Loaded Nachos", desc: "Tortilla, guacamole, salsa, jalapeno, ekşi krema", price: "85", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=300&fit=crop", tag: "PAYLAŞIMLIK", tagColor: "#FBBF24" },
        { name: "Chicken Wings", desc: "Çıtır kanat (6 adet), buffalo veya bal-hardal sos", price: "95", image: "https://images.unsplash.com/photo-1527477396000-e27163b4d6e7?w=300&h=300&fit=crop", tag: "EN SEVİLEN", tagColor: "#FF6B6B" },
        { name: "Falafel Wrap", desc: "Ev yapımı falafel, humus, taze sebzeler, tahin sos", price: "80", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&h=300&fit=crop", tag: "VEG", tagColor: "#4ADE80" },
      ]
    }
  ];

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "#0A0A0A",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .neon-card {
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer;
        }
        .neon-card:hover {
          transform: translateX(4px);
          background: rgba(255,255,255,0.06) !important;
        }
        .neon-card:active {
          transform: scale(0.98);
        }
        
        .cat-btn {
          transition: all 0.25s ease;
          cursor: pointer;
          border: none;
        }
        .cat-btn:hover {
          transform: scale(1.05);
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,107,107,0.15); }
          50% { box-shadow: 0 0 30px rgba(255,107,107,0.25); }
        }
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-bg { animation: fadeIn 0.2s ease; }
        .modal-body { animation: slideUp 0.3s ease; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px",
            background: "linear-gradient(135deg, #FF6B6B, #A78BFA)",
            color: "#fff", fontSize: 11,
            fontWeight: 800, borderRadius: 100, letterSpacing: "0.05em"
          }}>NEON / CANLI RENKLER TEMPLATE</span>
        </div>

        <div style={{
          background: "#111111",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.04)"
        }}>
          {/* Header */}
          <div style={{
            padding: "32px 24px 24px",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Gradient blur bg */}
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,107,107,0.12), transparent 70%)",
              filter: "blur(30px)"
            }} />
            <div style={{
              position: "absolute", top: -20, left: -60,
              width: 160, height: 160, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)",
              filter: "blur(30px)"
            }} />

            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-block", padding: "4px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                fontFamily: "'Space Mono', monospace",
                fontSize: 10, color: "rgba(255,255,255,0.35)",
                marginBottom: 14, fontWeight: 700
              }}>📍 Kadıköy, İstanbul</div>
              
              <h1 style={{
                fontSize: 34, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6
              }}>
                Fuel <span style={{
                  background: "linear-gradient(135deg, #FF6B6B, #FF8E53, #FBBF24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>Kitchen</span>
              </h1>
              <p style={{
                fontSize: 13, color: "rgba(255,255,255,0.35)",
                fontWeight: 500
              }}>Fresh • Healthy • Delicious</p>
            </div>
          </div>

          {/* Category Buttons */}
          <div style={{
            display: "flex", gap: 10, padding: "0 24px 20px",
            overflowX: "auto"
          }}>
            {categories.map((cat, i) => (
              <button
                key={i}
                className="cat-btn"
                onClick={() => setActiveCategory(i)}
                style={{
                  padding: "10px 20px", borderRadius: 14,
                  background: activeCategory === i ? cat.gradient : "rgba(255,255,255,0.04)",
                  color: activeCategory === i ? "#fff" : "rgba(255,255,255,0.4)",
                  fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
                  boxShadow: activeCategory === i ? `0 4px 16px ${cat.gradient.includes("FF6B6B") ? "rgba(255,107,107,0.25)" : cat.gradient.includes("A78BFA") ? "rgba(167,139,250,0.25)" : "rgba(251,191,36,0.25)"}` : "none"
                }}
              >{cat.emoji} {cat.name}</button>
            ))}
          </div>

          {/* Items List */}
          <div style={{ padding: "0 16px 16px" }}>
            {categories[activeCategory].items.map((item, i) => (
              <div
                key={i}
                className="neon-card"
                onClick={() => setSelectedItem({ ...item, gradient: categories[activeCategory].gradient })}
                style={{
                  display: "flex", gap: 14, padding: 12,
                  borderRadius: 18, marginBottom: 8,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  animation: `slideIn 0.3s ease ${i * 0.08}s both`
                }}
              >
                {/* Image */}
                <div style={{
                  width: 88, height: 88, borderRadius: 14,
                  overflow: "hidden", flexShrink: 0,
                  position: "relative"
                }}>
                  <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {item.tag && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "3px 0", textAlign: "center",
                      background: item.tagColor, color: "#fff",
                      fontSize: 8, fontWeight: 800, letterSpacing: "0.08em"
                    }}>{item.tag}</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.01em" }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.5, marginBottom: 8 }}>
                    {item.desc}
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "4px 12px", borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    alignSelf: "flex-start"
                  }}>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 15, fontWeight: 700, color: "#fff"
                    }}>₺{item.price}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{
                  display: "flex", alignItems: "center", padding: "0 4px"
                }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.15)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Fun banner */}
          <div style={{
            margin: "4px 16px 16px", padding: "16px 20px",
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(255,107,107,0.08), rgba(167,139,250,0.08))",
            border: "1px solid rgba(255,255,255,0.04)",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <span style={{ fontSize: 28 }}>🎉</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Happy Hour!</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>16:00–18:00 arası tüm smoothie'lerde %20 indirim</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: "16px 24px 22px", textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.04)"
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10, color: "rgba(255,255,255,0.12)", fontWeight: 700
            }}>Powered by QRMenus</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="modal-bg"
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            zIndex: 100, padding: 16
          }}
        >
          <div
            className="modal-body"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#1A1A1A", borderRadius: 24,
              width: "100%", maxWidth: 480, overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            {/* Image */}
            <div style={{ height: 220, position: "relative" }}>
              <img src={selectedItem.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, #1A1A1A 5%, transparent 50%)"
              }} />
              {selectedItem.tag && (
                <div style={{
                  position: "absolute", top: 16, left: 16,
                  padding: "5px 14px", borderRadius: 8,
                  background: selectedItem.tagColor, color: "#fff",
                  fontSize: 11, fontWeight: 800
                }}>{selectedItem.tag}</div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  width: 36, height: 36, borderRadius: 12,
                  background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
                  border: "none", cursor: "pointer", color: "#fff", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >✕</button>
            </div>

            <div style={{ padding: "8px 24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                  {selectedItem.name}
                </h3>
                <div style={{
                  padding: "6px 16px", borderRadius: 10,
                  background: selectedItem.gradient,
                  boxShadow: "0 4px 16px rgba(255,107,107,0.2)"
                }}>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 18, fontWeight: 700, color: "#fff"
                  }}>₺{selectedItem.price}</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                {selectedItem.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuNeonVibrant;
