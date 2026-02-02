// VMFS Dashboard - Complete Data Structure
// Based on: Verification Mechanism Feasibility Scorer (VMFS)
// Track 4: International Verification & Coordination Infrastructure

// ============================================================================
// EVIDENCE LOCATIONS - Where the "truth" is found
// ============================================================================
export const EVIDENCE_LOCATIONS = {
  DATA_CENTER: {
    id: "data_center",
    name: "The Data Center / Facility",
    description: "Physical location where compute infrastructure is housed",
  },
  CHIP_HARDWARE: {
    id: "chip_hardware",
    name: "The Chip / Hardware Level",
    description: "GPU/Accelerator level telemetry and attestation",
  },
  SUPPLY_CHAIN: {
    id: "supply_chain",
    name: "The Hardware Supply Chain",
    description: "Manufacturing, distribution, and custody chain",
  },
  DEVELOPER_LAB: {
    id: "developer_lab",
    name: "The Developer Lab / Pipeline",
    description: "Training processes, data filtering, internal systems",
  },
  INSTITUTIONAL: {
    id: "institutional",
    name: "The Institutional Record",
    description: "Legal documents, contracts, declarations, whistleblower reports",
  },
  MODEL_REGISTRY: {
    id: "model_registry",
    name: "The Central Model Registry",
    description: "Authorized model versions, weight hashes, change logs",
  },
  DEPLOYMENT_POINT: {
    id: "deployment_point",
    name: "The Model Deployment Point",
    description: "API access, deployment servers, user access controls",
  },
};

// ============================================================================
// VERIFICATION GOALS - What negotiators want to verify (Intent Layer)
// ============================================================================
export const VERIFICATION_GOALS = [
  {
    id: "goal_geo_location",
    goal: "The geographical location and jurisdictional boundaries of a compute cluster",
    evidenceType: "GPS-stamped 'heartbeats' or multi-spectral thermal signatures",
    evidenceLocation: "data_center",
  },
  {
    id: "goal_compute_flops",
    goal: "The total computational work (FLOPs) performed during a specific training window",
    evidenceType: "Cryptographically signed telemetry logs from the GPU/Accelerator level",
    evidenceLocation: "chip_hardware",
  },
  {
    id: "goal_hardware_origin",
    goal: "The legitimacy of hardware origin and its journey through the supply chain",
    evidenceType: "Cryptographic supply-chain manifests and serial number registries",
    evidenceLocation: "supply_chain",
  },
  {
    id: "goal_data_filtering",
    goal: "That a model's training data was filtered for hazardous or prohibited content",
    evidenceType: "Digital audit certificates and dataset provenance hashes",
    evidenceLocation: "developer_lab",
  },
  {
    id: "goal_data_rights",
    goal: "The legal basis and permissions for the acquisition of high-scale datasets",
    evidenceType: "Digital contracts, licensing attestations, and usage-right metadata",
    evidenceLocation: "institutional",
  },
  {
    id: "goal_model_identity",
    goal: "The identity and version history of a model to ensure it matches audited versions",
    evidenceType: "A digital weight-hash tied to an authorized model registry",
    evidenceLocation: "model_registry",
  },
  {
    id: "goal_post_training",
    goal: "Any material modifications or fine-tuning performed on a model after its initial release",
    evidenceType: "Signed change logs and re-hashed weights in the model registry",
    evidenceLocation: "model_registry",
  },
  {
    id: "goal_access_gates",
    goal: "The enforcement of access gates (who can use the model and from where)",
    evidenceType: "Real-time access-control logs and verified user-identity tokens",
    evidenceLocation: "deployment_point",
  },
  {
    id: "goal_hardware_safeguards",
    goal: "The presence of hardware-level safeguards that prevent unauthorized model use",
    evidenceType: "Proof of TEE-based secure enclaves or physical tamper-evident seals",
    evidenceLocation: "chip_hardware",
  },
  {
    id: "goal_operational_env",
    goal: "The operational environment to ensure the model is running on authorized servers",
    evidenceType: "Signed server identity attestations and IP-address verification logs",
    evidenceLocation: "deployment_point",
  },
];

