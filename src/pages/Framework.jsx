// Framework Page - Theory and Methodology with New 4-Dimension Scoring
import { Layout, BentoCard, SectionHeader, Badge } from "../components/shared";
import { OOVS, KEY_FINDINGS, SCORE_DIMENSIONS, EVIDENCE_LOCATIONS, VERIFICATION_GOALS } from "../vmfs-data";

export default function FrameworkPage({ theme, toggleTheme }) {
    const scoringDimensions = [
        {
            key: "hardness",
            name: "Evidence Hardness",
            short: "Trust",
            color: "#0a84ff",
            question: "Is the evidence based on math/physics (Hard) or human trust (Soft)?",
            description: "The Trust Score - measures whether evidence exists regardless of human intent. Cryptographic proofs and physics-based measurements score high; self-reports and testimony score low.",
            levels: [
                { score: "5.0", label: "Immutable/Physical", example: "Cryptographic, signed, hash, telemetry, thermal" },
                { score: "3.0", label: "Digital/Mutable", example: "Database, unsigned logs, watermarks, API responses" },
                { score: "1.0", label: "Subjective/Human", example: "Self-reports, declarations, testimony, interviews" },
            ],
        },
        {
            key: "burden",
            name: "Infrastructure Burden",
            short: "Cost",
            color: "#32d74b",
            question: "Does it require building new hardware (High Burden) or just passing laws (Low Burden)?",
            description: "The Cost Score - what new physical reality must be built for this mechanism to work. Policy-only mechanisms score high; those requiring new hardware score low.",
            levels: [
                { score: "5.0", label: "Policy/Software Only", example: "Laws, regulations, treaties, public registries" },
                { score: "3.0", label: "Commercial/Cloud", example: "Vendor cooperation, API integration, KYC" },
                { score: "1.0", label: "New Frontier Hardware", example: "Specialized chips, TEEs, satellite constellations" },
            ],
        },
        {
            key: "intrusion",
            name: "Intrusion Level",
            short: "Friction",
            color: "#ff9f0a",
            question: "How much secret data (IP, Weights) is exposed?",
            description: "The Friction Score - measures privacy and intellectual property exposure risk. External observation scores high; deep access to model weights and training data scores low.",
            levels: [
                { score: "5.0", label: "Zero/External", example: "Aggregate data, heat signatures, remote sensing" },
                { score: "3.0", label: "Metadata/API", example: "Traffic analysis, headers, query access" },
                { score: "1.0", label: "Deep/Internal", example: "Weights, code, training data, trade secrets" },
            ],
        },
        {
            key: "robustness",
            name: "Evasion Robustness",
            short: "Cheating",
            color: "#bf5af2",
            question: "How easy is it to spoof or hide from this mechanism?",
            description: "The Cheating Score - measures vulnerability to evasion. Mathematically proven or physically undeniable mechanisms score high; those with known bypass methods score low.",
            levels: [
                { score: "5.0", label: "Airtight", example: "Mathematically proven, physically undeniable" },
                { score: "3.0", label: "Costly Evasion", example: "Possible but requires significant effort" },
                { score: "1.0", label: "Known Gaps", example: "Coverage gaps, smuggling routes, suppression" },
            ],
        },
    ];

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
                {/* Hero */}
                <div style={{ textAlign: "center", marginBottom: "80px" }}>
                    <Badge variant="accent">Methodology</Badge>
                    <h1 style={{
                        fontSize: "48px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        marginTop: "16px",
                        marginBottom: "16px",
                    }}>
                        The VMFS Framework
                    </h1>
                    <p style={{
                        fontSize: "18px",
                        color: "var(--text-secondary)",
                        maxWidth: "700px",
                        margin: "0 auto",
                        lineHeight: 1.7,
                    }}>
                        A rigorous scoring system for evaluating AI verification mechanisms.
                        We translate policy intent into technical architecture using evidence-based scoring.
                    </p>
                </div>

                {/* Core Concept */}
                <section style={{ marginBottom: "80px" }}>
                    <SectionHeader
                        label="Approach"
                        title="Evidence-Based Scoring"
                        subtitle="Scores must be derived strictly from mechanism characteristics, not assumptions"
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        <BentoCard hoverable={false}>
                            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--accent)" }}>Goal-Based Entry</h3>
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
                                Users start with a verification goal ("I want to verify compute usage") which maps to an
                                Evidence Location where the truth exists. The system then recommends mechanisms that can
                                access that location.
                            </p>
                            <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                                Goal &rarr; Evidence Location &rarr; Mechanism
                            </div>
                        </BentoCard>

                        <BentoCard hoverable={false}>
                            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--blue)" }}>Four Dimensions</h3>
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
                                Each mechanism is scored across four dimensions that capture the essential trade-offs:
                                trust in evidence, implementation cost, privacy friction, and evasion resistance.
                            </p>
                            <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                                Hardness + Burden + Intrusion + Robustness
                            </div>
                        </BentoCard>
                    </div>
                </section>

                {/* Evidence Locations */}
                <section style={{ marginBottom: "80px" }}>
                    <SectionHeader
                        label="Locations"
                        title="Where the Truth Lives"
                        subtitle="Seven evidence locations where verification mechanisms can look for proof"
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        {Object.values(EVIDENCE_LOCATIONS).map((loc, i) => {
                            const colors = ["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b", "#ff453a", "#64d2ff", "#ffd60a"];
                            return (
                                <BentoCard key={loc.id} hoverable={false} style={{ padding: "20px" }}>
                                    <div style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "8px",
                                        background: `${colors[i % colors.length]}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "12px",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        fontFamily: "var(--mono)",
                                        color: colors[i % colors.length],
                                    }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
                                        {loc.name.split('/')[0].trim()}
                                    </h3>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                        {loc.description}
                                    </p>
                                </BentoCard>
                            );
                        })}
                    </div>
                </section>

                {/* Scoring Dimensions */}
                <section style={{ marginBottom: "80px" }}>
                    <SectionHeader
                        label="Dimensions"
                        title="Four-Dimension Scoring"
                        subtitle="Each mechanism is evaluated across these critical dimensions on a 1-5 scale"
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {scoringDimensions.map((dim) => (
                            <BentoCard key={dim.key} hoverable={false} style={{ padding: "28px" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "20px" }}>
                                    <div style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background: `${dim.color}20`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        fontFamily: "var(--mono)",
                                        color: dim.color,
                                        flexShrink: 0,
                                    }}>
                                        {dim.short.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "4px" }}>{dim.name}</h3>
                                        <div style={{ fontSize: "13px", color: dim.color, marginBottom: "8px", fontStyle: "italic" }}>
                                            "{dim.question}"
                                        </div>
                                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                            {dim.description}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                                    {dim.levels.map((level, i) => (
                                        <div key={i} style={{
                                            padding: "14px",
                                            background: `${dim.color}08`,
                                            borderRadius: "10px",
                                            border: `1px solid ${dim.color}20`,
                                        }}>
                                            <div style={{ fontSize: "24px", fontWeight: 700, color: dim.color, marginBottom: "4px" }}>
                                                {level.score}
                                            </div>
                                            <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                                                {level.label}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                                                {level.example}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </BentoCard>
                        ))}
                    </div>
                </section>

                {/* Objects of Verification */}
                <section style={{ marginBottom: "80px" }}>
                    <SectionHeader
                        label="OoVs"
                        title="Objects of Verification"
                        subtitle="What specifically can be verified about AI systems"
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                        {OOVS.map((oov, i) => {
                            const colors = ["#0a84ff", "#bf5af2", "#ff9f0a", "#32d74b"];
                            const labels = ["01", "02", "03", "04"];
                            return (
                                <BentoCard key={oov.id} hoverable={false} style={{ padding: "24px" }}>
                                    <div style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "10px",
                                        background: `${colors[i]}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "14px",
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        fontFamily: "var(--mono)",
                                        color: colors[i],
                                    }}>
                                        {labels[i]}
                                    </div>
                                    <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px", color: colors[i] }}>
                                        {oov.shortName}
                                    </h3>
                                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                        {oov.definition}
                                    </p>
                                </BentoCard>
                            );
                        })}
                    </div>
                </section>

                {/* Coverage Levels */}
                <section style={{ marginBottom: "80px" }}>
                    <SectionHeader
                        label="Coverage"
                        title="Coverage Classification"
                        subtitle="How mechanisms are rated for each Object of Verification"
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                        {[
                            {
                                symbol: "Y",
                                level: "Primary",
                                color: "var(--accent)",
                                description: "The mechanism directly and comprehensively addresses this OoV as its main purpose. Provides strong evidence.",
                            },
                            {
                                symbol: "-",
                                level: "Partial",
                                color: "var(--blue)",
                                description: "The mechanism provides some coverage of this OoV, but not as its primary focus. May need complementary mechanisms.",
                            },
                            {
                                symbol: "X",
                                level: "None",
                                color: "var(--text-tertiary)",
                                description: "The mechanism does not meaningfully address this OoV. Coverage gap if this is your verification goal.",
                            },
                        ].map((cov, i) => (
                            <BentoCard key={i} hoverable={false}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "28px", fontWeight: 700, color: cov.color }}>{cov.symbol}</span>
                                    <span style={{ fontSize: "18px", fontWeight: 600, color: cov.color }}>{cov.level}</span>
                                </div>
                                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                    {cov.description}
                                </p>
                            </BentoCard>
                        ))}
                    </div>
                </section>

                {/* Key Findings */}
                <section style={{ marginBottom: "80px" }}>
                    <SectionHeader
                        label="Insights"
                        title="Key Findings"
                        subtitle="Critical insights from the framework analysis"
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {KEY_FINDINGS.slice(0, 5).map((finding, i) => (
                            <BentoCard key={i} hoverable={false} style={{
                                padding: "24px",
                                background: i === 0 ? "rgba(50, 215, 75, 0.05)" : undefined,
                                borderColor: i === 0 ? "rgba(50, 215, 75, 0.15)" : undefined,
                            }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                                    <div style={{
                                        width: "28px",
                                        height: "28px",
                                        borderRadius: "8px",
                                        background: i === 0 ? "var(--accent)" : "rgba(255,255,255,0.08)",
                                        color: i === 0 ? "var(--bg)" : "var(--text-secondary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        flexShrink: 0,
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>{finding.title}</h4>
                                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                            {finding.description}
                                        </p>
                                    </div>
                                </div>
                            </BentoCard>
                        ))}
                    </div>
                </section>

                {/* Blind Spot Warning */}
                <section>
                    <BentoCard hoverable={false} style={{
                        padding: "32px",
                        background: "rgba(255, 69, 58, 0.05)",
                        borderColor: "rgba(255, 69, 58, 0.15)",
                    }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: "rgba(255, 69, 58, 0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--red)",
                                fontSize: "20px",
                                fontWeight: 700,
                                flexShrink: 0,
                            }}>
                                !
                            </div>
                            <div>
                                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "var(--red)" }}>
                                    Critical Blind Spot Warning
                                </h3>
                                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                    Portfolios without chip-level verification (On-Chip Telemetry or TEE Attestation) cannot verify
                                    digital compute activity. This means a bad actor could use legally acquired hardware for illegal
                                    training runs without detection. Always ensure your verification portfolio includes at least one
                                    mechanism that monitors the Chip/Hardware Level evidence location.
                                </p>
                            </div>
                        </div>
                    </BentoCard>
                </section>
            </div>
        </Layout>
    );
}
