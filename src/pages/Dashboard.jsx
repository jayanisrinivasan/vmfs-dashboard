// Dashboard Page - Interactive Visualizations
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Layout, BentoCard } from "../components/shared";
import { MECHANISMS, OOVS, COVERAGE_MATRIX } from "../vmfs-data";

// ============================================================================
// RADAR CHART
// ============================================================================
function RadarChart({ mechanism, customScores, onScoreChange }) {
    const svgRef = useRef(null);
    const [dragging, setDragging] = useState(null);
    const [hovered, setHovered] = useState(null);

    const size = 340;
    const center = size / 2;
    const radius = 110;

    const dimensions = [
        { key: "technicalFeasibility", label: "Technical", color: "#0a84ff" },
        { key: "politicalTractability", label: "Political", color: "#bf5af2" },
        { key: "sovereigntyImpact", label: "Sovereignty", color: "#ff9f0a" },
        { key: "globalSouthAdoptability", label: "Global South", color: "#32d74b" },
    ];

    const scores = customScores || mechanism?.vmfsScores || {};
    const hasCustom = customScores !== null;

    const getPoint = useCallback((value, index, r = radius) => {
        const angle = (Math.PI * 2 * index) / 4 - Math.PI / 2;
        const distance = (value / 5) * r;
        return { x: center + Math.cos(angle) * distance, y: center + Math.sin(angle) * distance };
    }, [center, radius]);

    const getPolygon = (s) => dimensions.map((d, i) => {
        const p = getPoint(s[d.key] || 0, i);
        return `${p.x},${p.y}`;
    }).join(" ");

    const handleDrag = useCallback((e) => {
        if (dragging === null || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * size - center;
        const y = ((e.clientY - rect.top) / rect.height) * size - center;
        const dist = Math.sqrt(x * x + y * y);
        const score = Math.min(5, Math.max(1, (dist / radius) * 5));
        onScoreChange?.(dimensions[dragging].key, Math.round(score * 10) / 10);
    }, [dragging, dimensions, center, radius, size, onScoreChange]);

    useEffect(() => {
        if (dragging !== null) {
            const up = () => setDragging(null);
            window.addEventListener("mousemove", handleDrag);
            window.addEventListener("mouseup", up);
            return () => { window.removeEventListener("mousemove", handleDrag); window.removeEventListener("mouseup", up); };
        }
    }, [dragging, handleDrag]);

    const labelPos = [
        { x: center, y: 40, anchor: "middle" },
        { x: size - 25, y: center, anchor: "start" },
        { x: center, y: size - 35, anchor: "middle" },
        { x: 25, y: center, anchor: "end" },
    ];

    if (!mechanism) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", color: "var(--text-tertiary)" }}>
            Select a mechanism to view
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: "300px" }}>
                <defs>
                    <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <circle cx={center} cy={center} r={radius + 15} fill="url(#radarGlow)" />

                {[1, 2, 3, 4, 5].map(l => (
                    <circle key={l} cx={center} cy={center} r={(l / 5) * radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                ))}
                {dimensions.map((_, i) => {
                    const p = getPoint(5, i);
                    return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" />;
                })}

                {dimensions.map((d, i) => {
                    const p = labelPos[i];
                    return (
                        <g key={i}>
                            <text x={p.x} y={p.y} fill={hovered === i ? d.color : "var(--text-secondary)"} fontSize="11" fontWeight="500" textAnchor={p.anchor} dominantBaseline="middle">{d.label}</text>
                            <text x={p.x} y={p.y + (i === 0 ? 14 : i === 2 ? -14 : 14)} fill={d.color} fontSize="12" fontFamily="var(--mono)" fontWeight="600" textAnchor={p.anchor} dominantBaseline="middle">{(scores[d.key] || 0).toFixed(1)}</text>
                        </g>
                    );
                })}

                {hasCustom && <polygon points={getPolygon(mechanism.vmfsScores)} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4" />}
                <polygon points={getPolygon(scores)} fill="rgba(50, 215, 75, 0.1)" stroke="var(--accent)" strokeWidth="2" style={{ transition: dragging === null ? "all 0.2s" : "none" }} />

                {dimensions.map((d, i) => {
                    const p = getPoint(scores[d.key] || 0, i);
                    const active = dragging === i || hovered === i;
                    return (
                        <g key={i} style={{ cursor: "grab" }} onMouseDown={(e) => { e.preventDefault(); setDragging(i); }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                            <circle cx={p.x} cy={p.y} r="18" fill="transparent" />
                            {active && <circle cx={p.x} cy={p.y} r="12" fill="none" stroke={d.color} strokeWidth="2" opacity="0.4" />}
                            <circle cx={p.x} cy={p.y} r={active ? 6 : 5} fill={d.color} stroke="var(--bg)" strokeWidth="2" style={{ transition: "all 0.15s" }} />
                        </g>
                    );
                })}
            </svg>

            <div style={{ marginTop: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {hasCustom ? "Adjusted Score" : "Feasibility Score"}
                </div>
                <div style={{ fontSize: "36px", fontWeight: 700, fontFamily: "var(--mono)", color: hasCustom ? "var(--accent)" : "var(--text)", marginTop: "4px" }}>
                    {((scores.technicalFeasibility + scores.politicalTractability + scores.sovereigntyImpact + scores.globalSouthAdoptability) / 4).toFixed(2)}
                </div>
                {hasCustom && (
                    <button onClick={() => onScoreChange?.("reset", null)} style={{ marginTop: "8px", padding: "6px 16px", background: "transparent", border: "1px solid var(--border)", borderRadius: "20px", color: "var(--text-secondary)", fontSize: "11px", cursor: "pointer" }}>
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// SCATTER MATRIX
// ============================================================================
function ScatterMatrix({ mechanisms, selected, onSelect }) {
    const width = 400;
    const height = 280;
    const pad = 50;

    const xScale = (v) => pad + ((v - 1) / 4) * (width - pad * 2);
    const yScale = (v) => height - pad - ((v - 1) / 4) * (height - pad * 2);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%" }}>
            <defs>
                <linearGradient id="quadrantGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(50, 215, 75, 0.04)" />
                </linearGradient>
            </defs>

            <rect x={xScale(3)} y={pad} width={width - pad - xScale(3)} height={yScale(3) - pad} fill="url(#quadrantGrad)" rx="6" />

            {[1, 2, 3, 4, 5].map(v => (
                <g key={v}>
                    <line x1={xScale(v)} y1={pad} x2={xScale(v)} y2={height - pad} stroke="rgba(255,255,255,0.04)" />
                    <line x1={pad} y1={yScale(v)} x2={width - pad} y2={yScale(v)} stroke="rgba(255,255,255,0.04)" />
                    <text x={xScale(v)} y={height - pad + 14} fill="var(--text-tertiary)" fontSize="9" textAnchor="middle">{v}</text>
                    <text x={pad - 10} y={yScale(v) + 3} fill="var(--text-tertiary)" fontSize="9" textAnchor="end">{v}</text>
                </g>
            ))}

            <text x={width / 2} y={height - 8} fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Technical →</text>
            <text x={12} y={height / 2} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" transform={`rotate(-90, 12, ${height / 2})`}>Political →</text>

            {mechanisms.map((m) => {
                const x = xScale(m.vmfsScores.technicalFeasibility);
                const y = yScale(m.vmfsScores.politicalTractability);
                const isSelected = selected?.id === m.id;
                const size = 4 + m.vmfsScores.weightedAvg * 1.2;

                return (
                    <g key={m.id} style={{ cursor: "pointer" }} onClick={() => onSelect(m)}>
                        {isSelected && (
                            <>
                                <circle cx={x} cy={y} r={size + 10} fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.3">
                                    <animate attributeName="r" from={size + 6} to={size + 14} dur="1.5s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx={x} cy={y} r={size + 5} fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.5" />
                            </>
                        )}
                        <circle cx={x} cy={y} r={size} fill={isSelected ? "var(--accent)" : "var(--blue)"} opacity={isSelected ? 1 : 0.6} style={{ transition: "all 0.2s" }} />
                    </g>
                );
            })}
        </svg>
    );
}

// ============================================================================
// MECHANISM CARD
// ============================================================================
function MechanismCard({ m, isSelected, onClick, rank }) {
    const cov = COVERAGE_MATRIX.find(c => c.mechanismId === m.id);
    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];
    const primaryCount = oovKeys.filter(k => cov?.[k]?.coverage === "primary").length;

    return (
        <div
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                background: isSelected ? "rgba(50, 215, 75, 0.1)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isSelected ? "rgba(50, 215, 75, 0.3)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "14px",
                cursor: "pointer",
                transition: "all 0.2s var(--ease)",
            }}
        >
            <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: rank <= 3 ? "var(--accent)" : "rgba(255,255,255,0.06)",
                color: rank <= 3 ? "var(--bg)" : "var(--text-tertiary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 700, flexShrink: 0,
            }}>{rank}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.shortName}</div>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{primaryCount}/4 primary OoVs</div>
            </div>
            <div style={{
                fontSize: "18px", fontWeight: 700, fontFamily: "var(--mono)",
                color: m.vmfsScores.weightedAvg >= 3.5 ? "var(--accent)" : m.vmfsScores.weightedAvg >= 2.5 ? "var(--orange)" : "var(--red)",
            }}>{m.vmfsScores.weightedAvg.toFixed(1)}</div>
        </div>
    );
}

