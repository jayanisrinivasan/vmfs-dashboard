// ============================================================================
// VMFS Dashboard - Main Application Component
// ============================================================================
// This file contains the UI logic. All data is imported from vmfs-data.js

import { useState } from "react";
import { MECHANISMS, OOVS, COVERAGE_MATRIX, KEY_FINDINGS } from "./vmfs-data";

export default function App() {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const [selectedMechanism, setSelectedMechanism] = useState(MECHANISMS[0]);
  const [selectedOov, setSelectedOov] = useState(null);
  const [activeTab, setActiveTab] = useState("heatmap"); // heatmap | coverage | mechanisms
  const [sortBy, setSortBy] = useState("weightedAvg"); // weightedAvg | tf | pt | gsa
  const [filterGlobalSouth, setFilterGlobalSouth] = useState(false);

  // ==========================================================================
  // SORTING & FILTERING LOGIC
  // ==========================================================================

  // Sort mechanisms based on selected dimension
  const sortedMechanisms = [...MECHANISMS].sort((a, b) => {
    if (sortBy === "weightedAvg") return b.vmfsScores.weightedAvg - a.vmfsScores.weightedAvg;
    if (sortBy === "tf") return b.vmfsScores.technicalFeasibility - a.vmfsScores.technicalFeasibility;
    if (sortBy === "pt") return b.vmfsScores.politicalTractability - a.vmfsScores.politicalTractability;
    if (sortBy === "gsa") return b.vmfsScores.globalSouthAdoptability - a.vmfsScores.globalSouthAdoptability;
    return 0;
  });

  // Filter mechanisms based on Global South adoptability
  const filteredMechanisms = filterGlobalSouth
    ? sortedMechanisms.filter((m) => m.vmfsScores.globalSouthAdoptability >= 3.5)
    : sortedMechanisms;

  // ==========================================================================
  // HELPER FUNCTIONS - COLOR CODING
  // ==========================================================================

  // Get text color based on score (1-5 scale)
  const getScoreColor = (score) => {
    if (score >= 4.5) return "#065F46"; // deep teal
    if (score >= 3.5) return "#1E40AF"; // blue
    if (score >= 2.5) return "#78716C"; // gray
    if (score >= 1.5) return "#EA580C"; // orange
    return "#B91C1C"; // crimson
  };

  // Get background tint based on score
  const getScoreBgColor = (score) => {
    if (score >= 4.5) return "#F0FDF4"; // light green
    if (score >= 3.5) return "#EFF6FF"; // light blue
    if (score >= 2.5) return "#FAFAF9"; // neutral
    if (score >= 1.5) return "#FFF7ED"; // light orange
    return "#FEF2F2"; // light red
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#FAFAF9", minHeight: "100vh" }}>

      {/* ====================================================================
          HEADER (Sticky)
          ==================================================================== */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #E7E5E4",
          padding: "24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "32px", fontFamily: "Crimson Pro, serif", color: "#1C1917" }}>
          VMFS
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#78716C" }}>
          Verification Mechanism Feasibility Scorer
        </p>
      </header>

      {/* ====================================================================
          MAIN CONTENT CONTAINER
          ==================================================================== */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>

        {/* ==================================================================
            KEY INSIGHTS PANEL
            ================================================================== */}
        <div
          style={{
            background: "#F8FAFC",
            borderLeft: "4px solid #1E40AF",
            padding: "24px",
            marginBottom: "24px",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#1C1917" }}>💡 Key Findings</h3>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#44403C" }}>
            {KEY_FINDINGS.map((finding) => (
              <li key={finding.id} style={{ marginBottom: "8px" }}>
                <strong>{finding.title}:</strong> {finding.description}
              </li>
            ))}
          </ul>
        </div>

        {/* ==================================================================
            TAB NAVIGATION
            ================================================================== */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "2px solid #E7E5E4",
            marginBottom: "24px",
          }}
        >
          {[
            { id: "heatmap", label: "Feasibility Heatmap" },
            { id: "coverage", label: "Coverage Matrix" },
            { id: "mechanisms", label: "Mechanisms" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: activeTab === tab.id ? "600" : "400",
                color: activeTab === tab.id ? "#1E40AF" : "#78716C",
                borderBottom: activeTab === tab.id ? "3px solid #1E40AF" : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================================================================
            FILTER CONTROLS
            ================================================================== */}
        <div
          style={{
            background: "white",
            border: "1px solid #E7E5E4",
            padding: "16px",
            marginBottom: "24px",
            borderRadius: "4px",
          }}
        >
          <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Sort Dropdown */}
            <div>
              <label style={{ fontSize: "14px", color: "#78716C", marginRight: "8px" }}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #E7E5E4",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <option value="weightedAvg">Weighted Average</option>
                <option value="tf">Technical Feasibility</option>
                <option value="pt">Political Tractability</option>
                <option value="gsa">Global South Adoptability</option>
              </select>
            </div>

            {/* Global South Filter Checkbox */}
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={filterGlobalSouth}
                onChange={(e) => setFilterGlobalSouth(e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ fontSize: "14px", color: "#44403C" }}>
                High Global South Adoptability (≥3.5)
              </span>
            </label>
          </div>

          {/* Filter Active Indicator */}
          {filterGlobalSouth && (
            <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#78716C" }}>
              Showing {filteredMechanisms.length} of {MECHANISMS.length} mechanisms
            </p>
          )}
        </div>

        {/* ==================================================================
            TAB 1: HEATMAP VIEW
            ================================================================== */}
        {activeTab === "heatmap" && (
          <div>
            <div style={{ background: "white", border: "1px solid #E7E5E4", borderRadius: "4px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>

                {/* Table Header */}
                <thead>
                  <tr style={{ background: "#F5F5F4" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#78716C", borderBottom: "1px solid #E7E5E4" }}>
                      Mechanism
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#78716C", borderBottom: "1px solid #E7E5E4" }} title="Technical Feasibility">
                      TF
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#78716C", borderBottom: "1px solid #E7E5E4" }} title="Political Tractability">
                      PT
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#78716C", borderBottom: "1px solid #E7E5E4" }} title="Institutional Requirements">
                      IR
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#78716C", borderBottom: "1px solid #E7E5E4" }} title="Sovereignty Impact">
                      SI
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#78716C", borderBottom: "1px solid #E7E5E4" }} title="Global South Adoptability">
                      GSA
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#78716C", borderBottom: "1px solid #E7E5E4" }}>
                      Avg
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#78716C", borderBottom: "1px solid #E7E5E4" }}>
                      Coverage
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredMechanisms.map((mechanism) => {
                    // Get coverage data for this mechanism
                    const coverage = COVERAGE_MATRIX.find((c) => c.mechanismId === mechanism.id);
                    const coverageSymbols = [
                      coverage?.oov1_compute.symbol || "○",
                      coverage?.oov2_lineage.symbol || "○",
                      coverage?.oov3_deployment.symbol || "○",
                      coverage?.oov4_post_training.symbol || "○",
                    ];

                    return (
                      <tr
                        key={mechanism.id}
                        onClick={() => setSelectedMechanism(mechanism)}
                        style={{
                          cursor: "pointer",
                          background: selectedMechanism.id === mechanism.id ? "#F5F5F4" : "white",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedMechanism.id !== mechanism.id) {
                            e.currentTarget.style.background = "#FAFAF9";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedMechanism.id !== mechanism.id) {
                            e.currentTarget.style.background = "white";
                          }
                        }}
                      >
                        {/* Mechanism Name */}
                        <td style={{ padding: "16px", borderBottom: "1px solid #E7E5E4", fontWeight: "500" }}>
                          {mechanism.shortName}
                        </td>

                        {/* Technical Feasibility */}
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            background: getScoreBgColor(mechanism.vmfsScores.technicalFeasibility),
                            color: getScoreColor(mechanism.vmfsScores.technicalFeasibility),
                            fontWeight: "600",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                        >
                          {mechanism.vmfsScores.technicalFeasibility.toFixed(1)}
                        </td>

                        {/* Political Tractability */}
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            background: getScoreBgColor(mechanism.vmfsScores.politicalTractability),
                            color: getScoreColor(mechanism.vmfsScores.politicalTractability),
                            fontWeight: "600",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                        >
                          {mechanism.vmfsScores.politicalTractability.toFixed(1)}
                        </td>

                        {/* Institutional Requirements */}
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: mechanism.vmfsScores.institutionalReq === "high" ? "#B91C1C" : mechanism.vmfsScores.institutionalReq === "medium" ? "#EA580C" : "#065F46",
                          }}
                        >
                          {mechanism.vmfsScores.institutionalReq.toUpperCase()[0]}
                        </td>

                        {/* Sovereignty Impact */}
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            background: getScoreBgColor(mechanism.vmfsScores.sovereigntyImpact),
                            color: getScoreColor(mechanism.vmfsScores.sovereigntyImpact),
                            fontWeight: "600",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                        >
                          {mechanism.vmfsScores.sovereigntyImpact.toFixed(1)}
                        </td>

                        {/* Global South Adoptability */}
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            background: getScoreBgColor(mechanism.vmfsScores.globalSouthAdoptability),
                            color: getScoreColor(mechanism.vmfsScores.globalSouthAdoptability),
                            fontWeight: "600",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                        >
                          {mechanism.vmfsScores.globalSouthAdoptability.toFixed(1)}
                        </td>

                        {/* Weighted Average */}
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            fontWeight: "700",
                            fontSize: "16px",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                        >
                          {mechanism.vmfsScores.weightedAvg.toFixed(1)}
                        </td>

                        {/* Coverage Symbols */}
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            fontSize: "18px",
                          }}
                        >
                          {coverageSymbols.join(" ")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div style={{ marginTop: "16px", display: "flex", gap: "32px", fontSize: "12px", color: "#78716C" }}>
              <div>
                <strong>Columns:</strong> TF=Technical Feasibility, PT=Political Tractability, IR=Institutional Requirements, SI=Sovereignty Impact, GSA=Global South Adoptability
              </div>
              <div>
                <strong>Coverage:</strong> ✔ Primary, ◐ Partial, ✖ None
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 2: COVERAGE MATRIX VIEW
            ================================================================== */}
        {activeTab === "coverage" && (
          <div>
            <div style={{ background: "white", border: "1px solid #E7E5E4", borderRadius: "4px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>

                {/* Table Header */}
                <thead>
                  <tr style={{ background: "#F5F5F4" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#1C1917", borderBottom: "2px solid #E7E5E4", minWidth: "220px" }}>
                      Mechanism
                    </th>
                    {OOVS.map((oov) => (
                      <th key={oov.id} style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px", fontWeight: "600", color: "#1C1917", borderBottom: "2px solid #E7E5E4", minWidth: "140px" }}>
                        {oov.shortName}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredMechanisms.map((mechanism) => {
                    const coverage = COVERAGE_MATRIX.find((c) => c.mechanismId === mechanism.id);
                    return (
                      <tr key={mechanism.id} style={{ borderBottom: "1px solid #E7E5E4" }}>
                        <td style={{
                          padding: "20px 16px",
                          fontWeight: "500",
                          fontSize: "14px",
                          color: "#1C1917",
                          background: "#FAFAF9"
                        }}>
                          {mechanism.shortName}
                        </td>
                        {["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"].map((oovKey) => {
                          const cell = coverage?.[oovKey];

                          // IMPROVED COLOR SCHEME - Higher contrast
                          let bgColor, borderColor, symbolColor;
                          if (cell?.coverage === "primary") {
                            bgColor = "#DCFCE7";      // Stronger green
                            borderColor = "#86EFAC";   // Brighter green border
                            symbolColor = "#166534";   // Dark green symbol
                          } else if (cell?.coverage === "partial") {
                            bgColor = "#DBEAFE";      // Stronger blue
                            borderColor = "#93C5FD";   // Brighter blue border
                            symbolColor = "#1E40AF";   // Dark blue symbol
                          } else {
                            bgColor = "#F5F5F4";      // Light gray
                            borderColor = "#D6D3D1";   // Gray border
                            symbolColor = "#A8A29E";   // Medium gray symbol
                          }

                          return (
                            <td
                              key={oovKey}
                              style={{
                                padding: "20px 16px",
                                textAlign: "center",
                                background: bgColor,
                                borderLeft: `2px solid ${borderColor}`,
                                borderRight: `2px solid ${borderColor}`,
                                fontSize: "28px",
                                color: symbolColor,
                                cursor: cell?.justification ? "pointer" : "default",
                                transition: "all 0.2s",
                              }}
                              title={cell?.justification}
                              onMouseEnter={(e) => {
                                if (cell?.justification) {
                                  e.currentTarget.style.transform = "scale(1.05)";
                                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {cell?.symbol || "○"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Enhanced Legend */}
            <div style={{
              marginTop: "24px",
              display: "flex",
              gap: "32px",
              alignItems: "center",
              padding: "16px",
              background: "#F5F5F4",
              borderRadius: "4px"
            }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1C1917" }}>Legend:</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "24px", color: "#166534" }}>✔</span>
                <span style={{ fontSize: "14px", color: "#44403C" }}>Primary Coverage</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "24px", color: "#1E40AF" }}>◐</span>
                <span style={{ fontSize: "14px", color: "#44403C" }}>Partial Coverage</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "24px", color: "#A8A29E" }}>✖</span>
                <span style={{ fontSize: "14px", color: "#44403C" }}>Not Intended</span>
              </div>
            </div>

            {/* Coverage Summary Stats */}
            <div style={{
              marginTop: "24px",
              background: "#F8FAFC",
              borderLeft: "4px solid #1E40AF",
              padding: "16px",
              borderRadius: "4px"
            }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#1C1917" }}>
                Coverage Summary
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", fontSize: "13px" }}>
                {OOVS.map((oov, idx) => {
                  const oovKey = `oov${idx + 1}_${oov.id.split("_")[1]}`;
                  const primaryCount = COVERAGE_MATRIX.filter(c => c[oovKey]?.coverage === "primary").length;
                  const partialCount = COVERAGE_MATRIX.filter(c => c[oovKey]?.coverage === "partial").length;

                  return (
                    <div key={oov.id}>
                      <div style={{ fontWeight: "600", color: "#1C1917", marginBottom: "4px" }}>
                        {oov.shortName}
                      </div>
                      <div style={{ color: "#78716C" }}>
                        {primaryCount} primary, {partialCount} partial
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 3: MECHANISM DETAILS VIEW
            ================================================================== */}
        {activeTab === "mechanisms" && (
          <div>
            <div
              style={{
                background: "white",
                border: "1px solid #E7E5E4",
                borderRadius: "4px",
                padding: "32px",
              }}
            >
              {/* Mechanism Header */}
              <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontFamily: "Crimson Pro, serif", color: "#1C1917" }}>
                {selectedMechanism.shortName}
              </h2>
              <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#78716C", lineHeight: "1.6" }}>
                {selectedMechanism.definition}
              </p>

              {/* Two-Column Layout: Scores + Coverage */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

                {/* Left Column: VMFS Scores */}
                <div>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1C1917" }}>VMFS Scores</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Technical Feasibility", value: selectedMechanism.vmfsScores.technicalFeasibility },
                      { label: "Political Tractability", value: selectedMechanism.vmfsScores.politicalTractability },
                      { label: "Institutional Req", value: selectedMechanism.vmfsScores.institutionalReq },
                      { label: "Sovereignty Impact", value: selectedMechanism.vmfsScores.sovereigntyImpact },
                      { label: "Global South Adoptability", value: selectedMechanism.vmfsScores.globalSouthAdoptability },
                    ].map((score, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "#FAFAF9", borderRadius: "4px" }}>
                        <span style={{ fontSize: "14px", color: "#44403C" }}>{score.label}</span>
                        <span style={{ fontSize: "14px", fontWeight: "600", fontFamily: "IBM Plex Mono, monospace" }}>
                          {typeof score.value === "number" ? score.value.toFixed(1) : score.value.toUpperCase()}
                        </span>
                      </div>
                    ))}

                    {/* Weighted Average Highlight */}
                    <div style={{ marginTop: "8px", padding: "12px", background: "#F8FAFC", borderRadius: "4px", borderLeft: "4px solid #1E40AF" }}>
                      <span style={{ fontSize: "12px", color: "#78716C" }}>Weighted Average</span>
                      <div style={{ fontSize: "24px", fontWeight: "700", fontFamily: "IBM Plex Mono, monospace", color: "#1C1917" }}>
                        {selectedMechanism.vmfsScores.weightedAvg.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: OoV Coverage */}
                <div>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1C1917" }}>OoV Coverage</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {OOVS.map((oov) => {
                      const coverage = COVERAGE_MATRIX.find((c) => c.mechanismId === selectedMechanism.id);
                      const oovKey = `oov${OOVS.indexOf(oov) + 1}_${oov.id.split("_")[1]}`;
                      const cell = coverage?.[oovKey];
                      return (
                        <div
                          key={oov.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "8px",
                            background: "#FAFAF9",
                            borderRadius: "4px",
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>{cell?.symbol || "○"}</span>
                          <span style={{ fontSize: "14px", color: "#44403C" }}>{oov.shortName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* What it produces */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1C1917" }}>What it produces</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#44403C", lineHeight: "1.6" }}>
                  {selectedMechanism.evidenceProduced.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* What it verifies */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1C1917" }}>What it can verify</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#44403C", lineHeight: "1.6" }}>
                  {selectedMechanism.whatItVerifies.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Dependencies */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1C1917" }}>What it needs to work</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#44403C", lineHeight: "1.6" }}>
                  {selectedMechanism.dependencies.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Limitations Panel */}
              <div
                style={{
                  background: "#FFF7ED",
                  borderLeft: "4px solid #EA580C",
                  padding: "16px",
                  borderRadius: "4px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1C1917" }}>⚠️ Biggest Limitations</h3>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#44403C", lineHeight: "1.6" }}>
                  <strong>Primary:</strong> {selectedMechanism.limitations.primary}
                </p>
                <p style={{ margin: 0, fontSize: "14px", color: "#44403C", lineHeight: "1.6" }}>
                  <strong>Technical:</strong> {selectedMechanism.limitations.technical}
                </p>
              </div>

              {/* Evasion Modes */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1C1917" }}>🔓 Known Evasion Modes</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#44403C", lineHeight: "1.6" }}>
                  {selectedMechanism.evasionModes.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Citations */}
              <div style={{ fontSize: "12px", color: "#78716C" }}>
                <strong>Key References:</strong>{" "}
                {selectedMechanism.citations.map((cite, idx) => (
                  <span key={idx}>
                    {cite}
                    {idx < selectedMechanism.citations.length - 1 ? "; " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
