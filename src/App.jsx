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
  // HELPER FUNCTIONS - COLOR CODING (HIGH CONTRAST)
  // ==========================================================================

  // Get text color based on score (1-5 scale) - DARKER for readability
  const getScoreColor = (score) => {
    if (score >= 4.5) return "#14532D"; // very dark green
    if (score >= 3.5) return "#1E3A8A"; // very dark blue
    if (score >= 2.5) return "#57534E"; // dark gray
    if (score >= 1.5) return "#9A3412"; // dark orange
    return "#7F1D1D"; // dark red
  };

  // Get background color based on score - STRONGER colors
  const getScoreBgColor = (score) => {
    if (score >= 4.5) return "#BBF7D0"; // strong green
    if (score >= 3.5) return "#BFDBFE"; // strong blue
    if (score >= 2.5) return "#E7E5E4"; // medium gray
    if (score >= 1.5) return "#FED7AA"; // strong orange
    return "#FECACA"; // strong red
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
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1C1917",
                      borderBottom: "2px solid #A8A29E",
                      minWidth: "220px"
                    }}>
                      Mechanism
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1C1917",
                      borderBottom: "2px solid #A8A29E"
                    }} title="Technical Feasibility (1-5): Can we build this with current/near-term technology?">
                      TF
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1C1917",
                      borderBottom: "2px solid #A8A29E"
                    }} title="Political Tractability (1-5): Will states and labs agree to this?">
                      PT
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1C1917",
                      borderBottom: "2px solid #A8A29E"
                    }} title="Institutional Requirements: What bodies/agreements are needed? (Low/Medium/High)">
                      IR
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1C1917",
                      borderBottom: "2px solid #A8A29E"
                    }} title="Sovereignty Impact (1-5): How intrusive? Higher = less intrusive">
                      SI
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1C1917",
                      borderBottom: "2px solid #A8A29E"
                    }} title="Global South Adoptability (1-5): Can developing nations participate meaningfully?">
                      GSA
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1C1917",
                      borderBottom: "2px solid #A8A29E"
                    }}>
                      Avg
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1C1917",
                      borderBottom: "2px solid #A8A29E"
                    }}>
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
                        {/* Mechanism Name - FIXED to show actual name */}
                        <td style={{
                          padding: "18px 16px",
                          borderBottom: "1px solid #E7E5E4",
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "#1C1917"
                        }}>
                          {mechanism.shortName}
                        </td>

                        {/* Technical Feasibility */}
                        <td
                          style={{
                            padding: "18px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            background: getScoreBgColor(mechanism.vmfsScores.technicalFeasibility),
                            color: getScoreColor(mechanism.vmfsScores.technicalFeasibility),
                            fontWeight: "700",
                            fontSize: "15px",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                          title={`Technical Feasibility: ${mechanism.vmfsScores.technicalFeasibility}/5`}
                        >
                          {mechanism.vmfsScores.technicalFeasibility.toFixed(1)}
                        </td>

                        {/* Political Tractability */}
                        <td
                          style={{
                            padding: "18px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            background: getScoreBgColor(mechanism.vmfsScores.politicalTractability),
                            color: getScoreColor(mechanism.vmfsScores.politicalTractability),
                            fontWeight: "700",
                            fontSize: "15px",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                          title={`Political Tractability: ${mechanism.vmfsScores.politicalTractability}/5`}
                        >
                          {mechanism.vmfsScores.politicalTractability.toFixed(1)}
                        </td>

                        {/* Institutional Requirements */}
                        <td
                          style={{
                            padding: "18px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            fontSize: "14px",
                            fontWeight: "700",
                            background: mechanism.vmfsScores.institutionalReq === "low" ? "#BBF7D0" :
                                       mechanism.vmfsScores.institutionalReq === "medium" ? "#FED7AA" : "#FECACA",
                            color: mechanism.vmfsScores.institutionalReq === "low" ? "#14532D" :
                                   mechanism.vmfsScores.institutionalReq === "medium" ? "#9A3412" : "#7F1D1D",
                          }}
                          title={`Institutional Requirements: ${mechanism.vmfsScores.institutionalReq}`}
                        >
                          {mechanism.vmfsScores.institutionalReq.toUpperCase()[0]}
                        </td>

                        {/* Sovereignty Impact */}
                        <td
                          style={{
                            padding: "18px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            background: getScoreBgColor(mechanism.vmfsScores.sovereigntyImpact),
                            color: getScoreColor(mechanism.vmfsScores.sovereigntyImpact),
                            fontWeight: "700",
                            fontSize: "15px",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                          title={`Sovereignty Impact: ${mechanism.vmfsScores.sovereigntyImpact}/5 (higher = less intrusive)`}
                        >
                          {mechanism.vmfsScores.sovereigntyImpact.toFixed(1)}
                        </td>

                        {/* Global South Adoptability */}
                        <td
                          style={{
                            padding: "18px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            background: getScoreBgColor(mechanism.vmfsScores.globalSouthAdoptability),
                            color: getScoreColor(mechanism.vmfsScores.globalSouthAdoptability),
                            fontWeight: "700",
                            fontSize: "15px",
                            fontFamily: "IBM Plex Mono, monospace",
                          }}
                          title={`Global South Adoptability: ${mechanism.vmfsScores.globalSouthAdoptability}/5`}
                        >
                          {mechanism.vmfsScores.globalSouthAdoptability.toFixed(1)}
                        </td>

                        {/* Weighted Average - USE DIRECT VALUE FROM DATA */}
                        <td
                          style={{
                            padding: "18px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            fontWeight: "700",
                            fontSize: "17px",
                            fontFamily: "IBM Plex Mono, monospace",
                            background: "#F5F5F4",
                            color: "#1C1917"
                          }}
                          title={`Overall Weighted Average: ${mechanism.vmfsScores.weightedAvg}/5`}
                        >
                          {mechanism.vmfsScores.weightedAvg.toFixed(1)}
                        </td>

                        {/* Coverage Symbols - FIXED VISIBILITY */}
                        <td
                          style={{
                            padding: "18px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid #E7E5E4",
                            fontSize: "20px",
                            letterSpacing: "6px",
                            fontWeight: "600",
                            color: "#1C1917",
                            background: "white"
                          }}
                          title="OoV Coverage: Compute | Lineage | Deployment | Post-Training"
                        >
                          {coverageSymbols.map((symbol, idx) => {
                            let symbolColor;
                            if (symbol === "✔") symbolColor = "#166534"; // dark green
                            else if (symbol === "◐") symbolColor = "#1E40AF"; // dark blue
                            else if (symbol === "✖") symbolColor = "#A8A29E"; // gray
                            else symbolColor = "#D6D3D1"; // light gray for ○

                            return (
                              <span key={idx} style={{ color: symbolColor, marginRight: idx < 3 ? "6px" : "0" }}>
                                {symbol}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Enhanced Legend with Color Examples */}
            <div style={{
              marginTop: "24px",
              background: "#F5F5F4",
              padding: "20px",
              borderRadius: "4px",
              border: "1px solid #E7E5E4"
            }}>
              <div style={{ marginBottom: "16px" }}>
                <strong style={{ fontSize: "14px", color: "#1C1917" }}>Column Explanations:</strong>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", fontSize: "13px", marginBottom: "16px" }}>
                <div>
                  <strong style={{ color: "#1C1917" }}>TF</strong> = Technical Feasibility<br/>
                  <span style={{ color: "#78716C" }}>Can we build this now?</span>
                </div>
                <div>
                  <strong style={{ color: "#1C1917" }}>PT</strong> = Political Tractability<br/>
                  <span style={{ color: "#78716C" }}>Will states/labs agree?</span>
                </div>
                <div>
                  <strong style={{ color: "#1C1917" }}>IR</strong> = Institutional Requirements<br/>
                  <span style={{ color: "#78716C" }}>L=Low, M=Medium, H=High</span>
                </div>
                <div>
                  <strong style={{ color: "#1C1917" }}>SI</strong> = Sovereignty Impact<br/>
                  <span style={{ color: "#78716C" }}>Higher = less intrusive</span>
                </div>
                <div>
                  <strong style={{ color: "#1C1917" }}>GSA</strong> = Global South Adoptability<br/>
                  <span style={{ color: "#78716C" }}>Can developing nations join?</span>
                </div>
                <div>
                  <strong style={{ color: "#1C1917" }}>Coverage</strong> = OoV Symbols<br/>
                  <span style={{ color: "#78716C" }}>✔ Primary, ◐ Partial, ✖ None</span>
                </div>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #D6D3D1" }}>
                <strong style={{ fontSize: "14px", color: "#1C1917", marginBottom: "8px", display: "block" }}>Color Scale (1-5 scores):</strong>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "40px", height: "24px", background: "#BBF7D0", border: "1px solid #86EFAC", borderRadius: "2px" }}></div>
                    <span style={{ fontSize: "13px", color: "#44403C" }}>4.5-5.0 (Excellent)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "40px", height: "24px", background: "#BFDBFE", border: "1px solid #93C5FD", borderRadius: "2px" }}></div>
                    <span style={{ fontSize: "13px", color: "#44403C" }}>3.5-4.4 (Good)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "40px", height: "24px", background: "#E7E5E4", border: "1px solid #D6D3D1", borderRadius: "2px" }}></div>
                    <span style={{ fontSize: "13px", color: "#44403C" }}>2.5-3.4 (Moderate)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "40px", height: "24px", background: "#FED7AA", border: "1px solid #FDBA74", borderRadius: "2px" }}></div>
                    <span style={{ fontSize: "13px", color: "#44403C" }}>1.5-2.4 (Challenging)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "40px", height: "24px", background: "#FECACA", border: "1px solid #FCA5A5", borderRadius: "2px" }}></div>
                    <span style={{ fontSize: "13px", color: "#44403C" }}>1.0-1.4 (Very Difficult)</span>
                  </div>
                </div>
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
                      { label: "Technical Feasibility", value: selectedMechanism.vmfsScores.technicalFeasibility, isNumeric: true },
                      { label: "Political Tractability", value: selectedMechanism.vmfsScores.politicalTractability, isNumeric: true },
                      { label: "Institutional Req", value: selectedMechanism.vmfsScores.institutionalReq, isNumeric: false },
                      { label: "Sovereignty Impact", value: selectedMechanism.vmfsScores.sovereigntyImpact, isNumeric: true },
                      { label: "Global South Adoptability", value: selectedMechanism.vmfsScores.globalSouthAdoptability, isNumeric: true },
                    ].map((score, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#FAFAF9", borderRadius: "4px" }}>
                        <span style={{ fontSize: "14px", color: "#44403C" }}>{score.label}</span>
                        <span style={{ fontSize: "16px", fontWeight: "700", fontFamily: "IBM Plex Mono, monospace", color: "#1C1917" }}>
                          {score.isNumeric ? score.value.toFixed(1) : score.value.toUpperCase()}
                        </span>
                      </div>
                    ))}

                    {/* Weighted Average Highlight */}
                    <div style={{ marginTop: "8px", padding: "16px", background: "#F8FAFC", borderRadius: "4px", borderLeft: "4px solid #1E40AF" }}>
                      <span style={{ fontSize: "12px", color: "#78716C", display: "block", marginBottom: "4px" }}>Weighted Average</span>
                      <div style={{ fontSize: "28px", fontWeight: "700", fontFamily: "IBM Plex Mono, monospace", color: "#1C1917" }}>
                        {selectedMechanism.vmfsScores.weightedAvg.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: OoV Coverage */}
                <div>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1C1917" }}>OoV Coverage</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {OOVS.map((oov, oovIndex) => {
                      const coverage = COVERAGE_MATRIX.find((c) => c.mechanismId === selectedMechanism.id);
                      // Map OoV index to the correct key in coverage object
                      const oovKeys = ["oov1_compute", "oov2_lineage", "oov3_deployment", "oov4_post_training"];
                      const oovKey = oovKeys[oovIndex];
                      const cell = coverage?.[oovKey];

                      // Get symbol and color
                      const symbol = cell?.symbol || "○";
                      let symbolColor, bgColor, coverageText;

                      if (cell?.coverage === "primary") {
                        symbolColor = "#166534";
                        bgColor = "#DCFCE7";
                        coverageText = "Primary";
                      } else if (cell?.coverage === "partial") {
                        symbolColor = "#1E40AF";
                        bgColor = "#DBEAFE";
                        coverageText = "Partial";
                      } else {
                        symbolColor = "#A8A29E";
                        bgColor = "#F5F5F4";
                        coverageText = "Not Intended";
                      }

                      return (
                        <div
                          key={oov.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px",
                            background: bgColor,
                            borderRadius: "4px",
                            border: `1px solid ${symbolColor}40`,
                          }}
                          title={cell?.justification || "No coverage information"}
                        >
                          <span style={{ fontSize: "24px", color: symbolColor, fontWeight: "600" }}>{symbol}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#1C1917" }}>{oov.shortName}</div>
                            <div style={{ fontSize: "12px", color: "#78716C" }}>{coverageText}</div>
                          </div>
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
