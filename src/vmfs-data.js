// VMFS Dashboard - Complete Data Structure
// Based on: Verification Mechanism Feasibility Scorer (VMFS)
// Track 4: International Verification & Coordination Infrastructure

export const MECHANISMS = [
  {
    id: "m1_compute_monitoring",
    mechanism: "Compute Monitoring via On-Chip Telemetry",
    shortName: "Compute Monitoring",
    definition: "Uses secure hardware features in AI chips to meter training workloads (e.g., FLOPs, run duration, chip IDs) and produce cryptographically verifiable logs.",
    vmfsScores: {
      technicalFeasibility: 3.5,
      politicalTractability: 2.5,
      institutionalReq: "high", // converted to 3 for numeric
      institutionalReqNumeric: 3,
      sovereigntyImpact: 2.0,
      globalSouthAdoptability: 2.5,
      weightedAvg: 2.6
    },
    evidenceProduced: [
      "Logs of large training runs (FLOPs, chips, duration)",
      "Proof of presence and utilization of high-end chips at specific facilities",
      "Aggregated provider-level usage and capacity statistics"
    ],
    whatItVerifies: [
      "Whether any frontier-scale training runs took place on monitored chips",
      "Compliance with compute caps or licensing limits",
      "Cross-validation of self-reported training runs"
    ],
    dependencies: [
      "Hardware support with secure telemetry and attestation",
      "Cloud/cluster integration into schedulers and billing",
      "Governance rules requiring enabled telemetry",
      "Standards and interoperability across vendors"
    ],
    limitations: {
      primary: "Political and commercial acceptability - whether chip makers/cloud providers will accept always-on telemetry",
      technical: "Coverage gaps: unmonitored legacy/gray-market chips, air-gapped clusters, distributed compute below thresholds"
    },
    evasionModes: ["Distributed training across sub-threshold clusters", "Gray market chips", "Hardware circumvention"],
    citations: ["Sastry et al. 2024", "Kulp et al. 2024", "Toward a Global Regime for Compute Governance 2025"]
  },
  {
    id: "m2_chip_registry",
    mechanism: "Chip Registry & Tracking of AI Accelerators",
    shortName: "Chip Registry",
    definition: "A system where advanced AI accelerators receive unique identifiers and all sales, transfers, and major deployments are logged in trusted databases.",
    vmfsScores: {
      technicalFeasibility: 3.0,
      politicalTractability: 3.0,
      institutionalReq: "high",
      institutionalReqNumeric: 3,
      sovereigntyImpact: 3.0,
      globalSouthAdoptability: 3.0,
      weightedAvg: 3.0
    },
    evidenceProduced: [
      "Ownership and transfer history for each registered high-end AI chip",
      "Installation location of registered chips",
      "Aggregate national and sectoral inventories of frontier-class compute capacity"
    ],
    whatItVerifies: [
      "Whether actors have enough high-end chips to train frontier models",
      "Whether export-controlled chips were diverted to unapproved buyers",
      "Consistency between declared facilities and registered inventories"
    ],
    dependencies: [
      "Mandatory vendor participation in assigning chip IDs",
      "Operator reporting of installations and redeployments",
      "Registry operators (national/international bodies)",
      "Policy integration with export controls and customs data"
    ],
    limitations: {
      primary: "Whether major powers and labs will fully participate and report honestly rather than building off-book clusters",
      technical: "Only tracks possession, not actual usage; cannot catch clusters that never enter the registry"
    },
    evasionModes: ["Shadow inventory", "Falsified transfer records", "Procurement through intermediaries", "Smuggling"],
    citations: ["Sastry et al. 2024", "Oxford Martin AIGI 2025", "Toward a Global Regime for Compute Governance 2025"]
  },
  {
    id: "m3_tee_attestation",
    mechanism: "Hardware Attestation via Trusted Execution Environments (TEEs)",
    shortName: "TEE Attestation",
    definition: "Enables AI chips/servers to cryptographically prove specific properties of a training/inference run without revealing sensitive model weights, using tamper-resistant hardware enclaves.",
    vmfsScores: {
      technicalFeasibility: 4.2,
      politicalTractability: 2.8,
      institutionalReq: "medium",
      institutionalReqNumeric: 2,
      sovereigntyImpact: 3.5,
      globalSouthAdoptability: 2.0,
      weightedAvg: 3.1
    },
    evidenceProduced: [
      "Cryptographic proof of workload properties (compute, code, duration)",
      "Attestations of TEE integrity and location/configuration",
      "Verifiable audit/eval results bound to model/dataset"
    ],
    whatItVerifies: [
      "Compliance with compute caps or approved-code rules",
      "Remote auditing of safety benchmarks without model access",
      "Proving workloads ran in secure, authorized environments"
    ],
    dependencies: [
      "TEE-enabled hardware (Intel TDX, AMD SEV-SNP, ARM CCA)",
      "Trusted hardware vendors providing verifiable attestation reports",
      "Cloud/on-prem integration into AI stacks",
      "Accredited verifiers with PKI infrastructure"
    ],
    limitations: {
      primary: "Reliance on hardware vendors - TEE security rests on a few companies; backdoor or vulnerability could undermine all attestations",
      technical: "Attestations only prove measured properties, not emergent capabilities; performance overhead limits massive training runs"
    },
    evasionModes: ["Side-channel attacks on TEE memory", "Vulnerability exploits in enclave software", "Performance overhead avoidance"],
    citations: ["Wasil et al. 2024", "Hardware-Enabled Mechanisms for Verifying Responsible AI 2024", "Attestable Audits 2025"]
  },
  {
    id: "m4_third_party_audits",
    mechanism: "Third-Party Model Audits",
    shortName: "Third-Party Audits",
    definition: "Independent external experts gain structured access to frontier AI models, weights, training data, and internal processes to evaluate safety claims and governance.",
    vmfsScores: {
      technicalFeasibility: 4.5,
      politicalTractability: 4.0,
      institutionalReq: "medium",
      institutionalReqNumeric: 2,
      sovereigntyImpact: 3.0,
      globalSouthAdoptability: 3.5,
      weightedAvg: 3.8
    },
    evidenceProduced: [
      "Independent assessment reports on model capabilities (cyber/bio/chem risks)",
      "Verification of internal safety/security practices",
      "Compliance confirmation against standards",
      "Recommendations on gaps and safeguards"
    ],
    whatItVerifies: [
      "Whether frontier models have dangerous capabilities beyond self-reports",
      "If developer safety processes are actually implemented and effective",
      "Compliance with standards or treaties before deployment"
    ],
    dependencies: [
      "Developer cooperation granting secure, time-bounded access",
      "Accredited auditors (e.g., METR, AISI, BSI) with expertise",
      "Legal agreements/regulations mandating audits for frontier models",
      "Secure infrastructure (sandboxes, encrypted channels, NDAs)",
      "Government oversight to accredit auditors and enforce access"
    ],
    limitations: {
      primary: "Access depth and developer cooperation - labs may limit scope or redact info, turning audits superficial",
      technical: "Audits are periodic snapshots; miss ongoing risks or post-audit changes without continuous monitoring"
    },
    evasionModes: ["Selective disclosure", "Staging environments that differ from production", "Post-audit modifications"],
    citations: ["Brundage et al. 2024", "Belfield 2025", "Homewood 2025"]
  },
  {
    id: "m5_watermarking",
    mechanism: "Model Watermarking",
    shortName: "Model Watermarking",
    definition: "Embeds imperceptible, statistically detectable signals into AI model outputs during generation, allowing downstream detectors to trace content back to specific models.",
    vmfsScores: {
      technicalFeasibility: 2.5,
      politicalTractability: 3.5,
      institutionalReq: "low",
      institutionalReqNumeric: 1,
      sovereigntyImpact: 4.5,
      globalSouthAdoptability: 4.0,
      weightedAvg: 3.6
    },
    evidenceProduced: [
      "Detection of AI-generated content with confidence scores",
      "Attribution to specific model/provider",
      "Proof of provenance chain for derivative content",
      "Aggregate statistics on model usage"
    ],
    whatItVerifies: [
      "Whether specific content was AI-generated by a regulated model",
      "That viral or harmful content originated from a particular AI provider",
      "Compliance with labeling rules for AI-generated content"
    ],
    dependencies: [
      "Model developers embedding watermarks during training/inference",
      "Detector operators (platforms) running detectors on content",
      "Standards bodies agreeing on watermark strength and threat models",
      "Regulators mandating watermarking for high-risk models",
      "Independent auditor testing of watermark robustness"
    ],
    limitations: {
      primary: "Robustness to removal attacks - simple edits (paraphrase, crop) often break watermarks",
      technical: "Only traces outputs, not model training, capabilities, or safety; ineffective without mandated embedding"
    },
    evasionModes: ["Paraphrasing attacks", "Image editing/cropping", "Adversarial removal techniques"],
    citations: ["Nemecek et al. 2025", "Wen et al. 2024", "Adorante et al. MDPI 2025"]
  },
  {
    id: "m6_whistleblowers",
    mechanism: "Whistleblower Programs",
    shortName: "Whistleblower Programs",
    definition: "Incentivize and protect AI lab employees/contractors to confidentially report undisclosed frontier AI development, safety failures, or agreement violations.",
    vmfsScores: {
      technicalFeasibility: 4.0,
      politicalTractability: 3.0,
      institutionalReq: "low",
      institutionalReqNumeric: 1,
      sovereigntyImpact: 4.0,
      globalSouthAdoptability: 4.5,
      weightedAvg: 3.9
    },
    evidenceProduced: [
      "Insider accounts of undeclared training runs or safety incidents",
      "Specific leads for inspections (e.g., hidden cluster locations)",
      "Documents/emails proving violations",
      "Corroboration of technical signals"
    ],
    whatItVerifies: [
      "Existence of secret frontier AI projects evading hardware/compute monitors",
      "Internal cover-ups of safety failures or agreement breaches",
      "Details on covert operations (off-book scaling, safety stripping)"
    ],
    dependencies: [
      "Insiders willing to report (motivated by incentives/protections)",
      "AI labs cannot block reports via NDAs",
      "Governments providing secure anonymous hotlines and financial rewards",
      "International coordination for cross-border protections",
      "Auditors/investigators with capacity to vet tips and protect sources"
    ],
    limitations: {
      primary: "Insider willingness - fear of retaliation, loyalty, or suppression may yield few reports",
      technical: "Probabilistic and retrospective; no proactive monitoring, dependent on human judgment"
    },
    evasionModes: ["Retaliation deterrence", "Limited insider access to sensitive info", "Suppression in authoritarian regimes"],
    citations: ["Wasil et al. 2024", "Baker et al. 2024", "Loyens & Vandekerckhove 2018"]
  },
  {
    id: "m7_remote_sensing",
    mechanism: "Remote Sensing (Thermal/Satellite Monitoring)",
    shortName: "Remote Sensing",
    definition: "Uses commercial/government satellites with thermal infrared cameras to detect heat signatures from large AI data centers without on-site access.",
    vmfsScores: {
      technicalFeasibility: 3.5,
      politicalTractability: 4.5,
      institutionalReq: "low",
      institutionalReqNumeric: 1,
      sovereigntyImpact: 5.0,
      globalSouthAdoptability: 3.5,
      weightedAvg: 4.1
    },
    evidenceProduced: [
      "Thermal anomalies indicating high-power compute clusters",
      "Visual signatures of data centers via optical satellites",
      "Change detection (new builds, capacity ramps) over time",
      "AI-classified facility types and scales"
    ],
    whatItVerifies: [
      "Existence/location of new or expanded large-scale AI compute facilities",
      "Rough scale of compute infrastructure via heat/power proxies",
      "Consistency with declarations (undeclared data centers)"
    ],
    dependencies: [
      "Satellite operators (commercial providers like Satellite Vu, Planet, Maxar)",
      "AI analysts/teams to process imagery for signatures",
      "Governments/regulators with agreements to share/buy data",
      "International bodies coordinating global coverage",
      "No on-ground cooperation needed (unilateral national technical means)"
    ],
    limitations: {
      primary: "Discriminating AI compute from other data centers - generic hyperscalers mask signatures",
      technical: "Coarse proxies (heat/power) infer capacity but not usage/models; infrequent revisits miss short bursts"
    },
    evasionModes: ["Distributed compute", "Camouflage techniques", "Cooling efficiency improvements reducing thermal signature"],
    citations: ["Wasil et al. 2024", "Rutkowski & Niemeyer 2020", "Stanford HAI 2025"]
  },
  {
    id: "m8_declarations",
    mechanism: "Declaration Regimes",
    shortName: "Declaration Regimes",
    definition: "Require AI developers/operators to periodically self-report key details (training runs, model releases, facilities) into public/semi-public registries with audits to verify claims.",
    vmfsScores: {
      technicalFeasibility: 4.0,
      politicalTractability: 4.0,
      institutionalReq: "medium",
      institutionalReqNumeric: 2,
      sovereigntyImpact: 3.0,
      globalSouthAdoptability: 2.5,
      weightedAvg: 3.4
    },
    evidenceProduced: [
      "Self-reported inventories of frontier models, training compute, facilities",
      "Registry of high-risk systems with compliance attestations",
      "Audit results confirming or flagging discrepancies"
    ],
    whatItVerifies: [
      "Whether developers are accurately disclosing frontier AI activities",
      "Compliance with registration rules for high-risk systems before release",
      "Baseline transparency for cross-checking with other monitors"
    ],
    dependencies: [
      "Developers/labs mandated to self-report via standardized forms",
      "Registry operator (EU-style database, IAEA-like agency)",
      "Regulators with legal mandates and verification powers",
      "Auditors with capacity for random/challenge checks",
      "Governments harmonizing international reporting rules"
    ],
    limitations: {
      primary: "Self-reporting honesty - actors may omit/understate to evade scrutiny",
      technical: "Low standalone power; needs complementary verification (audits, telemetry)"
    },
    evasionModes: ["Strategic non-disclosure", "Falsification", "Jurisdictional arbitrage"],
    citations: ["Toward a Global Regime for Compute Governance 2025", "Wasil et al. 2024", "EU AI Act"]
  }
];

