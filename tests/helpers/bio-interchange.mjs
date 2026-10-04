// The AI Interchange v1 answer an assistant following the Biopolitical prompt
// would send for a canonical sample analysis.
export const interchangeFrom = (sourceFixture) => ({
  contract: "jarbou3i-ai-interchange/1",
  lens: "biopolitical",
  language: sourceFixture.language,
  mode: sourceFixture.model_mode,
  analysis_id: sourceFixture.analysis_id,
  subject: sourceFixture.subject,
  framing: sourceFixture.framing,
  legal_framework: sourceFixture.legal_framework,
  international_comparison: sourceFixture.international_comparison,
  capture_levels: Object.fromEntries(
    sourceFixture.capture_levels.map(({ level, ...item }) => [level, item]),
  ),
  theoretical_comparison: sourceFixture.theoretical_comparison,
  human_functions: sourceFixture.human_functions,
  power: sourceFixture.power_map,
  mechanisms: sourceFixture.mechanisms,
  meaning: sourceFixture.meaning_systems,
  intervention: {
    interventions: sourceFixture.intervention_assessment.interventions,
    capture: {
      ...sourceFixture.intervention_assessment.capture_assessment,
      criteria: Object.fromEntries(
        sourceFixture.intervention_assessment.capture_assessment.criteria.map(
          ({ criterion, ...item }) => [criterion, item],
        ),
      ),
    },
    care_control_tensions:
      sourceFixture.intervention_assessment.care_control_tensions,
  },
  scale_time: sourceFixture.scale_time,
  distribution: sourceFixture.distribution,
  consent_exit: sourceFixture.consent_exit,
  explanations: Object.fromEntries(
    sourceFixture.competing_explanations.map(({ type, ...item }) => [type, item]),
  ),
  evidence: sourceFixture.evidence.items,
  assumptions: sourceFixture.assumptions.items,
  resistance: sourceFixture.resistance_agency.items,
  alternatives: sourceFixture.alternatives.items,
  conclusion: sourceFixture.calibrated_conclusion,
  self_audit: sourceFixture.self_audit,
  self_audit_notes: sourceFixture.self_audit_notes,
  links: sourceFixture.links,
});
