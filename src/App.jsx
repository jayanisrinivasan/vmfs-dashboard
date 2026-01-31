// VMFS Command Center - AI Safety Hackathon Edition
import { useState, useEffect, useRef } from "react";
import { MECHANISMS, OOVS, COVERAGE_MATRIX, KEY_FINDINGS } from "./vmfs-data";
import "./App.css";

// ============================================================================
// ANIMATED COUNTER
// ============================================================================
function Counter({ value, duration = 1500, suffix = "", decimals = 0 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count.toFixed(decimals)}{suffix}</span>;
}

// ============================================================================
// RADAR CHART (SVG)
// ============================================================================
function RadarChart({ mechanisms, selected, onSelect }) {
  const size = 300;
  const center = size / 2;
  const radius = 120;
  const dimensions = ["technicalFeasibility", "politicalTractability", "sovereigntyImpact", "globalSouthAdoptability"];
  const labels = ["Technical", "Political", "Sovereignty", "Global South"];

  const getPoint = (value, index, r = radius) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
    const distance = (value / 5) * r;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };

  const getPolygonPoints = (mechanism) => {
    return dimensions.map((dim, i) => {
      const p = getPoint(mechanism.vmfsScores[dim], i);
      return `${p.x},${p.y}`;
    }).join(" ");
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: "400px" }}>
      {/* Grid circles */}
      {[1, 2, 3, 4, 5].map(level => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 5) * radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const p = getPoint(5, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}

      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(5.8, i);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            fill="#8888a0"
            fontSize="10"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}

      {/* Mechanism polygons */}
      {mechanisms.slice(0, 4).map((m, idx) => {
        const isSelected = selected?.id === m.id;
        const colors = ["#4b7bec", "#a855f7", "#fbbf24", "#22c55e"];
        return (
          <polygon
            key={m.id}
            points={getPolygonPoints(m)}
            fill={isSelected ? `${colors[idx]}30` : `${colors[idx]}10`}
            stroke={colors[idx]}
            strokeWidth={isSelected ? 2.5 : 1.5}
            opacity={selected && !isSelected ? 0.3 : 1}
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
            onClick={() => onSelect(m)}
          />
        );
      })}
    </svg>
  );
}