export const OOVS = [
  {
    id: "oov1_compute",
    name: "Compute Use",
    shortName: "Compute",
    definition: "Verifying the scale and nature of compute used for training and (where relevant) inference of advanced AI systems.",
    exampleClaims: [
      "A given training run exceeded an agreed compute threshold",
      "A lab conducted any undeclared frontier-scale training runs during a reporting period",
      "Compute usage patterns are consistent with training vs inference at declared times"
    ],
    evidenceTypes: [
      "Hardware/software telemetry and logs",
      "Cloud/provider records",
      "Audited internal training run records"
    ],
    constraints: "Cross-border compute verification must balance confidentiality and sovereignty; feasible regimes typically rely on limited-scope evidence and confidential verification designs."
  },
  {
    id: "oov2_lineage",
    name: "Model Identity & Lineage",
    shortName: "Lineage",
    definition: "Verifying a model's provenance: what it is derived from and the major transformations it underwent (e.g., fine-tuning, distillation, merging).",
    exampleClaims: [
      "A deployed model is derived from (or contains) a declared base model family/version",
      "A reported fine-tuning event occurred, including timing and responsible entity",
      "The released model corresponds to the evaluated model version"
    ],
    evidenceTypes: [
      "Signed model registries",
      "Auditable versioning records",
      "Controlled disclosure of training/fine-tuning attestations",
      "Third-party audit reports"
    ],
    constraints: "International regimes often need 'prove without revealing' approaches (confidential verification, limited attestations) because lineage can expose competitive IP and sensitive capabilities."
  },
  {
    id: "oov3_deployment",
    name: "Deployment & Access Conditions",
    shortName: "Deployment",
    definition: "Verifying how and where a model is deployed and who can access it (scope, controls, and operational constraints).",
    exampleClaims: [
      "The model is deployed only in approved environments/jurisdictions",
      "High-risk capabilities are gated behind specified access controls",
      "The system is not accessible to prohibited user groups/use cases under an agreement"
    ],
    evidenceTypes: [
      "Access-control logs",
      "API gateway policy configs",
      "Deployment attestations",
      "Audit results",
      "Incident reports tied to enforcement mechanisms"
    ],
    constraints: "Deployment verification is often more sovereignty- and privacy-sensitive than compute because it touches users, communications, and domestic enforcement."
  },
  {
    id: "oov4_post_training",
    name: "Post-Training Modification",
    shortName: "Post-Training",
    definition: "Verifying material changes to a model after initial training, including fine-tuning, capability unlocking, parameter updates, or system-level integrations.",
    exampleClaims: [
      "The model has been materially modified since its last declared evaluation",
      "Post-training updates introduced new capabilities or removed safeguards",
      "Deployment-time modifications are consistent with reported changes"
    ],
    evidenceTypes: [
      "Version histories",
      "Post-training change logs",
      "Signed modification attestations",
      "Audit trails linking updates to specific model versions",
      "Targeted reevaluations of modified systems"
    ],
    constraints: "Post-training modification is a common point of governance drift, but verification is constrained by commercial secrecy and rapid iteration cycles."
  }
];

