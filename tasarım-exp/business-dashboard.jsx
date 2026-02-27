import { useState } from "react";

const BusinessDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const bg = darkMode ? "#0F0F0F" : "#FAFAF8";
  const cardBg = darkMode ? "#1A1A1A" : "#FFFFFF";
  const textPrimary = darkMode ? "#F5F5F5" : "#1A1A1A";
  const textSecondary = darkMode ? "#888" : "#888";
  const textMuted = darkMode ? "#555" : "#bbb";
  const borderColor = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const sidebarBg = darkMode ? "#141414" : "#FFFFFF";
  const hoverBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const accent = "#16A34A";

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "menu", icon: "🍽️", label: "Menü Yönetimi" },
    { id: "branding", icon: "🎨", label: "Branding" },
    { id: "qr", icon: "📱", label: "QR Kod" },
    { id: "languages", icon: "🌍", label: "Diller" },
    { id: "subscription", icon: "📦", label: "Abonelik" },
    { id: "payments", icon: "💳", label: "Ödemeler" },
    { id: "settings", icon: "⚙️", label: "Ayarlar" },
  ];

  const categories = [
    { name: "Sıcak İçecekler", count: 6, active: true },
    { name: "Soğuk İçecekler", count: 4, active: true },
    { name: "Tatlılar", count: 5, active: true },
    { name: "Kahvaltı", count: 3, active: false },
  ];

  const products = [
    [
      { name: "Türk Kahvesi", price: "45₺", active: true, badges: ["Popüler"], hasImage: true },
      { name: "Latte", price: "65₺", active: true, badges: [], hasImage: true },
      { name: "Cappuccino", price: "60₺", active: true, badges: ["Yeni"], hasImage: true },
      { name: "Filtre Kahve", price: "50₺", active: true, badges: [], hasImage: false },
      { name: "Sıcak Çikolata", price: "55₺", active: false, badges: [], hasImage: true },
      { name: "Çay", price: "20₺", active: true, badges: [], hasImage: false },
    ],
    [
      { name: "Ice Latte", price: "70₺", active: true, badges: [], hasImage: true },
      { name: "Limonata", price: "45₺", active: true, badges: ["Popüler"], hasImage: true },
      { name: "Smoothie", price: "55₺", active: true, badges: [], hasImage: true },
      { name: "Milkshake", price: "60₺", active: false, badges: [], hasImage: false },
    ],
    [],
    []
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: bg,
      minHeight: "100vh",
      display: "flex",
      color: textPrimary,
      transition: "all 0.3s ease"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .nav-item { transition: all 0.15s ease; cursor: pointer; }
        .nav-item:hover { background: ${hoverBg}; }
        .action-btn { transition: all 0.2s ease; cursor: pointer; }
        .action-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22,163,74,0.2); }
        .toggle-track { transition: all 0.2s ease; cursor: pointer; }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .drag-handle { cursor: grab; opacity: 0.3; }
        .drag-handle:hover { opacity: 0.7; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? 72 : 240,
        background: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0, overflow: "hidden"
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? "20px 16px" : "20px 20px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: `1px solid ${borderColor}`,
          height: 68, overflow: "hidden"
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #166534, #22c55e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 16
          }}>Q</div>
          {!sidebarCollapsed && (
            <span style={{ fontWeight: 700, fontSize: 17, whiteSpace: "nowrap" }}>QRMenus</span>
          )}
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => (
            <div
              key={item.id}
              className="nav-item"
              onClick={() => setView(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: sidebarCollapsed ? "11px 16px" : "11px 14px",
                borderRadius: 10, marginBottom: 2,
                background: view === item.id ? (darkMode ? "rgba(22,163,74,0.1)" : "#f0fdf4") : "transparent",
                color: view === item.id ? accent : textSecondary,
                borderLeft: view === item.id ? `3px solid ${accent}` : "3px solid transparent",
                fontSize: 14, fontWeight: view === item.id ? 600 : 500,
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                position: "relative"
              }}
              title={sidebarCollapsed ? item.label : ""}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </div>
          ))}
        </div>

        {/* Collapse Button */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${borderColor}` }}>
          <div
            className="nav-item"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              display: "flex", alignItems: "center", justifyContent: sidebarCollapsed ? "center" : "flex-start",
              gap: 12, padding: "10px 14px", borderRadius: 10,
              color: textMuted, fontSize: 13, fontWeight: 500
            }}
          >
            <span style={{ fontSize: 16, transform: sidebarCollapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>◀</span>
            {!sidebarCollapsed && <span>Daralt</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          height: 68, padding: "0 28px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: sidebarBg
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>
            {view === "dashboard" ? "Dashboard" : view === "menu" ? "Menü Yönetimi" : navItems.find(n => n.id === view)?.label}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Theme Toggle */}
            <div
              className="toggle-track"
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: darkMode ? "#333" : "#e5e5e5",
                position: "relative", padding: 2
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: darkMode ? "#D4A76A" : "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transform: darkMode ? "translateX(20px)" : "translateX(0)",
                transition: "transform 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10
              }}>
                {darkMode ? "🌙" : "☀️"}
              </div>
            </div>
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${accent}, #22c55e)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
            }}>AK</div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>

          {/* ===== DASHBOARD VIEW ===== */}
          {view === "dashboard" && (
            <div>
              {/* Welcome */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Hoş geldiniz, Ahmet! 👋</h2>
                <p style={{ fontSize: 14, color: textSecondary }}>Café Istanbul paneline hoş geldiniz</p>
              </div>

              {/* Subscription Card */}
              <div style={{
                padding: 24, borderRadius: 16,
                background: `linear-gradient(135deg, ${darkMode ? "#0f2e1a" : "#f0fdf4"}, ${darkMode ? "#1a1a1a" : "#fff"})`,
                border: `1px solid ${darkMode ? "rgba(22,163,74,0.2)" : "#bbf7d0"}`,
                marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                      background: "rgba(22,163,74,0.1)", color: accent
                    }}>PROFESYONEL</span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                      background: "#DBEAFE", color: "#1E40AF"
                    }}>DENEME</span>
                  </div>
                  <p style={{ fontSize: 14, color: textSecondary }}>Deneme süreniz <strong style={{ color: accent }}>9 gün</strong> sonra bitiyor</p>
                  <div style={{
                    width: 200, height: 4, borderRadius: 2, background: darkMode ? "#333" : "#e5e5e5",
                    marginTop: 8, overflow: "hidden"
                  }}>
                    <div style={{ width: "36%", height: "100%", borderRadius: 2, background: accent }} />
                  </div>
                </div>
                <button className="action-btn" style={{
                  padding: "10px 20px", borderRadius: 10,
                  background: accent, color: "#fff", border: "none",
                  fontSize: 13, fontWeight: 600
                }}>Hemen Abone Ol</button>
              </div>

              {/* Quick Access Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: "🍽️", title: "Menü Yönetimi", subtitle: "4 kategori, 18 ürün", target: "menu" },
                  { icon: "📱", title: "QR Kodunu İndir", subtitle: "PNG veya SVG", target: "qr" },
                  { icon: "👁️", title: "Menüyü Görüntüle", subtitle: "qrmenus.com/menu/cafe-istanbul", target: "preview" },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="card-hover"
                    onClick={() => card.target !== "preview" && setView(card.target)}
                    style={{
                      padding: 22, borderRadius: 16,
                      background: cardBg,
                      border: `1px solid ${borderColor}`,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{card.title}</div>
                    <div style={{ fontSize: 12, color: textSecondary }}>{card.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== MENU MANAGEMENT VIEW ===== */}
          {view === "menu" && (
            <div style={{ display: "flex", gap: 24, height: "calc(100vh - 164px)" }}>
              {/* Left Panel — Categories */}
              <div style={{
                width: 280, flexShrink: 0,
                background: cardBg, borderRadius: 16,
                border: `1px solid ${borderColor}`,
                display: "flex", flexDirection: "column", overflow: "hidden"
              }}>
                <div style={{
                  padding: "18px 18px 14px",
                  borderBottom: `1px solid ${borderColor}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Kategoriler</span>
                  <button className="action-btn" style={{
                    padding: "6px 12px", borderRadius: 8,
                    background: accent, color: "#fff", border: "none",
                    fontSize: 12, fontWeight: 600
                  }}>+ Yeni</button>
                </div>

                <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
                  {categories.map((cat, i) => (
                    <div
                      key={i}
                      className="nav-item"
                      onClick={() => setActiveCategory(i)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 12px", borderRadius: 10, marginBottom: 2,
                        background: activeCategory === i ? (darkMode ? "rgba(22,163,74,0.08)" : "#f0fdf4") : "transparent",
                        border: activeCategory === i ? `1px solid ${darkMode ? "rgba(22,163,74,0.2)" : "#bbf7d0"}` : "1px solid transparent"
                      }}
                    >
                      <span className="drag-handle" style={{ fontSize: 14 }}>⠿</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 600,
                          color: cat.active ? textPrimary : textMuted,
                          textDecoration: !cat.active ? "line-through" : "none"
                        }}>{cat.name}</div>
                        <div style={{ fontSize: 11, color: textSecondary }}>{cat.count} ürün</div>
                      </div>
                      {/* Toggle */}
                      <div
                        className="toggle-track"
                        style={{
                          width: 36, height: 20, borderRadius: 10,
                          background: cat.active ? accent : (darkMode ? "#333" : "#ddd"),
                          position: "relative", padding: 2
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: "50%", background: "#fff",
                          transform: cat.active ? "translateX(16px)" : "translateX(0)",
                          transition: "transform 0.2s ease",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.15)"
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel — Products */}
              <div style={{
                flex: 1,
                background: cardBg, borderRadius: 16,
                border: `1px solid ${borderColor}`,
                display: "flex", flexDirection: "column", overflow: "hidden"
              }}>
                <div style={{
                  padding: "18px 18px 14px",
                  borderBottom: `1px solid ${borderColor}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>
                    {categories[activeCategory].name} <span style={{ color: textSecondary, fontWeight: 400 }}>({categories[activeCategory].count} ürün)</span>
                  </span>
                  <button className="action-btn" style={{
                    padding: "6px 12px", borderRadius: 8,
                    background: accent, color: "#fff", border: "none",
                    fontSize: 12, fontWeight: 600
                  }}>+ Yeni Ürün</button>
                </div>

                <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
                  {(products[activeCategory] || []).map((product, i) => (
                    <div
                      key={i}
                      className="nav-item"
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 12px", borderRadius: 10, marginBottom: 2
                      }}
                    >
                      <span className="drag-handle" style={{ fontSize: 14 }}>⠿</span>
                      
                      {/* Thumbnail */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                        background: product.hasImage
                          ? `url(https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=88&h=88&fit=crop)`
                          : (darkMode ? "#222" : "#f0f0f0"),
                        backgroundSize: "cover",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: textMuted, fontSize: 18
                      }}>
                        {!product.hasImage && "📷"}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{
                            fontSize: 14, fontWeight: 600,
                            color: product.active ? textPrimary : textMuted
                          }}>{product.name}</span>
                          {product.badges.map((b, bi) => (
                            <span key={bi} style={{
                              fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                              background: b === "Popüler" ? "#FEF3C7" : "#DBEAFE",
                              color: b === "Popüler" ? "#92400E" : "#1E40AF"
                            }}>{b}</span>
                          ))}
                        </div>
                      </div>

                      <span style={{ fontSize: 14, fontWeight: 700, color: product.active ? accent : textMuted, marginRight: 8 }}>
                        {product.price}
                      </span>

                      {/* Toggle */}
                      <div
                        className="toggle-track"
                        style={{
                          width: 36, height: 20, borderRadius: 10,
                          background: product.active ? accent : (darkMode ? "#333" : "#ddd"),
                          position: "relative", padding: 2
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: "50%", background: "#fff",
                          transform: product.active ? "translateX(16px)" : "translateX(0)",
                          transition: "transform 0.2s ease",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.15)"
                        }} />
                      </div>

                      {/* Edit icon */}
                      <div style={{ cursor: "pointer", color: textMuted, padding: 4 }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </div>
                    </div>
                  ))}

                  {(!products[activeCategory] || products[activeCategory].length === 0) && (
                    <div style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      height: "100%", color: textMuted, gap: 8, padding: 40
                    }}>
                      <span style={{ fontSize: 40 }}>🍽️</span>
                      <span style={{ fontSize: 14 }}>Bu kategoride henüz ürün yok</span>
                      <button className="action-btn" style={{
                        marginTop: 8, padding: "8px 16px", borderRadius: 8,
                        background: accent, color: "#fff", border: "none",
                        fontSize: 13, fontWeight: 600
                      }}>İlk Ürünü Ekle</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
