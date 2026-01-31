// Home Page - Landing/Hero
import { Link } from "react-router-dom";
import { Layout, BentoCard, Button } from "../components/shared";
import { MECHANISMS, OOVS, KEY_FINDINGS } from "../vmfs-data";

export default function HomePage() {
    const avgScore = MECHANISMS.reduce((a, m) => a + m.vmfsScores.weightedAvg, 0) / MECHANISMS.length;
    const topScore = Math.max(...MECHANISMS.map(m => m.vmfsScores.weightedAvg));

    // OoV icons as simple text abbreviations
    const oovLabels = ["01", "02", "03", "04"];

    return (
        <Layout>
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
                    background: "radial-gradient(ellipse, rgba(50, 215, 75, 0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                {/* Badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "rgba(50, 215, 75, 0.08)",
                    border: "1px solid rgba(50, 215, 75, 0.15)",
                    borderRadius: "100px",
                    marginBottom: "24px",
                    animation: "fadeIn 0.6s var(--ease)",
                }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
                    <span style={{ fontSize: "12px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>AI Governance Research</span>
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
                    A systematic framework for evaluating AI governance verification mechanisms
                    across technical, political, and global adoption dimensions.
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
                    <Link to="/framework" style={{ textDecoration: "none" }}>
                        <Button variant="secondary">
                            View Framework
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
                        { value: OOVS.length, label: "Verification Objects" },
                        { value: avgScore.toFixed(1), label: "Avg. Feasibility" },
                        { value: topScore.toFixed(1), label: "Top Score" },
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

            {/* Key Finding Section */}
            <section style={{
                padding: "80px 24px",
                maxWidth: "1000px",
                margin: "0 auto",
            }}>
                <div style={{
                    padding: "32px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "20px",
                    border: "1px solid var(--border)",
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: "rgba(50, 215, 75, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <span style={{ color: "var(--accent)", fontSize: "16px", fontWeight: 700 }}>!</span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px", color: "var(--text)" }}>Key Finding</h3>
                            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                {KEY_FINDINGS[0]?.finding || "No single verification mechanism achieves high scores across all dimensions. Effective AI safety governance requires a layered approach combining multiple verification methods."}
                            </p>
                        </div>
                    </div>
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
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>Four dimensions for comprehensive AI verification coverage</p>
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
                                {oovLabels[i]}
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
                    background: "linear-gradient(180deg, rgba(50, 215, 75, 0.05) 0%, transparent 100%)",
                    border: "1px solid rgba(50, 215, 75, 0.1)",
                    borderRadius: "24px",
                }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>Build Your Strategy</h2>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                        Create a custom portfolio of verification mechanisms to analyze coverage gaps and maximize feasibility for your specific use case.
                    </p>
                    <Link to="/portfolio" style={{ textDecoration: "none" }}>
                        <Button variant="primary" style={{ padding: "12px 32px" }}>
                            Start Building Portfolio
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
                    VMFS Command Center
                </p>
            </footer>
        </Layout>
    );
}
