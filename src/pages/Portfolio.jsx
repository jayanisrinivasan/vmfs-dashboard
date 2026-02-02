// Portfolio Builder - Select mechanisms to build verification strategy
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout, BentoCard, SectionHeader, Badge, Button } from "../components/shared";
import { 
    MECHANISMS, 
    OOVS, 
    COVERAGE_MATRIX, 
    EVIDENCE_LOCATIONS,
    SCORE_DIMENSIONS,
    calculatePortfolioScores,
    detectBlindSpots 
} from "../vmfs-data";

// ============================================================================
// PORTFOLIO RADAR CHART - 4 NEW DIMENSIONS
// ============================================================================
function PortfolioRadarChart({ portfolio }) {
    const svgRef = useRef(null);
    const [hovered, setHovered] = useState(null);

    const size = 400;
    const center = size / 2;
    const radius = 110;
    const padding = 50;

    const dimensions = [
        { key: "hardness", label: "Hardness", sublabel: "Trust", color: "#0a84ff" },
        { key: "robustness", label: "Robustness", sublabel: "Cheating", color: "#bf5af2" },
        { key: "burden", label: "Burden", sublabel: "Cost", color: "#32d74b" },
        { key: "intrusion", label: "Intrusion", sublabel: "Friction", color: "#ff9f0a" },
    ];

    const scores = useMemo(() => {
        if (!portfolio || portfolio.length === 0) {
            return { hardness: 0, burden: 0, intrusion: 0, robustness: 0 };
        }
        return calculatePortfolioScores(portfolio);
    }, [portfolio]);

    const getPoint = useCallback((value, index, r = radius) => {
        const angle = (Math.PI * 2 * index) / 4 - Math.PI / 2;
        const distance = (value / 5) * r;
        return { x: center + Math.cos(angle) * distance, y: center + Math.sin(angle) * distance };
    }, [center, radius]);

    const getPolygon = (s) => dimensions.map((d, i) => {
        const p = getPoint(s[d.key] || 0, i);
        return `${p.x},${p.y}`;
    }).join(" ");

    const labelPos = [
        { x: center, y: padding, anchor: "middle" },
        { x: size - padding, y: center, anchor: "start" },
        { x: center, y: size - padding, anchor: "middle" },
        { x: padding, y: center, anchor: "end" },
    ];

    if (!portfolio || portfolio.length === 0) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", color: "var(--text-tertiary)" }}>
                Select mechanisms to view portfolio radar
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: "300px" }}>
                <defs>
                    <radialGradient id="portfolioRadarGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <circle cx={center} cy={center} r={radius + 15} fill="url(#portfolioRadarGlow)" />

                {[1, 2, 3, 4, 5].map(l => (
                    <circle key={l} cx={center} cy={center} r={(l / 5) * radius} fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
                ))}
                {dimensions.map((_, i) => {
                    const p = getPoint(5, i);
                    return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--border-subtle)" />;
                })}

                {dimensions.map((d, i) => {
                    const p = labelPos[i];
                    const isRobustness = d.key === "robustness";
                    const labelLines = isRobustness ? ["Robust-", "ness"] : [d.label];
                    const lineHeight = 11;
                    const totalLabelHeight = labelLines.length * lineHeight;
                    const labelYOffset = isRobustness ? (i === 1 ? -lineHeight / 2 : 0) : 0;
                    
                    return (
                        <g key={i}>
                            <text 
                                x={p.x} 
                                y={p.y + labelYOffset} 
                                fill={hovered === i ? d.color : "var(--text-secondary)"} 
                                fontSize="12" 
                                fontWeight="500" 
                                textAnchor={p.anchor} 
                                dominantBaseline="middle"
                                style={{ userSelect: "none" }}
                            >
                                {labelLines.map((line, lineIdx) => (
                                    <tspan 
                                        key={lineIdx}
                                        x={p.x} 
                                        dy={lineIdx === 0 ? 0 : lineHeight}
                                        textAnchor={p.anchor}
                                    >
                                        {line}
                                    </tspan>
                                ))}
                            </text>
                            <text 
                                x={p.x} 
                                y={p.y + (i === 0 ? 16 : i === 2 ? -16 : i === 1 ? 20 : 16)} 
                                fill={d.color} 
                                fontSize="12" 
                                fontFamily="var(--mono)" 
                                fontWeight="600" 
                                textAnchor={p.anchor} 
                                dominantBaseline="middle"
                                style={{ userSelect: "none" }}
                            >
                                {(scores[d.key] || 0).toFixed(1)}
                            </text>
                        </g>
                    );
                })}

                <polygon 
                    points={getPolygon(scores)} 
                    fill="var(--accent-glow)" 
                    stroke="var(--accent)" 
                    strokeWidth="2" 
                    style={{ transition: "all 0.3s" }} 
                />

                {dimensions.map((d, i) => {
                    const p = getPoint(scores[d.key] || 0, i);
                    const active = hovered === i;
                    return (
                        <g 
                            key={i} 
                            onMouseEnter={() => setHovered(i)} 
                            onMouseLeave={() => setHovered(null)}
                            style={{ cursor: "pointer" }}
                        >
                            <circle cx={p.x} cy={p.y} r="18" fill="transparent" />
                            {active && <circle cx={p.x} cy={p.y} r="12" fill="none" stroke={d.color} strokeWidth="2" opacity="0.4" />}
                            <circle cx={p.x} cy={p.y} r={active ? 6 : 5} fill={d.color} stroke="var(--bg)" strokeWidth="2" style={{ transition: "all 0.15s" }} />
                        </g>
                    );
                })}
            </svg>

            <div style={{ marginTop: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Portfolio Score
                </div>
                <div style={{ fontSize: "36px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)", marginTop: "4px" }}>
                    {(scores.overall || 0).toFixed(2)}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// GAP ANALYSIS ALERTS (RED TEAM)
// ============================================================================
function GapAnalysisAlerts({ portfolio }) {
    const warnings = useMemo(() => {
        if (!portfolio || portfolio.length === 0) return [];
        return detectBlindSpots(portfolio);
    }, [portfolio]);

    if (warnings.length === 0) {
        return (
            <div style={{ 
                padding: "20px", 
                background: "rgba(50, 215, 75, 0.08)", 
                borderRadius: "12px", 
                border: "1px solid rgba(50, 215, 75, 0.2)",
                textAlign: "center" 
            }}>
                <div style={{ fontSize: "18px", marginBottom: "8px", color: "var(--accent)" }}>All Clear</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    Your portfolio covers major evidence locations without critical blind spots.
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {warnings.map((warning, i) => {
                const styles = {
                    critical: { 
                        bg: "rgba(255, 69, 58, 0.08)", 
                        border: "rgba(255, 69, 58, 0.25)", 
                        color: "var(--red)",
                        icon: "!"
                    },
                    warning: { 
                        bg: "rgba(255, 159, 10, 0.08)", 
                        border: "rgba(255, 159, 10, 0.25)", 
                        color: "var(--orange)",
                        icon: "?"
                    },
                    info: { 
                        bg: "rgba(10, 132, 255, 0.08)", 
                        border: "rgba(10, 132, 255, 0.25)", 
                        color: "var(--blue)",
                        icon: "i"
                    },
                };
                const style = styles[warning.type] || styles.info;
                
                return (
                    <div 
                        key={i} 
                        style={{
                            padding: "16px",
                            background: style.bg,
                            border: `1px solid ${style.border}`,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                        }}
                    >
                        <div style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            background: style.color,
                            color: "var(--bg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 700,
                            flexShrink: 0,
                        }}>
                            {style.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: "11px", color: style.color, textTransform: "uppercase", marginBottom: "4px", fontWeight: 600 }}>
                                {warning.type === 'critical' ? 'Critical Blind Spot' : warning.type === 'warning' ? 'Coverage Gap' : 'Recommendation'}
                            </div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                                {warning.message}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================================
// MECHANISM SELECTOR CARD
// ============================================================================
function MechanismSelector({ mechanism, isSelected, onToggle, disabled }) {
    const cov = COVERAGE_MATRIX.find(c => c.mechanismId === mechanism.id);
    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];
    const primaryCount = oovKeys.filter(k => cov?.[k]?.coverage === "primary").length;

    const avgNewScore = mechanism.newScores 
        ? (mechanism.newScores.hardness + mechanism.newScores.burden + mechanism.newScores.intrusion + mechanism.newScores.robustness) / 4
        : 3.0;

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
                        {mechanism.evidenceLocations?.map(loc => {
                            const location = EVIDENCE_LOCATIONS[loc.toUpperCase()] || 
                                Object.values(EVIDENCE_LOCATIONS).find(l => l.id === loc);
                            return location?.name?.split('/')[0]?.trim() || loc;
                        }).join(', ')}
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
                    {isSelected ? "Y" : ""}
                </div>
            </div>
            
            {/* Mini score bars for new dimensions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", marginBottom: "10px" }}>
                {['hardness', 'burden', 'intrusion', 'robustness'].map(dim => {
                    const score = mechanism.newScores?.[dim] || 3;
                    const dimConfig = SCORE_DIMENSIONS[dim];
                    return (
                        <div key={dim} title={dimConfig?.name}>
                            <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                                <div style={{
                                    height: "100%",
                                    width: `${(score / 5) * 100}%`,
                                    background: dimConfig?.color || "var(--accent)",
                                    borderRadius: "2px",
                                }} />
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div style={{
                fontSize: "24px",
                fontWeight: 700,
                fontFamily: "var(--mono)",
                color: avgNewScore >= 3.5 ? "var(--accent)" : avgNewScore >= 2.5 ? "var(--orange)" : "var(--red)",
            }}>
                {avgNewScore.toFixed(1)}
            </div>
        </div>
    );
}

// ============================================================================
// SCORE BREAKDOWN WITH NEW DIMENSIONS
// ============================================================================
function NewScoreBreakdown({ portfolio }) {
    const scores = useMemo(() => calculatePortfolioScores(portfolio), [portfolio]);
    
    if (!scores) return null;

    const dimensions = [
        { key: "hardness", ...SCORE_DIMENSIONS.hardness },
        { key: "burden", ...SCORE_DIMENSIONS.burden },
        { key: "intrusion", ...SCORE_DIMENSIONS.intrusion },
        { key: "robustness", ...SCORE_DIMENSIONS.robustness },
    ];

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "8px" }}>
                    Combined Portfolio Score
                </div>
                <div style={{
                    fontSize: "56px",
                    fontWeight: 700,
                    fontFamily: "var(--mono)",
                    color: scores.overall >= 3.5 ? "var(--accent)" : scores.overall >= 2.5 ? "var(--orange)" : "var(--red)",
                }}>
                    {scores.overall.toFixed(2)}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {dimensions.map((d) => (
                    <div key={d.key}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <div>
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{d.name}</span>
                                <span style={{ fontSize: "11px", color: "var(--text-tertiary)", marginLeft: "8px" }}>
                                    ({d.shortName})
                                </span>
                            </div>
                            <span style={{ fontSize: "13px", fontFamily: "var(--mono)", color: d.color }}>{scores[d.key].toFixed(1)}</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{
                                height: "100%",
                                width: `${(scores[d.key] / 5) * 100}%`,
                                background: d.color,
                                borderRadius: "3px",
                                transition: "width 0.4s var(--ease)",
                            }} />
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "4px" }}>
                            {d.question}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// EVIDENCE LOCATION COVERAGE
// ============================================================================
function EvidenceLocationCoverage({ portfolio }) {
    const locationColors = {
        chip_hardware: "#0a84ff",
        data_center: "#bf5af2",
        supply_chain: "#ff9f0a",
        developer_lab: "#32d74b",
        institutional: "#ff453a",
        model_registry: "#64d2ff",
        deployment_point: "#ffd60a",
    };

    const locationCoverage = useMemo(() => {
        const coverage = {};
        Object.values(EVIDENCE_LOCATIONS).forEach(loc => {
            coverage[loc.id] = {
                ...loc,
                mechanisms: portfolio.filter(m => m.evidenceLocations?.includes(loc.id)),
                color: locationColors[loc.id] || "var(--text-tertiary)",
            };
        });
        return coverage;
    }, [portfolio]);

    const coveredCount = Object.values(locationCoverage).filter(c => c.mechanisms.length > 0).length;

    return (
        <div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                <div style={{ flex: 1, padding: "16px", background: "rgba(50, 215, 75, 0.08)", borderRadius: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>{coveredCount}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Locations Covered</div>
                </div>
                <div style={{ flex: 1, padding: "16px", background: "rgba(255, 69, 58, 0.08)", borderRadius: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--red)" }}>
                        {Object.keys(EVIDENCE_LOCATIONS).length - coveredCount}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Blind Spots</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {Object.values(locationCoverage).map((loc) => {
                    const isCovered = loc.mechanisms.length > 0;
                    return (
                        <div
                            key={loc.id}
                            style={{
                                padding: "12px",
                                background: isCovered ? `${loc.color}10` : "rgba(255,255,255,0.02)",
                                border: `1px solid ${isCovered ? `${loc.color}30` : "var(--border)"}`,
                                borderRadius: "10px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <div style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: isCovered ? loc.color : "var(--text-tertiary)",
                                }} />
                                <span style={{ 
                                    fontSize: "12px", 
                                    fontWeight: 600, 
                                    color: isCovered ? loc.color : "var(--text-tertiary)" 
                                }}>
                                    {loc.name.split('/')[0].trim()}
                                </span>
                            </div>
                            {isCovered ? (
                                <div style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
                                    {loc.mechanisms.map(m => m.shortName).join(', ')}
                                </div>
                            ) : (
                                <div style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
                                    Not covered
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================================
// OoV COVERAGE MATRIX
// ============================================================================
function CoverageMatrix({ portfolio }) {
    const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];

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
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <div style={{ flex: 1, padding: "14px", background: "rgba(50, 215, 75, 0.08)", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>{coveredCount}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Primary</div>
                </div>
                <div style={{ flex: 1, padding: "14px", background: "rgba(10, 132, 255, 0.08)", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--blue)" }}>{partialCount}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Partial</div>
                </div>
                <div style={{ flex: 1, padding: "14px", background: "rgba(255, 69, 58, 0.08)", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--red)" }}>{gapCount}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Gaps</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {coverageData.map((data, i) => (
                    <div
                        key={data.oov.id}
                        style={{
                            padding: "14px",
                            background: data.status === "covered" ? "rgba(50, 215, 75, 0.06)" : data.status === "partial" ? "rgba(10, 132, 255, 0.06)" : "rgba(255, 69, 58, 0.06)",
                            border: `1px solid ${data.status === "covered" ? "rgba(50, 215, 75, 0.2)" : data.status === "partial" ? "rgba(10, 132, 255, 0.2)" : "rgba(255, 69, 58, 0.2)"}`,
                            borderRadius: "10px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <div style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                background: ["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b"][i] + "20",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                fontWeight: 700,
                                fontFamily: "var(--mono)",
                                color: ["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b"][i],
                            }}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <div style={{ fontSize: "12px", fontWeight: 600 }}>{data.oov.shortName}</div>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                            {data.status === "covered" ? "Primary coverage" : data.status === "partial" ? "Partial coverage" : "No coverage"}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {data.mechanisms.map((m, j) => (
                                <span 
                                    key={j} 
                                    style={{ 
                                        fontSize: "10px", 
                                        color: m.coverage === "primary" ? "var(--accent)" : m.coverage === "partial" ? "var(--blue)" : "var(--text-tertiary)" 
                                    }}
                                >
                                    {m.coverage !== "none" && (
                                        <>
                                            {m.coverage === "primary" ? "Y" : "-"} {m.mechanism.shortName}
                                        </>
                                    )}
                                    </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function PortfolioPage({ theme, toggleTheme }) {
    const [searchParams] = useSearchParams();
    const [portfolio, setPortfolio] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const MAX_SELECTION = 3;

    // Handle recommended mechanisms from URL
    useEffect(() => {
        if (!initialized) {
            const recommended = searchParams.get('recommended');
            if (recommended) {
                const mechanismIds = recommended.split(',');
                const recommendedMechanisms = MECHANISMS.filter(m => mechanismIds.includes(m.id));
                setPortfolio(recommendedMechanisms.slice(0, MAX_SELECTION));
            }
            setInitialized(true);
        }
    }, [searchParams, initialized]);

    const sorted = useMemo(
        () => [...MECHANISMS].sort((a, b) => {
            const aScore = a.newScores ? (a.newScores.hardness + a.newScores.burden + a.newScores.intrusion + a.newScores.robustness) / 4 : 0;
            const bScore = b.newScores ? (b.newScores.hardness + b.newScores.burden + b.newScores.intrusion + b.newScores.robustness) / 4 : 0;
            return bScore - aScore;
        }),
        []
    );

    const toggleMechanism = (mechanism) => {
        if (portfolio.some(m => m.id === mechanism.id)) {
            setPortfolio(portfolio.filter(m => m.id !== mechanism.id));
        } else if (portfolio.length < MAX_SELECTION) {
            setPortfolio([...portfolio, mechanism]);
        }
    };

    const clearPortfolio = () => setPortfolio([]);

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 24px" }}>
                <SectionHeader
                    label="Strategy Builder"
                    title="Portfolio Sandbox"
                    subtitle={`Select up to ${MAX_SELECTION} verification mechanisms to simulate a treaty regime and analyze coverage, trade-offs, and blind spots`}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>
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
                                    <div style={{ fontSize: "48px", color: "var(--text-tertiary)", marginBottom: "16px" }}>+</div>
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
                                        {portfolio.map((m) => {
                                            const avgScore = m.newScores 
                                                ? (m.newScores.hardness + m.newScores.burden + m.newScores.intrusion + m.newScores.robustness) / 4 
                                                : 3.0;
                                            return (
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
                                                        {avgScore.toFixed(1)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </BentoCard>

                                {/* Radar Chart & Score Breakdown */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                    <BentoCard hoverable={false}>
                                        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "16px" }}>
                                            Portfolio Radar
                                        </div>
                                        <PortfolioRadarChart portfolio={portfolio} />
                                    </BentoCard>

                                    <BentoCard hoverable={false}>
                                        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "16px" }}>
                                            Dimension Scores
                                        </div>
                                        <NewScoreBreakdown portfolio={portfolio} />
                                    </BentoCard>
                                </div>

                                {/* Gap Analysis Alerts */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "16px" }}>
                                        Gap Analysis (Red Team Alert)
                                    </div>
                                    <GapAnalysisAlerts portfolio={portfolio} />
                                </BentoCard>

                                {/* Evidence Location Coverage */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "16px" }}>
                                        Evidence Location Coverage
                                    </div>
                                    <EvidenceLocationCoverage portfolio={portfolio} />
                                </BentoCard>

                                {/* OoV Coverage Matrix */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "16px" }}>
                                        OoV Coverage Analysis
                                    </div>
                                    <CoverageMatrix portfolio={portfolio} />
                                </BentoCard>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
