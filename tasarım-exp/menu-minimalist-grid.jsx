import { useState } from "react";

const MenuMinimalistGrid = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tümü" },
    { id: "coffee", name: "Kahveler" },
    { id: "cold", name: "Soğuk" },
    { id: "food", name: "Yemekler" },
    { id: "dessert", name: "Tatlılar" },
  ];

  const items = [
    { id: 1, cat: "coffee", name: "Espresso", desc: "Çift shot, yoğun krema", price: "40", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop", badges: [], color: "#8B6914" },
    { id: 2, cat: "coffee", name: "Pour Over", desc: "V60, tek origin Ethiopia", price: "75", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop", badges: ["Yeni"], color: "#B8860B" },
    { id: 3, cat: "coffee", name: "Flat White", desc: "Mikro köpük, çift shot", price: "65", image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop", badges: ["Popüler"], color: "#A0522D" },
    { id: 4, cat: "cold", name: "Cold Brew", desc: "18 saat demleme, buz üzeri", price: "70", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop", badges: [], color: "#2F4F4F" },
    { id: 5, cat: "cold", name: "Matcha Tonic", desc: "Matcha, tonik su, lime", price: "80", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=400&fit=crop", badges: ["Yeni"], color: "#2E8B57" },
    { id: 6, cat: "cold", name: "Açaí Bowl", desc: "Granola, muz, yaban mersini", price: "95", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop", badges: ["Popüler"], color: "#4B0082" },
    { id: 7, cat: "food", name: "Avocado Toast", desc: "Ekşi maya, poşe yumurta, chili", price: "85", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=400&fit=crop", badges: [], color: "#556B2F" },
    { id: 8, cat: "food", name: "Granola Bowl", desc: "Yoğurt, bal, mevsim meyve", price: "75", image: "https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?w=400&h=400&fit=crop", badges: [], color: "#CD853F" },
    { id: 9, cat: "dessert", name: "Tiramisu", desc: "Klasik İtalyan, mascarpone", price: "70", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop", badges: ["Şef Önerisi"], color: "#8B4513" },
    { id: 10, cat: "dessert", name: "Cookie", desc: "Çikolata parçalı, ılık servis", price: "35", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop", badges: [], color: "#D2691E" },
  ];

  const filtered = activeCategory === "all" ? items : items.filter(i => i.cat === activeCategory);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "#F7F7F5",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .grid-card {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .grid-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .grid-card:hover .card-img {
          transform: scale(1.08);
        }
        .card-img {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .filter-btn {
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          outline: none;
        }
        .filter-btn:hover {
          background: #1A1A1A !important;
          color: #fff !important;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .modal-bg { animation: fadeIn 0.2s ease; }
        .modal-card { animation: scaleUp 0.3s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px",
            background: "#1A1A1A", color: "#fff", fontSize: 11, fontWeight: 700,
            borderRadius: 100, letterSpacing: "0.05em"
          }}>MİNİMALİST GRİD TEMPLATE</span>
        </div>

        <div style={{
          background: "#FFFFFF",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)"
        }}>
          {/* Header */}
          <div style={{ padding: "36px 28px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#1A1A1A",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 18
              }}>ST</div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.03em" }}>
                  Stone Coffee
                </h1>
                <p style={{ fontSize: 12, color: "#999", fontWeight: 500 }}>Specialty Coffee & Brunch</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{
            display: "flex", gap: 6, padding: "0 28px 20px",
            overflowX: "auto"
          }}>
            {categories.map(c => (
              <button
                key={c.id}
                className="filter-btn"
                onClick={() => setActiveCategory(c.id)}
                style={{
                  padding: "8px 18px", borderRadius: 100,
                  background: activeCategory === c.id ? "#1A1A1A" : "#F0F0EE",
                  color: activeCategory === c.id ? "#fff" : "#666",
                  fontSize: 13, fontWeight: 600, whiteSpace: "nowrap"
                }}
              >{c.name}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            padding: "0 20px 24px"
          }}>
            {filtered.map(item => (
              <div
                key={item.id}
                className="grid-card"
                onClick={() => setSelectedItem(item)}
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#FAFAFA",
                  border: "1px solid rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ height: 150, overflow: "hidden", position: "relative" }}>
                  <img
                    className="card-img"
                    src={item.image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {item.badges.length > 0 && (
                    <div style={{ position: "absolute", top: 8, left: 8 }}>
                      {item.badges.map((b, i) => (
                        <span key={i} style={{
                          fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
                          background: "#fff", color: "#1A1A1A",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}>{b.toUpperCase()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ padding: "14px 14px 16px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 3 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 10, lineHeight: 1.4 }}>
                    {item.desc}
                  </div>
                  <div style={{
                    fontSize: 16, fontWeight: 800, color: "#1A1A1A"
                  }}>₺{item.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 28px 22px", borderTop: "1px solid #f5f5f3", textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "#ddd" }}>Powered by </span>
            <span style={{ fontSize: 11, color: "#bbb", fontWeight: 700 }}>QRMenus</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="modal-bg"
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, padding: 24
          }}
        >
          <div
            className="modal-card"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 24,
              width: "100%", maxWidth: 380, overflow: "hidden",
              boxShadow: "0 32px 64px rgba(0,0,0,0.15)"
            }}
          >
            <div style={{ height: 240, position: "relative" }}>
              <img src={selectedItem.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 34, height: 34, borderRadius: "50%",
                  background: "#fff", border: "none", cursor: "pointer",
                  fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
              >✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{selectedItem.name}</h3>
                  {selectedItem.badges.map((b, i) => (
                    <span key={i} style={{
                      display: "inline-block", marginTop: 6,
                      fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 6,
                      background: "#F0F0EE", color: "#666"
                    }}>{b.toUpperCase()}</span>
                  ))}
                </div>
                <span style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A" }}>₺{selectedItem.price}</span>
              </div>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginTop: 14 }}>{selectedItem.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuMinimalistGrid;
