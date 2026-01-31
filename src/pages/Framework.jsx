// Framework Page - Theory and Methodology
import { Layout, BentoCard, SectionHeader, ScoreBar, Badge } from "../components/shared";
import { OOVS, KEY_FINDINGS } from "../vmfs-data";

export default function FrameworkPage() {
    const scoringDimensions = [
        {
            name: "Technical Feasibility",
            short: "TF",
            color: "#0a84ff",
            description: "Can this mechanism be implemented with current or near-term technology? Considers technical maturity, infrastructure requirements, and implementation complexity.",
            factors: ["Technology readiness level", "Infrastructure requirements", "Scalability potential", "Integration complexity"],
        },
        {
            name: "Political Tractability",
            short: "PT",
            color: "#bf5af2",
            description: "Can this mechanism gain political support and be adopted through governance processes? Considers stakeholder interests, regulatory alignment, and international cooperation.",
            factors: ["Stakeholder buy-in", "Regulatory compatibility", "International cooperation", "Industry acceptance"],
        },
        {
            name: "Sovereignty Impact",
            short: "SI",
            color: "#ff9f0a",
            description: "How does this mechanism affect national sovereignty and decision-making autonomy? Mechanisms that respect sovereignty are more likely to be adopted.",
            factors: ["National control retention", "Data sovereignty", "Decision autonomy", "Jurisdictional clarity"],
        },
        {
            name: "Global South Adoptability",
            short: "GSA",
            color: "#32d74b",
            description: "Can this mechanism be effectively adopted by developing nations? Considers resource requirements, capacity building needs, and equitable access.",
            factors: ["Resource requirements", "Capacity constraints", "Technology access", "Equitable participation"],
        },
    ];

    return (
        <Layout>
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
                        A systematic approach to evaluating verification mechanisms for AI safety governance,
                        considering technical, political, and social dimensions of global adoption.
                    </p>
                </div>

                {/* What is VMFS */}
                <section style={{ marginBottom: "80px" }}>
                    <SectionHeader
                        label="Overview"
                        title="What is VMFS?"
                        subtitle="Understanding the Verification Mechanism Feasibility Scorer"
                    />

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "24px",
                    }}>
                        <BentoCard hoverable={false}>
                            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--accent)" }}>Purpose</h3>
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                VMFS provides a structured methodology for evaluating different verification mechanisms
                                that can be used to ensure AI systems are developed and deployed safely. It helps
                                policymakers and researchers identify which mechanisms are most likely to be effective
                                and adoptable at a global scale.
                            </p>
                        </BentoCard>

                        <BentoCard hoverable={false}>
                            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--blue)" }}>Approach</h3>
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                Each mechanism is scored across four dimensions on a scale of 1-5. These scores are
                                then combined into a weighted average that represents overall feasibility. The framework
                                also maps each mechanism's coverage across four Objects of Verification (OoVs).
                            </p>
                        </BentoCard>
                    </div>
                </section>

                {/* Scoring Dimensions */}
                <section style={{ marginBottom: "80px" }}>
                    <SectionHeader
                        label="Scoring"
                        title="Four Dimensions of Feasibility"
                        subtitle="Each mechanism is evaluated across these critical dimensions"
                    />

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "24px",
                    }}>
                        {scoringDimensions.map((dim, i) => (
                            <BentoCard key={i} hoverable={false} style={{ padding: "28px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "10px",
                                        background: `${dim.color}20`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        fontFamily: "var(--mono)",
                                        color: dim.color,
                                    }}>
                                        {dim.short}
                                    </div>
                                    <h3 style={{ fontSize: "18px", fontWeight: 600 }}>{dim.name}</h3>
                                </div>
                                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
                                    {dim.description}
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    {dim.factors.map((f, j) => (
                                        <span key={j} style={{
                                            padding: "4px 10px",
                                            background: `${dim.color}10`,
                                            borderRadius: "6px",
                                            fontSize: "11px",
                                            color: dim.color,
                                        }}>
                                            {f}
                                        </span>
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
                        subtitle="The four key areas that verification mechanisms aim to cover"
                    />

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "20px",
                    }}>
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
                                symbol: "●",
                                level: "Primary",
                                color: "var(--accent)",
                                description: "The mechanism directly and comprehensively addresses this OoV as its main purpose.",
                            },
                            {
                                symbol: "◐",
                                level: "Partial",
                                color: "var(--blue)",
                                description: "The mechanism provides some coverage of this OoV, but not as its primary focus.",
                            },
                            {
                                symbol: "○",
                                level: "None",
                                color: "var(--text-tertiary)",
                                description: "The mechanism does not meaningfully address this OoV.",
                            },
                        ].map((cov, i) => (
                            <BentoCard key={i} hoverable={false}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "24px", color: cov.color }}>{cov.symbol}</span>
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
                        subtitle="Critical insights from our analysis"
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
                                        <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: 1.6 }}>
                                            {finding.finding}
                                        </p>
                                        {finding.implication && (
                                            <p style={{ fontSize: "13px", color: "var(--text-tertiary)", marginTop: "8px", fontStyle: "italic" }}>
                                                Implication: {finding.implication}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </BentoCard>
                        ))}
                    </div>
                </section>

                {/* Scoring Scale */}
                <section>
                    <SectionHeader
                        label="Scale"
                        title="Scoring Interpretation"
                        subtitle="How to interpret mechanism scores"
                    />

                    <BentoCard hoverable={false}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
                            {[
                                { score: "5.0", label: "Excellent", color: "#32d74b", desc: "Highly feasible, ready for implementation" },
                                { score: "4.0", label: "Good", color: "#30d158", desc: "Feasible with minor challenges" },
                                { score: "3.0", label: "Moderate", color: "#ff9f0a", desc: "Feasible with significant work" },
                                { score: "2.0", label: "Difficult", color: "#ff6b35", desc: "Major barriers to implementation" },
                                { score: "1.0", label: "Very Difficult", color: "#ff453a", desc: "Fundamental challenges exist" },
                            ].map((s, i) => (
                                <div key={i} style={{ textAlign: "center", padding: "16px" }}>
                                    <div style={{
                                        fontSize: "32px",
                                        fontWeight: 700,
                                        fontFamily: "var(--mono)",
                                        color: s.color,
                                        marginBottom: "8px",
                                    }}>{s.score}</div>
                                    <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{s.label}</div>
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{s.desc}</div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </section>
            </div>
        </Layout>
    );
}
