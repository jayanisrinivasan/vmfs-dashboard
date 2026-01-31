// Mechanisms Page - Detailed List of All Mechanisms
import { useState, useMemo } from "react";
import { Layout, BentoCard, SectionHeader, ScoreBar, Badge } from "../components/shared";
import { MECHANISMS, OOVS, COVERAGE_MATRIX } from "../vmfs-data";

// Mechanism Detail Modal
function MechanismModal({ mechanism, isOpen, onClose }) {
    if (!mechanism || !isOpen) return null;

    const cov = COVERAGE_MATRIX.find(c => c.mechanismId === mechanism.id);
    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];
    const scoreColors = {
        technicalFeasibility: "#0a84ff",
        politicalTractability: "#bf5af2",
        sovereigntyImpact: "#ff9f0a",
        globalSouthAdoptability: "#32d74b",
    };

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(12px)",
                    zIndex: 100,
                    animation: "fadeIn 0.2s var(--ease)",
                }}
            />
            <div style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: "800px",
                maxHeight: "85vh",
                background: "var(--bg-elevated)",
                borderRadius: "24px",
                border: "1px solid var(--border)",
                overflow: "hidden",
                zIndex: 101,
                animation: "scaleIn 0.3s var(--ease)",
            }}>
                {/* Header */}
                <div style={{
                    padding: "24px 28px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}>
                    <div>
                        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>{mechanism.shortName}</h2>
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "500px", lineHeight: 1.6 }}>
                            {mechanism.definition}
                        </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{
                            fontSize: "42px",
                            fontWeight: 700,
                            fontFamily: "var(--mono)",
                            color: mechanism.vmfsScores.weightedAvg >= 3.5 ? "var(--accent)" : mechanism.vmfsScores.weightedAvg >= 2.5 ? "var(--orange)" : "var(--red)",
                        }}>
                            {mechanism.vmfsScores.weightedAvg.toFixed(1)}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>
                            Weighted Avg
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.08)",
                            border: "none",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "18px",
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: "24px 28px", overflowY: "auto", maxHeight: "calc(85vh - 120px)" }}>
                    {/* Scores */}
                    <div style={{ marginBottom: "28px" }}>
                        <h4 style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                            Dimension Scores
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                            {[
                                { key: "technicalFeasibility", label: "Technical" },
                                { key: "politicalTractability", label: "Political" },
                                { key: "sovereigntyImpact", label: "Sovereignty" },
                                { key: "globalSouthAdoptability", label: "Global South" },
                            ].map(d => (
                                <div key={d.key} style={{
                                    padding: "16px",
                                    background: "rgba(255,255,255,0.03)",
                                    borderRadius: "12px",
                                }}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "8px" }}>{d.label}</div>
                                    <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--mono)", color: scoreColors[d.key] }}>
                                        {mechanism.vmfsScores[d.key].toFixed(1)}
                                    </div>
                                    <div style={{ marginTop: "8px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                                        <div style={{
                                            height: "100%",
                                            width: `${(mechanism.vmfsScores[d.key] / 5) * 100}%`,
                                            background: scoreColors[d.key],
                                            borderRadius: "2px",
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OoV Coverage */}
                    <div style={{ marginBottom: "28px" }}>
                        <h4 style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                            Verification Coverage
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                            {OOVS.map((oov, i) => {
                                const cell = cov?.[oovKeys[i]];
                                const isPrimary = cell?.coverage === "primary";
                                const isPartial = cell?.coverage === "partial";
                                return (
                                    <div key={oov.id} style={{
                                        padding: "14px",
                                        background: isPrimary ? "rgba(50, 215, 75, 0.08)" : isPartial ? "rgba(10, 132, 255, 0.08)" : "rgba(255,255,255,0.02)",
                                        border: `1px solid ${isPrimary ? "rgba(50, 215, 75, 0.2)" : isPartial ? "rgba(10, 132, 255, 0.2)" : "var(--border)"}`,
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}>
                                        <span style={{
                                            fontSize: "18px",
                                            color: isPrimary ? "var(--accent)" : isPartial ? "var(--blue)" : "var(--text-tertiary)",
                                        }}>
                                            {isPrimary ? "●" : isPartial ? "◐" : "○"}
                                        </span>
                                        <div style={{ fontSize: "12px", marginTop: "6px" }}>{oov.shortName}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Limitations & Evasion */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        <div>
                            <h4 style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                                ⚠️ Limitations
                            </h4>
                            <div style={{
                                padding: "16px",
                                background: "rgba(255, 69, 58, 0.05)",
                                border: "1px solid rgba(255, 69, 58, 0.1)",
                                borderRadius: "12px",
                            }}>
                                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                    {mechanism.limitations.primary}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                                🎯 Evasion Vectors
                            </h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {mechanism.evasionModes.map((e, i) => (
                                    <Badge key={i} variant="default">{e}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Evidence */}
                    {mechanism.evidence && mechanism.evidence.length > 0 && (
                        <div style={{ marginTop: "28px" }}>
                            <h4 style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                                📚 Evidence & Sources
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {mechanism.evidence.slice(0, 3).map((e, i) => (
                                    <div key={i} style={{
                                        padding: "12px 16px",
                                        background: "rgba(255,255,255,0.02)",
                                        borderRadius: "8px",
                                        fontSize: "13px",
                                        color: "var(--text-secondary)",
                                    }}>
                                        {e}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Main Page
export default function MechanismsPage() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("weightedAvg");
    const [selectedMechanism, setSelectedMechanism] = useState(null);

    const sorted = useMemo(() => {
        let filtered = [...MECHANISMS];

        // Filter by search
        if (search) {
            filtered = filtered.filter(m =>
                m.shortName.toLowerCase().includes(search.toLowerCase()) ||
                m.mechanism.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === "weightedAvg") return b.vmfsScores.weightedAvg - a.vmfsScores.weightedAvg;
            if (sortBy === "technical") return b.vmfsScores.technicalFeasibility - a.vmfsScores.technicalFeasibility;
            if (sortBy === "political") return b.vmfsScores.politicalTractability - a.vmfsScores.politicalTractability;
            if (sortBy === "name") return a.shortName.localeCompare(b.shortName);
            return 0;
        });

        return filtered;
    }, [search, sortBy]);

    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];

    return (
        <Layout>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
                <SectionHeader
                    label="Analysis"
                    title="All Mechanisms"
                    subtitle={`${MECHANISMS.length} verification mechanisms evaluated across ${OOVS.length} objects of verification`}
                />

                {/* Controls */}
                <div style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "32px",
                    flexWrap: "wrap",
                }}>
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search mechanisms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: "200px",
                            padding: "12px 16px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            color: "var(--text)",
                            fontSize: "14px",
                            outline: "none",
                        }}
                    />

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: "12px 16px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            color: "var(--text)",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    >
                        <option value="weightedAvg">Sort: Weighted Avg</option>
                        <option value="technical">Sort: Technical</option>
                        <option value="political">Sort: Political</option>
                        <option value="name">Sort: Name</option>
                    </select>
                </div>

                {/* Mechanisms Table */}
                <BentoCard hoverable={false} style={{ padding: 0, overflow: "hidden" }}>
                    {/* Header */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "40px 1fr 80px 80px 80px 80px 80px 100px",
                        gap: "16px",
                        padding: "16px 20px",
                        background: "rgba(255,255,255,0.02)",
                        borderBottom: "1px solid var(--border)",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}>
                        <div>#</div>
                        <div>Mechanism</div>
                        <div style={{ textAlign: "center" }}>Tech</div>
                        <div style={{ textAlign: "center" }}>Polit</div>
                        <div style={{ textAlign: "center" }}>Sov</div>
                        <div style={{ textAlign: "center" }}>G.South</div>
                        <div style={{ textAlign: "center" }}>Avg</div>
                        <div style={{ textAlign: "center" }}>Coverage</div>
                    </div>

                    {/* Rows */}
                    {sorted.map((m, i) => {
                        const cov = COVERAGE_MATRIX.find(c => c.mechanismId === m.id);
                        const primaryCount = oovKeys.filter(k => cov?.[k]?.coverage === "primary").length;
                        const partialCount = oovKeys.filter(k => cov?.[k]?.coverage === "partial").length;

                        return (
                            <div
                                key={m.id}
                                onClick={() => setSelectedMechanism(m)}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "40px 1fr 80px 80px 80px 80px 80px 100px",
                                    gap: "16px",
                                    padding: "16px 20px",
                                    borderBottom: "1px solid var(--border-subtle)",
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                                <div style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "6px",
                                    background: i < 3 ? "var(--accent)" : "rgba(255,255,255,0.06)",
                                    color: i < 3 ? "var(--bg)" : "var(--text-tertiary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                }}>{i + 1}</div>

                                <div>
                                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{m.shortName}</div>
                                </div>

                                <div style={{ textAlign: "center", fontFamily: "var(--mono)", color: "#0a84ff" }}>
                                    {m.vmfsScores.technicalFeasibility.toFixed(1)}
                                </div>
                                <div style={{ textAlign: "center", fontFamily: "var(--mono)", color: "#bf5af2" }}>
                                    {m.vmfsScores.politicalTractability.toFixed(1)}
                                </div>
                                <div style={{ textAlign: "center", fontFamily: "var(--mono)", color: "#ff9f0a" }}>
                                    {m.vmfsScores.sovereigntyImpact.toFixed(1)}
                                </div>
                                <div style={{ textAlign: "center", fontFamily: "var(--mono)", color: "#32d74b" }}>
                                    {m.vmfsScores.globalSouthAdoptability.toFixed(1)}
                                </div>
                                <div style={{
                                    textAlign: "center",
                                    fontFamily: "var(--mono)",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    color: m.vmfsScores.weightedAvg >= 3.5 ? "var(--accent)" : m.vmfsScores.weightedAvg >= 2.5 ? "var(--orange)" : "var(--red)",
                                }}>
                                    {m.vmfsScores.weightedAvg.toFixed(1)}
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <span style={{ color: "var(--accent)", marginRight: "6px" }}>●{primaryCount}</span>
                                    <span style={{ color: "var(--blue)" }}>◐{partialCount}</span>
                                </div>
                            </div>
                        );
                    })}
                </BentoCard>

                {sorted.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "60px",
                        color: "var(--text-tertiary)",
                    }}>
                        No mechanisms found matching your search.
                    </div>
                )}
            </div>

            <MechanismModal
                mechanism={selectedMechanism}
                isOpen={!!selectedMechanism}
                onClose={() => setSelectedMechanism(null)}
            />
        </Layout>
    );
}