// ============================================================================
// DETAIL PANEL
// ============================================================================
function DetailPanel({ mechanism }) {
    if (!mechanism) return null;

    const cov = COVERAGE_MATRIX.find(c => c.mechanismId === mechanism.id);
    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];

    return (
        <div style={{ padding: "20px", borderTop: "1px solid var(--border)", marginTop: "16px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>{mechanism.shortName}</h4>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>{mechanism.definition}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "16px" }}>
                {OOVS.map((oov, i) => {
                    const cell = cov?.[oovKeys[i]];
                    const isPrimary = cell?.coverage === "primary";
                    const isPartial = cell?.coverage === "partial";
                    return (
                        <div key={oov.id} style={{
                            padding: "8px",
                            background: isPrimary ? "rgba(50, 215, 75, 0.08)" : isPartial ? "rgba(10, 132, 255, 0.08)" : "rgba(255,255,255,0.02)",
                            borderRadius: "8px",
                            textAlign: "center",
                        }}>
                            <span style={{ color: isPrimary ? "var(--accent)" : isPartial ? "var(--blue)" : "var(--text-tertiary)", fontSize: "14px" }}>
                                {isPrimary ? "●" : isPartial ? "◐" : "○"}
                            </span>
                            <div style={{ fontSize: "10px", color: "var(--text-tertiary)", marginTop: "2px" }}>{oov.shortName}</div>
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: "12px", background: "rgba(255, 69, 58, 0.05)", borderRadius: "8px" }}>
                <div style={{ fontSize: "10px", color: "var(--red)", textTransform: "uppercase", marginBottom: "4px" }}>Key Limitation</div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{mechanism.limitations.primary}</p>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================
export default function DashboardPage() {
    const [selected, setSelected] = useState(null);
    const [customScores, setCustomScores] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const sorted = useMemo(() => [...MECHANISMS].sort((a, b) => b.vmfsScores.weightedAvg - a.vmfsScores.weightedAvg), []);
    const avgScore = MECHANISMS.reduce((a, m) => a + m.vmfsScores.weightedAvg, 0) / MECHANISMS.length;

    useEffect(() => {
        if (!selected && sorted.length) setSelected(sorted[0]);
    }, [sorted, selected]);

    const handleScoreChange = (key, value) => {
        if (key === "reset") { setCustomScores(null); return; }
        if (!selected) return;
        const base = customScores || { ...selected.vmfsScores };
        setCustomScores({ ...base, [key]: value });
    };

    const handleSelect = (m) => {
        setSelected(m);
        setCustomScores(null);
    };

    return (
        <Layout>
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 24px" }}>
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>Interactive Dashboard</h1>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
                        Explore verification mechanisms with interactive visualizations. Drag radar points to simulate what-if scenarios.
                    </p>
                </div>

                {/* Bento Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "20px", marginBottom: "20px" }}>
                    {/* Radar */}
                    <BentoCard hoverable={false}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h3 style={{ fontSize: "12px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Interactive Radar</h3>
                            {selected && <span style={{ fontSize: "12px", color: "var(--accent)" }}>{selected.shortName}</span>}
                        </div>
                        <RadarChart mechanism={selected} customScores={customScores} onScoreChange={handleScoreChange} />
                        <p style={{ textAlign: "center", fontSize: "10px", color: "var(--text-tertiary)", marginTop: "8px" }}>Drag points to explore scenarios</p>
                    </BentoCard>

                    {/* Matrix */}
                    <BentoCard hoverable={false}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h3 style={{ fontSize: "12px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Feasibility Matrix</h3>
                            <div style={{ display: "flex", gap: "20px" }}>
                                {[
                                    { label: "Mechanisms", value: MECHANISMS.length },
                                    { label: "Avg Score", value: avgScore.toFixed(1) },
                                ].map((s, i) => (
                                    <div key={i} style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>{s.value}</div>
                                        <div style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ScatterMatrix mechanisms={sorted} selected={selected} onSelect={handleSelect} />
                    </BentoCard>
                </div>

                {/* Mechanism Grid */}
                <BentoCard hoverable={false}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "12px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>All Mechanisms</h3>
                        <button
                            onClick={() => setShowDetail(!showDetail)}
                            style={{
                                padding: "8px 16px",
                                background: showDetail ? "var(--accent)" : "rgba(255,255,255,0.05)",
                                border: "none",
                                borderRadius: "20px",
                                color: showDetail ? "var(--bg)" : "var(--text-secondary)",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                        >
                            {showDetail ? "Hide Details" : "Show Details"}
                        </button>
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "12px",
                    }}>
                        {sorted.map((m, i) => (
                            <MechanismCard key={m.id} m={m} rank={i + 1} isSelected={selected?.id === m.id} onClick={() => handleSelect(m)} />
                        ))}
                    </div>
                    {showDetail && <DetailPanel mechanism={selected} />}
                </BentoCard>
            </div>
        </Layout>
    );
}
