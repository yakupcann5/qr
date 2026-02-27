import { useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("E-posta ve şifre gereklidir.");
    } else {
      setError("");
      alert("Giriş yapılıyor... (mockup)");
    }
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: "100vh",
      background: "#FAFAF8",
      display: "flex"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeUp 0.6s ease-out forwards; }
        .fade-in-d1 { animation: fadeUp 0.6s ease-out 0.1s forwards; opacity: 0; }
        .fade-in-d2 { animation: fadeUp 0.6s ease-out 0.2s forwards; opacity: 0; }
        
        input:focus {
          outline: none;
          border-color: #166534 !important;
          box-shadow: 0 0 0 3px rgba(22, 101, 52, 0.1);
        }
        
        .login-btn {
          transition: all 0.25s ease;
          cursor: pointer;
          border: none;
        }
        .login-btn:hover {
          background: #15803d !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22, 101, 52, 0.25);
        }
        .login-btn:active { transform: translateY(0); }
        
        .link-hover { transition: color 0.2s ease; }
        .link-hover:hover { color: #166534 !important; }
      `}</style>

      {/* Left — Decorative Panel */}
      <div style={{
        flex: "0 0 45%",
        background: "linear-gradient(160deg, #0f4c24 0%, #166534 40%, #15803d 100%)",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: 64, position: "relative", overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, left: -80, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ position: "absolute", bottom: -100, right: -100, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", top: "40%", right: 40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.02)" }} />
        
        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 380 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 22,
              fontFamily: "'Playfair Display', serif"
            }}>Q</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 22 }}>QRMenus</span>
          </div>
          
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 36, fontWeight: 700, color: "#fff",
            lineHeight: 1.2, marginBottom: 20
          }}>
            Menünüzü yönetin,<br />işinize odaklanın.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            Dijital menünüzü dakikalar içinde oluşturun ve müşterilerinize modern bir deneyim sunun.
          </p>
          
          {/* Testimonial card */}
          <div style={{
            marginTop: 48, padding: 24, borderRadius: 16,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>
              "QRMenus sayesinde basılı menü maliyetinden kurtulduk. Müşterilerimiz yeni sistemi çok seviyor."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 600, fontSize: 14
              }}>AK</div>
              <div>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Ahmet Kaya</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Café Istanbul</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 48
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h1 className="fade-in" style={{
            fontSize: 28, fontWeight: 700, marginBottom: 8,
            letterSpacing: "-0.02em"
          }}>Giriş Yap</h1>
          <p className="fade-in-d1" style={{ fontSize: 15, color: "#888", marginBottom: 36 }}>
            Hesabınıza giriş yaparak menünüzü yönetin
          </p>

          {error && (
            <div style={{
              padding: "12px 16px", borderRadius: 12, marginBottom: 20,
              background: "#fef2f2", border: "1px solid #fecaca",
              fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 8
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <div className="fade-in-d1">
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 8 }}>
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12,
                  border: "1.5px solid #e5e5e5", fontSize: 15, color: "#1A1A1A",
                  background: "#fff", transition: "all 0.2s ease"
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 8 }}>
                Şifre
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "14px 48px 14px 16px", borderRadius: 12,
                    border: "1.5px solid #e5e5e5", fontSize: 15, color: "#1A1A1A",
                    background: "#fff", transition: "all 0.2s ease"
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 28
            }}>
              <label style={{
                display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#666"
              }}>
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: rememberMe ? "none" : "1.5px solid #ccc",
                    background: rememberMe ? "#166534" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s ease"
                  }}
                >
                  {rememberMe && (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                Beni hatırla
              </label>
              <a href="#" className="link-hover" style={{
                fontSize: 14, color: "#888", textDecoration: "none", fontWeight: 500
              }}>Şifremi unuttum</a>
            </div>

            {/* Login Button */}
            <button
              className="login-btn"
              onClick={handleLogin}
              style={{
                width: "100%", padding: "15px 0", borderRadius: 12,
                background: "#166534", color: "#fff",
                fontSize: 15, fontWeight: 600
              }}
            >
              Giriş Yap
            </button>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              margin: "28px 0", color: "#ddd"
            }}>
              <div style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
              <span style={{ fontSize: 13, color: "#aaa" }}>veya</span>
              <div style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
            </div>

            {/* Register link */}
            <p style={{ textAlign: "center", fontSize: 14, color: "#888" }}>
              Hesabınız yok mu?{" "}
              <a href="#" className="link-hover" style={{
                color: "#166534", fontWeight: 600, textDecoration: "none"
              }}>Kayıt olun</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
