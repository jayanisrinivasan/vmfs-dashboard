// VMFS Command Center - Interactive Edition with Draggable Radar
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { MECHANISMS, OOVS, COVERAGE_MATRIX, KEY_FINDINGS } from "./vmfs-data";
import "./App.css";

// ============================================================================
// ANIMATED COUNTER
// ============================================================================
function Counter({ value, duration = 1200, suffix = "", decimals = 0 }) {
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
// TOOLTIP
// ============================================================================
function Tooltip({ children, text }) {
  const [show, setShow] = useState(false);
  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: "relative", display: "inline-block" }}
    >
      {children}
      {show && (
        <div style={{
          position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
          padding: "6px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: "6px", fontSize: "12px", color: "var(--text)", whiteSpace: "nowrap",
          zIndex: 1000, marginBottom: "4px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}>
          {text}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SLIDER
// ============================================================================
function Slider({ label, value, onChange, min = 0, max = 5, step = 0.5 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ fontSize: "12px", color: "var(--text-dim)", minWidth: "80px" }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: "var(--accent)", cursor: "pointer" }} />
      <span style={{ fontSize: "13px", fontFamily: "var(--mono)", color: "var(--accent)", minWidth: "30px" }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

// ============================================================================
// INTERACTIVE RADAR CHART
// ============================================================================
function InteractiveRadar({ mechanism, customScores, onScoreChange, onReset, compareList }) {
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [hovered, setHovered] = useState(null);

  // Sizing - extra padding for labels
  const padding = 80;
  const radarSize = 280;
  const size = radarSize + padding * 2;
  const center = size / 2;
  const radius = radarSize / 2;

  const dimensions = [
    { key: "technicalFeasibility", label: "Technical", short: "TF" },
    { key: "politicalTractability", label: "Political", short: "PT" },
    { key: "sovereigntyImpact", label: "Sovereignty", short: "SI" },
    { key: "globalSouthAdoptability", label: "Global South", short: "GSA" },
  ];
  const colors = ["#00d4aa", "#4b7bec", "#a855f7", "#fbbf24"];

  const scores = customScores || mechanism.vmfsScores;
  const hasCustom = customScores !== null;

  const getPoint = useCallback((value, index, r = radius) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
    const distance = (value / 5) * r;
    return { x: center + Math.cos(angle) * distance, y: center + Math.sin(angle) * distance };
  }, [center, radius, dimensions.length]);

  const getPolygonPoints = useCallback((scoreObj) =>
    dimensions.map((dim, i) => {
      const p = getPoint(scoreObj[dim.key], i);
      return `${p.x},${p.y}`;
    }).join(" "), [dimensions, getPoint]);

  // Calculate score from mouse position
  const getScoreFromPosition = useCallback((clientX, clientY, dimIndex) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * size;
    const svgY = ((clientY - rect.top) / rect.height) * size;

    const dx = svgX - center;
    const dy = svgY - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const score = Math.min(5, Math.max(1, (distance / radius) * 5));
    return Math.round(score * 10) / 10;
  }, [center, radius, size]);

  const handleMouseDown = (dimIndex) => (e) => {
    e.preventDefault();
    setDragging(dimIndex);
  };

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return;
    const newScore = getScoreFromPosition(e.clientX, e.clientY, dragging);
    if (newScore !== null) {
      onScoreChange(dimensions[dragging].key, newScore);
    }
  }, [dragging, getScoreFromPosition, onScoreChange, dimensions]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const calcAvg = (s) => (s.technicalFeasibility + s.politicalTractability + s.sovereigntyImpact + s.globalSouthAdoptability) / 4;
  const currentAvg = calcAvg(scores);
  const originalAvg = calcAvg(mechanism.vmfsScores);

  // Fixed label positions (manually positioned to avoid clipping)
  const labelPositions = [
    { x: center, y: 25, anchor: "middle" },           // Top - Technical
    { x: size - 25, y: center, anchor: "end" },       // Right - Political
    { x: center, y: size - 25, anchor: "middle" },    // Bottom - Sovereignty  
    { x: 25, y: center, anchor: "start" },            // Left - Global South
  ];

  return (
    <div style={{ overflow: "visible" }}>
      <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: "500px", cursor: dragging !== null ? "grabbing" : "default", overflow: "visible" }}>
        {/* Grid circles */}
        {[1, 2, 3, 4, 5].map(level => (
          <circle key={level} cx={center} cy={center} r={(level / 5) * radius}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        ))}

        {/* Axis lines */}
        {dimensions.map((_, i) => {
          const p = getPoint(5, i);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.12)" />;
        })}

        {/* Scale numbers */}
        {[1, 2, 3, 4, 5].map(level => (
          <text key={level} x={center + 8} y={center - (level / 5) * radius + 4}
            fill="#555566" fontSize="10" fontFamily="var(--mono)">{level}</text>
        ))}

        {/* Labels - fixed positions */}
        {dimensions.map((dim, i) => {
          const pos = labelPositions[i];
          const isHovered = hovered === i;
          const scoreY = i === 0 ? pos.y + 16 : i === 2 ? pos.y - 16 : pos.y + 18;

          return (
            <g key={i}>
              <text x={pos.x} y={pos.y} fill={isHovered ? "var(--accent)" : "#9999aa"} fontSize="13" fontWeight="500"
                textAnchor={pos.anchor} dominantBaseline="middle" style={{ transition: "fill 0.2s" }}>
                {dim.label}
              </text>
              <text x={pos.x} y={scoreY} fill={hasCustom ? "var(--accent)" : "#888899"} fontSize="13"
                fontFamily="var(--mono)" textAnchor={pos.anchor} dominantBaseline="middle" fontWeight="600">
                {scores[dim.key].toFixed(1)}
              </text>
            </g>
          );
        })}


        {/* Original polygon (faded) */}
        {hasCustom && (
          <polygon
            points={getPolygonPoints(mechanism.vmfsScores)}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        )}

        {/* Compare list polygons */}
        {compareList.filter(m => m.id !== mechanism.id).map((m, idx) => (
          <polygon
            key={m.id}
            points={getPolygonPoints(m.vmfsScores)}
            fill={`${colors[(idx + 1) % colors.length]}15`}
            stroke={colors[(idx + 1) % colors.length]}
            strokeWidth="1.5"
            opacity={0.6}
          />
        ))}

        {/* Current polygon */}
        <polygon
          points={getPolygonPoints(scores)}
          fill={hasCustom ? "rgba(0, 212, 170, 0.15)" : "rgba(0, 212, 170, 0.12)"}
          stroke="var(--accent)"
          strokeWidth="2"
          style={{ transition: dragging === null ? "all 0.15s ease" : "none" }}
        />

        {/* Draggable points */}
        {dimensions.map((dim, i) => {
          const p = getPoint(scores[dim.key], i);
          const isDragging = dragging === i;
          const isHover = hovered === i;
          return (
            <g key={i}>
              {/* Hit area (larger for easier grabbing) */}
              <circle
                cx={p.x} cy={p.y} r="20"
                fill="transparent"
                style={{ cursor: "grab" }}
                onMouseDown={handleMouseDown(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              {/* Outer ring on hover/drag */}
              {(isDragging || isHover) && (
                <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
              )}
              {/* Main point */}
              <circle
                cx={p.x} cy={p.y} r={isDragging ? 10 : 7}
                fill="var(--accent)"
                stroke="var(--bg)"
                strokeWidth="3"
                style={{ cursor: isDragging ? "grabbing" : "grab", transition: isDragging ? "none" : "all 0.15s ease" }}
              />
            </g>
          );
        })}
      </svg>

      {/* Score display */}
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
              {hasCustom ? "Adjusted Score" : "Weighted Avg"}
            </div>
            <div style={{
              fontSize: "32px", fontWeight: 700, fontFamily: "var(--mono)",
              color: hasCustom ? "var(--accent)" : "var(--text)",
            }}>
              {currentAvg.toFixed(2)}
            </div>
          </div>

          {hasCustom && (
            <>
              <div style={{ color: "var(--text-muted)" }}>←</div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                  Original
                </div>
                <div style={{ fontSize: "24px", fontWeight: 600, fontFamily: "var(--mono)", color: "var(--text-dim)" }}>
                  {originalAvg.toFixed(2)}
                </div>
              </div>
            </>
          )}
        </div>

        {hasCustom && (
          <button onClick={onReset} style={{
            marginTop: "16px", padding: "8px 20px",
            background: "transparent", border: "1px solid var(--border)",
            borderRadius: "6px", color: "var(--text-dim)", cursor: "pointer", fontSize: "12px",
          }}>
            Reset to Original
          </button>
        )}

        <p style={{ marginTop: "12px", fontSize: "11px", color: "var(--text-muted)" }}>
          💡 Drag the points to explore "what-if" scenarios
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// SCATTER PLOT
// ============================================================================
function ScatterPlot({ mechanisms, selected, onSelect, xDim, yDim }) {
  const width = 450;
  const height = 350;
  const padding = 50;

  const dimLabels = {
    technicalFeasibility: "Technical",
    politicalTractability: "Political",
    sovereigntyImpact: "Sovereignty",
    globalSouthAdoptability: "Global South",
  };

  const xScale = (v) => padding + ((v - 1) / 4) * (width - padding * 2);
  const yScale = (v) => height - padding - ((v - 1) / 4) * (height - padding * 2);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%" }}>
      {[1, 2, 3, 4, 5].map(v => (
        <g key={v}>
          <line x1={xScale(v)} y1={padding} x2={xScale(v)} y2={height - padding} stroke="rgba(255,255,255,0.06)" />
          <line x1={padding} y1={yScale(v)} x2={width - padding} y2={yScale(v)} stroke="rgba(255,255,255,0.06)" />
          <text x={xScale(v)} y={height - padding + 15} fill="#555566" fontSize="10" textAnchor="middle">{v}</text>
          <text x={padding - 10} y={yScale(v) + 4} fill="#555566" fontSize="10" textAnchor="end">{v}</text>
        </g>
      ))}
      <rect x={xScale(3)} y={padding} width={width - padding - xScale(3)} height={yScale(3) - padding} fill="rgba(0, 212, 170, 0.03)" />
      <text x={width / 2} y={height - 10} fill="#8888a0" fontSize="11" textAnchor="middle">{dimLabels[xDim]} →</text>
      <text x={15} y={height / 2} fill="#8888a0" fontSize="11" textAnchor="middle" transform={`rotate(-90, 15, ${height / 2})`}>{dimLabels[yDim]} →</text>
      {mechanisms.map((m) => {
        const isSelected = selected?.id === m.id;
        const x = xScale(m.vmfsScores[xDim]);
        const y = yScale(m.vmfsScores[yDim]);
        const size = 6 + m.vmfsScores.weightedAvg * 1.5;
        return (
          <g key={m.id} style={{ cursor: "pointer" }} onClick={() => onSelect(m)}>
            {isSelected && (
              <circle cx={x} cy={y} r={size + 8} fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3">
                <animate attributeName="r" from={size + 4} to={size + 12} dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={x} cy={y} r={size} fill={isSelected ? "var(--accent)" : "var(--blue)"} opacity={0.9} />
            {isSelected && <text x={x} y={y - size - 8} fill="var(--accent)" fontSize="10" textAnchor="middle">{m.shortName}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// MECHANISM CARD
// ============================================================================
function MechanismCard({ m, isSelected, isComparing, onClick, index, onCompareToggle, customScores }) {
  const cov = COVERAGE_MATRIX.find(c => c.mechanismId === m.id);
  const covCount = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"]
    .filter(k => cov?.[k]?.coverage === "primary" || cov?.[k]?.coverage === "partial").length;

  const scores = customScores || m.vmfsScores;
  const hasCustom = customScores !== null && isSelected;
  const avg = hasCustom
    ? (scores.technicalFeasibility + scores.politicalTractability + scores.sovereigntyImpact + scores.globalSouthAdoptability) / 4
    : m.vmfsScores.weightedAvg;

  return (
    <div onClick={onClick} style={{
      padding: "20px",
      background: isSelected ? "rgba(0, 212, 170, 0.08)" : isComparing ? "rgba(75, 123, 236, 0.08)" : "var(--bg-card)",
      border: `1px solid ${isSelected ? "var(--accent)" : isComparing ? "var(--blue)" : "var(--border)"}`,
      borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease", position: "relative",
    }}>
      <div style={{
        position: "absolute", top: "12px", right: "12px",
        width: "24px", height: "24px", borderRadius: "50%",
        background: index < 3 ? "var(--accent)" : "rgba(255,255,255,0.05)",
        color: index < 3 ? "var(--bg)" : "var(--text-dim)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "11px", fontWeight: 700,
      }}>{index + 1}</div>

      <div onClick={(e) => { e.stopPropagation(); onCompareToggle(); }} style={{
        position: "absolute", bottom: "12px", right: "12px",
        width: "20px", height: "20px", borderRadius: "4px",
        border: `2px solid ${isComparing ? "var(--blue)" : "var(--border)"}`,
        background: isComparing ? "var(--blue)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }}>
        {isComparing && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px", paddingRight: "30px" }}>{m.shortName}</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <span style={{
          fontSize: "28px", fontWeight: 700, fontFamily: "var(--mono)",
          color: avg >= 3.5 ? "var(--accent)" : avg >= 2.5 ? "var(--amber)" : "var(--red)",
        }}>
          {avg.toFixed(1)}
        </span>
        <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
          <div>{hasCustom ? "Adjusted" : "Feasibility"}</div>
          <div style={{ color: "var(--text-muted)" }}>{covCount}/4 OoVs</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        {[
          { v: scores.technicalFeasibility, c: "#4b7bec", l: "TF" },
          { v: scores.politicalTractability, c: "#a855f7", l: "PT" },
          { v: scores.sovereigntyImpact, c: "#fbbf24", l: "SI" },
          { v: scores.globalSouthAdoptability, c: "#22c55e", l: "GSA" },
        ].map((s, i) => (
          <Tooltip key={i} text={`${s.l}: ${s.v.toFixed(1)}`}>
            <div style={{ flex: 1 }}>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(s.v / 5) * 100}%`, background: s.c, borderRadius: "3px", transition: "width 0.3s" }} />
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPARISON PANEL
// ============================================================================
function ComparePanel({ mechanisms, onClose }) {
  if (mechanisms.length < 2) return null;

  const dimensions = [
    { key: "technicalFeasibility", label: "Technical", color: "#4b7bec" },
    { key: "politicalTractability", label: "Political", color: "#a855f7" },
    { key: "sovereigntyImpact", label: "Sovereignty", color: "#fbbf24" },
    { key: "globalSouthAdoptability", label: "Global South", color: "#22c55e" },
    { key: "weightedAvg", label: "Average", color: "var(--accent)" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "var(--bg-card)", borderTop: "1px solid var(--accent)",
      padding: "24px 32px", zIndex: 100, animation: "slideUp 0.3s ease",
    }}>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Comparing {mechanisms.length} Mechanisms</h3>
          <button onClick={onClose} style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            borderRadius: "6px", padding: "8px 16px", color: "var(--text-dim)", cursor: "pointer", fontSize: "13px",
          }}>Close</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${mechanisms.length}, 1fr)`, gap: "12px" }}>
          <div>{dimensions.map(d => <div key={d.key} style={{ height: "36px", display: "flex", alignItems: "center", fontSize: "12px", color: d.color }}>{d.label}</div>)}</div>
          {mechanisms.map((m, i) => (
            <div key={m.id}>
              <div style={{ marginBottom: "8px", padding: "6px", background: "var(--bg-elevated)", borderRadius: "6px", textAlign: "center", fontWeight: 600, fontSize: "13px" }}>{m.shortName}</div>
              {dimensions.map(d => {
                const value = m.vmfsScores[d.key];
                const isMax = value === Math.max(...mechanisms.map(x => x.vmfsScores[d.key]));
                return (
                  <div key={d.key} style={{ height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: isMax ? `${d.color}15` : "transparent", borderRadius: "4px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 600, fontFamily: "var(--mono)", color: isMax ? d.color : "var(--text-dim)" }}>{value.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DETAIL MODAL
// ============================================================================
function DetailModal({ mechanism, onClose }) {
  if (!mechanism) return null;
  const cov = COVERAGE_MATRIX.find(c => c.mechanismId === mechanism.id);
  const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "90%", maxWidth: "700px", maxHeight: "85vh", overflowY: "auto",
        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", zIndex: 201,
      }}>
        <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg-card)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>{mechanism.shortName}</h2>
            <span style={{ padding: "4px 12px", background: "var(--accent-glow)", border: "1px solid var(--border-accent)", borderRadius: "4px", fontSize: "14px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 600 }}>
              Score: {mechanism.vmfsScores.weightedAvg.toFixed(1)}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "24px", color: "var(--text-muted)" }}>×</button>
        </div>
        <div style={{ padding: "24px 32px" }}>
          <p style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "24px" }}>{mechanism.definition}</p>
          <div style={{ marginBottom: "24px" }}>
            {[
              { key: "technicalFeasibility", label: "Technical Feasibility", color: "#4b7bec" },
              { key: "politicalTractability", label: "Political Tractability", color: "#a855f7" },
              { key: "sovereigntyImpact", label: "Sovereignty Impact", color: "#fbbf24" },
              { key: "globalSouthAdoptability", label: "Global South Adoptability", color: "#22c55e" },
            ].map(d => (
              <div key={d.key} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>{d.label}</span>
                  <span style={{ fontSize: "13px", fontFamily: "var(--mono)", color: d.color }}>{mechanism.vmfsScores[d.key].toFixed(1)}</span>
                </div>
                <div style={{ height: "8px", background: "var(--bg-elevated)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(mechanism.vmfsScores[d.key] / 5) * 100}%`, background: d.color, borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>Verification Coverage</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {OOVS.map((oov, i) => {
                const cell = cov?.[oovKeys[i]];
                const isPrimary = cell?.coverage === "primary";
                const isPartial = cell?.coverage === "partial";
                return (
                  <div key={oov.id} style={{
                    padding: "14px",
                    background: isPrimary ? "rgba(0, 212, 170, 0.08)" : isPartial ? "rgba(75, 123, 236, 0.08)" : "var(--bg-elevated)",
                    border: `1px solid ${isPrimary ? "rgba(0, 212, 170, 0.25)" : isPartial ? "rgba(75, 123, 236, 0.25)" : "var(--border)"}`,
                    borderRadius: "8px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ color: isPrimary ? "var(--accent)" : isPartial ? "var(--blue)" : "var(--text-muted)" }}>{isPrimary ? "●" : isPartial ? "◐" : "○"}</span>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>{oov.shortName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ padding: "16px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "10px", marginBottom: "20px" }}>
            <h4 style={{ fontSize: "12px", color: "var(--red)", textTransform: "uppercase", marginBottom: "8px" }}>⚠ Key Limitations</h4>
            <p style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>{mechanism.limitations.primary}</p>
          </div>
          <div>
            <h4 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Evasion Vectors</h4>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {mechanism.evasionModes.map((e, i) => <span key={i} style={{ padding: "5px 10px", background: "var(--bg-elevated)", borderRadius: "4px", fontSize: "12px", color: "var(--text-dim)" }}>{e}</span>)}
            </div>
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
  const [detailOpen, setDetailOpen] = useState(null);
  const [view, setView] = useState("radar");
  const [compareList, setCompareList] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [scatterX, setScatterX] = useState("technicalFeasibility");
  const [scatterY, setScatterY] = useState("politicalTractability");
  const [customScores, setCustomScores] = useState(null);

  const sorted = useMemo(() =>
    [...MECHANISMS].filter(m => m.vmfsScores.weightedAvg >= minScore)
      .sort((a, b) => b.vmfsScores.weightedAvg - a.vmfsScores.weightedAvg),
    [minScore]
  );

  // Set initial selected
  useEffect(() => {
    if (!selected && sorted.length > 0) setSelected(sorted[0]);
  }, [sorted, selected]);

  const avgScore = MECHANISMS.reduce((a, m) => a + m.vmfsScores.weightedAvg, 0) / MECHANISMS.length;
  const topMechanism = sorted[0];

  const toggleCompare = (m) => {
    if (compareList.find(x => x.id === m.id)) {
      setCompareList(compareList.filter(x => x.id !== m.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, m]);
    }
  };

  const handleScoreChange = (key, value) => {
    if (!selected) return;
    const base = customScores || { ...selected.vmfsScores };
    setCustomScores({ ...base, [key]: value });
  };

  const handleSelectMechanism = (m) => {
    setSelected(m);
    setCustomScores(null); // Reset custom scores when switching
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: compareList.length > 1 ? "200px" : 0 }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5, 5, 8, 0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 12px var(--accent)", animation: "pulse 2s infinite" }} />
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: 700 }}>VMFS Command Center</h1>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>VERIFICATION MECHANISM FEASIBILITY SCORER</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", gap: "4px", background: "var(--bg-card)", padding: "4px", borderRadius: "8px" }}>
              {["radar", "matrix", "list"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: "6px 14px", background: view === v ? "var(--accent)" : "transparent",
                  border: "none", borderRadius: "6px", color: view === v ? "var(--bg)" : "var(--text-dim)",
                  fontSize: "12px", fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
                }}>{v}</button>
              ))}
            </div>
            {compareList.length > 0 && (
              <div style={{ padding: "6px 14px", background: "var(--blue)", borderRadius: "6px", fontSize: "12px", fontWeight: 600, color: "#fff" }}>
                {compareList.length} selected
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        {/* Controls */}
        <div style={{
          display: "flex", gap: "24px", alignItems: "center",
          padding: "16px 20px", background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: "12px", marginBottom: "24px",
        }}>
          <Slider label="Min Score" value={minScore} onChange={setMinScore} min={0} max={4} step={0.5} />
          {view === "matrix" && (
            <>
              <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-dim)" }}>
                X: <select value={scatterX} onChange={(e) => setScatterX(e.target.value)} style={{ padding: "6px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", fontSize: "12px", cursor: "pointer" }}>
                  <option value="technicalFeasibility">Technical</option>
                  <option value="politicalTractability">Political</option>
                  <option value="sovereigntyImpact">Sovereignty</option>
                  <option value="globalSouthAdoptability">Global South</option>
                </select>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-dim)" }}>
                Y: <select value={scatterY} onChange={(e) => setScatterY(e.target.value)} style={{ padding: "6px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", fontSize: "12px", cursor: "pointer" }}>
                  <option value="politicalTractability">Political</option>
                  <option value="technicalFeasibility">Technical</option>
                  <option value="sovereigntyImpact">Sovereignty</option>
                  <option value="globalSouthAdoptability">Global South</option>
                </select>
              </label>
            </>
          )}
          <div style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)" }}>
            Click card → View details • Checkbox → Compare
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Showing", value: sorted.length, suffix: `/${MECHANISMS.length}` },
            { label: "Top Score", value: topMechanism?.vmfsScores.weightedAvg || 0, decimals: 1, sub: topMechanism?.shortName },
            { label: "Avg Score", value: avgScore, suffix: "/5", decimals: 1 },
            { label: "Comparing", value: compareList.length, suffix: " selected" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>{stat.label}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>
                <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </div>
              {stat.sub && <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "2px" }}>{stat.sub}</div>}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: view === "list" ? "1fr" : "1fr 1fr", gap: "24px" }}>
          {/* Visualization */}
          {view !== "list" && (
            <div style={{ padding: "24px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {view === "radar" ? "Interactive Radar" : "Feasibility Matrix"}
                </h3>
                {selected && view === "radar" && (
                  <span style={{ fontSize: "12px", color: "var(--accent)" }}>{selected.shortName}</span>
                )}
              </div>

              {view === "radar" && selected && (
                <InteractiveRadar
                  mechanism={selected}
                  customScores={customScores}
                  onScoreChange={handleScoreChange}
                  onReset={() => setCustomScores(null)}
                  compareList={compareList}
                />
              )}

              {view === "matrix" && (
                <ScatterPlot mechanisms={sorted} selected={selected} onSelect={handleSelectMechanism} xDim={scatterX} yDim={scatterY} />
              )}
            </div>
          )}

          {/* Cards */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: view === "list" ? "repeat(3, 1fr)" : "1fr", gap: "12px" }}>
              {sorted.map((m, i) => (
                <MechanismCard
                  key={m.id}
                  m={m}
                  index={i}
                  isSelected={selected?.id === m.id}
                  isComparing={!!compareList.find(x => x.id === m.id)}
                  onClick={() => handleSelectMechanism(m)}
                  onCompareToggle={() => toggleCompare(m)}
                  customScores={selected?.id === m.id ? customScores : null}
                />
              ))}
            </div>

            {/* Open full details button */}
            {selected && (
              <button onClick={() => setDetailOpen(selected)} style={{
                marginTop: "16px", width: "100%", padding: "12px",
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                borderRadius: "8px", color: "var(--text)", cursor: "pointer", fontSize: "13px",
              }}>
                View Full Details for {selected.shortName} →
              </button>
            )}
          </div>
        </div>
      </main>

      <ComparePanel mechanisms={compareList} onClose={() => setCompareList([])} />
      <DetailModal mechanism={detailOpen} onClose={() => setDetailOpen(null)} />
    </div>
  );
}
