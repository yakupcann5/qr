import { useState } from "react";

const MenuClassic = () => {
  const [selectedLang, setSelectedLang] = useState("tr");
  
  const categories = [
    {
      name: "Sıcak İçecekler",
      items: [
        { name: "Türk Kahvesi", desc: "Geleneksel köpüklü Türk kahvesi", price: "45" },
        { name: "Latte", desc: "Espresso ve buharlanmış süt", price: "65" },
        { name: "Cappuccino", desc: "Espresso, süt köpüğü", price: "60" },
        { name: "Filtre Kahve", desc: "Günlük taze filtre", price: "50" },
        { name: "Sıcak Çikolata", desc: "Belçika çikolatası ile", price: "55" },
        { name: "Çay", desc: "Demlenmiş Rize çayı", price: "20" },
      ]
    },
    {
      name: "Soğuk İçecekler",
      items: [
        { name: "Ice Latte", desc: "Soğuk espresso ve süt", price: "70" },
        { name: "Limonata", desc: "Taze sıkılmış ev yapımı", price: "45" },
        { name: "Smoothie", desc: "Mevsim meyveleri ile", price: "55" },
      ]
    },
    {
      name: "Tatlılar",
      items: [
        { name: "Künefe", desc: "Hatay usulü, kaymak peynirli", price: "95" },
        { name: "Sütlaç", desc: "Fırında fıstıklı", price: "55" },
        { name: "Cheesecake", desc: "New York usulü", price: "75" },
        { name: "Brownie", desc: "Sıcak, dondurma eşliğinde", price: "65" },
      ]
    }
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#F8F6F3",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px",
            background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 700,
            borderRadius: 100, letterSpacing: "0.05em"
          }}>BAŞLANGIÇ TEMPLATE — Görsel Yok, Tek Dil</span>
        </div>

        {/* Menu Container */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)"
        }}>
          {/* Header */}
          <div style={{
            padding: "36px 28px 28px",
            textAlign: "center",
            borderBottom: "1px solid #f0ece6"
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "#1A1A1A",
              margin: "0 auto 14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 26,
              fontFamily: "'Playfair Display', serif"
            }}>C</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 24, fontWeight: 700, color: "#1A1A1A",
              marginBottom: 4
            }}>Café Istanbul</h1>
            <p style={{ fontSize: 13, color: "#999" }}>Geleneksel lezzetler, modern sunum</p>
          </div>

          {/* Menu Content */}
          <div style={{ padding: "8px 0" }}>
            {categories.map((cat, ci) => (
              <div key={ci} style={{ padding: "24px 28px" }}>
                {/* Category Header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  marginBottom: 16
                }}>
                  <h2 style={{
                    fontSize: 13, fontWeight: 700,
                    color: "#1A1A1A",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap"
                  }}>{cat.name}</h2>
                  <div style={{ flex: 1, height: 1, background: "#f0ece6" }} />
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {cat.items.map((item, ii) => (
                    <div key={ii} style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start",
                      padding: "14px 0",
                      borderBottom: ii < cat.items.length - 1 ? "1px solid #f8f5f0" : "none"
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 15, fontWeight: 600, color: "#1A1A1A",
                          marginBottom: 3
                        }}>{item.name}</div>
                        <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.4 }}>{item.desc}</div>
                      </div>
                      <div style={{
                        fontSize: 15, fontWeight: 700, color: "#1A1A1A",
                        marginLeft: 16, whiteSpace: "nowrap"
                      }}>₺{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: "20px 28px",
            borderTop: "1px solid #f0ece6",
            textAlign: "center"
          }}>
            <span style={{ fontSize: 11, color: "#ccc" }}>Powered by </span>
            <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>QRMenus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuClassic;
