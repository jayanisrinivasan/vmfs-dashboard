// Home Page - Landing/Hero
import { Link } from "react-router-dom";
import { Layout, BentoCard, Button } from "../components/shared";
import { MECHANISMS, OOVS, KEY_FINDINGS } from "../vmfs-data";

export default function HomePage() {
    const avgScore = MECHANISMS.reduce((a, m) => a + m.vmfsScores.weightedAvg, 0) / MECHANISMS.length;
    const topScore = Math.max(...MECHANISMS.map(m => m.vmfsScores.weightedAvg));

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
                    background: "radial-gradient(ellipse, rgba(50, 215, 75, 0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                {/* Badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "rgba(50, 215, 75, 0.1)",
                    border: "1px solid rgba(50, 215, 75, 0.2)",
                    borderRadius: "100px",
                    marginBottom: "24px",
                    animation: "fadeIn 0.6s var(--ease)",
                }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
                    <span style={{ fontSize: "13px", color: "var(--accent)" }}>AI Safety Research</span>
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
                    fontSize: "18px",
                    color: "var(--text-secondary)",
                    maxWidth: "600px",
                    lineHeight: 1.7,
                    marginBottom: "40px",
                    animation: "slideUp 0.6s var(--ease) 0.2s both",
                }}>
                    A comprehensive framework for evaluating AI governance verification mechanisms
                    across technical feasibility, political tractability, and global adoption dimensions.
                </p>

                {/* CTA Buttons */}
                <div style={{
                    display: "flex",
                    gap: "16px",
                    animation: "slideUp 0.6s var(--ease) 0.3s both",
                }}>
                    <Link to="/dashboard" style={{ textDecoration: "none" }}>
                        <Button variant="primary">
                            Explore Dashboard →
                        </Button>
                    </Link>
                    <Link to="/framework" style={{ textDecoration: "none" }}>
                        <Button variant="secondary">
                            Learn the Framework
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div style={{
                    display: "flex",
                    gap: "48px",
                    marginTop: "80px",
                    animation: "fadeIn 0.6s var(--ease) 0.5s both",
                }}>
                    {[
                        { value: MECHANISMS.length, label: "Mechanisms Analyzed" },
                        { value: OOVS.length, label: "Verification Objectives" },
                        { value: avgScore.toFixed(1), label: "Average Feasibility" },
                        { value: topScore.toFixed(1), label: "Highest Score" },
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                            <div style={{
                                fontSize: "36px",
                                fontWeight: 700,
                                fontFamily: "var(--mono)",
                                color: "var(--accent)",
                            }}>{stat.value}</div>
                            <div style={{
                                fontSize: "12px",
                                color: "var(--text-tertiary)",
                                marginTop: "4px",
                            }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Key Insight Section */}
            <section style={{
                padding: "80px 24px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}>
                <div style={{
                    padding: "32px",
                    background: "linear-gradient(135deg, rgba(50, 215, 75, 0.06), rgba(10, 132, 255, 0.06))",
                    borderRadius: "24px",
                    border: "1px solid rgba(50, 215, 75, 0.1)",
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                        <span style={{ fontSize: "32px" }}>💡</span>
                        <div>
                            <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>Critical Finding</h3>
                            <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "800px" }}>
                                {KEY_FINDINGS[0]?.finding || "No single verification mechanism achieves high scores across all dimensions. Effective AI safety governance requires a layered approach combining multiple verification methods."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* OoV Preview */}
            <section style={{
                padding: "80px 24px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h2 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "12px" }}>Objects of Verification</h2>
                    <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>Four key dimensions for comprehensive AI verification</p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "20px",
                }}>
                    {OOVS.map((oov, i) => (
                        <BentoCard key={oov.id} hoverable style={{ padding: "28px" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b"][i]}20, transparent)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "16px",
                            }}>
                                <span style={{ fontSize: "24px" }}>
                                    {["🖥️", "🔗", "🚀", "🔄"][i]}
                                </span>
                            </div>
                            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>{oov.shortName}</h3>
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                {oov.definition}
                            </p>
                        </BentoCard>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <Link to="/framework" style={{ textDecoration: "none" }}>
                        <Button variant="ghost">
                            Learn More About the Framework →
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: "40px 24px",
                borderTop: "1px solid var(--border)",
                textAlign: "center",
            }}>
                <p style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
                    VMFS Command Center • AI Safety Hackathon 2026
                </p>
            </footer>
        </Layout>
    );
}