// ============================================================================
// SCATTER PLOT
// ============================================================================
function ScatterPlot({ mechanisms, selected, onSelect }) {
  const width = 400;
  const height = 300;
  const padding = 40;

  const xScale = (v) => padding + ((v - 1) / 4) * (width - padding * 2);
  const yScale = (v) => height - padding - ((v - 1) / 4) * (height - padding * 2);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%" }}>
      {/* Grid */}
      {[1, 2, 3, 4, 5].map(v => (
        <g key={v}>
          <line x1={xScale(v)} y1={padding} x2={xScale(v)} y2={height - padding} stroke="rgba(255,255,255,0.06)" />
          <line x1={padding} y1={yScale(v)} x2={width - padding} y2={yScale(v)} stroke="rgba(255,255,255,0.06)" />
        </g>
      ))}

      {/* Quadrant labels */}
      <text x={width - padding - 5} y={padding + 15} fill="#555566" fontSize="10" textAnchor="end">High PT, High TF</text>
      <text x={padding + 5} y={height - padding - 10} fill="#555566" fontSize="10">Low PT, Low TF</text>

      {/* Axis labels */}
      <text x={width / 2} y={height - 8} fill="#8888a0" fontSize="11" textAnchor="middle">Technical Feasibility →</text>
      <text x={12} y={height / 2} fill="#8888a0" fontSize="11" textAnchor="middle" transform={`rotate(-90, 12, ${height / 2})`}>Political Tractability →</text>

      {/* Points */}
      {mechanisms.map((m) => {
        const isSelected = selected?.id === m.id;
        const x = xScale(m.vmfsScores.technicalFeasibility);
        const y = yScale(m.vmfsScores.politicalTractability);
        const size = 6 + m.vmfsScores.weightedAvg * 2;

        return (
          <g key={m.id} style={{ cursor: "pointer" }} onClick={() => onSelect(m)}>
            <circle
              cx={x}
              cy={y}
              r={size}
              fill={isSelected ? "var(--accent)" : "var(--blue)"}
              opacity={selected && !isSelected ? 0.3 : 0.8}
              style={{ transition: "all 0.3s ease" }}
            />
            {isSelected && (
              <circle
                cx={x}
                cy={y}
                r={size + 4}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                opacity="0.5"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// MECHANISM CARD (Compact)
// ============================================================================
function MechanismCard({ m, isSelected, onClick, index }) {
  const cov = COVERAGE_MATRIX.find(c => c.mechanismId === m.id);
  const covCount = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"]
    .filter(k => cov?.[k]?.coverage === "primary" || cov?.[k]?.coverage === "partial").length;

  return (
    <div
      onClick={onClick}
      style={{
        padding: "20px",
        background: isSelected ? "var(--bg-elevated)" : "var(--bg-card)",
        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Rank badge */}
      <div style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 600,
        color: "var(--text-dim)",
      }}>
        {index + 1}
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px", paddingRight: "30px" }}>
        {m.shortName}
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <span style={{
          fontSize: "28px",
          fontWeight: 700,
          fontFamily: "var(--mono)",
          color: m.vmfsScores.weightedAvg >= 3.5 ? "var(--accent)" : m.vmfsScores.weightedAvg >= 2.5 ? "var(--amber)" : "var(--red)",
        }}>
          {m.vmfsScores.weightedAvg.toFixed(1)}
        </span>
        <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
          <div>Feasibility Score</div>
          <div style={{ color: "var(--text-muted)" }}>{covCount}/4 OoVs covered</div>
        </div>
      </div>

      {/* Mini score bars */}
      <div style={{ display: "flex", gap: "4px" }}>
        {[
          { v: m.vmfsScores.technicalFeasibility, c: "#4b7bec" },
          { v: m.vmfsScores.politicalTractability, c: "#a855f7" },
          { v: m.vmfsScores.sovereigntyImpact, c: "#fbbf24" },
          { v: m.vmfsScores.globalSouthAdoptability, c: "#22c55e" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(s.v / 5) * 100}%`, background: s.c, borderRadius: "2px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// DETAIL PANEL
// ============================================================================
function DetailPanel({ mechanism, onClose }) {
  if (!mechanism) return null;
  const cov = COVERAGE_MATRIX.find(c => c.mechanismId === mechanism.id);
  const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "90%", maxWidth: "700px", maxHeight: "85vh", overflowY: "auto",
        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px",
        zIndex: 101, padding: "32px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>{mechanism.shortName}</h2>
            <p style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.6 }}>{mechanism.definition}</p>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: "none", borderRadius: "8px",
            padding: "8px 16px", color: "var(--text-dim)", cursor: "pointer", fontSize: "13px",
          }}>Close</button>
        </div>

        {/* Score grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Technical", value: mechanism.vmfsScores.technicalFeasibility, color: "#4b7bec" },
            { label: "Political", value: mechanism.vmfsScores.politicalTractability, color: "#a855f7" },
            { label: "Sovereignty", value: mechanism.vmfsScores.sovereigntyImpact, color: "#fbbf24" },
            { label: "Global South", value: mechanism.vmfsScores.globalSouthAdoptability, color: "#22c55e" },
            { label: "Average", value: mechanism.vmfsScores.weightedAvg, color: "var(--accent)" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px", background: "var(--bg-elevated)", borderRadius: "10px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>{s.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--mono)", color: s.color }}>{s.value.toFixed(1)}</div>
            </div>
          ))}
        </div>

        {/* OoV Coverage */}
        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>Object of Verification Coverage</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {OOVS.map((oov, i) => {
              const cell = cov?.[oovKeys[i]];
              const isPrimary = cell?.coverage === "primary";
              const isPartial = cell?.coverage === "partial";
              return (
                <div key={oov.id} style={{
                  padding: "12px",
                  background: isPrimary ? "rgba(0, 212, 170, 0.1)" : isPartial ? "rgba(75, 123, 236, 0.1)" : "var(--bg-elevated)",
                  border: `1px solid ${isPrimary ? "rgba(0, 212, 170, 0.3)" : isPartial ? "rgba(75, 123, 236, 0.3)" : "var(--border)"}`,
                  borderRadius: "8px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>{oov.shortName}</div>
                  <div style={{ fontSize: "11px", color: isPrimary ? "var(--accent)" : isPartial ? "var(--blue)" : "var(--text-muted)" }}>
                    {isPrimary ? "● Primary" : isPartial ? "◐ Partial" : "○ None"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Limitations */}
        <div style={{ padding: "16px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", marginBottom: "16px" }}>
          <h4 style={{ fontSize: "12px", color: "var(--red)", textTransform: "uppercase", marginBottom: "8px" }}>Key Limitations</h4>
          <p style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6 }}>{mechanism.limitations.primary}</p>
        </div>

        {/* Evasion */}
        <div>
          <h4 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Evasion Vectors</h4>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {mechanism.evasionModes.map((e, i) => (
              <span key={i} style={{ padding: "4px 10px", background: "var(--bg-elevated)", borderRadius: "4px", fontSize: "12px", color: "var(--text-dim)" }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================
export default function App() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("radar"); // radar | matrix | list
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);

  const sorted = [...MECHANISMS].sort((a, b) => b.vmfsScores.weightedAvg - a.vmfsScores.weightedAvg);
  const topMechanism = sorted[0];
  const avgScore = (MECHANISMS.reduce((a, m) => a + m.vmfsScores.weightedAvg, 0) / MECHANISMS.length);
  const coverage = COVERAGE_MATRIX.flatMap(c => ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"].map(k => c[k]?.coverage))
    .filter(c => c === "primary").length;

  const handleSelect = (m) => {
    if (compareMode) {
      if (compareList.find(x => x.id === m.id)) {
        setCompareList(compareList.filter(x => x.id !== m.id));
      } else if (compareList.length < 4) {
        setCompareList([...compareList, m]);
      }
    } else {
      setSelected(m);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5, 5, 8, 0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: "var(--accent)", boxShadow: "0 0 10px var(--accent)",
            }} />
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>VMFS Command Center</h1>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                VERIFICATION MECHANISM FEASIBILITY SCORER
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["radar", "matrix", "list"].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "8px 16px",
                  background: view === v ? "var(--accent)" : "transparent",
                  border: `1px solid ${view === v ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "6px",
                  color: view === v ? "var(--bg)" : "var(--text-dim)",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Mechanisms Analyzed", value: MECHANISMS.length, suffix: "" },
            { label: "Top Scorer", value: topMechanism.vmfsScores.weightedAvg, suffix: "", decimals: 1, sub: topMechanism.shortName },
            { label: "Avg Feasibility", value: avgScore, suffix: "/5", decimals: 1 },
            { label: "Primary Coverage", value: coverage, suffix: "", sub: "OoV assignments" },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: "24px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "36px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>
                <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </div>
              {stat.sub && <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>{stat.sub}</div>}
            </div>
          ))}
        </div>

        {/* Key Finding Banner */}
        <div style={{
          padding: "20px 24px",
          background: "linear-gradient(90deg, rgba(0, 212, 170, 0.1), rgba(75, 123, 236, 0.1))",
          border: "1px solid rgba(0, 212, 170, 0.2)",
          borderRadius: "12px",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <span style={{ fontSize: "24px" }}>💡</span>
          <div>
            <strong style={{ color: "var(--accent)" }}>Key Insight:</strong>
            <span style={{ color: "var(--text-dim)", marginLeft: "8px" }}>
              No single mechanism achieves scores above 4.0 across all dimensions. Layered approaches combining multiple mechanisms are required for robust verification.
            </span>
          </div>
        </div>

        {/* Main View */}
        <div style={{ display: "grid", gridTemplateColumns: view === "list" ? "1fr" : "1fr 1fr", gap: "24px" }}>
          {/* Left: Visualization */}
          {view !== "list" && (
            <div style={{
              padding: "24px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
            }}>
              <h3 style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "20px" }}>
                {view === "radar" ? "Mechanism Comparison Radar" : "Feasibility Matrix"}
              </h3>

              {view === "radar" && (
                <>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <RadarChart mechanisms={sorted.slice(0, 4)} selected={selected} onSelect={handleSelect} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                    {sorted.slice(0, 4).map((m, i) => {
                      const colors = ["#4b7bec", "#a855f7", "#fbbf24", "#22c55e"];
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleSelect(m)}
                          style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            padding: "6px 12px",
                            background: selected?.id === m.id ? `${colors[i]}20` : "transparent",
                            border: `1px solid ${selected?.id === m.id ? colors[i] : "var(--border)"}`,
                            borderRadius: "6px", cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: colors[i] }} />
                          <span style={{ fontSize: "12px" }}>{m.shortName}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {view === "matrix" && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ScatterPlot mechanisms={MECHANISMS} selected={selected} onSelect={handleSelect} />
                </div>
              )}
            </div>
          )}

          {/* Right: Mechanism List */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                All Mechanisms (Ranked)
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: view === "list" ? "repeat(3, 1fr)" : "1fr", gap: "12px" }}>
              {sorted.map((m, i) => (
                <MechanismCard
                  key={m.id}
                  m={m}
                  index={i}
                  isSelected={selected?.id === m.id}
                  onClick={() => handleSelect(m)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* OoV Summary */}
        <div style={{ marginTop: "32px" }}>
          <h3 style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
            Objects of Verification
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {OOVS.map((oov, i) => {
              const key = `oov${i + 1}_${oov.id.split("_")[1]}`;
              const primaryCount = COVERAGE_MATRIX.filter(c => c[key]?.coverage === "primary").length;
              const partialCount = COVERAGE_MATRIX.filter(c => c[key]?.coverage === "partial").length;
              return (
                <div key={oov.id} style={{
                  padding: "20px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>{oov.shortName}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "12px" }}>{oov.definition.slice(0, 80)}...</div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ fontSize: "12px", color: "var(--accent)" }}>● {primaryCount} primary</span>
                    <span style={{ fontSize: "12px", color: "var(--blue)" }}>◐ {partialCount} partial</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <DetailPanel mechanism={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
