// Crowdsource Page - Add New Mechanism Ideas
import { useState, useRef, useCallback } from "react";
import { Layout, BentoCard, SectionHeader, Button } from "../components/shared";
import { EVIDENCE_LOCATIONS, SCORE_DIMENSIONS } from "../vmfs-data";

// ============================================================================
// RADAR CHART FOR NEW MECHANISM
// ============================================================================
function MechanismRadarChart({ scores }) {
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

    if (!scores) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", color: "var(--text-tertiary)" }}>
                Submit an idea to see the radar chart
            </div>
        );
    }

    const avgScore = (scores.hardness + scores.burden + scores.intrusion + scores.robustness) / 4;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: "300px" }}>
                <defs>
                    <radialGradient id="newMechRadarGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <circle cx={center} cy={center} r={radius + 15} fill="url(#newMechRadarGlow)" />

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
                    Predicted Score
                </div>
                <div style={{ fontSize: "36px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)", marginTop: "4px" }}>
                    {avgScore.toFixed(2)}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MECHANISM CARD
// ============================================================================
function NewMechanismCard({ mechanism }) {
    if (!mechanism) return null;

    const avgScore = (mechanism.scores.hardness + mechanism.scores.burden + mechanism.scores.intrusion + mechanism.scores.robustness) / 4;
    const location = Object.values(EVIDENCE_LOCATIONS).find(l => l.id === mechanism.evidenceLocation);

    return (
        <div style={{
            padding: "24px",
            background: "rgba(50, 215, 75, 0.06)",
            border: "2px solid rgba(50, 215, 75, 0.2)",
            borderRadius: "16px",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                    <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>{mechanism.name}</div>
                    <div style={{ 
                        fontSize: "11px", 
                        color: "var(--accent)", 
                        padding: "4px 8px", 
                        background: "rgba(50, 215, 75, 0.1)", 
                        borderRadius: "4px",
                        display: "inline-block"
                    }}>
                        {location?.name || mechanism.evidenceLocation}
                    </div>
                </div>
                <div style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    fontFamily: "var(--mono)",
                    color: avgScore >= 3.5 ? "var(--accent)" : avgScore >= 2.5 ? "var(--orange)" : "var(--red)",
                }}>
                    {avgScore.toFixed(1)}
                </div>
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
                {mechanism.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "16px" }}>
                {['hardness', 'burden', 'intrusion', 'robustness'].map(dim => {
                    const score = mechanism.scores[dim];
                    const dimConfig = SCORE_DIMENSIONS[dim];
                    
                    // Get rubric label based on score
                    let rubricLabel = "";
                    if (score >= 4.5) {
                        rubricLabel = dimConfig.labels[5] || "";
                    } else if (score >= 2.5) {
                        rubricLabel = dimConfig.labels[3] || "";
                    } else {
                        rubricLabel = dimConfig.labels[1] || "";
                    }
                    
                    return (
                        <div key={dim} style={{
                            padding: "10px",
                            background: `${dimConfig.color}10`,
                            borderRadius: "8px",
                            textAlign: "center",
                        }} title={rubricLabel}>
                            <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--mono)", color: dimConfig.color }}>
                                {score.toFixed(1)}
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-tertiary)", marginTop: "2px" }}>{dimConfig.shortName}</div>
                            {rubricLabel && (
                                <div style={{ 
                                    fontSize: "9px", 
                                    color: "var(--text-tertiary)", 
                                    marginTop: "4px",
                                    lineHeight: 1.3,
                                    opacity: 0.8
                                }}>
                                    {rubricLabel.split('(')[0].trim()}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "6px" }}>Analysis</div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    {mechanism.analysis}
                </p>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function CrowdsourcePage({ theme, toggleTheme }) {
    const [idea, setIdea] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedMechanism, setGeneratedMechanism] = useState(null);
    const [error, setError] = useState(null);

    // Backend API URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    const handleSubmit = async () => {
        if (!idea.trim()) return;
        
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/score-mechanism`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mechanismDescription: idea }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(errorData.error || 'Failed to analyze mechanism');
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to analyze mechanism');
            }

            // Transform backend response to component format
            // Backend returns: { success: true, scores: { mechanism_name, evidence_location, scores: {...}, rationale: {...}, ... } }
            const scoresData = data.scores;
            
            // Get evidence produced, fallback to idea if not available or is "No information provided"
            let description = scoresData.evidence_produced;
            if (!description || description.toLowerCase().includes('no information')) {
                description = idea;
            }
            
            const mechanism = {
                name: scoresData.mechanism_name || idea.split(' ').slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                description: description,
                evidenceLocation: scoresData.evidence_location || "institutional",
                scores: {
                    hardness: scoresData.scores?.hardness || 3.0,
                    burden: scoresData.scores?.burden || 3.0,
                    intrusion: scoresData.scores?.intrusion || 3.0,
                    robustness: scoresData.scores?.robustness || 3.0,
                },
                analysis: generateAnalysisFromScores(scoresData),
            };

            setGeneratedMechanism(mechanism);
        } catch (err) {
            console.error("LLM scoring error:", err);
            setError(err.message);
            // Fallback: generate locally using rubric
            const localResult = generateLocalPrediction(idea);
            setGeneratedMechanism(localResult);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate analysis text from LLM scores with rubric fallback
    const generateAnalysisFromScores = (scoresData) => {
        const scores = scoresData.scores;
        const avgScore = (scores.hardness + scores.burden + scores.intrusion + scores.robustness) / 4;
        
        let analysis = "";
        
        // Use rationale from LLM if available and meaningful
        if (scoresData.rationale) {
            const validRationales = Object.entries(scoresData.rationale)
                .filter(([dim, r]) => r && r.trim() && !r.toLowerCase().includes('no information'))
                .map(([dim, r]) => {
                    const dimName = SCORE_DIMENSIONS[dim]?.shortName || dim;
                    return `${dimName}: ${r}`;
                });
            
            if (validRationales.length > 0) {
                analysis = `Based on the VMFS framework analysis: ${validRationales.slice(0, 2).join('. ')}. `;
            }
        }
        
        // If no valid rationales, use rubric-based explanations
        if (!analysis) {
            const rubricExplanations = [];
            
            // Hardness rubric
            if (scores.hardness >= 4.5) {
                rubricExplanations.push("Hardness (5.0): Immutable/physical evidence (cryptographic, sensor, thermal) - evidence exists regardless of human intent");
            } else if (scores.hardness >= 3.5) {
                rubricExplanations.push("Hardness (3.0): Digital/mutable evidence (databases, unsigned logs) - could be altered if root of trust is compromised");
            } else if (scores.hardness <= 1.5) {
                rubricExplanations.push("Hardness (1.0): Subjective/human evidence (self-reports, testimony) - relies entirely on honesty");
            }
            
            // Burden rubric
            if (scores.burden >= 4.5) {
                rubricExplanations.push("Burden (5.0): Policy/software only (laws, code updates) - can be implemented with a pen stroke");
            } else if (scores.burden <= 1.5) {
                rubricExplanations.push("Burden (1.0): New frontier hardware (TEEs, satellites, facilities) - requires manufacturing or building something new");
            }
            
            // Intrusion rubric
            if (scores.intrusion >= 4.5) {
                rubricExplanations.push("Intrusion (5.0): Zero/external intrusion (remote, aggregate, no access) - verifier looks from outside");
            } else if (scores.intrusion <= 1.5) {
                rubricExplanations.push("Intrusion (1.0): Deep/internal intrusion (weights, code, training data) - verifier sees company secrets");
            }
            
            // Robustness rubric
            if (scores.robustness >= 4.5) {
                rubricExplanations.push("Robustness (5.0): Airtight (mathematically proven, physically undeniable) - no viable evasion path");
            } else if (scores.robustness <= 1.5) {
                rubricExplanations.push("Robustness (1.0): Known gaps (coverage gaps, easy to bypass) - text explicitly lists evasion methods");
            }
            
            if (rubricExplanations.length > 0) {
                analysis = `VMFS Framework Assessment: ${rubricExplanations.slice(0, 2).join('. ')}. `;
            }
        }
        
        // Add overall assessment
        if (avgScore >= 3.5) {
            analysis += "This mechanism shows promising feasibility with good balance across dimensions. Consider how it complements existing verification tools.";
        } else if (avgScore >= 2.5) {
            analysis += "This mechanism has moderate feasibility with some trade-offs. ";
            if (scores.hardness < 2.5) analysis += "Evidence hardness is low (relies on trust). ";
            if (scores.burden < 2.5) analysis += "Infrastructure burden is high (costly to implement). ";
            if (scores.intrusion < 2.5) analysis += "Intrusion level is high (requires deep access). ";
            if (scores.robustness < 2.5) analysis += "Evasion robustness is low (easy to circumvent). ";
        } else {
            analysis += "This mechanism faces significant feasibility challenges. Consider how it could be paired with complementary mechanisms to address its weaknesses.";
        }
        
        // Add biggest limitation if available and meaningful
        if (scoresData.biggest_limitation && !scoresData.biggest_limitation.toLowerCase().includes('no information')) {
            analysis += ` Primary limitation: ${scoresData.biggest_limitation}.`;
        }
        
        return analysis.trim();
    };

    // Local fallback prediction using the rubric
    const generateLocalPrediction = (ideaText) => {
        const lowerIdea = ideaText.toLowerCase();
        
        // Evidence Location Mapping
        let evidenceLocation = "institutional";
        if (lowerIdea.includes("chip") || lowerIdea.includes("hardware") || lowerIdea.includes("gpu") || lowerIdea.includes("tee") || lowerIdea.includes("telemetry")) {
            evidenceLocation = "chip_hardware";
        } else if (lowerIdea.includes("data center") || lowerIdea.includes("facility") || lowerIdea.includes("thermal") || lowerIdea.includes("satellite")) {
            evidenceLocation = "data_center";
        } else if (lowerIdea.includes("supply chain") || lowerIdea.includes("manufacturing") || lowerIdea.includes("registry")) {
            evidenceLocation = "supply_chain";
        } else if (lowerIdea.includes("audit") || lowerIdea.includes("developer") || lowerIdea.includes("training") || lowerIdea.includes("lab")) {
            evidenceLocation = "developer_lab";
        } else if (lowerIdea.includes("deployment") || lowerIdea.includes("api") || lowerIdea.includes("access") || lowerIdea.includes("watermark")) {
            evidenceLocation = "deployment_point";
        } else if (lowerIdea.includes("model") && (lowerIdea.includes("registry") || lowerIdea.includes("hash"))) {
            evidenceLocation = "model_registry";
        }

        // Score Prediction using rubric keywords
        let hardness = 2.0;
        let burden = 3.0;
        let intrusion = 3.0;
        let robustness = 2.0;

        // Hardness: Physics/Crypto = High, Self-report = Low
        if (lowerIdea.includes("cryptograph") || lowerIdea.includes("signed") || lowerIdea.includes("hash") || lowerIdea.includes("attestation")) {
            hardness = 4.5;
        } else if (lowerIdea.includes("sensor") || lowerIdea.includes("thermal") || lowerIdea.includes("physical")) {
            hardness = 4.0;
        } else if (lowerIdea.includes("database") || lowerIdea.includes("log") || lowerIdea.includes("record")) {
            hardness = 3.0;
        } else if (lowerIdea.includes("self-report") || lowerIdea.includes("declaration") || lowerIdea.includes("testimony") || lowerIdea.includes("whistleblower")) {
            hardness = 1.0;
        }

        // Burden: Hardware = Low (costly), Software/Law = High (cheap)
        if (lowerIdea.includes("new hardware") || lowerIdea.includes("chip") || lowerIdea.includes("satellite") || lowerIdea.includes("facility")) {
            burden = 1.5;
        } else if (lowerIdea.includes("software") || lowerIdea.includes("code") || lowerIdea.includes("update")) {
            burden = 4.5;
        } else if (lowerIdea.includes("law") || lowerIdea.includes("regulation") || lowerIdea.includes("policy")) {
            burden = 5.0;
        }

        // Intrusion: Deep access = Low, External = High
        if (lowerIdea.includes("weights") || lowerIdea.includes("model access") || lowerIdea.includes("training data") || lowerIdea.includes("internal")) {
            intrusion = 1.5;
        } else if (lowerIdea.includes("external") || lowerIdea.includes("remote") || lowerIdea.includes("satellite") || lowerIdea.includes("public")) {
            intrusion = 5.0;
        } else if (lowerIdea.includes("metadata") || lowerIdea.includes("api")) {
            intrusion = 3.5;
        }

        // Robustness: Hard to evade = High, Easy to fake = Low
        if (lowerIdea.includes("tamper") || lowerIdea.includes("immutable") || lowerIdea.includes("cryptograph") || lowerIdea.includes("physics")) {
            robustness = 4.0;
        } else if (lowerIdea.includes("self-report") || lowerIdea.includes("voluntary") || lowerIdea.includes("declaration")) {
            robustness = 1.5;
        } else if (lowerIdea.includes("distributed") || lowerIdea.includes("coverage gap")) {
            robustness = 2.0;
        }

        // Generate short name
        const words = ideaText.split(' ').slice(0, 4);
        const name = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // Generate analysis
        const avgScore = (hardness + burden + intrusion + robustness) / 4;
        let analysis = "";
        if (avgScore >= 3.5) {
            analysis = "This mechanism shows promising feasibility with good balance across dimensions. Consider how it complements existing verification tools.";
        } else if (avgScore >= 2.5) {
            analysis = "This mechanism has moderate feasibility with some trade-offs. The main challenges lie in ";
            if (hardness < 2.5) analysis += "evidence hardness (relies on trust). ";
            if (burden < 2.5) analysis += "infrastructure burden (costly to implement). ";
            if (intrusion < 2.5) analysis += "intrusion level (requires deep access). ";
            if (robustness < 2.5) analysis += "evasion robustness (easy to circumvent). ";
        } else {
            analysis = "This mechanism faces significant feasibility challenges. Consider how it could be paired with complementary mechanisms to address its weaknesses.";
        }

        return {
            name,
            description: ideaText,
            evidenceLocation,
            scores: { hardness, burden, intrusion, robustness },
            analysis,
        };
    };

    const handleClear = () => {
        setIdea("");
        setGeneratedMechanism(null);
        setError(null);
    };

    const exampleIdeas = [
        "A global registry of AI researchers with mandatory reporting of frontier model involvement",
        "Cryptographic watermarks embedded in model weights during training that persist through fine-tuning",
        "Thermal satellite monitoring of suspected underground data centers with AI-powered anomaly detection",
        "Mandatory third-party audits before any model exceeding 10^25 FLOPs can be deployed",
    ];

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
                <SectionHeader
                    title="Add New Verification Mechanism"
                    subtitle="Test your verification ideas against the VMFS framework. Describe a mechanism and see its predicted scores across all four dimensions."
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    {/* Input Panel */}
                    <div>
                        <BentoCard hoverable={false}>
                            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                                Describe Your Mechanism Idea
                            </div>
                            
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="Describe a new verification mechanism idea... (e.g., 'A global registry of AI researchers with mandatory reporting')"
                                style={{
                                    width: "100%",
                                    minHeight: "150px",
                                    padding: "16px",
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "12px",
                                    color: "var(--text)",
                                    fontSize: "14px",
                                    fontFamily: "inherit",
                                    lineHeight: 1.6,
                                    resize: "vertical",
                                    marginBottom: "16px",
                                }}
                            />

                            <div style={{ display: "flex", gap: "12px" }}>
                                <Button 
                                    variant="primary" 
                                    onClick={handleSubmit}
                                    style={{ flex: 1, opacity: isLoading ? 0.7 : 1 }}
                                >
                                    {isLoading ? "Analyzing..." : "Analyze Mechanism"}
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    onClick={handleClear}
                                >
                                    Clear
                                </Button>
                            </div>

                            {error && (
                                <div style={{ 
                                    marginTop: "12px", 
                                    padding: "12px", 
                                    background: "rgba(255, 159, 10, 0.1)", 
                                    border: "1px solid rgba(255, 159, 10, 0.2)",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "var(--orange)"
                                }}>
                                    Using local prediction (server unavailable): {error}
                                </div>
                            )}
                        </BentoCard>

                        {/* Example Ideas */}
                        <BentoCard hoverable={false} style={{ marginTop: "20px" }}>
                            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                                Example Ideas
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {exampleIdeas.map((example, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setIdea(example)}
                                        style={{
                                            padding: "12px",
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            color: "var(--text-secondary)",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = "var(--accent)";
                                            e.currentTarget.style.background = "rgba(50, 215, 75, 0.05)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = "var(--border)";
                                            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                        }}
                                    >
                                        {example}
                                    </div>
                                ))}
                            </div>
                        </BentoCard>
                    </div>

                    {/* Output Panel */}
                    <div>
                        {generatedMechanism ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {/* Radar Chart */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                                        Predicted Radar Profile
                                    </div>
                                    <MechanismRadarChart scores={generatedMechanism.scores} />
                                </BentoCard>

                                {/* Mechanism Card */}
                                <BentoCard hoverable={false}>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                                        Generated Mechanism Card
                                    </div>
                                    <NewMechanismCard mechanism={generatedMechanism} />
                                </BentoCard>
                            </div>
                        ) : (
                            <BentoCard hoverable={false} style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ textAlign: "center", padding: "60px" }}>
                                    <div style={{ 
                                        width: "64px", 
                                        height: "64px", 
                                        margin: "0 auto 20px",
                                        borderRadius: "16px",
                                        background: "rgba(50, 215, 75, 0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 8v8"/>
                                            <path d="M8 12h8"/>
                                        </svg>
                                    </div>
                                    <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>No Mechanism Analyzed</div>
                                    <div style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "300px" }}>
                                        Enter your verification mechanism idea in the text box and click "Analyze" to see its predicted scores.
                                    </div>
                                </div>
                            </BentoCard>
                        )}
                    </div>
                </div>

                {/* How It Works */}
                <BentoCard hoverable={false} style={{ marginTop: "40px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "20px" }}>
                        How It Works
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                margin: "0 auto 12px",
                                borderRadius: "12px",
                                background: "rgba(10, 132, 255, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0a84ff",
                                fontSize: "18px",
                                fontWeight: 700,
                            }}>1</div>
                            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Text Input</h4>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Describe your verification mechanism idea in natural language
                            </p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                margin: "0 auto 12px",
                                borderRadius: "12px",
                                background: "rgba(191, 90, 242, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#bf5af2",
                                fontSize: "18px",
                                fontWeight: 700,
                            }}>2</div>
                            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>LLM Extraction</h4>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                The system identifies Evidence Location and predicts scores using the VMFS rubric
                            </p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                margin: "0 auto 12px",
                                borderRadius: "12px",
                                background: "rgba(50, 215, 75, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#32d74b",
                                fontSize: "18px",
                                fontWeight: 700,
                            }}>3</div>
                            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Structured Card</h4>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                View your idea as a Mechanism Card with radar visualization showing trade-offs
                            </p>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </Layout>
    );
}
