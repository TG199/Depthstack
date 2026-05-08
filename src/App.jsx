import { useState, useEffect, useRef } from "react";

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #07070A; color: #fff; font-family: 'DM Sans', sans-serif; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #07070A; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }
  @keyframes drift {
    0%,100% { transform: translateY(0px) translateX(0px); }
    33%      { transform: translateY(-18px) translateX(8px); }
    66%      { transform: translateY(10px) translateX(-6px); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); } to { transform: rotate(360deg); }
  }
  @keyframes flow {
    0%   { stroke-dashoffset: 200; }
    100% { stroke-dashoffset: 0; }
  }

  @media (max-width: 768px) {
    .desktop-only { display: none !important; }
    .mobile-stack { flex-direction: column !important; }
    .hero-grid    { grid-template-columns: 1fr !important; }
    .nav-links    { display: none !important; }
    .hamburger    { display: flex !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
    .before-after { grid-template-columns: 1fr !important; }
    .feature-grid { grid-template-columns: 1fr 1fr !important; }
    .footer-grid  { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 480px) {
    .feature-grid { grid-template-columns: 1fr !important; }
    .footer-grid  { grid-template-columns: 1fr !important; }
  }
`;

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:       "#07070A",
  bg2:      "#0D0D14",
  bg3:      "#12121C",
  cyan:     "#00C6F8",
  violet:   "#7C3AED",
  white:    "#FFFFFF",
  grey:     "#8B8B9E",
  greyLt:   "#C4C4D0",
  greyMid:  "#3A3A4A",
  greyDim:  "#1A1A24",
  amber:    "#F59E0B",
  green:    "#34D399",
  red:      "#F87171",
};

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

// ─── useInView hook ───────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Animated section wrapper ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
function CTAButton({ children, onClick, outline, small, full, style = {} }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, cursor: "pointer", borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    transition: "all 0.22s ease", border: "none",
    padding: small ? "9px 20px" : "14px 30px",
    fontSize: small ? 13 : 15, letterSpacing: "0.01em",
    width: full ? "100%" : "auto",
    ...style,
  };
  const solid = {
    background: hov ? "linear-gradient(135deg,#00e0ff,#7c3aed)" : "linear-gradient(135deg,#00C6F8,#6D28D9)",
    color: "#fff",
    boxShadow: hov ? "0 0 32px rgba(0,198,248,0.4)" : "none",
    transform: hov ? "translateY(-2px)" : "translateY(0)",
  };
  const outlineS = {
    background: "transparent",
    border: `1px solid ${hov ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.16)"}`,
    color: hov ? "#fff" : "rgba(255,255,255,0.65)",
    transform: hov ? "translateY(-1px)" : "translateY(0)",
  };
  return (
    <button onClick={onClick} style={{ ...base, ...(outline ? outlineS : solid) }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

// ─── Badge pill ───────────────────────────────────────────────────────────────
function Badge({ children, color = C.cyan }) {
  return (
    <span style={{
      display: "inline-block",
      background: `${color}18`, border: `1px solid ${color}35`,
      color, fontSize: 11, fontWeight: 600,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "5px 13px", borderRadius: 999, marginBottom: 18,
    }}>{children}</span>
  );
}

// ─── Section title ────────────────────────────────────────────────────────────
function SectionTitle({ badge, title, sub, align = "center", color }) {
  return (
    <div style={{ textAlign: align, marginBottom: 56 }}>
      {badge && <Badge color={color}>{badge}</Badge>}
      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(26px,4vw,44px)",
        fontWeight: 800, color: "#fff",
        margin: "0 0 14px", letterSpacing: "-0.03em", lineHeight: 1.1,
      }}>{title}</h2>
      {sub && <p style={{
        color: C.grey, fontSize: 16, maxWidth: 560,
        margin: align === "center" ? "0 auto" : 0,
        lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif",
      }}>{sub}</p>}
    </div>
  );
}

// ─── Dim rule ─────────────────────────────────────────────────────────────────
function Rule({ color = C.greyMid }) {
  return <div style={{ height: 1, background: color, opacity: 0.4, margin: "0" }} />;
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, glowColor, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hov && glowColor ? glowColor : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: 28, transition: "all 0.25s ease",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov && glowColor ? `0 12px 40px ${glowColor}20` : "none",
        ...style,
      }}>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HERO DIAGRAM — animated SVG
