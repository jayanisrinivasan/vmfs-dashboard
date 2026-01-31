// Shared Components - Navbar, Layout, UI Elements
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

// ============================================================================
// NAVBAR
// ============================================================================
export function Navbar() {
    const location = useLocation();

    const links = [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/portfolio", label: "Portfolio" },
        { to: "/framework", label: "Framework" },
        { to: "/mechanisms", label: "Mechanisms" },
    ];

    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "64px",
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            zIndex: 1000,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    boxShadow: "0 0 20px var(--accent)",
                }} />
                <span style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                }}>VMFS</span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
                {links.map(link => {
                    const isActive = location.pathname === link.to ||
                        (link.to !== "/" && location.pathname.startsWith(link.to));
                    const isHome = link.to === "/" && location.pathname === "/";
                    const active = isActive || isHome;

                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                fontSize: "13px",
                                fontWeight: 500,
                                color: active ? "var(--text)" : "var(--text-secondary)",
                                background: active ? "rgba(255,255,255,0.08)" : "transparent",
                                textDecoration: "none",
                                transition: "all 0.2s var(--ease)",
                            }}
                        >
                            {link.label}
                        </NavLink>
                    );
                })}
            </div>

            <div style={{ width: "80px" }} /> {/* Spacer for balance */}
        </nav>
    );
}

// ============================================================================
// LAYOUT WRAPPER
// ============================================================================
export function Layout({ children }) {
    return (
        <div style={{ paddingTop: "64px", minHeight: "100vh" }}>
            <Navbar />
            {children}
        </div>
    );
}

// ============================================================================
// BENTO CARD
// ============================================================================
export function BentoCard({ children, className = "", style = {}, onClick, hoverable = true }) {
    return (
        <div
            onClick={onClick}
            className={`glass ${className}`}
            style={{
                borderRadius: "24px",
                padding: "24px",
                transition: "all 0.3s var(--ease)",
                cursor: onClick ? "pointer" : "default",
                ...style,
            }}
            onMouseEnter={(e) => {
                if (hoverable) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }
            }}
            onMouseLeave={(e) => {
                if (hoverable) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }
            }}
        >
            {children}
        </div>
    );
}

// ============================================================================
// ANIMATED NUMBER
// ============================================================================
export function AnimatedNumber({ value, decimals = 1, duration = 800, suffix = "" }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseFloat(value);
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setDisplay(end);
                clearInterval(timer);
            } else {
                setDisplay(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{display.toFixed(decimals)}{suffix}</span>;
}


// ============================================================================
// SECTION HEADER
// ============================================================================
export function SectionHeader({ label, title, subtitle }) {
    return (
        <div style={{ marginBottom: "32px" }}>
            {label && (
                <div style={{
                    fontSize: "12px",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "8px",
                }}>
                    {label}
                </div>
            )}
            <h2 style={{
                fontSize: "36px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: subtitle ? "8px" : 0,
            }}>
                {title}
            </h2>
            {subtitle && (
                <p style={{
                    fontSize: "16px",
                    color: "var(--text-secondary)",
                    maxWidth: "600px",
                    lineHeight: 1.6,
                }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

// ============================================================================
// BUTTON
// ============================================================================
export function Button({ children, variant = "primary", onClick, style = {} }) {
    const variants = {
        primary: {
            background: "var(--accent)",
            color: "var(--bg)",
            border: "none",
        },
        secondary: {
            background: "transparent",
            color: "var(--text)",
            border: "1px solid var(--border)",
        },
        ghost: {
            background: "rgba(255,255,255,0.05)",
            color: "var(--text-secondary)",
            border: "none",
        },
    };

    return (
        <button
            onClick={onClick}
            style={{
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s var(--ease)",
                ...variants[variant],
                ...style,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                if (variant === "primary") e.currentTarget.style.boxShadow = "0 4px 20px rgba(50, 215, 75, 0.3)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {children}
        </button>
    );
}

// ============================================================================
// SCORE BAR
// ============================================================================
export function ScoreBar({ value, max = 5, color = "var(--accent)", label, showValue = true }) {
    return (
        <div style={{ marginBottom: "12px" }}>
            {(label || showValue) && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    {label && <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{label}</span>}
                    {showValue && <span style={{ fontSize: "13px", fontFamily: "var(--mono)", color }}>{value.toFixed(1)}</span>}
                </div>
            )}
            <div style={{
                height: "6px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "3px",
                overflow: "hidden",
            }}>
                <div style={{
                    height: "100%",
                    width: `${(value / max) * 100}%`,
                    background: color,
                    borderRadius: "3px",
                    transition: "width 0.4s var(--ease)",
                }} />
            </div>
        </div>
    );
}

// ============================================================================
// BADGE
// ============================================================================
export function Badge({ children, variant = "default" }) {
    const variants = {
        default: { background: "rgba(255,255,255,0.08)", color: "var(--text-secondary)" },
        accent: { background: "rgba(50, 215, 75, 0.15)", color: "var(--accent)" },
        blue: { background: "rgba(10, 132, 255, 0.15)", color: "var(--blue)" },
        warning: { background: "rgba(255, 159, 10, 0.15)", color: "var(--orange)" },
        danger: { background: "rgba(255, 69, 58, 0.15)", color: "var(--red)" },
    };

    return (
        <span style={{
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 500,
            ...variants[variant],
        }}>
            {children}
        </span>
    );
}