// Coverage Matrix: Mechanism × OoV pairs
export const COVERAGE_MATRIX = [
  // M1: Compute Monitoring
  {
    mechanismId: "m1_compute_monitoring",
    oov1_compute: {
      coverage: "primary",
      symbol: "✔",
      justification: "Direct measurement of compute via on-chip telemetry produces checkable evidence against declared thresholds.",
      evidenceArtifact: "Run-level evidence dashboard showing above-threshold events"
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "◐",
      justification: "Telemetry reveals computational activity but cannot independently prove which model was trained without integration with signed workload identifiers."
    },
    oov3_deployment: {
      coverage: "none",
      symbol: "✖",
      justification: "Does not observe deployment configurations or access controls."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "◐",
      justification: "Shows compute activity but not what changed in the model or system architecture."
    }
  },
  // M2: Chip Registry
  {
    mechanismId: "m2_chip_registry",
    oov1_compute: {
      coverage: "partial",
      symbol: "◐",
      justification: "Registry confirms possession not use; actors may possess but not utilize capacity."
    },
    oov2_lineage: {
      coverage: "none",
      symbol: "✖",
      justification: "Does not track model provenance or transformations."
    },
    oov3_deployment: {
      coverage: "none",
      symbol: "✖",
      justification: "Tracks hardware location but not deployment configurations or access."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "◐",
      justification: "Tracks infrastructure changes that enable modification but not the modifications themselves."
    }
  },
  // M3: TEE Attestation
  {
    mechanismId: "m3_tee_attestation",
    oov1_compute: {
      coverage: "primary",
      symbol: "✔",
      justification: "Generates cryptographically signed evidence that specific code ran with defined compute bounds.",
      evidenceArtifact: "Attestation result dashboard showing pass/fail status and bound claims"
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "◐",
      justification: "Attestation proves what was measured in the enclave but requires integration with model registries to definitively link to specific model versions."
    },
    oov3_deployment: {
      coverage: "primary",
      symbol: "✔",
      justification: "Can attest to environment verification - proving workloads ran in authorized locations/configurations.",
      evidenceArtifact: "Attestations of TEE integrity and location/configuration"
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "◐",
      justification: "Can attest to modification events if modifications occur within TEE, but cannot capture modifications in non-attested environments."
    }
  },
  // M4: Third-Party Audits
  {
    mechanismId: "m4_third_party_audits",
    oov1_compute: {
      coverage: "partial",
      symbol: "◐",
      justification: "Audits can review compute logs if provided but depend on auditee cooperation and log integrity."
    },
    oov2_lineage: {
      coverage: "primary",
      symbol: "✔",
      justification: "Structured access to models enables direct verification of model identity and lineage documentation.",
      evidenceArtifact: "Audit report with version identity reproduction and lineage review"
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "◐",
      justification: "Can assess deployment controls at time of audit but not continuous monitoring."
    },
    oov4_post_training: {
      coverage: "primary",
      symbol: "✔",
      justification: "Direct access enables verification of post-training changes through documentation review and targeted reevaluation.",
      evidenceArtifact: "Post-training change assessment in audit report"
    }
  },
  // M5: Watermarking
  {
    mechanismId: "m5_watermarking",
    oov1_compute: {
      coverage: "none",
      symbol: "✖",
      justification: "Does not address compute use at all."
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "◐",
      justification: "Can suggest model family but not definitive version or lineage."
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "◐",
      justification: "Indicates deployment occurred but not deployment conditions or access controls."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "◐",
      justification: "Changes in watermark patterns could indicate modifications, but not reliably."
    }
  },
  // M6: Whistleblowers
  {
    mechanismId: "m6_whistleblowers",
    oov1_compute: {
      coverage: "partial",
      symbol: "◐",
      justification: "Provides leads and triggers for deeper investigation rather than direct verification evidence."
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "◐",
      justification: "Insider reports can flag lineage issues but depend on reporter access and credibility."
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "◐",
      justification: "Can reveal unauthorized deployments but coverage is probabilistic and non-systematic."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "◐",
      justification: "Insiders may report undisclosed modifications, but depends on individual decisions to report."
    }
  },
  // M7: Remote Sensing
  {
    mechanismId: "m7_remote_sensing",
    oov1_compute: {
      coverage: "partial",
      symbol: "◐",
      justification: "Heat and power are indirect proxies; cannot precisely measure FLOPs or distinguish AI compute from other workloads."
    },
    oov2_lineage: {
      coverage: "none",
      symbol: "✖",
      justification: "Cannot observe model provenance or transformations from external imagery."
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "◐",
      justification: "Can identify facilities but not access controls or deployment configurations."
    },
    oov4_post_training: {
      coverage: "none",
      symbol: "✖",
      justification: "Cannot detect model modifications from external monitoring."
    }
  },
  // M8: Declarations
  {
    mechanismId: "m8_declarations",
    oov1_compute: {
      coverage: "partial",
      symbol: "◐",
      justification: "Provides claimed state for comparison against independent verification methods; vulnerable to omission without audits."
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "◐",
      justification: "Creates paper trail but requires cross-referencing with other mechanisms for validation."
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "◐",
      justification: "Establishes baseline transparency but limited standalone verification power."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "◐",
      justification: "Enables detection of discrepancies when cross-referenced with audits or monitoring."
    }
  }
];

