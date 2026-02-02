// Home Page - Landing/Hero with New Framework Messaging
import { Link } from "react-router-dom";
import { Layout, BentoCard, Button } from "../components/shared";
import { MECHANISMS, OOVS, KEY_FINDINGS, SCORE_DIMENSIONS } from "../vmfs-data";

// SVG Icons for dimensions
const DimensionIcons = {
    hardness: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
        </svg>
    ),
    burden: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
        </svg>
    ),
    intrusion: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    ),
    robustness: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
    ),
};

export default function HomePage({ theme, toggleTheme }) {
    // Calculate stats using new scoring
    const avgScore = MECHANISMS.reduce((a, m) => {
        const score = m.newScores 
            ? (m.newScores.hardness + m.newScores.burden + m.newScores.intrusion + m.newScores.robustness) / 4 
            : 3;
        return a + score;
    }, 0) / MECHANISMS.length;

    const topScore = Math.max(...MECHANISMS.map(m => {
        return m.newScores 
            ? (m.newScores.hardness + m.newScores.burden + m.newScores.intrusion + m.newScores.robustness) / 4 
            : 3;
    }));


    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            {/* Hero Section */}
            <section style={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "60px 24px",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Background gradient */}
                <div style={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "800px",
                    height: "600px",
                    background: theme === 'light' 
                        ? "radial-gradient(ellipse, rgba(30, 64, 175, 0.08) 0%, transparent 70%)"
                        : "radial-gradient(ellipse, rgba(50, 215, 75, 0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                {/* Badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: theme === 'light'
                        ? "rgba(30, 64, 175, 0.1)"
                        : "rgba(50, 215, 75, 0.08)",
                    border: theme === 'light'
                        ? "1px solid rgba(30, 64, 175, 0.2)"
                        : "1px solid rgba(50, 215, 75, 0.15)",
                    borderRadius: "100px",
                    marginBottom: "24px",
                    animation: "fadeIn 0.6s var(--ease)",
                }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
                    <span style={{ fontSize: "12px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Decision Support for Treaty Negotiators
                    </span>
                </div>

                {/* Main headline */}
                <h1 style={{
                    fontSize: "clamp(40px, 8vw, 72px)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    marginBottom: "24px",
                    animation: "slideUp 0.6s var(--ease) 0.1s both",
                }}>
                    Verification Mechanism<br />
                    <span style={{ color: "var(--accent)" }}>Feasibility Scorer</span>
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: "17px",
                    color: "var(--text-secondary)",
                    maxWidth: "580px",
                    lineHeight: 1.7,
                    marginBottom: "40px",
                    animation: "slideUp 0.6s var(--ease) 0.2s both",
                }}>
                    Translate policy goals into technical architecture. Score verification mechanisms 
                    across Trust, Cost, Friction, and Cheating dimensions to build robust treaty regimes.
                </p>

                {/* CTA Buttons */}
                <div style={{
                    display: "flex",
                    gap: "16px",
                    animation: "slideUp 0.6s var(--ease) 0.3s both",
                }}>
                    <Link to="/dashboard" style={{ textDecoration: "none" }}>
                        <Button variant="primary">
                            Explore Dashboard
                        </Button>
                    </Link>
                    <Link to="/treaty-advisor" style={{ textDecoration: "none" }}>
                        <Button variant="secondary">
                            Ask the Advisor
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div style={{
                    display: "flex",
                    gap: "56px",
                    marginTop: "80px",
                    animation: "fadeIn 0.6s var(--ease) 0.5s both",
                }}>
                    {[
                        { value: MECHANISMS.length, label: "Mechanisms" },
                        { value: avgScore.toFixed(1), label: "Avg. Score" },
                        { value: "4", label: "Dimensions" },
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                            <div style={{
                                fontSize: "32px",
                                fontWeight: 700,
                                fontFamily: "var(--mono)",
                                color: "var(--accent)",
                            }}>{stat.value}</div>
                            <div style={{
                                fontSize: "11px",
                                color: "var(--text-tertiary)",
                                marginTop: "4px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Four Dimensions Preview */}
            <section style={{
                padding: "80px 24px",
                maxWidth: "1000px",
                margin: "0 auto",
            }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Four Scoring Dimensions</h2>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
                        Every mechanism is evaluated across these critical trade-off dimensions
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                    {Object.entries(SCORE_DIMENSIONS).map(([key, dim], i) => (
                        <BentoCard key={key} hoverable style={{ padding: "24px" }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                background: `${dim.color}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "14px",
                            }}>
                                {DimensionIcons[key](dim.color)}
                            </div>
                            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>{dim.shortName}</h3>
                            <div style={{ fontSize: "11px", color: dim.color, marginBottom: "8px" }}>{dim.name}</div>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                {dim.question}
                            </p>
                        </BentoCard>
                    ))}
                </div>
            </section>

            {/* Key Finding Section */}
            <section style={{
                padding: "40px 24px 80px",
                maxWidth: "1000px",
                margin: "0 auto",
            }}>
                <div style={{
                    padding: "32px",
                    background: theme === 'light'
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.02)",
                    borderRadius: "20px",
                    border: "1px solid var(--border)",
                    boxShadow: theme === 'light' ? "var(--shadow-md)" : "none",
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: theme === 'light'
                                ? "rgba(30, 64, 175, 0.12)"
                                : "rgba(50, 215, 75, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <span style={{ color: "var(--accent)", fontSize: "16px", fontWeight: 700 }}>!</span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px", color: "var(--text)" }}>Critical Insight</h3>
                            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                {KEY_FINDINGS[0]?.description || "No single mechanism achieves high scores across all dimensions. Hard evidence requires infrastructure investment. Low-cost mechanisms rely on human honesty. Robust verification requires layered portfolios."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Goal-Based Approach */}
            <section style={{
                padding: "0 24px 80px",
                maxWidth: "1000px",
                margin: "0 auto",
            }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Goal-Based Entry</h2>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
                        Start with what you want to verify, we will map you to the right tools
                    </p>
                </div>

                <div style={{
                    padding: "32px",
                    background: theme === 'light'
                        ? "linear-gradient(180deg, rgba(30, 64, 175, 0.06) 0%, rgba(30, 64, 175, 0.02) 100%)"
                        : "linear-gradient(180deg, rgba(50, 215, 75, 0.05) 0%, transparent 100%)",
                    borderRadius: "20px",
                    border: theme === 'light'
                        ? "1px solid rgba(30, 64, 175, 0.12)"
                        : "1px solid rgba(50, 215, 75, 0.1)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
                        <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Your Goal</div>
                            <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                                "I want to verify compute usage"
                            </div>
                        </div>
                        <div style={{ fontSize: "24px", color: "var(--text-tertiary)" }}>&rarr;</div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Evidence Location</div>
                            <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                                Chip / Hardware Level
                            </div>
                        </div>
                        <div style={{ fontSize: "24px", color: "var(--text-tertiary)" }}>&rarr;</div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Mechanisms</div>
                            <div style={{ fontSize: "12px", color: "var(--accent)" }}>
                                On-Chip Telemetry, TEE Attestation
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <Link to="/dashboard" style={{ textDecoration: "none" }}>
                        <Button variant="ghost">
                            Try the Goal-Based Filter
                        </Button>
                    </Link>
                </div>
            </section>

            {/* OoV Preview */}
            <section style={{
                padding: "60px 24px 100px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Objects of Verification</h2>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>What can be verified about AI systems</p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px",
                }}>
                    {OOVS.map((oov, i) => (
                        <BentoCard key={oov.id} hoverable style={{ padding: "24px" }}>
                            <div style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "8px",
                                background: `${["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b"][i]}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "14px",
                                fontSize: "12px",
                                fontWeight: 700,
                                fontFamily: "var(--mono)",
                                color: ["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b"][i],
                            }}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>{oov.shortName}</h3>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                {oov.definition}
                            </p>
                        </BentoCard>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <Link to="/framework" style={{ textDecoration: "none" }}>
                        <Button variant="ghost">
                            View Full Framework
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Strategy Promo */}
            <section style={{
                padding: "0 24px 80px",
                maxWidth: "800px",
                margin: "0 auto",
                textAlign: "center",
            }}>
                <div style={{
                    padding: "40px",
                    background: theme === 'light'
                        ? "linear-gradient(180deg, rgba(30, 64, 175, 0.08) 0%, rgba(30, 64, 175, 0.02) 100%)"
                        : "linear-gradient(180deg, rgba(50, 215, 75, 0.05) 0%, transparent 100%)",
                    border: theme === 'light'
                        ? "1px solid rgba(30, 64, 175, 0.15)"
                        : "1px solid rgba(50, 215, 75, 0.1)",
                    borderRadius: "24px",
                    boxShadow: theme === 'light' ? "var(--shadow-sm)" : "none",
                }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>Build Your Portfolio</h2>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                        Combine up to 3 mechanisms to simulate a treaty verification regime.
                        See aggregate scores, coverage gaps, and blind spot warnings.
                    </p>
                    <Link to="/portfolio" style={{ textDecoration: "none" }}>
                        <Button variant="primary" style={{ padding: "12px 32px" }}>
                            Start Building
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: "32px 24px",
                borderTop: "1px solid var(--border)",
                textAlign: "center",
            }}>
                <p style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                    VMFS Command Center - AI Governance Research
                </p>
            </footer>
        </Layout>
    );
}
