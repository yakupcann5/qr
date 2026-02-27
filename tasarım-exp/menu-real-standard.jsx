import { useState, useRef, useEffect } from "react";

const MenuStandardList = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [lang, setLang] = useState("tr");
  const [langOpen, setLangOpen] = useState(false);
  const catRef = useRef(null);

  const langs = [
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
  ];

  const categories = [
    { name: "Kahvaltı", icon: "🍳" },
    { name: "Başlangıçlar", icon: "🥗" },
    { name: "Ana Yemekler", icon: "🍖" },
    { name: "Pizzalar", icon: "🍕" },
    { name: "Burgerler", icon: "🍔" },
    { name: "Tatlılar", icon: "🍰" },
    { name: "Sıcak İçecekler", icon: "☕" },
    { name: "Soğuk İçecekler", icon: "🧃" },
  ];

  const allItems = [
    // Kahvaltı
    { cat: 0, name: "Serpme Kahvaltı (2 Kişilik)", desc: "Peynir çeşitleri, zeytin, bal, kaymak, tereyağı, yumurta, reçel, taze ekmek", price: "450", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop", popular: true, tags: [] },
    { cat: 0, name: "Menemen", desc: "Domates, biber, yumurta, taze soğan", price: "120", image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=200&h=200&fit=crop", popular: false, tags: ["Vejetaryen"] },
    { cat: 0, name: "Sahanda Yumurta", desc: "Tereyağında, sucuklu veya kavurmalı seçenekli", price: "110", image: "", popular: false, tags: [] },
    { cat: 0, name: "Pancake", desc: "3 adet, akçaağaç şurubu, mevsim meyveleri", price: "95", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop", popular: true, tags: ["Vejetaryen"] },
    // Başlangıçlar
    { cat: 1, name: "Mercimek Çorbası", desc: "Kırmızı mercimek, limon, kızarmış ekmek", price: "65", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop", popular: true, tags: ["Vegan"] },
    { cat: 1, name: "Humus", desc: "Nohut ezmesi, zeytinyağı, kırmızı biber", price: "75", image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=200&h=200&fit=crop", popular: false, tags: ["Vegan", "Gluten-free"] },
    { cat: 1, name: "Sigara Böreği (4 adet)", desc: "El açması, beyaz peynir, maydanoz", price: "85", image: "", popular: false, tags: ["Vejetaryen"] },
    { cat: 1, name: "Karışık Salata", desc: "Roka, marul, domates, salatalık, nar ekşisi", price: "70", image: "", popular: false, tags: ["Vegan", "Gluten-free"] },
    // Ana Yemekler
    { cat: 2, name: "Izgara Köfte", desc: "Dana köfte, pilav, közlenmiş biber-domates", price: "185", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop", popular: true, tags: ["Gluten-free"] },
    { cat: 2, name: "Tavuk Şiş", desc: "Marine edilmiş tavuk, bulgur pilavı, yeşillik", price: "165", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=200&fit=crop", popular: false, tags: ["Gluten-free"] },
    { cat: 2, name: "Levrek Izgara", desc: "Taze levrek fileto, mevsim sebzeler, limon", price: "245", image: "", popular: false, tags: ["Gluten-free"] },
    { cat: 2, name: "Mantı", desc: "El yapımı, yoğurt, sarımsaklı tereyağı, sumak", price: "145", image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=200&h=200&fit=crop", popular: true, tags: [] },
    // Pizzalar
    { cat: 3, name: "Margarita", desc: "Domates sos, mozzarella, fesleğen", price: "135", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop", popular: false, tags: ["Vejetaryen"] },
    { cat: 3, name: "Karışık Pizza", desc: "Sucuk, sosis, mantar, biber, zeytin, mozzarella", price: "175", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop", popular: true, tags: [] },
    // Burgerler
    { cat: 4, name: "Klasik Burger", desc: "150gr dana köfte, cheddar, marul, domates, turşu, özel sos", price: "155", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop", popular: true, tags: [] },
    { cat: 4, name: "Tavuk Burger", desc: "Çıtır tavuk, coleslaw, ranch sos", price: "135", image: "", popular: false, tags: [] },
    // Tatlılar
    { cat: 5, name: "Künefe", desc: "Antep fıstıklı, dondurma eşliğinde", price: "110", image: "https://images.unsplash.com/photo-1579888944880-d98341245702?w=200&h=200&fit=crop", popular: true, tags: [] },
    { cat: 5, name: "Sütlaç", desc: "Fırında, tarçınlı", price: "65", image: "", popular: false, tags: ["Vejetaryen", "Gluten-free"] },
    // Sıcak İçecekler
    { cat: 6, name: "Türk Kahvesi", desc: "Orta, sade veya şekerli", price: "45", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop", popular: true, tags: [] },
    { cat: 6, name: "Latte", desc: "Espresso, buharlanmış süt", price: "70", image: "", popular: false, tags: [] },
    { cat: 6, name: "Çay", desc: "Rize çayı, bardak veya fincan", price: "25", image: "", popular: false, tags: [] },
    // Soğuk İçecekler
    { cat: 7, name: "Limonata", desc: "Ev yapımı, taze nane", price: "55", image: "", popular: false, tags: ["Vegan"] },
    { cat: 7, name: "Ayran", desc: "Ev yapımı, köpüklü", price: "30", image: "", popular: false, tags: ["Vejetaryen", "Gluten-free"] },
  ];

  const filteredItems = searchQuery
    ? allItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : allItems.filter(i => i.cat === activeCategory);

  const scrollToCategory = (idx) => {
    setActiveCategory(idx);
    setSearchQuery("");
    setSearchOpen(false);
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
        .item-row { transition: background 0.15s; }
        .item-row:active { background: rgba(0,0,0,0.02); }
        .cat-tab { transition: all 0.2s; cursor: pointer; white-space: nowrap; flex-shrink: 0; }
        .cat-tab::-webkit-scrollbar { display: none; }
        .search-input:focus { outline: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .modal-bg { animation: fadeIn 0.15s ease; }
        .modal-sheet { animation: slideUp 0.25s cubic-bezier(0.32,0.72,0,1); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480, background: "#fff", minHeight: "100vh", position: "relative" }}>
        
        {/* === STICKY HEADER === */}
        <div style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "#fff"
        }}>
          {/* Restaurant Info Bar */}
          <div style={{
            padding: "14px 16px 12px",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "#E8F5E9",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20
              }}>🍽️</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.01em" }}>Lezzet Durağı</div>
                <div style={{ fontSize: 12, color: "#999" }}>Kadıköy, İstanbul</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Search */}
              <button
                onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: searchOpen ? "#E8F5E9" : "#F5F5F5",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={searchOpen ? "#2E7D32" : "#666"} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              {/* Lang */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  style={{
                    height: 36, padding: "0 10px", borderRadius: 10,
                    background: "#F5F5F5", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 13, fontWeight: 600, color: "#666"
                  }}
                >
                  {langs.find(l => l.code === lang)?.flag} {lang.toUpperCase()}
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#999" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {langOpen && (
                  <div style={{
                    position: "absolute", top: 42, right: 0,
                    background: "#fff", borderRadius: 12, padding: 4,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #f0f0f0",
                    zIndex: 50, minWidth: 140
                  }}>
                    {langs.map(l => (
                      <div
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        style={{
                          padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 10,
                          background: lang === l.code ? "#E8F5E9" : "transparent",
                          fontSize: 14, fontWeight: lang === l.code ? 600 : 400,
                          color: lang === l.code ? "#2E7D32" : "#333"
                        }}
                      >
                        <span>{l.flag}</span> {l.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {searchOpen && (
            <div style={{ padding: "0 16px 10px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#F5F5F5", borderRadius: 10, padding: "0 12px"
              }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#999" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  className="search-input"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Menüde ara..."
                  style={{
                    flex: 1, padding: "11px 0", border: "none",
                    background: "transparent", fontSize: 14, color: "#333"
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{
                    background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 16
                  }}>✕</button>
                )}
              </div>
            </div>
          )}

          {/* Category Tabs (horizontal scroll) */}
          {!searchOpen && (
            <div
              ref={catRef}
              className="hide-scrollbar"
              style={{
                display: "flex", gap: 6, padding: "0 16px 12px",
                overflowX: "auto"
              }}
            >
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className="cat-tab"
                  onClick={() => scrollToCategory(i)}
                  style={{
                    padding: "7px 14px", borderRadius: 20,
                    background: activeCategory === i ? "#2E7D32" : "#F5F5F5",
                    color: activeCategory === i ? "#fff" : "#555",
                    fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 5
                  }}
                >
                  <span style={{ fontSize: 14 }}>{cat.icon}</span>
                  {cat.name}
                </div>
              ))}
            </div>
          )}

          <div style={{ height: 1, background: "#F0F0F0" }} />
        </div>

        {/* === MENU ITEMS === */}
        <div style={{ padding: "8px 0" }}>
          {searchQuery && (
            <div style={{ padding: "8px 16px 4px", fontSize: 13, color: "#999" }}>
              "{searchQuery}" için {filteredItems.length} sonuç
            </div>
          )}

          {filteredItems.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 14 }}>Sonuç bulunamadı</div>
            </div>
          )}

          {filteredItems.map((item, i) => (
            <div
              key={i}
              className="item-row"
              onClick={() => setSelectedItem(item)}
              style={{
                display: "flex", gap: 12, padding: "12px 16px",
                cursor: "pointer", borderBottom: "1px solid #F5F5F5"
              }}
            >
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{item.name}</span>
                  {item.popular && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                      background: "#FFF3E0", color: "#E65100"
                    }}>Popüler</span>
                  )}
                </div>
                <p style={{
                  fontSize: 13, color: "#888", lineHeight: 1.45,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  overflow: "hidden", marginBottom: 6
                }}>{item.desc}</p>
                
                {/* Tags */}
                {item.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {item.tags.map((t, ti) => (
                      <span key={ti} style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                        background: t === "Vegan" ? "#E8F5E9" : t === "Vejetaryen" ? "#F3E5F5" : "#E3F2FD",
                        color: t === "Vegan" ? "#2E7D32" : t === "Vejetaryen" ? "#7B1FA2" : "#1565C0"
                      }}>{t}</span>
                    ))}
                  </div>
                )}
                
                <div style={{ fontSize: 16, fontWeight: 700, color: "#2E7D32" }}>₺{item.price}</div>
              </div>

              {/* Image */}
              {item.image ? (
                <div style={{
                  width: 88, height: 88, borderRadius: 12,
                  overflow: "hidden", flexShrink: 0
                }}>
                  <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{
                  width: 88, height: 88, borderRadius: 12, flexShrink: 0,
                  background: "#F9F9F9", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{ fontSize: 32, opacity: 0.3 }}>{categories[item.cat]?.icon}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp / Call Banner */}
        <div style={{
          margin: "8px 16px 16px",
          padding: "14px 16px",
          background: "#F5F5F5",
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: 13, color: "#666" }}>Sipariş veya soru için</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              padding: "8px 14px", borderRadius: 8,
              background: "#25D366", color: "#fff", border: "none",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.34 0-4.512-.654-6.373-1.788l-.457-.275-3.17 1.063 1.063-3.17-.275-.457A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp
            </button>
            <button style={{
              padding: "8px 14px", borderRadius: 8,
              background: "#fff", color: "#666", border: "1px solid #E0E0E0",
              fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}>📞 Ara</button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px", textAlign: "center",
          borderTop: "1px solid #F0F0F0"
        }}>
          <div style={{ fontSize: 10, color: "#ccc", fontWeight: 600, letterSpacing: "0.05em" }}>
            Powered by QRMenus
          </div>
        </div>

        {/* === ITEM DETAIL BOTTOM SHEET === */}
        {selectedItem && (
          <div
            className="modal-bg"
            onClick={() => setSelectedItem(null)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.35)",
              zIndex: 100, display: "flex",
              alignItems: "flex-end", justifyContent: "center"
            }}
          >
            <div
              className="modal-sheet"
              onClick={e => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: "20px 20px 0 0",
                width: "100%", maxWidth: 480,
                maxHeight: "85vh", overflow: "auto"
              }}
            >
              {/* Handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0E0E0" }} />
              </div>

              {selectedItem.image && (
                <div style={{ height: 220, margin: "8px 16px 0", borderRadius: 16, overflow: "hidden" }}>
                  <img src={selectedItem.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}

              <div style={{ padding: "16px 20px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{selectedItem.name}</h3>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {selectedItem.popular && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#FFF3E0", color: "#E65100" }}>Popüler</span>
                      )}
                      {selectedItem.tags.map((t, i) => (
                        <span key={i} style={{
                          fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                          background: t === "Vegan" ? "#E8F5E9" : t === "Vejetaryen" ? "#F3E5F5" : "#E3F2FD",
                          color: t === "Vegan" ? "#2E7D32" : t === "Vejetaryen" ? "#7B1FA2" : "#1565C0"
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#2E7D32" }}>₺{selectedItem.price}</span>
                </div>

                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginTop: 12 }}>{selectedItem.desc}</p>

                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    width: "100%", marginTop: 20, padding: 14, borderRadius: 12,
                    background: "#F5F5F5", color: "#666", border: "none",
                    fontSize: 14, fontWeight: 600, cursor: "pointer"
                  }}
                >Kapat</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuStandardList;