// Key Findings from Analysis
export const KEY_FINDINGS = [
  {
    id: "finding_1",
    title: "No Silver Bullet",
    description: "No mechanism achieves scores above 4.0 across all dimensions. The highest weighted average is Remote Sensing (4.1), which benefits from being non-intrusive but has limited ability to verify training run properties.",
    icon: "target"
  },
  {
    id: "finding_2",
    title: "Technical-Political Trade-off",
    description: "The most technically sophisticated mechanisms (compute monitoring, hardware attestation) face the steepest political barriers. This suggests a sequencing challenge: building technical capacity before political consensus exists may strand investments.",
    icon: "scale"
  },
  {
    id: "finding_3",
    title: "Global South Adoption Gap",
    description: "Five of eight mechanisms score below 3.5 on Global South Adoptability. Hardware-dependent mechanisms (compute monitoring, TEEs) score lowest (2.0-2.5), while personnel-based mechanisms (whistleblowers) score highest (4.5).",
    icon: "globe"
  },
  {
    id: "finding_4",
    title: "Layered Approaches Required",
    description: "The pattern of complementary strengths and weaknesses suggests robust verification will require multiple mechanisms. For example: Remote sensing (high political tractability) + hardware attestation (high technical precision).",
    icon: "layers"
  }
];

