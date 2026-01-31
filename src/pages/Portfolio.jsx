// Portfolio Builder - Select mechanisms to build verification strategy
import { useState, useMemo } from "react";
import { Layout, BentoCard, SectionHeader, Badge, Button } from "../components/shared";
import { MECHANISMS, OOVS, COVERAGE_MATRIX } from "../vmfs-data";

// Selection Card
function MechanismSelector({ mechanism, isSelected, onToggle, disabled }) {
    const cov = COVERAGE_MATRIX.find(c => c.mechanismId === mechanism.id);
    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];
    const primaryCount = oovKeys.filter(k => cov?.[k]?.coverage === "primary").length;

    return (
        <div
            onClick={() => !disabled && onToggle(mechanism)}
            style={{
                padding: "16px",
                background: isSelected ? "rgba(50, 215, 75, 0.1)" : "rgba(255,255,255,0.02)",
                border: `2px solid ${isSelected ? "var(--accent)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "14px",
                cursor: disabled && !isSelected ? "not-allowed" : "pointer",
                opacity: disabled && !isSelected ? 0.5 : 1,
                transition: "all 0.2s var(--ease)",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                    <div style={{ fontSize: "15px", fontWeight: 600 }}>{mechanism.shortName}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "2px" }}>
                        {primaryCount}/4 primary OoVs
                    </div>
                </div>
                <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    background: isSelected ? "var(--accent)" : "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    color: isSelected ? "var(--bg)" : "var(--text-tertiary)",
                }}>
                    {isSelected ? "✓" : ""}
                </div>
            </div>
            <div style={{
                fontSize: "24px",
                fontWeight: 700,
                fontFamily: "var(--mono)",
                color: mechanism.vmfsScores.weightedAvg >= 3.5 ? "var(--accent)" : mechanism.vmfsScores.weightedAvg >= 2.5 ? "var(--orange)" : "var(--red)",
            }}>
                {mechanism.vmfsScores.weightedAvg.toFixed(1)}
            </div>
        </div>
    );
}

// Coverage Matrix Visualization
function CoverageMatrix({ portfolio }) {
    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];

    // Calculate combined coverage for each OoV
    const coverageData = OOVS.map((oov, i) => {
        const key = oovKeys[i];
        const mechanisms = portfolio.map(m => {
            const cov = COVERAGE_MATRIX.find(c => c.mechanismId === m.id);
            return { mechanism: m, coverage: cov?.[key]?.coverage || "none" };
        });

        const hasPrimary = mechanisms.some(m => m.coverage === "primary");
        const hasPartial = mechanisms.some(m => m.coverage === "partial");

        return {
            oov,
            mechanisms,
            status: hasPrimary ? "covered" : hasPartial ? "partial" : "gap",
        };
    });

    const coveredCount = coverageData.filter(c => c.status === "covered").length;
    const partialCount = coverageData.filter(c => c.status === "partial").length;
    const gapCount = coverageData.filter(c => c.status === "gap").length;

    return (
        <div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div style={{ flex: 1, padding: "16px", background: "rgba(50, 215, 75, 0.08)", borderRadius: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>{coveredCount}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Primary Coverage</div>
                </div>
                <div style={{ flex: 1, padding: "16px", background: "rgba(10, 132, 255, 0.08)", borderRadius: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--blue)" }}>{partialCount}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Partial Coverage</div>
                </div>
                <div style={{ flex: 1, padding: "16px", background: "rgba(255, 69, 58, 0.08)", borderRadius: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--red)" }}>{gapCount}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Coverage Gaps</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {coverageData.map((data, i) => (
                    <div
                        key={data.oov.id}
                        style={{
                            padding: "16px",
                            background: data.status === "covered" ? "rgba(50, 215, 75, 0.06)" : data.status === "partial" ? "rgba(10, 132, 255, 0.06)" : "rgba(255, 69, 58, 0.06)",
                            border: `1px solid ${data.status === "covered" ? "rgba(50, 215, 75, 0.2)" : data.status === "partial" ? "rgba(10, 132, 255, 0.2)" : "rgba(255, 69, 58, 0.2)"}`,
                            borderRadius: "12px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                            <div style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "6px",
                                background: ["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b"][i] + "20",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: 700,
                                fontFamily: "var(--mono)",
                                color: ["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b"][i],
                            }}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <div style={{ fontSize: "13px", fontWeight: 600 }}>{data.oov.shortName}</div>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                            {data.status === "covered" ? "Primary coverage" : data.status === "partial" ? "Partial coverage" : "No coverage"}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {data.mechanisms.map((m, j) => (
                                <div key={j} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--text-tertiary)" }}>
                                    <span style={{
                                        color: m.coverage === "primary" ? "var(--accent)" : m.coverage === "partial" ? "var(--blue)" : "var(--text-tertiary)",
                                    }}>
                                        {m.coverage === "primary" ? "●" : m.coverage === "partial" ? "◐" : "○"}
                                    </span>
                                    {m.mechanism.shortName}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Score Breakdown
function ScoreBreakdown({ portfolio }) {
    const dimensions = [
        { key: "technicalFeasibility", label: "Technical Feasibility", color: "#0a84ff" },
        { key: "politicalTractability", label: "Political Tractability", color: "#bf5af2" },
        { key: "sovereigntyImpact", label: "Sovereignty Impact", color: "#ff9f0a" },
        { key: "globalSouthAdoptability", label: "Global South Adoptability", color: "#32d74b" },
    ];

    const avgScores = dimensions.map(d => {
        const avg = portfolio.reduce((sum, m) => sum + m.vmfsScores[d.key], 0) / portfolio.length;
        return { ...d, avg };
    });

    const overallAvg = avgScores.reduce((sum, d) => sum + d.avg, 0) / avgScores.length;

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "8px" }}>
                    Portfolio Average Score
                </div>
                <div style={{
                    fontSize: "56px",
                    fontWeight: 700,
                    fontFamily: "var(--mono)",
                    color: overallAvg >= 3.5 ? "var(--accent)" : overallAvg >= 2.5 ? "var(--orange)" : "var(--red)",
                }}>
                    {overallAvg.toFixed(2)}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {avgScores.map((d, i) => (
                    <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{d.label}</span>
                            <span style={{ fontSize: "13px", fontFamily: "var(--mono)", color: d.color }}>{d.avg.toFixed(1)}</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{
                                height: "100%",
                                width: `${(d.avg / 5) * 100}%`,
                                background: d.color,
                                borderRadius: "3px",
                                transition: "width 0.4s var(--ease)",
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Recommendations
function Recommendations({ portfolio }) {
    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];

    // Find gaps
    const gaps = OOVS.filter((oov, i) => {
        const key = oovKeys[i];
        return !portfolio.some(m => {
            const cov = COVERAGE_MATRIX.find(c => c.mechanismId === m.id);
            return cov?.[key]?.coverage === "primary";
        });
    });

    // Find mechanisms that would fill gaps
    const recommendations = MECHANISMS
        .filter(m => !portfolio.some(p => p.id === m.id))
        .map(m => {
            const cov = COVERAGE_MATRIX.find(c => c.mechanismId === m.id);
            const fillsGaps = gaps.filter((gap, i) => {
                const key = oovKeys[OOVS.indexOf(gap)];
                return cov?.[key]?.coverage === "primary";
            });
            return { mechanism: m, fillsGaps };
        })
        .filter(r => r.fillsGaps.length > 0)
        .sort((a, b) => b.fillsGaps.length - a.fillsGaps.length)
        .slice(0, 3);

    if (gaps.length === 0) {
        return (
            <div style={{ padding: "24px", background: "rgba(50, 215, 75, 0.06)", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>✓</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent)" }}>Full Primary Coverage</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Your portfolio covers all Objects of Verification with primary mechanisms.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "8px" }}>
                    Coverage Gaps
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {gaps.map(gap => (
                        <Badge key={gap.id} variant="danger">{gap.shortName}</Badge>
                    ))}
                </div>
            </div>

            {recommendations.length > 0 && (
                <div>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "12px" }}>
                        Consider Adding
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {recommendations.map((r, i) => (
                            <div key={i} style={{
                                padding: "12px 16px",
                                background: "rgba(255,255,255,0.02)",
                                borderRadius: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                                <div>
                                    <div style={{ fontSize: "14px", fontWeight: 500 }}>{r.mechanism.shortName}</div>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                                        Fills: {r.fillsGaps.map(g => g.shortName).join(", ")}
                                    </div>
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>
                                    {r.mechanism.vmfsScores.weightedAvg.toFixed(1)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Main Page
export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState([]);
    const MAX_SELECTION = 3;

    const sorted = useMemo(() =>
        [...MECHANISMS].sort((a, b) => b.vmfsScores.weightedAvg - a.vmfsScores.weightedAvg),
        []);

    const toggleMechanism = (mechanism) => {
        if (portfolio.some(m => m.id === mechanism.id)) {
            setPortfolio(portfolio.filter(m => m.id !== mechanism.id));
        } else if (portfolio.length < MAX_SELECTION) {
            setPortfolio([...portfolio, mechanism]);
        }
    };

    const clearPortfolio = () => setPortfolio([]);

    return (
        <Layout>
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 24px" }}>
                <SectionHeader
                    label="Strategy"
                    title="Build Your Portfolio"
                    subtitle={`Select ${MAX_SELECTION} verification mechanisms to analyze combined coverage and feasibility`}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "24px" }}>
                    {/* Selection Panel */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "12px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>
                                Select Mechanisms ({portfolio.length}/{MAX_SELECTION})
                            </div>
                            {portfolio.length > 0 && (
                                <button
                                    onClick={clearPortfolio}
                                    style={{
                                        padding: "6px 12px",
                                        background: "transparent",
                                        border: "1px solid var(--border)",
                                        borderRadius: "6px",
                                        color: "var(--text-secondary)",
                                        fontSize: "11px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                            {sorted.map(m => (
                                <MechanismSelector
                                    key={m.id}
                                    mechanism={m}
                                    isSelected={portfolio.some(p => p.id === m.id)}
                                    onToggle={toggleMechanism}
                                    disabled={portfolio.length >= MAX_SELECTION && !portfolio.some(p => p.id === m.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Analysis Panel */}
                    <div>
                        {portfolio.length === 0 ? (
                            <BentoCard hoverable={false} style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ textAlign: "center", padding: "60px" }}>
                                    <div style={{ fontSize: "48px", color: "var(--text-tertiary)", marginBottom: "16px" }}>◇</div>
                                    <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>No Mechanisms Selected</div>
                                    <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                                        Select up to {MAX_SELECTION} mechanisms from the left to analyze your portfolio
                                    </div>
                                </div>
                            </BentoCard>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {/* Selected Items */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "12px" }}>
                                        Your Portfolio
                                    </div>
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        {portfolio.map((m, i) => (
                                            <div key={m.id} style={{
                                                flex: 1,
                                                padding: "16px",
                                                background: "rgba(50, 215, 75, 0.06)",
                                                border: "1px solid rgba(50, 215, 75, 0.15)",
                                                borderRadius: "12px",
                                                textAlign: "center",
                                            }}>
                                                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{m.shortName}</div>
                                                <div style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>
                                                    {m.vmfsScores.weightedAvg.toFixed(1)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </BentoCard>

                                {/* Score Breakdown */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "16px" }}>
                                        Combined Scores
                                    </div>
                                    <ScoreBreakdown portfolio={portfolio} />
                                </BentoCard>

                                {/* Coverage Matrix */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "16px" }}>
                                        OoV Coverage Analysis
                                    </div>
                                    <CoverageMatrix portfolio={portfolio} />
                                </BentoCard>

                                {/* Recommendations */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "16px" }}>
                                        Recommendations
                                    </div>
                                    <Recommendations portfolio={portfolio} />
                                </BentoCard>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