// ══════════════════════════════════════════════════════════════════════════════
function HeroDiagram() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
      {/* Glow behind */}
      <div style={{
        position: "absolute", top: "20%", left: "20%",
        width: "60%", height: "60%",
        background: "radial-gradient(ellipse, rgba(0,198,248,0.18) 0%, transparent 70%)",
        filter: "blur(32px)", zIndex: 0,
      }} />
      <svg viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", position: "relative", zIndex: 1 }}>

        {/* Grid background */}
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
          </pattern>
          <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C6F8"/>
            <stop offset="100%" stopColor="#7C3AED"/>
          </linearGradient>
          <linearGradient id="vg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#00C6F8" stopOpacity="0.8"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="420" height="280" fill="url(#grid)"/>

        {/* ── Node: Client ── */}
        <rect x="20" y="110" width="80" height="60" rx="8"
          fill="#0D0D18" stroke="#00C6F8" strokeWidth="1.2"/>
        <text x="60" y="134" textAnchor="middle" fill="#00C6F8"
          fontFamily="DM Mono" fontSize="9" fontWeight="500">CLIENT</text>
        {/* person icon */}
        <circle cx="60" cy="148" r="4" fill="#00C6F8" opacity="0.7"/>
        <path d="M52 162 Q60 156 68 162" stroke="#00C6F8" strokeWidth="1.2" fill="none" opacity="0.7"/>

        {/* ── Arrow 1: Client → API ── */}
        <path d="M102 140 L148 140" stroke="#00C6F8" strokeWidth="1.2"
          strokeDasharray="5 3"
          style={{ animation: "flow 2s linear infinite" }}/>
        <polygon points="148,136 156,140 148,144" fill="#00C6F8"/>

        {/* ── Node: API Layer ── */}
        <rect x="158" y="100" width="100" height="80" rx="8"
          fill="#0D0D18" stroke="url(#cg)" strokeWidth="1.5"/>
        <text x="208" y="126" textAnchor="middle" fill="#fff"
          fontFamily="DM Mono" fontSize="8.5" fontWeight="500">API LAYER</text>
        <Rule/>
        {/* mini endpoints */}
        {["validate","route","respond"].map((t,i) => (
          <g key={t}>
            <rect x="170" y={136+i*14} width="76" height="10" rx="3"
              fill={`rgba(0,198,248,${0.08+i*0.04})`}/>
            <text x="208" y={143+i*14} textAnchor="middle"
              fill={C.greyLt} fontFamily="DM Mono" fontSize="6.5">{t}</text>
          </g>
        ))}

        {/* ── Arrow 2: API → Services (down) ── */}
        <path d="M208 182 L208 210" stroke="url(#cg)" strokeWidth="1.2" strokeDasharray="4 3"
          style={{ animation: "flow 2.4s linear infinite" }}/>
        <polygon points="204,210 208,218 212,210" fill="#7C3AED"/>

        {/* ── Arrow 3: API → DB (right) ── */}
        <path d="M260 140 L306 140" stroke="url(#cg)" strokeWidth="1.2" strokeDasharray="4 3"
          style={{ animation: "flow 1.8s linear infinite" }}/>
        <polygon points="306,136 314,140 306,144" fill="#00C6F8"/>

        {/* ── Node: Database ── */}
        <rect x="316" y="110" width="84" height="60" rx="8"
          fill="#0D0D18" stroke="#34D399" strokeWidth="1.2"/>
        <text x="358" y="132" textAnchor="middle" fill="#34D399"
          fontFamily="DM Mono" fontSize="8.5" fontWeight="500">DATABASE</text>
        {/* cylinder icon */}
        <ellipse cx="358" cy="148" rx="16" ry="5" fill="none" stroke="#34D399" strokeWidth="1" opacity="0.6"/>
        <path d="M342 148 L342 158 Q342 163 358 163 Q374 163 374 158 L374 148"
          stroke="#34D399" strokeWidth="1" fill="none" opacity="0.6"/>

        {/* ── Node: Services ── */}
        <rect x="128" y="220" width="80" height="50" rx="8"
          fill="#0D0D18" stroke="#A78BFA" strokeWidth="1.2"/>
        <text x="168" y="240" textAnchor="middle" fill="#A78BFA"
          fontFamily="DM Mono" fontSize="8" fontWeight="500">SERVICES</text>
        <rect x="138" y="246" width="60" height="6" rx="2" fill="rgba(167,139,250,0.15)"/>
        <rect x="138" y="256" width="45" height="6" rx="2" fill="rgba(167,139,250,0.1)"/>

        {/* ── Arrow: Services → Cache ── */}
        <path d="M210 245 L254 245" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="4 3"
          style={{ animation: "flow 2.2s linear infinite" }}/>
        <polygon points="254,241 262,245 254,249" fill="#F59E0B"/>

        {/* ── Node: Cache ── */}
        <rect x="264" y="220" width="80" height="50" rx="8"
          fill="#0D0D18" stroke="#F59E0B" strokeWidth="1.2"/>
        <text x="304" y="240" textAnchor="middle" fill="#F59E0B"
          fontFamily="DM Mono" fontSize="8.5" fontWeight="500">CACHE</text>
        <text x="304" y="256" textAnchor="middle" fill={C.grey}
          fontFamily="DM Mono" fontSize="7">Redis</text>
        {/* lightning bolt */}
        <path d="M300 262 L307 270 L304 270 L311 278" stroke="#F59E0B" strokeWidth="1.2"
          fill="none" opacity="0.6"/>

        {/* ── State label ── */}
        <rect x="14" y="18" width="130" height="22" rx="5"
          fill="rgba(0,198,248,0.08)" stroke="rgba(0,198,248,0.2)" strokeWidth="0.8"/>
        <text x="79" y="33" textAnchor="middle" fill="#00C6F8"
          fontFamily="DM Mono" fontSize="8" letterSpacing="1">PRODUCTION SYSTEM</text>

        {/* ── Pulse dots on connections ── */}
        <circle cx="130" cy="140" r="3" fill="#00C6F8"
          style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}/>
        <circle cx="208" cy="196" r="3" fill="#7C3AED"
          style={{ animation: "pulse-dot 1.8s ease-in-out infinite 0.3s" }}/>
        <circle cx="283" cy="140" r="3" fill="#34D399"
          style={{ animation: "pulse-dot 2s ease-in-out infinite 0.6s" }}/>
        <circle cx="237" cy="245" r="3" fill="#F59E0B"
          style={{ animation: "pulse-dot 1.6s ease-in-out infinite 0.9s" }}/>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════════════════════
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Overview", id: "overview" },
    { label: "Content",  id: "features" },
    { label: "Pricing",  id: "pricing"  },
  ];

  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}
      onClick={() => scrollTo("hero")}>
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="7" fill="url(#nav-g)"/>
        <rect x="6" y="8"    width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.92"/>
        <rect x="6" y="12.75" width="11" height="2.5" rx="1.25" fill="white" fillOpacity="0.6"/>
        <rect x="6" y="17.5" width="7"  height="2.5" rx="1.25" fill="white" fillOpacity="0.35"/>
        <defs>
          <linearGradient id="nav-g" x1="0" y1="0" x2="28" y2="28">
            <stop stopColor="#00C6F8"/><stop offset="1" stopColor="#6D28D9"/>
          </linearGradient>
        </defs>
      </svg>
      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16,
        color: "#fff", letterSpacing: "-0.03em" }}>
        <span style={{ color: C.cyan }}>Depthstack</span>
      </span>
    </div>
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(7,7,10,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Logo />

          {/* Desktop nav */}
          <div className="nav-links" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {links.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.5)",
                fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                transition: "color 0.2s", padding: 0,
              }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
              >{l.label}</button>
            ))}
            <CTAButton small onClick={() => scrollTo("pricing")}>Get Instant Access</CTAButton>
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
            display: "none", background: "none", border: "none",
            cursor: "pointer", color: "#fff", fontSize: 22, padding: 4,
            flexDirection: "column", gap: 5,
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: 22, height: 2,
                background: "#fff", borderRadius: 2,
                transition: "all 0.2s",
              }}/>
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: "rgba(7,7,10,0.98)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "16px 24px 24px",
          }}>
            {links.map(l => (
              <button key={l.id} onClick={() => { scrollTo(l.id); setMenuOpen(false); }} style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none", color: "rgba(255,255,255,0.7)",
                fontSize: 16, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>{l.label}</button>
            ))}
            <CTAButton full style={{ marginTop: 16 }}
              onClick={() => { scrollTo("pricing"); setMenuOpen(false); }}>
              Get Instant Access
            </CTAButton>
          </div>
        )}
      </nav>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. HERO — split layout (headline left, diagram right)