// Global South Adoption Barriers
export const GLOBAL_SOUTH_BARRIERS = [
  {
    mechanismId: "m1_compute_monitoring",
    primaryBarrier: "Infrastructure cost; no local chip manufacturing",
    historicalPrecedent: "IAEA safeguards burden on non-nuclear states",
    adaptationNeeded: "Tiered obligations, tech transfer provisions"
  },
  {
    mechanismId: "m2_chip_registry",
    primaryBarrier: "Participation irrelevant for non-frontier states",
    historicalPrecedent: "Nuclear Suppliers Group exclusion",
    adaptationNeeded: "Benefit-sharing mechanisms"
  },
  {
    mechanismId: "m3_tee_attestation",
    primaryBarrier: "Requires frontier compute infrastructure",
    historicalPrecedent: "N/A (novel)",
    adaptationNeeded: "Regional evaluation hubs"
  },
  {
    mechanismId: "m4_third_party_audits",
    primaryBarrier: "Evaluator capacity concentrated in US/UK",
    historicalPrecedent: "IAEA Additional Protocol adoption gaps",
    adaptationNeeded: "Evaluator training programs"
  },
  {
    mechanismId: "m5_watermarking",
    primaryBarrier: "Limited relevance; low technical barrier",
    historicalPrecedent: "Pharmaceutical serialization",
    adaptationNeeded: "Multilingual documentation"
  },
  {
    mechanismId: "m6_whistleblowers",
    primaryBarrier: "Cultural/legal protection variations",
    historicalPrecedent: "Nuclear whistleblower challenges",
    adaptationNeeded: "Contextualized protection frameworks"
  },
  {
    mechanismId: "m7_remote_sensing",
    primaryBarrier: "Low barrier; can use satellite data",
    historicalPrecedent: "Arms control NTM broadly used",
    adaptationNeeded: "Open data sharing agreements"
  },
  {
    mechanismId: "m8_declarations",
    primaryBarrier: "Compliance burden without frontier models",
    historicalPrecedent: "OPCW universal but uneven implementation",
    adaptationNeeded: "De minimis thresholds for small developers"
  }
];