// ============================================================================
// MECHANISMS - Updated with new 4-dimension scoring
// ============================================================================
export const MECHANISMS = [
  {
    id: "m1_compute_monitoring",
    mechanism: "Compute Monitoring via On-Chip Telemetry",
    shortName: "On-Chip Telemetry",
    definition: "Uses secure hardware features in AI chips to meter training workloads (e.g., FLOPs, run duration, chip IDs) and produce cryptographically verifiable logs.",
    evidenceLocations: ["chip_hardware"],
    evidenceProduced: "Signed logs of total FLOPs and runtime",
    whatItNeeds: "Hardware support with secure telemetry and attestation, cloud/cluster integration, governance rules requiring enabled telemetry",
    biggestLimitation: "Coverage gaps: unmonitored legacy/gray-market chips, air-gapped clusters, distributed compute below thresholds. Political acceptability for always-on telemetry.",
    // New 4-dimension scoring
    newScores: {
      hardness: 4.5, // Cryptographically signed telemetry = physics-based
      burden: 1.5,   // Requires new hardware features
      intrusion: 2.0, // Sees compute activity (metadata level)
      robustness: 2.5, // Coverage gaps for legacy/gray-market chips
    },
    // Legacy scores for backwards compatibility
    vmfsScores: {
      technicalFeasibility: 3.5,
      politicalTractability: 2.5,
      institutionalReq: "high",
      institutionalReqNumeric: 3,
      sovereigntyImpact: 2.0,
      globalSouthAdoptability: 2.5,
      weightedAvg: 2.6
    },
    evidenceProducedList: [
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
    evidenceLocations: ["supply_chain"],
    evidenceProduced: "Ledger of serial numbers and transfer-of-custody",
    whatItNeeds: "Mandatory vendor participation in assigning chip IDs, operator reporting, registry operators (national/international bodies), export controls integration",
    biggestLimitation: "Only tracks possession, not actual usage. Cannot catch clusters that never enter registry. Smuggling and falsified records possible.",
    newScores: {
      hardness: 3.0, // Database/logs - mutable digital
      burden: 3.5,   // Registry/database infrastructure
      intrusion: 4.5, // External tracking, no IP exposure
      robustness: 2.0, // Smuggling, shadow inventory evasion
    },
    vmfsScores: {
      technicalFeasibility: 3.0,
      politicalTractability: 3.0,
      institutionalReq: "high",
      institutionalReqNumeric: 3,
      sovereigntyImpact: 3.0,
      globalSouthAdoptability: 3.0,
      weightedAvg: 3.0
    },
    evidenceProducedList: [
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
    evidenceLocations: ["chip_hardware", "deployment_point"],
    evidenceProduced: "Cryptographic proof of workload properties (compute, code, duration) and TEE integrity attestations",
    whatItNeeds: "TEE-enabled hardware (Intel TDX, AMD SEV-SNP, ARM CCA), trusted hardware vendors, cloud/on-prem integration, accredited verifiers with PKI infrastructure",
    biggestLimitation: "Reliance on hardware vendors - TEE security rests on a few companies; backdoor or vulnerability could undermine all attestations. Performance overhead.",
    newScores: {
      hardness: 5.0, // Cryptographic proof, tamper-resistant
      burden: 1.0,   // Requires specialized hardware/secure enclaves
      intrusion: 4.0, // Proves without revealing weights
      robustness: 3.5, // Side-channel attacks possible but costly
    },
    vmfsScores: {
      technicalFeasibility: 4.2,
      politicalTractability: 2.8,
      institutionalReq: "medium",
      institutionalReqNumeric: 2,
      sovereigntyImpact: 3.5,
      globalSouthAdoptability: 2.0,
      weightedAvg: 3.1
    },
    evidenceProducedList: [
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
    evidenceLocations: ["developer_lab"],
    evidenceProduced: "Capability risk reports and safety-compliance certs",
    whatItNeeds: "Developer cooperation granting secure, time-bounded access, accredited auditors (e.g., METR, AISI, BSI), legal agreements/regulations, secure infrastructure",
    biggestLimitation: "Access depth and developer cooperation - labs may limit scope or redact info. Audits are periodic snapshots, miss ongoing risks or post-audit changes.",
    newScores: {
      hardness: 1.5, // Audit reports - human judgment/testimony
      burden: 5.0,   // Just regulations and agreements
      intrusion: 1.0, // Deep access to weights, code, training data
      robustness: 2.0, // Selective disclosure, staging environments
    },
    vmfsScores: {
      technicalFeasibility: 4.5,
      politicalTractability: 4.0,
      institutionalReq: "medium",
      institutionalReqNumeric: 2,
      sovereigntyImpact: 3.0,
      globalSouthAdoptability: 3.5,
      weightedAvg: 3.8
    },
    evidenceProducedList: [
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
    evidenceLocations: ["deployment_point"],
    evidenceProduced: "Detectable signals in output to prove model origin",
    whatItNeeds: "Model developers embedding watermarks during training/inference, detector operators running detectors, standards for watermark strength, regulators mandating watermarking",
    biggestLimitation: "Robustness to removal attacks - simple edits (paraphrase, crop) often break watermarks. Hard to remove but not impossible.",
    newScores: {
      hardness: 3.5, // Statistical signals - digital/mutable but robust
      burden: 5.0,   // Software/code update only
      intrusion: 5.0, // External, only looks at outputs
      robustness: 3.0, // Hard to remove but paraphrasing attacks exist
    },
    vmfsScores: {
      technicalFeasibility: 2.5,
      politicalTractability: 3.5,
      institutionalReq: "low",
      institutionalReqNumeric: 1,
      sovereigntyImpact: 4.5,
      globalSouthAdoptability: 4.0,
      weightedAvg: 3.6
    },
    evidenceProducedList: [
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
    evidenceLocations: ["institutional"],
    evidenceProduced: "Insider testimony and internal documents",
    whatItNeeds: "Whistleblower protection laws, secure anonymous hotlines, financial rewards, international coordination, auditors to vet tips",
    biggestLimitation: "Insider willingness - fear of retaliation, loyalty, or suppression may yield few reports. Dependence on reporting.",
    newScores: {
      hardness: 1.0, // Human testimony, self-report
      burden: 5.0,   // Law/regulation only
      intrusion: 2.5, // Requires insider access but voluntary
      robustness: 1.5, // Suppression, retaliation deterrence
    },
    vmfsScores: {
      technicalFeasibility: 4.0,
      politicalTractability: 3.0,
      institutionalReq: "low",
      institutionalReqNumeric: 1,
      sovereigntyImpact: 4.0,
      globalSouthAdoptability: 4.5,
      weightedAvg: 3.9
    },
    evidenceProducedList: [
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
    evidenceLocations: ["data_center"],
    evidenceProduced: "Thermal anomalies indicating high-power compute clusters",
    whatItNeeds: "Satellite operators (commercial providers like Satellite Vu, Planet, Maxar), AI analysts, government/regulator agreements, no on-ground cooperation needed",
    biggestLimitation: "Discriminating AI compute from other data centers - generic hyperscalers mask signatures. Coarse proxies (heat/power) cannot measure FLOPs precisely.",
    newScores: {
      hardness: 4.0, // Thermal/physics-based measurements
      burden: 3.0,   // Uses commercial satellites, some integration
      intrusion: 5.0, // Zero intrusion - external observation
      robustness: 2.5, // Distributed compute, thermal masking evasion
    },
    vmfsScores: {
      technicalFeasibility: 3.5,
      politicalTractability: 4.5,
      institutionalReq: "low",
      institutionalReqNumeric: 1,
      sovereigntyImpact: 5.0,
      globalSouthAdoptability: 3.5,
      weightedAvg: 4.1
    },
    evidenceProducedList: [
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
    evidenceLocations: ["institutional", "model_registry"],
    evidenceProduced: "Formal self-reports on infrastructure and safety tests",
    whatItNeeds: "Developers mandated to self-report via standardized forms, registry operator, regulators with verification powers, auditors for random checks",
    biggestLimitation: "Self-reporting honesty - actors may omit/understate to evade scrutiny. Dependence on reporting.",
    newScores: {
      hardness: 1.0, // Self-report, declaration, human honesty
      burden: 5.0,   // Regulation/registry only
      intrusion: 4.0, // Metadata, no deep access
      robustness: 1.5, // Strategic non-disclosure, falsification
    },
    vmfsScores: {
      technicalFeasibility: 4.0,
      politicalTractability: 4.0,
      institutionalReq: "medium",
      institutionalReqNumeric: 2,
      sovereigntyImpact: 3.0,
      globalSouthAdoptability: 2.5,
      weightedAvg: 3.4
    },
    evidenceProducedList: [
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
  },
  {
    id: "m9_data_filtering",
    mechanism: "Data Filtering Verification",
    shortName: "Data Filtering",
    definition: "Verifies that training datasets have been filtered to remove prohibited or hazardous content through audit logs, hash comparisons, and provenance tracking.",
    evidenceLocations: ["developer_lab"],
    evidenceProduced: "Logs showing removal of prohibited content hashes",
    whatItNeeds: "Standardized filtering protocols, hash databases of prohibited content, audit infrastructure, developer compliance",
    biggestLimitation: "Cannot verify what was never logged. Filters can be bypassed or training resumed with unfiltered data post-audit.",
    newScores: {
      hardness: 3.0, // Digital audit logs, hash comparisons
      burden: 4.0,   // Software/process integration
      intrusion: 2.0, // Requires access to training pipeline
      robustness: 2.0, // Post-audit modification, unlogged data
    },
    vmfsScores: {
      technicalFeasibility: 3.8,
      politicalTractability: 3.5,
      institutionalReq: "medium",
      institutionalReqNumeric: 2,
      sovereigntyImpact: 3.5,
      globalSouthAdoptability: 3.0,
      weightedAvg: 3.4
    },
    evidenceProducedList: [
      "Hash-based proof of content removal",
      "Audit trails of filtering process",
      "Dataset provenance certificates",
      "Compliance reports for content standards"
    ],
    whatItVerifies: [
      "That prohibited content classes were filtered from training data",
      "Consistency between claimed and actual filtering processes",
      "Compliance with content standards before model training"
    ],
    dependencies: [
      "Standardized prohibited content hash databases",
      "Developer implementation of filtering pipelines",
      "Audit access to training infrastructure",
      "International standards for content filtering"
    ],
    limitations: {
      primary: "Cannot verify negative - only proves what was logged as filtered",
      technical: "Filters can be circumvented or disabled after audit verification"
    },
    evasionModes: ["Training on unlogged data", "Post-audit filter bypass", "Selective logging"],
    citations: ["Data Governance Framework 2025", "Content Filtering Standards 2024"]
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

// Coverage Matrix: Mechanism x OoV pairs
export const COVERAGE_MATRIX = [
  // M1: Compute Monitoring
  {
    mechanismId: "m1_compute_monitoring",
    oov1_compute: {
      coverage: "primary",
      symbol: "Y",
      justification: "Direct measurement of compute via on-chip telemetry produces checkable evidence against declared thresholds.",
      evidenceArtifact: "Run-level evidence dashboard showing above-threshold events"
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "-",
      justification: "Telemetry reveals computational activity but cannot independently prove which model was trained without integration with signed workload identifiers."
    },
    oov3_deployment: {
      coverage: "none",
      symbol: "X",
      justification: "Does not observe deployment configurations or access controls."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "-",
      justification: "Shows compute activity but not what changed in the model or system architecture."
    }
  },
  // M2: Chip Registry
  {
    mechanismId: "m2_chip_registry",
    oov1_compute: {
      coverage: "partial",
      symbol: "-",
      justification: "Registry confirms possession not use; actors may possess but not utilize capacity."
    },
    oov2_lineage: {
      coverage: "none",
      symbol: "X",
      justification: "Does not track model provenance or transformations."
    },
    oov3_deployment: {
      coverage: "none",
      symbol: "X",
      justification: "Tracks hardware location but not deployment configurations or access."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "-",
      justification: "Tracks infrastructure changes that enable modification but not the modifications themselves."
    }
  },
  // M3: TEE Attestation
  {
    mechanismId: "m3_tee_attestation",
    oov1_compute: {
      coverage: "primary",
      symbol: "Y",
      justification: "Generates cryptographically signed evidence that specific code ran with defined compute bounds.",
      evidenceArtifact: "Attestation result dashboard showing pass/fail status and bound claims"
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "-",
      justification: "Attestation proves what was measured in the enclave but requires integration with model registries to definitively link to specific model versions."
    },
    oov3_deployment: {
      coverage: "primary",
      symbol: "Y",
      justification: "Can attest to environment verification - proving workloads ran in authorized locations/configurations.",
      evidenceArtifact: "Attestations of TEE integrity and location/configuration"
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "-",
      justification: "Can attest to modification events if modifications occur within TEE, but cannot capture modifications in non-attested environments."
    }
  },
  // M4: Third-Party Audits
  {
    mechanismId: "m4_third_party_audits",
    oov1_compute: {
      coverage: "partial",
      symbol: "-",
      justification: "Audits can review compute logs if provided but depend on auditee cooperation and log integrity."
    },
    oov2_lineage: {
      coverage: "primary",
      symbol: "Y",
      justification: "Structured access to models enables direct verification of model identity and lineage documentation.",
      evidenceArtifact: "Audit report with version identity reproduction and lineage review"
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "-",
      justification: "Can assess deployment controls at time of audit but not continuous monitoring."
    },
    oov4_post_training: {
      coverage: "primary",
      symbol: "Y",
      justification: "Direct access enables verification of post-training changes through documentation review and targeted reevaluation.",
      evidenceArtifact: "Post-training change assessment in audit report"
    }
  },
  // M5: Watermarking
  {
    mechanismId: "m5_watermarking",
    oov1_compute: {
      coverage: "none",
      symbol: "X",
      justification: "Does not address compute use at all."
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "-",
      justification: "Can suggest model family but not definitive version or lineage."
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "-",
      justification: "Indicates deployment occurred but not deployment conditions or access controls."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "-",
      justification: "Changes in watermark patterns could indicate modifications, but not reliably."
    }
  },
  // M6: Whistleblowers
  {
    mechanismId: "m6_whistleblowers",
    oov1_compute: {
      coverage: "partial",
      symbol: "-",
      justification: "Provides leads and triggers for deeper investigation rather than direct verification evidence."
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "-",
      justification: "Insider reports can flag lineage issues but depend on reporter access and credibility."
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "-",
      justification: "Can reveal unauthorized deployments but coverage is probabilistic and non-systematic."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "-",
      justification: "Insiders may report undisclosed modifications, but depends on individual decisions to report."
    }
  },
  // M7: Remote Sensing
  {
    mechanismId: "m7_remote_sensing",
    oov1_compute: {
      coverage: "partial",
      symbol: "-",
      justification: "Heat and power are indirect proxies; cannot precisely measure FLOPs or distinguish AI compute from other workloads."
    },
    oov2_lineage: {
      coverage: "none",
      symbol: "X",
      justification: "Cannot observe model provenance or transformations from external imagery."
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "-",
      justification: "Can identify facilities but not access controls or deployment configurations."
    },
    oov4_post_training: {
      coverage: "none",
      symbol: "X",
      justification: "Cannot detect model modifications from external monitoring."
    }
  },
  // M8: Declarations
  {
    mechanismId: "m8_declarations",
    oov1_compute: {
      coverage: "partial",
      symbol: "-",
      justification: "Provides claimed state for comparison against independent verification methods; vulnerable to omission without audits."
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "-",
      justification: "Creates paper trail but requires cross-referencing with other mechanisms for validation."
    },
    oov3_deployment: {
      coverage: "partial",
      symbol: "-",
      justification: "Establishes baseline transparency but limited standalone verification power."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "-",
      justification: "Enables detection of discrepancies when cross-referenced with audits or monitoring."
    }
  },
  // M9: Data Filtering
  {
    mechanismId: "m9_data_filtering",
    oov1_compute: {
      coverage: "none",
      symbol: "X",
      justification: "Does not address compute use directly."
    },
    oov2_lineage: {
      coverage: "partial",
      symbol: "-",
      justification: "Data provenance tracking provides partial lineage information for training data origins."
    },
    oov3_deployment: {
      coverage: "none",
      symbol: "X",
      justification: "Does not monitor deployment conditions."
    },
    oov4_post_training: {
      coverage: "partial",
      symbol: "-",
      justification: "Can verify pre-training filtering but not post-training data additions."
    }
  }
];

// Key Findings from Analysis
export const KEY_FINDINGS = [
  {
    id: "finding_1",
    title: "No Silver Bullet",
    description: "No mechanism achieves high scores across all four dimensions. Hard evidence (physics-based) mechanisms tend to have high infrastructure burden, while low-burden mechanisms rely on softer evidence like self-reports.",
    icon: "target"
  },
  {
    id: "finding_2",
    title: "Trust vs Cost Trade-off",
    description: "The most trustworthy mechanisms (TEE Attestation, On-Chip Telemetry) require new hardware infrastructure, while the cheapest mechanisms (Declarations, Whistleblowers) depend on human honesty.",
    icon: "scale"
  },
  {
    id: "finding_3",
    title: "Intrusion vs Robustness",
    description: "External monitoring (Remote Sensing, Watermarking) has low intrusion but provides coarse evidence. Deep verification (Third-Party Audits) provides rich evidence but requires sensitive access.",
    icon: "shield"
  },
  {
    id: "finding_4",
    title: "Layered Defense Required",
    description: "Robust verification requires combining mechanisms from different Evidence Locations. A portfolio covering Chip Level + Institutional + Deployment creates redundant verification paths.",
    icon: "layers"
  },
  {
    id: "finding_5",
    title: "Chip-Level Blind Spot Critical",
    description: "Portfolios without chip-level verification cannot verify digital compute activity. Bad actors could use legal hardware for illegal training runs if only external monitoring is deployed.",
    icon: "alert"
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
  },
  {
    mechanismId: "m9_data_filtering",
    primaryBarrier: "Hash databases may not cover local content concerns",
    historicalPrecedent: "Content moderation regional differences",
    adaptationNeeded: "Regional content standard customization"
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

// Score dimension definitions for display
export const SCORE_DIMENSIONS = {
  hardness: {
    name: "Evidence Hardness",
    shortName: "Hardness",
    question: "Is the evidence based on math/physics (Hard) or human trust (Soft)?",
    description: "The Trust Score - measures whether evidence exists regardless of human intent",
    color: "#0a84ff",
    labels: {
      5: "Immutable/Physical (cryptographic, sensor, thermal)",
      3: "Digital/Mutable (databases, unsigned logs)",
      1: "Subjective/Human (self-reports, testimony)"
    }
  },
  burden: {
    name: "Infrastructure Burden",
    shortName: "Burden",
    question: "Does it require building new hardware (High Burden) or just passing laws (Low Burden)?",
    description: "The Cost Score - what new physical reality must be built",
    color: "#32d74b",
    labels: {
      5: "Policy/Software Only (laws, code updates)",
      3: "Commercial/Cloud (vendor cooperation, APIs)",
      1: "New Frontier Hardware (TEEs, satellites, facilities)"
    }
  },
  intrusion: {
    name: "Intrusion Level",
    shortName: "Intrusion",
    question: "How much secret data (IP, Weights) is exposed?",
    description: "The Friction Score - measures privacy and IP exposure risk",
    color: "#ff9f0a",
    labels: {
      5: "Zero/External (remote, aggregate, no access)",
      3: "Metadata/API (traffic analysis, headers)",
      1: "Deep/Internal (weights, code, training data)"
    }
  },
  robustness: {
    name: "Evasion Robustness",
    shortName: "Robustness",
    question: "How easy is it to spoof or hide from this mechanism?",
    description: "The Cheating Score - measures vulnerability to evasion",
    color: "#bf5af2",
    labels: {
      5: "Airtight (mathematically proven, physically undeniable)",
      3: "Costly Evasion (possible but requires effort)",
      1: "Known Gaps (coverage gaps, easy to bypass)"
    }
  }
};

// Helper function to get mechanism by evidence location
export function getMechanismsByLocation(locationId) {
  return MECHANISMS.filter(m => m.evidenceLocations.includes(locationId));
}

// Helper function to get goals by evidence location
export function getGoalsByLocation(locationId) {
  return VERIFICATION_GOALS.filter(g => g.evidenceLocation === locationId);
}

// Helper to calculate portfolio scores
export function calculatePortfolioScores(mechanisms) {
  if (!mechanisms || mechanisms.length === 0) return null;
  
  const dimensions = ['hardness', 'burden', 'intrusion', 'robustness'];
  const avgScores = {};
  
  dimensions.forEach(dim => {
    const sum = mechanisms.reduce((acc, m) => acc + (m.newScores?.[dim] || 3), 0);
    avgScores[dim] = sum / mechanisms.length;
  });
  
  avgScores.overall = Object.values(avgScores).reduce((a, b) => a + b, 0) / 4;
  
  return avgScores;
}

// Helper to detect portfolio blind spots
export function detectBlindSpots(mechanisms) {
  const coveredLocations = new Set();
  mechanisms.forEach(m => {
    m.evidenceLocations.forEach(loc => coveredLocations.add(loc));
  });
  
  const warnings = [];
  
  if (!coveredLocations.has('chip_hardware')) {
    warnings.push({
      type: 'critical',
      message: "Your portfolio cannot verify digital activity (FLOPs). A bad actor could use legal hardware for illegal training. Consider adding On-Chip Telemetry or TEE Attestation."
    });
  }
  
  if (!coveredLocations.has('institutional') && !coveredLocations.has('developer_lab')) {
    warnings.push({
      type: 'warning',
      message: "No mechanism covers institutional records or developer processes. Consider adding Third-Party Audits or Declaration Regimes for compliance verification."
    });
  }
  
  if (!coveredLocations.has('deployment_point')) {
    warnings.push({
      type: 'info',
      message: "No mechanism monitors model deployment. Consider adding Watermarking or TEE Attestation to verify deployment compliance."
    });
  }
  
  return warnings;
}

if (typeof window !== 'undefined') {
    window.COVERAGE_MATRIX = COVERAGE_MATRIX;
}