// ══════════════════════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
      padding: "120px 24px 80px",
    }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "56px 56px",
      }}/>
      {/* Glow blobs */}
      <div style={{
        position: "absolute", top: "15%", left: "30%",
        width: 500, height: 350, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,198,248,0.1) 0%, transparent 70%)",
        filter: "blur(60px)", zIndex: 0,
        animation: "drift 8s ease-in-out infinite",
      }}/>
      <div style={{
        position: "absolute", bottom: "20%", right: "10%",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(109,40,217,0.15) 0%, transparent 70%)",
        filter: "blur(70px)", zIndex: 0,
        animation: "drift 11s ease-in-out infinite reverse",
      }}/>

      <div style={{
        maxWidth: 1120, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 64, alignItems: "center", position: "relative", zIndex: 1,
      }} className="hero-grid">

        {/* Left — copy */}
        <div style={{ animation: "fadeUp 0.7s ease both" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,198,248,0.07)", border: "1px solid rgba(0,198,248,0.18)",
            borderRadius: 999, padding: "5px 14px", marginBottom: 28,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: C.cyan,
              display: "inline-block",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}/>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 11,
              color: C.cyan, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>Go deeper than tutorials. Think in systems.</span>
          </div>

          <h1 style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "clamp(36px,5.5vw,68px)",
            fontWeight: 800, color: "#fff",
            margin: "0 0 10px", letterSpacing: "-0.04em", lineHeight: 1.05,
          }}>
            Stop Learning<br />
            Backend the<br />
            <span style={{
              background: "linear-gradient(135deg,#00C6F8 0%,#a78bfa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Wrong Way.</span>
          </h1>

          <p style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "clamp(16px,2vw,22px)",
            fontWeight: 600, color: "rgba(255,255,255,0.5)",
            margin: "0 0 16px", letterSpacing: "-0.02em",
          }}>Start Thinking Like a System Designer.</p>

          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 16,
            color: "rgba(255,255,255,0.38)", maxWidth: 480,
            margin: "0 0 40px", lineHeight: 1.72,
          }}>
            Depthstack teaches you the mental models, architecture patterns, and
            system design principles that take you from writing CRUD APIs to
            building production-grade systems.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <CTAButton onClick={() => scrollTo("pricing")}>Get Instant Access →</CTAButton>
            <CTAButton outline onClick={() => scrollTo("features")}>See What's Inside</CTAButton>
          </div>

          {/* Social proof */}
          <div style={{
            display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap",
          }}>
            {[["500+","Developers"],["4.9★","Rating"],["30-day","Guarantee"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>{n}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.32)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — diagram */}
        <div style={{ animation: "fadeIn 1s ease 0.3s both" }}>
          <HeroDiagram />
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. PROBLEM — 5-card grid (why most backend devs stay stuck)
// ══════════════════════════════════════════════════════════════════════════════
function Problem() {
  const problems = [
    { icon: "⚡", title: "Can build APIs", sub: "Can't design full systems" },
    { icon: "🗄️", title: "Knows SQL & NoSQL", sub: "Confused on when to use which" },
    { icon: "🧩", title: "Reads about system design", sub: "Still feels abstract and overwhelming" },
    { icon: "🚫", title: "Writes working code", sub: "Can't ship production-ready backends" },
    { icon: "🔁", title: "Follows tutorials", sub: "Skills plateau without depth" },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "rgba(255,255,255,0.012)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle
            badge="The Problem"
            title="Why Most Backend Developers Stay Stuck"
            sub="You've written thousands of lines of backend code. But something still feels shallow."
          />
        </Reveal>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }} className="feature-grid">
          {problems.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Card glowColor={C.red} style={{ textAlign: "center", padding: "28px 20px" }}>
                {/* X icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(241,68,68,0.1)", border: "1px solid rgba(241,68,68,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 18,
                }}>✗</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.grey, lineHeight: 1.5 }}>{p.sub}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. REAL PROBLEM — exclamation + tools vs system thinking contrast
// ══════════════════════════════════════════════════════════════════════════════
function RealProblem() {
  return (
    <section id="overview" style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <div style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 260px",
            gap: 32, alignItems: "center",
          }} className="mobile-stack">

            {/* Exclamation */}
            <div className="desktop-only" style={{
              width: 100, height: 100, borderRadius: 24,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 48, flexShrink: 0,
            }}>!</div>

            {/* Copy */}
            <div>
              <Badge color={C.amber}>The Real Problem</Badge>
              <h2 style={{
                fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,3.5vw,38px)",
                fontWeight: 800, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em",
              }}>The Mental Gap No Tutorial Covers</h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: C.grey, lineHeight: 1.72, maxWidth: 520 }}>
                You don't lack tutorials. You lack a system. Most developers learn tools, not thinking.
                Depthstack teaches you how to think in systems, so you can design, build, and reason
                about production-grade backend systems with clarity.
              </p>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Companies hire for architecture decisions, not coding speed.",
                  "Without system thinking, backend skills plateau at a ceiling.",
                  "Senior engineers think in state, trade-offs, and failure modes.",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: C.cyan, flexShrink: 0, marginTop: 2 }}>▸</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.greyLt, lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools vs System Thinking contrast */}
            <div style={{
              background: C.greyDim, border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, overflow: "hidden", flexShrink: 0,
            }}>
              <div style={{
                background: "rgba(241,68,68,0.08)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "16px 20px",
              }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.red, letterSpacing: "0.1em", marginBottom: 6 }}>TOOLS (WHAT TO USE)</div>
                {["Express.js","PostgreSQL","Redis","Docker","Kafka"].map(t => (
                  <div key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", padding: "3px 0" }}>{t}</div>
                ))}
              </div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "10px", background: "rgba(255,255,255,0.02)",
              }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.grey }}>VS</span>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.cyan, letterSpacing: "0.1em", marginBottom: 6 }}>SYSTEM THINKING (HOW IT ALL WORKS)</div>
                {["State transitions","Trade-off decisions","Failure handling","Scalability patterns","Observability"].map(t => (
                  <div key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.65)", padding: "3px 0" }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. PRODUCT INTRO — introducing + 4-step flow
// ══════════════════════════════════════════════════════════════════════════════
function ProductIntro() {
  const steps = [
    { n: "1", icon: "🧱", label: "Foundation", sub: "Mental model" },
    { n: "2", icon: "📐", label: "Design",     sub: "Architecture" },
    { n: "3", icon: "</>", label: "Build",     sub: "Production" },
    { n: "4", icon: "🚀", label: "Operate",    sub: "Scale & evolve" },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "rgba(255,255,255,0.012)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 64, alignItems: "center",
          }} className="hero-grid">

            {/* Left */}
            <div>
              <Badge>The Solution</Badge>
              <h2 style={{
                fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3.5vw,42px)",
                fontWeight: 800, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em",
              }}>Introducing Depthstack</h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.grey, lineHeight: 1.72, marginBottom: 28 }}>
                A backend engineering thinking system that teaches you how to design, build,
                and reason about production-grade systems — not just write code for them.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.greyLt, lineHeight: 1.7 }}>
                Not a course. Not a tutorial. A structured thinking system built around the
                mental models, decision frameworks, and system blueprints that senior engineers
                actually use.
              </p>
            </div>

            {/* Right — 4-step flow */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {steps.map((step, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: "16px 20px",
                  transition: "all 0.2s",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, rgba(0,198,248,${0.15 + i*0.05}), rgba(109,40,217,${0.15 + i*0.05}))`,
                    border: "1px solid rgba(0,198,248,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: step.icon === "</>" ? 11 : 18,
                    fontFamily: step.icon === "</>" ? "'DM Mono',monospace" : "inherit",
                    color: step.icon === "&#x2F;" ? C.cyan : "inherit",
                  }}>{step.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>{step.n}. {step.label}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.grey }}>{step.sub}</div>
                  </div>
                  {i < steps.length - 1 && (
                    <span style={{ color: C.cyan, fontSize: 12, opacity: 0.4 }}>↓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. FEATURES — what you get (4 cards with icons)
// ══════════════════════════════════════════════════════════════════════════════
function Features() {
  const features = [
    {
      icon: "📦", color: C.cyan,
      title: "Depthstack Core Guide",
      sub: "Core System",
      desc: "The foundational mental model. State transitions, concurrency, distributed systems, and the decision process that separates junior from senior thinking.",
    },
    {
      icon: "🗺️", color: "#A78BFA",
      title: "System Blueprints",
      sub: "Architecture Walkthroughs",
      desc: "Real-world breakdowns of messaging, banking, and notification systems — with actual DB schemas, architecture diagrams, and failure scenarios.",
    },
    {
      icon: "🚀", color: C.green,
      title: "Deployment Playbook",
      sub: "Production Readiness",
      desc: "Docker, CI/CD pipelines, environment management, and zero-downtime release patterns. Production-ready thinking from day one.",
    },
    {
      icon: "🔍", color: C.amber,
      title: "Production Debugging Guide",
      sub: "Incident Response",
      desc: "Systematic approaches to diagnosing failures — logging, tracing, profiling, degradation patterns, and root cause analysis.",
    },
  ];

  return (
    <section id="features" style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle
            badge="What You Get"
            title="What You Get Inside Depthstack"
            sub="Six documents that compound on each other — from mental model to production operation."
          />
        </Reveal>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
        }} className="feature-grid">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <Card glowColor={f.color} style={{ height: "100%" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: `${f.color}18`, border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: f.color, letterSpacing: "0.08em", marginBottom: 4 }}>{f.sub}</div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{f.title}</h3>
                  </div>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.grey, margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Bonus cards row */}
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          {[
            { icon: "🎯", color: C.cyan,   title: "System Design Interview Pack", desc: "12 practice problems, estimation sheets, and the vocabulary that signals seniority." },
            { icon: "📐", color: "#A78BFA", title: "Architecture Templates",       desc: "8 production-ready diagrams with design notes, schemas, and trade-off tables." },
          ].map((f, i) => (
            <Reveal key={i} delay={0.2 + i*0.1}>
              <Card glowColor={f.color}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `${f.color}15`, border: `1px solid ${f.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>{f.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{f.title}</h3>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.grey, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. BEFORE / AFTER — sad face | VS | happy face
// ══════════════════════════════════════════════════════════════════════════════
function BeforeAfter() {
  const before = [
    "Jump between tutorials without a system",
    "Copy-paste code without understanding it",
    "Struggle to design systems from scratch",
    "Can't debug complex production issues",
    "Not confident making architecture decisions",
  ];
  const after = [
    "Think in systems, not in snippets",
    "Design with confidence and clarity",
    "Build scalable, reliable backends",
    "Debug issues with a systematic approach",
    "Ship production-ready code with conviction",
  ];

  return (
    <section style={{ padding: "96px 24px", background: "rgba(255,255,255,0.012)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle badge="The Transformation" title="What You'll Be Able To Do" />
        </Reveal>
        <Reveal>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr auto 1fr",
            gap: 24, alignItems: "stretch",
          }} className="before-after">

            {/* Before */}
            <div style={{
              background: "rgba(241,68,68,0.04)",
              border: "1px solid rgba(241,68,68,0.14)",
              borderRadius: 16, padding: "32px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(241,68,68,0.1)", border: "1px solid rgba(241,68,68,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26,
                }}>😟</div>
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.red, letterSpacing: "0.1em", marginBottom: 2 }}>BEFORE DEPTHSTACK</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Stuck at the ceiling</div>
                </div>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {before.map((b, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: C.red, flexShrink: 0, marginTop: 1 }}>✗</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* VS divider */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: C.greyDim, border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.grey,
              }}>VS</div>
            </div>

            {/* After */}
            <div style={{
              background: "rgba(52,211,153,0.04)",
              border: "1px solid rgba(52,211,153,0.18)",
              borderRadius: 16, padding: "32px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26,
                }}>😊</div>
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.green, letterSpacing: "0.1em", marginBottom: 2 }}>AFTER DEPTHSTACK</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Thinking in systems</div>
                </div>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {after.map((a, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: C.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. BONUSES
// ══════════════════════════════════════════════════════════════════════════════
function Bonuses() {
  const bonuses = [
    { icon: "🗂️", label: "Architecture Cheat Sheet",    tag: "$29 value", desc: "Quick-reference decision guide for database, caching, API, and consistency trade-offs." },
    { icon: "</>", label: "Architecture Templates",       tag: "$19 value", desc: "8 ready-to-use Mermaid diagrams for common backend systems — start with structure." },
    { icon: "👥", label: "System Design Interview Pack", tag: "$39 value", desc: "12 practice problems, estimation reference, and the vocabulary that signals seniority." },
  ];

  return (
    <section style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle badge="Free Bonuses" title="Bonuses Included" sub="Included at no extra cost in Standard and Pro." />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {bonuses.map((b, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <Card glowColor="#A78BFA">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: b.icon === "</>" ? 14 : 22,
                    fontFamily: b.icon === "</>" ? "'DM Mono',monospace" : "inherit",
                    color: b.icon === "</>" ? "#A78BFA" : "inherit",
                  }}>{b.icon}</div>
                  <span style={{
                    background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
                    color: "#A78BFA", fontSize: 10, fontWeight: 600,
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em",
                    padding: "3px 10px", borderRadius: 999,
                  }}>{b.tag}</span>
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{b.label}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.grey, margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. PRICING
// ══════════════════════════════════════════════════════════════════════════════
function Pricing() {
  const tiers = [
    {
      name: "Starter", price: "$19", period: "/one-time",
      desc: "The foundation. Start going deeper today.",
      highlight: false,
      features: [
        "Depthstack Core Guide",
        "System Design Thinking Framework",
        "Backend Decision Cheatsheet",
        "Email support",
      ],
      cta: "Get Started",
      url: "https://kelebiri.gumroad.com/l/twtpu",
    },
    {
      name: "Standard", price: "$39", period: "/one-time",
      desc: "The complete system. Most popular choice.",
      highlight: true,
      features: [
        "Everything in Starter",
        "Real-World System Blueprints",
        "Deployment Playbook",
        "System Design Interview Pack",
        "Architecture Templates",
        "All future updates",
      ],
      cta: "Get Instant Access",
      url: "https://kelebiri.gumroad.com/l/rfficw",
    },
    {
      name: "Pro", price: "$69", period: "/one-time",
      desc: "For engineers serious about going senior.",
      highlight: false,
      features: [
        "Everything in Standard",
        "Production Debugging Guide",
        "1-on-1 architecture review (30 min)",
        "Priority support",
        "All future releases",
      ],
      cta: "Get Instant Access",
      url: "/pro.html",
    },
  ];

  return (
    <section id="pricing" style={{ padding: "96px 24px", background: "rgba(255,255,255,0.012)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle
            badge="Pricing"
            title="Invest in How You Think"
            sub="One-time payment. Lifetime access. No subscriptions. No fluff."
          />
        </Reveal>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16, alignItems: "start",
        }} className="pricing-grid">
          {tiers.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{
                background: t.highlight ? "rgba(0,198,248,0.05)" : "rgba(255,255,255,0.03)",
                border: t.highlight ? "1px solid rgba(0,198,248,0.32)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18, padding: 32, position: "relative",
                boxShadow: t.highlight ? "0 0 48px rgba(0,198,248,0.1)" : "none",
                transition: "transform 0.2s ease",
              }}>
                {t.highlight && (
                  <div style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg,#00C6F8,#6D28D9)",
                    color: "#fff", fontSize: 10, fontWeight: 700,
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em",
                    textTransform: "uppercase", padding: "4px 18px",
                    borderRadius: 999, whiteSpace: "nowrap",
                  }}>MOST POPULAR</div>
                )}
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{t.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{t.price}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.grey }}>{t.period}</span>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.grey, marginBottom: 28, lineHeight: 1.5 }}>{t.desc}</p>
                <Rule />
                <ul style={{ listStyle: "none", margin: "20px 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {t.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: t.highlight ? C.cyan : C.green, flexShrink: 0, fontSize: 13, marginTop: 1 }}>✓</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <CTAButton
                  full
                  outline={!t.highlight}
                  onClick={() => window.open(t.url, "_blank")}
                >{t.cta}</CTAButton>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p style={{
            textAlign: "center", marginTop: 28,
            fontFamily: "'DM Sans',sans-serif", fontSize: 13,
            color: "rgba(255,255,255,0.22)",
          }}>
            🔒 Secure checkout via Gumroad · 30-day money-back guarantee · Instant digital delivery
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 9. FINAL CTA
// ══════════════════════════════════════════════════════════════════════════════
function FinalCTA() {
  return (
    <section style={{ padding: "112px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 640, height: 320, borderRadius: "50%",
        background: "radial-gradient(ellipse,rgba(109,40,217,0.2) 0%,transparent 70%)",
        filter: "blur(64px)", zIndex: 0,
      }}/>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
        <Reveal>
          <Badge>Ready?</Badge>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "clamp(28px,4.5vw,54px)",
            fontWeight: 800, color: "#fff",
            margin: "0 0 14px", letterSpacing: "-0.035em", lineHeight: 1.08,
          }}>
            Stop Learning.<br />
            <span style={{
              background: "linear-gradient(135deg,#00C6F8 0%,#a78bfa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Start Building Systems That Last.</span>
          </h2>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 16,
            color: "rgba(255,255,255,0.36)",
            margin: "0 auto 16px", lineHeight: 1.72,
          }}>
            Join thousands of developers thinking deeper and building better.
          </p>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 14,
            color: "rgba(255,255,255,0.24)", margin: "0 auto 40px",
          }}>
            Every day without a system thinking framework is a day the gap grows.
          </p>
          <CTAButton onClick={() => scrollTo("pricing")} style={{ padding: "18px 48px", fontSize: 17 }}>
            Get Instant Access →
          </CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FOOTER — 4-column layout
// ══════════════════════════════════════════════════════════════════════════════
function Footer() {
  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="7" fill="url(#foot-g)"/>
        <rect x="6" y="8"    width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.9"/>
        <rect x="6" y="12.75" width="11" height="2.5" rx="1.25" fill="white" fillOpacity="0.6"/>
        <rect x="6" y="17.5" width="7"  height="2.5" rx="1.25" fill="white" fillOpacity="0.35"/>
        <defs>
          <linearGradient id="foot-g" x1="0" y1="0" x2="28" y2="28">
            <stop stopColor="#00C6F8"/><stop offset="1" stopColor="#6D28D9"/>
          </linearGradient>
        </defs>
      </svg>
      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: "-0.02em" }}>
        <span style={{ color: "rgba(0,198,248,0.5)" }}>Depthstack</span>
      </span>
    </div>
  );

  const col = (title, links) => (
    <div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{title}</div>
      {links.map(([label, id]) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <button onClick={() => id && scrollTo(id)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: "'DM Sans',sans-serif", fontSize: 13,
            color: "rgba(255,255,255,0.38)",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.38)"}
          >{label}</button>
        </div>
      ))}
    </div>
  );

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "56px 24px 32px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48, marginBottom: 48,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <Logo />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: "12px 0 0", lineHeight: 1.6, maxWidth: 240 }}>
              Think in systems. Build at scale.
            </p>
          </div>
          {col("Links",     [["Overview","overview"],["Content","features"],["Pricing","pricing"]])}
          {col("Resources", [["Blog",null],["Docs",null],["FAQ",null]])}
          {col("Company",   [["About",null],["Contact",null],["Terms",null]])}
        </div>

        <Rule />

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 24, flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>
            © 2026 DEPTHSTACK · ALL RIGHTS RESERVED
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.18)" }}>
            trydepthstack.com
          </div>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <div style={{ background: "#07070A", minHeight: "100vh", color: "#fff" }}>
      <Navbar />
      <Hero />
      <Problem />
      <RealProblem />
      <ProductIntro />
      <Features />
      <BeforeAfter />
      <Bonuses />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