// VFMC - Historical Failures (subset)
export const HISTORICAL_FAILURES = [
  {
    id: "iraq_1991",
    case: "Iraq (1991)",
    domain: "Nuclear (IAEA/NPT)",
    failureType: "Intelligence/Assessment",
    rootCause: "Analysts wedded to assumptions; ambiguous data misinterpreted",
    aiAnalog: "Mischaracterizing civilian AI research as military"
  },
  {
    id: "north_korea_2003",
    case: "North Korea (2003)",
    domain: "Nuclear (IAEA/NPT)",
    failureType: "Access Denial",
    rootCause: "Withdrawal from treaty; inspector expulsion",
    aiAnalog: "Lab claims 'national security' to block audits"
  },
  {
    id: "iran_natanz",
    case: "Iran Natanz (2002)",
    domain: "Nuclear (IAEA/NPT)",
    failureType: "Clandestine Facility",
    rootCause: "Undeclared sites outside safeguards",
    aiAnalog: "Offshore/underground data centers"
  },
  {
    id: "syria_chlorine",
    case: "Syria Chlorine (2015+)",
    domain: "Chemical (OPCW/CWC)",
    failureType: "Dual-Use Loophole",
    rootCause: "Non-scheduled chemical weaponized",
    aiAnalog: "Fine-tuning open-source models to strip safety filters"
  },
  {
    id: "soviet_biopreparat",
    case: "Soviet Biopreparat",
    domain: "Biological (BWC)",
    failureType: "Commercial Cover",
    rootCause: "Quarantine requirements blocked inspectors",
    aiAnalog: "Proprietary dataset protection blocks hardware audits"
  }
];

