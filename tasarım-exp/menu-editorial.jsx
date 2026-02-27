import { useState } from "react";

const MenuEditorial = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const sections = [
    {
      title: "Pour commencer",
      subtitle: "Başlangıçlar",
      items: [
        { name: "Mevsim Çorbası", desc: "Günlük taze hazırlanan mevsim sebze çorbası, kızarmış ekmek eşliğinde", price: "55", featured: false },
        { name: "Burrata", desc: "Taze burrata, kiraz domates, fesleğen pesto, ekstra sızma zeytinyağı", price: "120", featured: true, image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&h=350&fit=crop" },
        { name: "Keçi Peyniri Salatası", desc: "Roka, ceviz, nar, bal-hardal vinegret", price: "95", featured: false },
        { name: "Karides Sote", desc: "Sarımsak tereyağında, taze maydanoz, limon", price: "135", featured: false },
      ]
    },
    {
      title: "Plats principaux",
      subtitle: "Ana Yemekler",
      items: [
        { name: "Bonfile", desc: "250gr Black Angus, trüf püresi, mevsim sebze, jus sos. Pişirme derecenizi belirtiniz.", price: "385", featured: true, image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500&h=350&fit=crop" },
        { name: "Levrek", desc: "Tuzda pişirilmiş levrek, enginar, kapari, beurre blanc", price: "265", featured: false },
        { name: "Kuzu Pirzola", desc: "Fırında kuşkonmaz, biberiye jus, patates graten", price: "320", featured: false },
        { name: "Risotto ai Funghi", desc: "Porcini mantarı, parmesan, trüf yağı, mikroyeşillik", price: "185", featured: true, image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=350&fit=crop" },
      ]
    },
    {
      title: "Pour finir",
      subtitle: "Tatlılar",
      items: [
        { name: "Sufle", desc: "Sıcak çikolatalı sufle, vanilya dondurma. Hazırlama süresi 15 dakikadır.", price: "95", featured: false },
        { name: "Crème Brûlée", desc: "Klasik Fransız tarifi, karamelize şeker kabuğu", price: "80", featured: false },
        { name: "Peynir Tabağı", desc: "Seçilmiş Avrupa peynirleri, bal, ceviz, üzüm", price: "145", featured: true, image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500&h=350&fit=crop" },
      ]
    }
  ];

  return (
    <div style={{
      fontFamily: "'EB Garamond', Georgia, serif",
      background: "#F5F0E8",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Libre+Franklin:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .editorial-item {
          transition: all 0.2s ease;
          cursor: default;
        }
        .editorial-featured {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .editorial-featured:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08);
        }
        .editorial-featured:hover .featured-img {
          transform: scale(1.03);
        }
        .featured-img {
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-bg { animation: fadeIn 0.2s ease; }
        .modal-body { animation: slideUp 0.3s ease; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{
            display: "inline-block", padding: "4px 14px",
            background: "#2C1810", color: "#F5E6D3", fontSize: 11,
            fontFamily: "'Libre Franklin', sans-serif",
            fontWeight: 700, borderRadius: 100, letterSpacing: "0.05em"
          }}>MAGAZİN / EDİTORYAL TEMPLATE</span>
        </div>

        <div style={{
          background: "#FFFCF7",
          borderRadius: 0,
          overflow: "hidden",
          boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)"
        }}>
          {/* Masthead */}
          <div style={{
            padding: "48px 36px 36px",
            textAlign: "center",
            borderBottom: "2px solid #1A1A1A"
          }}>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.35em",
              color: "#999", marginBottom: 16, textTransform: "uppercase"
            }}>Est. 2018 — İstanbul</div>
            
            <h1 style={{
              fontSize: 52, fontWeight: 400, color: "#1A1A1A",
              letterSpacing: "-0.02em", lineHeight: 1,
              fontStyle: "italic"
            }}>Maison</h1>
            
            <div style={{
              width: 40, height: 1, background: "#1A1A1A",
              margin: "16px auto"
            }} />
            
            <p style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 10, fontWeight: 600, letterSpacing: "0.25em",
              color: "#888", textTransform: "uppercase"
            }}>Brasserie & Bar à Vins</p>
          </div>

          {/* Decorative Rule */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "14px 36px", gap: 12
          }}>
            <div style={{ flex: 1, height: 1, background: "#e8e0d4" }} />
            <span style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: "#bbb"
            }}>MENÜ</span>
            <div style={{ flex: 1, height: 1, background: "#e8e0d4" }} />
          </div>

          {/* Sections */}
          {sections.map((section, si) => (
            <div key={si} style={{ padding: "24px 36px 36px" }}>
              {/* Section Header */}
              <div style={{ marginBottom: 28, textAlign: "center" }}>
                <h2 style={{
                  fontSize: 32, fontWeight: 400, color: "#1A1A1A",
                  fontStyle: "italic", marginBottom: 4
                }}>{section.title}</h2>
                <span style={{
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.2em",
                  color: "#aaa", textTransform: "uppercase"
                }}>{section.subtitle}</span>
              </div>

              {/* Items */}
              {section.items.map((item, ii) => (
                item.featured ? (
                  /* Featured Item — with image */
                  <div
                    key={ii}
                    className="editorial-featured"
                    onClick={() => setSelectedItem(item)}
                    style={{
                      marginBottom: 24,
                      borderRadius: 4,
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.06)"
                    }}
                  >
                    <div style={{ height: 200, overflow: "hidden" }}>
                      <img
                        className="featured-img"
                        src={item.image}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "20px 22px" }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "baseline", marginBottom: 8
                      }}>
                        <h3 style={{ fontSize: 22, fontWeight: 600, color: "#1A1A1A" }}>{item.name}</h3>
                        <span style={{
                          fontFamily: "'Libre Franklin', sans-serif",
                          fontSize: 16, fontWeight: 700, color: "#1A1A1A"
                        }}>₺{item.price}</span>
                      </div>
                      <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, fontStyle: "italic" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Regular Item — text only */
                  <div
                    key={ii}
                    className="editorial-item"
                    style={{
                      padding: "16px 0",
                      borderBottom: ii < section.items.length - 1 ? "1px solid #f0ece4" : "none"
                    }}
                  >
                    <div style={{
                      display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6
                    }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A" }}>{item.name}</h3>
                      <div style={{
                        flex: 1, borderBottom: "1px dotted #ccc",
                        marginBottom: 4
                      }} />
                      <span style={{
                        fontFamily: "'Libre Franklin', sans-serif",
                        fontSize: 15, fontWeight: 700, color: "#1A1A1A"
                      }}>₺{item.price}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#999", lineHeight: 1.6, fontStyle: "italic", maxWidth: "85%" }}>
                      {item.desc}
                    </p>
                  </div>
                )
              ))}

              {/* Section Divider */}
              {si < sections.length - 1 && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "24px 0 0", gap: 16
                }}>
                  <div style={{ width: 60, height: 1, background: "#e0d8c8" }} />
                  <span style={{ fontSize: 16, color: "#ccc" }}>✦</span>
                  <div style={{ width: 60, height: 1, background: "#e0d8c8" }} />
                </div>
              )}
            </div>
          ))}

          {/* Wine Note */}
          <div style={{
            margin: "0 36px",
            padding: "20px 24px",
            background: "#FAF6EE",
            borderRadius: 4,
            border: "1px solid #ece4d4",
            marginBottom: 32,
            textAlign: "center"
          }}>
            <p style={{
              fontSize: 12, color: "#999",
              fontFamily: "'Libre Franklin', sans-serif",
              fontWeight: 500, letterSpacing: "0.02em", lineHeight: 1.7
            }}>
              Şef menüsü ve şarap eşleştirmesi için lütfen garsonunuzdan bilgi alınız.<br />
              Tüm fiyatlara KDV dahildir.
            </p>
          </div>

          {/* Footer */}
          <div style={{
            padding: "20px 36px 28px",
            borderTop: "2px solid #1A1A1A",
            textAlign: "center"
          }}>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 9, fontWeight: 600, letterSpacing: "0.2em",
              color: "#ccc", textTransform: "uppercase"
            }}>Powered by QRMenus</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEditorial;