// VFMC - Technical Subversion Vectors (subset)
export const SUBVERSION_VECTORS = [
  {
    id: "thermal_masking",
    category: "Physical Concealment",
    vector: "Thermal Masking",
    description: "Blending data center heat signatures into industrial sites (steel mills, refineries)",
    detectionDifficulty: "High",
    mitigation: "Multi-spectral satellite analysis",
    applicableMechanisms: ["m7_remote_sensing"]
  },
  {
    id: "distributed_training",
    category: "Physical Concealment",
    vector: "Distributed Training",
    description: "Splitting compute across many locations below reporting thresholds",
    detectionDifficulty: "High",
    mitigation: "Aggregate monitoring protocols",
    applicableMechanisms: ["m1_compute_monitoring", "m2_chip_registry"]
  },
  {
    id: "telemetry_spoofing",
    category: "Data/Telemetry Manipulation",
    vector: "Telemetry Spoofing",
    description: "Partitioned GPU cores run unauthorized workloads while reporting benign activity",
    detectionDifficulty: "High",
    mitigation: "Hardware roots of trust, attestation",
    applicableMechanisms: ["m1_compute_monitoring"]
  },
  {
    id: "model_substitution",
    category: "Data/Telemetry Manipulation",
    vector: "Model Substitution",
    description: "Present compliant model for audit, deploy different model",
    detectionDifficulty: "High",
    mitigation: "Continuous monitoring, user attestation",
    applicableMechanisms: ["m4_third_party_audits"]
  },
  {
    id: "jurisdiction_shopping",
    category: "Regulatory Arbitrage",
    vector: "Jurisdiction Shopping",
    description: "Relocate to states with weak enforcement",
    detectionDifficulty: "Low",
    mitigation: "International coordination",
    applicableMechanisms: ["m8_declarations"]
  },
  {
    id: "threshold_gaming",
    category: "Regulatory Arbitrage",
    vector: "Threshold Gaming",
    description: "Stay just below reporting requirements",
    detectionDifficulty: "Medium",
    mitigation: "Lower thresholds, gradient requirements",
    applicableMechanisms: ["m1_compute_monitoring", "m8_declarations"]
  }
];