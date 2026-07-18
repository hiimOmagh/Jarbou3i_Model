/* Generated from the canonical schemas. Do not edit by hand. */
(function attachBiopoliticalSchemaValidators(root) {
  "use strict";
  const module = { exports: {} };
  const exports = module.exports;
"use strict";
exports.canonical = validate20;
const schema31 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://jarbou3i.example/schema/biopolitical-analysis-v2.1.schema.json","title":"Jarbou3i Biopolitical Analysis Contract v2.1","description":"First-class contract derived from the Jarbou3i Biopolitics AI Training Map. It separates human functions, governing actors, affected populations, mechanisms, meaning systems, intervention modality, capture tests, distribution, evidence, agency, alternatives, and calibrated judgment.","type":"object","additionalProperties":false,"required":["schema_version","analysis_contract","contract_status","analysis_id","generated_at","language","model_mode","analysis_lens","subject","framing","legal_framework","international_comparison","capture_levels","theoretical_comparison","human_functions","power_map","mechanisms","meaning_systems","intervention_assessment","scale_time","distribution","consent_exit","competing_explanations","evidence","assumptions","resistance_agency","alternatives","calibrated_conclusion","self_audit","self_audit_notes","links","migration"],"properties":{"schema_version":{"const":"2.1.0"},"analysis_contract":{"const":"biopolitical-training-map-v2"},"contract_status":{"const":"canonical"},"analysis_id":{"type":"string","minLength":1},"generated_at":{"type":"string","minLength":1},"language":{"enum":["ar","en","fr"]},"model_mode":{"enum":["simple","focused","expert","research"]},"analysis_lens":{"const":"biopolitical"},"subject":{"type":"object","additionalProperties":false,"required":["title","context","research_question","executive_finding"],"properties":{"title":{"type":"string","minLength":1},"context":{"type":"string"},"research_question":{"type":"string","minLength":1},"executive_finding":{"type":"string","minLength":1}}},"framing":{"type":"object","additionalProperties":false,"required":["contested_terms","historical_context","official_problem_definition","critical_problem_definition","unknowns"],"properties":{"contested_terms":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/contestedTerm"}},"historical_context":{"type":"object","additionalProperties":false,"required":["summary","turning_points","continuities"],"properties":{"summary":{"type":"string","minLength":1},"turning_points":{"$ref":"#/$defs/stringArray"},"continuities":{"$ref":"#/$defs/stringArray"}}},"official_problem_definition":{"type":"string"},"critical_problem_definition":{"type":"string"},"unknowns":{"$ref":"#/$defs/nonEmptyStringArray"}}},"legal_framework":{"$ref":"#/$defs/legalFramework"},"international_comparison":{"type":"array","items":{"$ref":"#/$defs/internationalComparison"}},"capture_levels":{"type":"array","minItems":5,"maxItems":5,"items":{"$ref":"#/$defs/captureLevel"}},"theoretical_comparison":{"type":"array","items":{"$ref":"#/$defs/theoreticalComparison"}},"human_functions":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/humanFunction"}},"power_map":{"type":"object","additionalProperties":false,"required":["actors","affected_populations","institutions","power_asymmetries"],"properties":{"actors":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/actor"}},"affected_populations":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/population"}},"institutions":{"type":"array","items":{"$ref":"#/$defs/institution"}},"power_asymmetries":{"type":"array","items":{"$ref":"#/$defs/asymmetry"}}}},"mechanisms":{"type":"object","additionalProperties":false,"required":["instruments","infrastructures","political_economy","power_modes"],"properties":{"instruments":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/instrument"}},"infrastructures":{"type":"array","items":{"$ref":"#/$defs/infrastructure"}},"political_economy":{"type":"array","items":{"$ref":"#/$defs/politicalEconomy"}},"power_modes":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/powerMode"}}},"anyOf":[{"properties":{"infrastructures":{"type":"array","minItems":1}}},{"properties":{"political_economy":{"type":"array","minItems":1}}}]},"meaning_systems":{"type":"object","additionalProperties":false,"required":["norms","regimes_of_truth","classifications","looping_effects"],"properties":{"norms":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/norm"}},"regimes_of_truth":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/regimeOfTruth"}},"classifications":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/classification"}},"looping_effects":{"type":"array","items":{"$ref":"#/$defs/loopingEffect"}}}},"intervention_assessment":{"type":"object","additionalProperties":false,"required":["interventions","capture_assessment","care_control_tensions"],"properties":{"interventions":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/intervention"}},"capture_assessment":{"$ref":"#/$defs/captureAssessment"},"care_control_tensions":{"type":"array","items":{"$ref":"#/$defs/careControlTension"}}}},"scale_time":{"$ref":"#/$defs/scaleTime"},"distribution":{"type":"object","additionalProperties":false,"required":["items","inequality_dimensions","necropolitical_dimensions"],"properties":{"items":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/distributionItem"}},"inequality_dimensions":{"type":"array","items":{"$ref":"#/$defs/inequalityDimension"}},"necropolitical_dimensions":{"type":"array","items":{"$ref":"#/$defs/necropoliticalDimension"}}}},"consent_exit":{"$ref":"#/$defs/consentExit"},"competing_explanations":{"type":"array","minItems":9,"maxItems":9,"items":{"$ref":"#/$defs/explanation"}},"evidence":{"type":"object","additionalProperties":false,"required":["items"],"properties":{"items":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/evidence"}}}},"assumptions":{"type":"object","additionalProperties":false,"required":["items"],"properties":{"items":{"type":"array","items":{"$ref":"#/$defs/assumption"}}}},"resistance_agency":{"type":"object","additionalProperties":false,"required":["items"],"properties":{"items":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/resistance"}}}},"alternatives":{"type":"object","additionalProperties":false,"required":["items"],"properties":{"items":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/alternative"}}}},"calibrated_conclusion":{"$ref":"#/$defs/calibratedConclusion"},"self_audit":{"$ref":"#/$defs/selfAudit"},"self_audit_notes":{"$ref":"#/$defs/stringArray"},"links":{"type":"array","items":{"$ref":"#/$defs/link"}},"migration":{"type":"null"}},"$defs":{"confidence":{"enum":["high","medium","low"]},"auditStatus":{"enum":["pass","concern","not_applicable"]},"stringArray":{"type":"array","items":{"type":"string"}},"nonEmptyStringArray":{"type":"array","minItems":1,"items":{"type":"string","minLength":1}},"contestedTerm":{"type":"object","additionalProperties":false,"required":["term","definitions","working_definition","stakes"],"properties":{"term":{"type":"string","minLength":1},"definitions":{"$ref":"#/$defs/nonEmptyStringArray"},"working_definition":{"type":"string","minLength":1},"stakes":{"type":"string"}}},"legalFramework":{"type":"object","additionalProperties":false,"required":["status","jurisdictions","applicable_authorities","rights_engaged","safeguards_and_remedies","uncertainties"],"properties":{"status":{"enum":["assessed","not_relevant","unknown"]},"jurisdictions":{"$ref":"#/$defs/stringArray"},"applicable_authorities":{"$ref":"#/$defs/stringArray"},"rights_engaged":{"$ref":"#/$defs/stringArray"},"safeguards_and_remedies":{"$ref":"#/$defs/stringArray"},"uncertainties":{"$ref":"#/$defs/stringArray"}}},"internationalComparison":{"type":"object","additionalProperties":false,"required":["id","jurisdiction_or_context","comparison_basis","similarities","differences","transfer_limits","evidence_ids","confidence"],"properties":{"id":{"type":"string","minLength":1},"jurisdiction_or_context":{"type":"string","minLength":1},"comparison_basis":{"type":"string","minLength":1},"similarities":{"$ref":"#/$defs/stringArray"},"differences":{"$ref":"#/$defs/stringArray"},"transfer_limits":{"$ref":"#/$defs/stringArray"},"evidence_ids":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"captureLevel":{"type":"object","additionalProperties":false,"required":["level","status","finding","evidence_ids"],"properties":{"level":{"enum":["body","mind","relationship","population","environment"]},"status":{"enum":["present","absent","uncertain","not_applicable"]},"finding":{"type":"string","minLength":1},"evidence_ids":{"$ref":"#/$defs/stringArray"}}},"theoreticalComparison":{"type":"object","additionalProperties":false,"required":["id","tradition","contribution","limitations","relevance","evidence_ids"],"properties":{"id":{"type":"string","minLength":1},"tradition":{"type":"string","minLength":1},"contribution":{"type":"string","minLength":1},"limitations":{"$ref":"#/$defs/nonEmptyStringArray"},"relevance":{"enum":["relevant","not_relevant","uncertain"]},"evidence_ids":{"$ref":"#/$defs/stringArray"}}},"humanFunction":{"type":"object","additionalProperties":false,"required":["id","domain","name","scientific_definition","lived_context","governed_variation","authority_defining_normality","refusal_conditions","confidence"],"properties":{"id":{"type":"string","minLength":1},"domain":{"enum":["biological","cognitive_affective","reproductive","social_relational","symbolic","environmental"]},"name":{"type":"string","minLength":1},"scientific_definition":{"type":"string"},"lived_context":{"type":"string"},"governed_variation":{"type":"string"},"authority_defining_normality":{"type":"string"},"refusal_conditions":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"actor":{"type":"object","additionalProperties":false,"required":["id","name","role","formal_mandate","material_interests","authority_sources","funding","information_advantages","enforcement_capacities","dependencies","stated_objectives","plausible_unstated_incentives","internal_disagreements","accountability","confidence"],"properties":{"id":{"type":"string","minLength":1},"name":{"type":"string","minLength":1},"role":{"enum":["decision_maker","implementer","expert","funder","beneficiary","intermediary","resisting_group","other"]},"formal_mandate":{"type":"string"},"material_interests":{"$ref":"#/$defs/stringArray"},"authority_sources":{"$ref":"#/$defs/stringArray"},"funding":{"$ref":"#/$defs/stringArray"},"information_advantages":{"$ref":"#/$defs/stringArray"},"enforcement_capacities":{"$ref":"#/$defs/stringArray"},"dependencies":{"$ref":"#/$defs/stringArray"},"stated_objectives":{"$ref":"#/$defs/stringArray"},"plausible_unstated_incentives":{"$ref":"#/$defs/stringArray"},"internal_disagreements":{"$ref":"#/$defs/stringArray"},"accountability":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"population":{"type":"object","additionalProperties":false,"required":["id","name","classification","exposure","benefits","burdens","agency","missing_from_record","confidence"],"properties":{"id":{"type":"string","minLength":1},"name":{"type":"string","minLength":1},"classification":{"type":"string"},"exposure":{"$ref":"#/$defs/stringArray"},"benefits":{"$ref":"#/$defs/stringArray"},"burdens":{"$ref":"#/$defs/stringArray"},"agency":{"type":"string"},"missing_from_record":{"type":"boolean"},"confidence":{"$ref":"#/$defs/confidence"}}},"institution":{"type":"object","additionalProperties":false,"required":["id","name","mandate","role","accountability","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"mandate":{"type":"string"},"role":{"type":"string"},"accountability":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"asymmetry":{"type":"object","additionalProperties":false,"required":["id","between","resource","effect","confidence"],"properties":{"id":{"type":"string"},"between":{"$ref":"#/$defs/nonEmptyStringArray"},"resource":{"type":"string"},"effect":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"instrument":{"type":"object","additionalProperties":false,"required":["id","name","type","mechanism","scale","stated_purpose","ownership","oversight","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string","minLength":1},"type":{"enum":["law","force","architecture","money","expertise","statistics","surveillance","incentive","norm","algorithm","narrative","infrastructure","medical","other"]},"mechanism":{"type":"string","minLength":1},"scale":{"$ref":"#/$defs/nonEmptyStringArray"},"stated_purpose":{"type":"string"},"ownership":{"type":"string"},"oversight":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"infrastructure":{"type":"object","additionalProperties":false,"required":["id","name","owner","dependency_created","actions_enabled_or_blocked","access_conditions","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"owner":{"type":"string"},"dependency_created":{"type":"string"},"actions_enabled_or_blocked":{"$ref":"#/$defs/stringArray"},"access_conditions":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"politicalEconomy":{"type":"object","additionalProperties":false,"required":["id","ownership","labor","profit","unpaid_care","privatized_risks","socialized_costs","scarcity_mechanism","dependency_model","confidence"],"properties":{"id":{"type":"string"},"ownership":{"type":"string"},"labor":{"type":"string"},"profit":{"type":"string"},"unpaid_care":{"type":"string"},"privatized_risks":{"$ref":"#/$defs/stringArray"},"socialized_costs":{"$ref":"#/$defs/stringArray"},"scarcity_mechanism":{"type":"string"},"dependency_model":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"powerMode":{"type":"object","additionalProperties":false,"required":["mode","mechanism","evidence_ids","confidence"],"properties":{"mode":{"enum":["sovereign_power","disciplinary_power","biopower","governmentality","pastoral_power","psychopolitics","necropolitics","datafication","algorithmic_governance","political_economy","coloniality","ecological_governmentality"]},"mechanism":{"type":"string"},"evidence_ids":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"norm":{"type":"object","additionalProperties":false,"required":["id","name","definition","authority","subject_position","alternatives","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"definition":{"type":"string"},"authority":{"type":"string"},"subject_position":{"type":"string"},"alternatives":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"regimeOfTruth":{"type":"object","additionalProperties":false,"required":["id","claim","authorizing_institutions","validation_procedure","funding_or_interest","excluded_knowledge","evidence_quality","confidence"],"properties":{"id":{"type":"string"},"claim":{"type":"string"},"authorizing_institutions":{"$ref":"#/$defs/stringArray"},"validation_procedure":{"type":"string"},"funding_or_interest":{"type":"string"},"excluded_knowledge":{"$ref":"#/$defs/stringArray"},"evidence_quality":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"classification":{"type":"object","additionalProperties":false,"required":["id","category","definition","decision_use","error_risks","contestability","confidence"],"properties":{"id":{"type":"string"},"category":{"type":"string"},"definition":{"type":"string"},"decision_use":{"type":"string"},"error_risks":{"$ref":"#/$defs/stringArray"},"contestability":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"loopingEffect":{"type":"object","additionalProperties":false,"required":["id","classification_id","institutional_response","altered_opportunity_or_identity","behavioral_adaptation","new_data","confirmation_or_revision","falsified_if","confidence"],"properties":{"id":{"type":"string"},"classification_id":{"type":"string"},"institutional_response":{"type":"string"},"altered_opportunity_or_identity":{"type":"string"},"behavioral_adaptation":{"type":"string"},"new_data":{"type":"string"},"confirmation_or_revision":{"type":"string"},"falsified_if":{"$ref":"#/$defs/nonEmptyStringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"intervention":{"type":"object","additionalProperties":false,"required":["id","name","target_function_ids","actor_ids","instrument_ids","modality","stated_benefit","evidence_of_benefit","documented_harms","necessity","proportionality","dependency_created","consent","exit","contestability","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"target_function_ids":{"$ref":"#/$defs/nonEmptyStringArray"},"actor_ids":{"$ref":"#/$defs/stringArray"},"instrument_ids":{"$ref":"#/$defs/nonEmptyStringArray"},"modality":{"enum":["protection","assistance","treatment","regulation","persuasion","incentivization","manipulation","exploitation","coercion","capture","expropriation","mixed","undetermined"]},"stated_benefit":{"type":"string"},"evidence_of_benefit":{"$ref":"#/$defs/stringArray"},"documented_harms":{"$ref":"#/$defs/stringArray"},"necessity":{"enum":["supported","partly_supported","unsupported","unknown"]},"proportionality":{"enum":["proportionate","mixed","disproportionate","unknown"]},"dependency_created":{"type":"string"},"consent":{"type":"string"},"exit":{"type":"string"},"contestability":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"captureAssessment":{"type":"object","additionalProperties":false,"required":["status","criteria","counter_evidence","legitimate_benefits","conclusion","confidence"],"properties":{"status":{"enum":["no_capture","limited_capture","mixed_capture","substantial_capture","undetermined"]},"criteria":{"type":"array","minItems":13,"maxItems":13,"items":{"$ref":"#/$defs/captureCriterion"}},"counter_evidence":{"$ref":"#/$defs/nonEmptyStringArray"},"legitimate_benefits":{"$ref":"#/$defs/stringArray"},"conclusion":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"captureCriterion":{"type":"object","additionalProperties":false,"required":["criterion","status","evidence_ids","reason"],"properties":{"criterion":{"enum":["knowledge_deficit","consent_failure","vulnerability_exploitation","unequal_distribution","disproportionate_power_or_profit","dependency_or_costly_exit","alternatives_suppressed","behavior_optimized_without_oversight","choice_architecture_constraint","data_repurposing","human_capacity_commercialized","classification_not_contestable","environmental_unavoidability"]},"status":{"enum":["present","absent","uncertain","not_applicable"]},"evidence_ids":{"$ref":"#/$defs/stringArray"},"reason":{"type":"string"}}},"careControlTension":{"type":"object","additionalProperties":false,"required":["id","care_claim","control_effects","interpretation","severity","confidence"],"properties":{"id":{"type":"string"},"care_claim":{"type":"string"},"control_effects":{"$ref":"#/$defs/nonEmptyStringArray"},"interpretation":{"type":"string"},"severity":{"type":"number","minimum":0,"maximum":5},"confidence":{"$ref":"#/$defs/confidence"}}},"scaleTime":{"type":"object","additionalProperties":false,"required":["scales","immediate_effects","medium_term_adaptations","intergenerational_effects","historical_continuities","path_dependencies","future_feedback_loops"],"properties":{"scales":{"$ref":"#/$defs/nonEmptyStringArray"},"immediate_effects":{"$ref":"#/$defs/nonEmptyStringArray"},"medium_term_adaptations":{"$ref":"#/$defs/stringArray"},"intergenerational_effects":{"$ref":"#/$defs/stringArray"},"historical_continuities":{"$ref":"#/$defs/stringArray"},"path_dependencies":{"$ref":"#/$defs/stringArray"},"future_feedback_loops":{"type":"array","items":{"$ref":"#/$defs/futureLoop"}}}},"futureLoop":{"type":"object","additionalProperties":false,"required":["id","name","timeframe","drivers","early_signals","falsified_if","rationale","probability"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"timeframe":{"type":"string"},"drivers":{"$ref":"#/$defs/stringArray"},"early_signals":{"$ref":"#/$defs/stringArray"},"falsified_if":{"$ref":"#/$defs/nonEmptyStringArray"},"rationale":{"type":"string"},"probability":{"type":"number","minimum":0,"maximum":100}}},"distributionItem":{"type":"object","additionalProperties":false,"required":["id","population_id","benefits","burdens","protection","opportunity","recognition","profit","voice","risk","surveillance","discipline","displacement","illness_injury_death","axes","scale","time_horizon","outcome_character","confidence"],"properties":{"id":{"type":"string"},"population_id":{"type":"string"},"benefits":{"$ref":"#/$defs/stringArray"},"burdens":{"$ref":"#/$defs/stringArray"},"protection":{"$ref":"#/$defs/stringArray"},"opportunity":{"$ref":"#/$defs/stringArray"},"recognition":{"$ref":"#/$defs/stringArray"},"profit":{"$ref":"#/$defs/stringArray"},"voice":{"$ref":"#/$defs/stringArray"},"risk":{"$ref":"#/$defs/stringArray"},"surveillance":{"$ref":"#/$defs/stringArray"},"discipline":{"$ref":"#/$defs/stringArray"},"displacement":{"$ref":"#/$defs/stringArray"},"illness_injury_death":{"$ref":"#/$defs/stringArray"},"axes":{"$ref":"#/$defs/stringArray"},"scale":{"$ref":"#/$defs/stringArray"},"time_horizon":{"type":"string"},"outcome_character":{"enum":["intended","tolerated","concealed","unforeseen","uncertain"]},"confidence":{"$ref":"#/$defs/confidence"}}},"inequalityDimension":{"type":"object","additionalProperties":false,"required":["axis","mechanism","affected_groups","evidence_ids","confidence"],"properties":{"axis":{"enum":["class","race","gender","disability","age","citizenship","other"]},"mechanism":{"type":"string"},"affected_groups":{"$ref":"#/$defs/stringArray"},"evidence_ids":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"necropoliticalDimension":{"type":"object","additionalProperties":false,"required":["id","population_id","exposure","causal_character","visibility","protection_gap","confidence"],"properties":{"id":{"type":"string"},"population_id":{"type":"string"},"exposure":{"type":"string"},"causal_character":{"enum":["deliberate","reckless_indifference","structural_exposure","administrative_failure","unintended_harm","uncertain"]},"visibility":{"type":"string"},"protection_gap":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"consentExit":{"type":"object","additionalProperties":false,"required":["consent_status","informed","specific","revocable","comprehensible","materially_voluntary","exit_conditions","contestability","accountability"],"properties":{"consent_status":{"enum":["valid","partial","invalid","not_applicable","unknown"]},"informed":{"enum":["yes","partial","no","unknown"]},"specific":{"enum":["yes","partial","no","unknown"]},"revocable":{"enum":["yes","partial","no","unknown"]},"comprehensible":{"enum":["yes","partial","no","unknown"]},"materially_voluntary":{"enum":["yes","partial","no","unknown"]},"exit_conditions":{"$ref":"#/$defs/stringArray"},"contestability":{"$ref":"#/$defs/stringArray"},"accountability":{"$ref":"#/$defs/stringArray"}}},"explanation":{"type":"object","additionalProperties":false,"required":["id","type","relevance","evidentiary_status","claim","mechanism","supporting_evidence_ids","counter_evidence_ids","falsified_if","confidence"],"properties":{"id":{"type":"string"},"type":{"enum":["official","public_interest","political_economy","institutional_inertia","security","cultural","technological","critical_biopolitical","actor_error_unintended_consequence"]},"relevance":{"enum":["relevant","not_relevant","uncertain"]},"evidentiary_status":{"enum":["supported","plausible","disputed","unsupported","not_assessed"]},"claim":{"type":"string"},"mechanism":{"type":"string"},"supporting_evidence_ids":{"$ref":"#/$defs/stringArray"},"counter_evidence_ids":{"$ref":"#/$defs/stringArray"},"falsified_if":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"evidence":{"type":"object","additionalProperties":false,"required":["id","claim","epistemic_type","source_tier","source_title","source_url","source_locator","source_date","geography","population","measurement_method","denominator","sample_size","measurement_validity","causal_identification","replication_status","conflicts_of_interest","missing_data","selection_effects","relevant_comparison","cross_context_applicability","claim_source_fit","verification_status","verified_by","verification_date","uncertainty","limitations","counter_evidence","confidence"],"properties":{"id":{"type":"string"},"claim":{"type":"string"},"epistemic_type":{"enum":["verified_fact","quantitative_estimate","institutional_claim","scholarly_interpretation","political_narrative","legal_classification","ethical_judgment","plausible_inference","speculation","unsupported_allegation"]},"source_tier":{"enum":["primary_legal_policy","official_dataset","systematic_review_meta_analysis","individual_peer_reviewed_study","historical_archive","investigative_reporting","reputable_organization_report","expert_commentary","first_person_testimony","social_media_discourse"]},"source_title":{"type":"string"},"source_url":{"type":"string"},"source_locator":{"type":"string"},"source_date":{"type":"string"},"geography":{"type":"string"},"population":{"type":"string"},"measurement_method":{"type":"string"},"denominator":{"type":"string"},"sample_size":{"type":"string"},"measurement_validity":{"type":"string"},"causal_identification":{"type":"string"},"replication_status":{"enum":["replicated","partly_replicated","not_replicated","not_applicable","unknown"]},"conflicts_of_interest":{"type":"string"},"missing_data":{"type":"string"},"selection_effects":{"type":"string"},"relevant_comparison":{"type":"string"},"cross_context_applicability":{"type":"string"},"claim_source_fit":{"enum":["direct","indirect","context_only","mismatched","unknown"]},"verification_status":{"enum":["verified","partially_verified","unverified","disputed"]},"verified_by":{"type":"string"},"verification_date":{"type":"string"},"uncertainty":{"type":"string","minLength":1},"limitations":{"type":"string","minLength":1},"counter_evidence":{"type":"string","minLength":1},"confidence":{"$ref":"#/$defs/confidence"}},"allOf":[{"if":{"properties":{"verification_status":{"const":"verified"}},"required":["verification_status"]},"then":{"properties":{"source_title":{"type":"string","minLength":1},"source_date":{"type":"string","minLength":1},"verified_by":{"type":"string","minLength":1},"verification_date":{"type":"string","minLength":1}},"anyOf":[{"properties":{"source_url":{"type":"string","minLength":1}},"required":["source_url"]},{"properties":{"source_locator":{"type":"string","minLength":1}},"required":["source_locator"]}]}}]},"assumption":{"type":"object","additionalProperties":false,"required":["id","assumption","risk","disproving_test","implication_if_wrong","confidence"],"properties":{"id":{"type":"string"},"assumption":{"type":"string"},"risk":{"enum":["low","medium","high"]},"disproving_test":{"type":"string"},"implication_if_wrong":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}},"resistance":{"type":"object","additionalProperties":false,"required":["id","actor_or_population","form","mechanism","effect_on_system","constraints","confidence"],"properties":{"id":{"type":"string"},"actor_or_population":{"type":"string"},"form":{"enum":["refusal","protest","evasion","mutual_aid","counterknowledge","litigation","unionization","artistic_intervention","technological_adaptation","alternative_institution","other"]},"mechanism":{"type":"string"},"effect_on_system":{"type":"string"},"constraints":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}},"alternative":{"type":"object","additionalProperties":false,"required":["id","level","proposal","mechanism","feasibility","tradeoffs","rights_safeguards","evidence_needed","lower_harm_rationale"],"properties":{"id":{"type":"string"},"level":{"enum":["individual","community","institutional","national","transnational"]},"proposal":{"type":"string"},"mechanism":{"type":"string"},"feasibility":{"enum":["high","medium","low"]},"tradeoffs":{"$ref":"#/$defs/stringArray"},"rights_safeguards":{"$ref":"#/$defs/nonEmptyStringArray"},"evidence_needed":{"$ref":"#/$defs/stringArray"},"lower_harm_rationale":{"type":"string"}}},"calibratedConclusion":{"type":"object","additionalProperties":false,"required":["strongly_supported","plausible_unconfirmed","disputed","unknown","evidence_that_would_change","overall_confidence"],"properties":{"strongly_supported":{"$ref":"#/$defs/nonEmptyStringArray"},"plausible_unconfirmed":{"$ref":"#/$defs/stringArray"},"disputed":{"$ref":"#/$defs/stringArray"},"unknown":{"$ref":"#/$defs/nonEmptyStringArray"},"evidence_that_would_change":{"$ref":"#/$defs/nonEmptyStringArray"},"overall_confidence":{"$ref":"#/$defs/confidence"}}},"selfAudit":{"type":"object","additionalProperties":false,"required":["malicious_intent_without_evidence","institutional_claims_uncritically","metaphor_as_mechanism","human_function_identified","mechanism_explained","care_control_overlap","material_and_meaning","history_included","political_economy_included","inequality_dimensions","agency_resistance","competing_explanations","statistics_quotations_verified","uncertainty_stated","benefits_costs_identified","realistic_alternatives","stigmatization_risk_checked","falsifier_identified"],"properties":{"malicious_intent_without_evidence":{"$ref":"#/$defs/auditStatus"},"institutional_claims_uncritically":{"$ref":"#/$defs/auditStatus"},"metaphor_as_mechanism":{"$ref":"#/$defs/auditStatus"},"human_function_identified":{"$ref":"#/$defs/auditStatus"},"mechanism_explained":{"$ref":"#/$defs/auditStatus"},"care_control_overlap":{"$ref":"#/$defs/auditStatus"},"material_and_meaning":{"$ref":"#/$defs/auditStatus"},"history_included":{"$ref":"#/$defs/auditStatus"},"political_economy_included":{"$ref":"#/$defs/auditStatus"},"inequality_dimensions":{"$ref":"#/$defs/auditStatus"},"agency_resistance":{"$ref":"#/$defs/auditStatus"},"competing_explanations":{"$ref":"#/$defs/auditStatus"},"statistics_quotations_verified":{"$ref":"#/$defs/auditStatus"},"uncertainty_stated":{"$ref":"#/$defs/auditStatus"},"benefits_costs_identified":{"$ref":"#/$defs/auditStatus"},"realistic_alternatives":{"$ref":"#/$defs/auditStatus"},"stigmatization_risk_checked":{"$ref":"#/$defs/auditStatus"},"falsifier_identified":{"$ref":"#/$defs/auditStatus"}}},"link":{"type":"object","additionalProperties":false,"required":["from","to","relation","mechanism","confidence"],"properties":{"from":{"type":"string"},"to":{"type":"string"},"relation":{"enum":["causes","enables","constrains","classifies","legitimizes","commodifies","distributes","exposes","resists","feeds_back","contradicts"]},"mechanism":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}}}};
const schema34 = {"type":"array","items":{"type":"string"}};
const schema33 = {"type":"array","minItems":1,"items":{"type":"string","minLength":1}};
const func1 = Object.prototype.hasOwnProperty;
const func2 = (value) => Array.from(value).length;
const schema32 = {"type":"object","additionalProperties":false,"required":["term","definitions","working_definition","stakes"],"properties":{"term":{"type":"string","minLength":1},"definitions":{"$ref":"#/$defs/nonEmptyStringArray"},"working_definition":{"type":"string","minLength":1},"stakes":{"type":"string"}}};

function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate21.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.term === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "term"},message:"must have required property '"+"term"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.definitions === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "definitions"},message:"must have required property '"+"definitions"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.working_definition === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "working_definition"},message:"must have required property '"+"working_definition"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.stakes === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "stakes"},message:"must have required property '"+"stakes"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
for(const key0 in data){
if(!((((key0 === "term") || (key0 === "definitions")) || (key0 === "working_definition")) || (key0 === "stakes"))){
const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.term !== undefined){
let data0 = data.term;
if(typeof data0 === "string"){
if(func2(data0) < 1){
const err5 = {instancePath:instancePath+"/term",schemaPath:"#/properties/term/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/term",schemaPath:"#/properties/term/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.definitions !== undefined){
let data1 = data.definitions;
if(Array.isArray(data1)){
if(data1.length < 1){
const err7 = {instancePath:instancePath+"/definitions",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
if(typeof data2 === "string"){
if(func2(data2) < 1){
const err8 = {instancePath:instancePath+"/definitions/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/definitions/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath:instancePath+"/definitions",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.working_definition !== undefined){
let data3 = data.working_definition;
if(typeof data3 === "string"){
if(func2(data3) < 1){
const err11 = {instancePath:instancePath+"/working_definition",schemaPath:"#/properties/working_definition/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/working_definition",schemaPath:"#/properties/working_definition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.stakes !== undefined){
if(typeof data.stakes !== "string"){
const err13 = {instancePath:instancePath+"/stakes",schemaPath:"#/properties/stakes/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
validate21.errors = vErrors;
return errors === 0;
}
validate21.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema37 = {"type":"object","additionalProperties":false,"required":["status","jurisdictions","applicable_authorities","rights_engaged","safeguards_and_remedies","uncertainties"],"properties":{"status":{"enum":["assessed","not_relevant","unknown"]},"jurisdictions":{"$ref":"#/$defs/stringArray"},"applicable_authorities":{"$ref":"#/$defs/stringArray"},"rights_engaged":{"$ref":"#/$defs/stringArray"},"safeguards_and_remedies":{"$ref":"#/$defs/stringArray"},"uncertainties":{"$ref":"#/$defs/stringArray"}}};

function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate23.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.status === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.jurisdictions === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "jurisdictions"},message:"must have required property '"+"jurisdictions"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.applicable_authorities === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "applicable_authorities"},message:"must have required property '"+"applicable_authorities"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.rights_engaged === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rights_engaged"},message:"must have required property '"+"rights_engaged"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.safeguards_and_remedies === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "safeguards_and_remedies"},message:"must have required property '"+"safeguards_and_remedies"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.uncertainties === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "uncertainties"},message:"must have required property '"+"uncertainties"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "status") || (key0 === "jurisdictions")) || (key0 === "applicable_authorities")) || (key0 === "rights_engaged")) || (key0 === "safeguards_and_remedies")) || (key0 === "uncertainties"))){
const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.status !== undefined){
let data0 = data.status;
if(!(((data0 === "assessed") || (data0 === "not_relevant")) || (data0 === "unknown"))){
const err7 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema37.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.jurisdictions !== undefined){
let data1 = data.jurisdictions;
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
if(typeof data1[i0] !== "string"){
const err8 = {instancePath:instancePath+"/jurisdictions/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
else {
const err9 = {instancePath:instancePath+"/jurisdictions",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.applicable_authorities !== undefined){
let data3 = data.applicable_authorities;
if(Array.isArray(data3)){
const len1 = data3.length;
for(let i1=0; i1<len1; i1++){
if(typeof data3[i1] !== "string"){
const err10 = {instancePath:instancePath+"/applicable_authorities/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath:instancePath+"/applicable_authorities",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.rights_engaged !== undefined){
let data5 = data.rights_engaged;
if(Array.isArray(data5)){
const len2 = data5.length;
for(let i2=0; i2<len2; i2++){
if(typeof data5[i2] !== "string"){
const err12 = {instancePath:instancePath+"/rights_engaged/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath:instancePath+"/rights_engaged",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.safeguards_and_remedies !== undefined){
let data7 = data.safeguards_and_remedies;
if(Array.isArray(data7)){
const len3 = data7.length;
for(let i3=0; i3<len3; i3++){
if(typeof data7[i3] !== "string"){
const err14 = {instancePath:instancePath+"/safeguards_and_remedies/" + i3,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath:instancePath+"/safeguards_and_remedies",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.uncertainties !== undefined){
let data9 = data.uncertainties;
if(Array.isArray(data9)){
const len4 = data9.length;
for(let i4=0; i4<len4; i4++){
if(typeof data9[i4] !== "string"){
const err16 = {instancePath:instancePath+"/uncertainties/" + i4,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
else {
const err17 = {instancePath:instancePath+"/uncertainties",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
validate23.errors = vErrors;
return errors === 0;
}
validate23.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema43 = {"type":"object","additionalProperties":false,"required":["id","jurisdiction_or_context","comparison_basis","similarities","differences","transfer_limits","evidence_ids","confidence"],"properties":{"id":{"type":"string","minLength":1},"jurisdiction_or_context":{"type":"string","minLength":1},"comparison_basis":{"type":"string","minLength":1},"similarities":{"$ref":"#/$defs/stringArray"},"differences":{"$ref":"#/$defs/stringArray"},"transfer_limits":{"$ref":"#/$defs/stringArray"},"evidence_ids":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};
const schema48 = {"enum":["high","medium","low"]};

function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate25.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.jurisdiction_or_context === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "jurisdiction_or_context"},message:"must have required property '"+"jurisdiction_or_context"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.comparison_basis === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "comparison_basis"},message:"must have required property '"+"comparison_basis"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.similarities === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "similarities"},message:"must have required property '"+"similarities"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.differences === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "differences"},message:"must have required property '"+"differences"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.transfer_limits === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "transfer_limits"},message:"must have required property '"+"transfer_limits"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.evidence_ids === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_ids"},message:"must have required property '"+"evidence_ids"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.confidence === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key0 in data){
if(!((((((((key0 === "id") || (key0 === "jurisdiction_or_context")) || (key0 === "comparison_basis")) || (key0 === "similarities")) || (key0 === "differences")) || (key0 === "transfer_limits")) || (key0 === "evidence_ids")) || (key0 === "confidence"))){
const err8 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(func2(data0) < 1){
const err9 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.jurisdiction_or_context !== undefined){
let data1 = data.jurisdiction_or_context;
if(typeof data1 === "string"){
if(func2(data1) < 1){
const err11 = {instancePath:instancePath+"/jurisdiction_or_context",schemaPath:"#/properties/jurisdiction_or_context/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/jurisdiction_or_context",schemaPath:"#/properties/jurisdiction_or_context/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.comparison_basis !== undefined){
let data2 = data.comparison_basis;
if(typeof data2 === "string"){
if(func2(data2) < 1){
const err13 = {instancePath:instancePath+"/comparison_basis",schemaPath:"#/properties/comparison_basis/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/comparison_basis",schemaPath:"#/properties/comparison_basis/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.similarities !== undefined){
let data3 = data.similarities;
if(Array.isArray(data3)){
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
if(typeof data3[i0] !== "string"){
const err15 = {instancePath:instancePath+"/similarities/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath:instancePath+"/similarities",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.differences !== undefined){
let data5 = data.differences;
if(Array.isArray(data5)){
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
if(typeof data5[i1] !== "string"){
const err17 = {instancePath:instancePath+"/differences/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath:instancePath+"/differences",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.transfer_limits !== undefined){
let data7 = data.transfer_limits;
if(Array.isArray(data7)){
const len2 = data7.length;
for(let i2=0; i2<len2; i2++){
if(typeof data7[i2] !== "string"){
const err19 = {instancePath:instancePath+"/transfer_limits/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
else {
const err20 = {instancePath:instancePath+"/transfer_limits",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.evidence_ids !== undefined){
let data9 = data.evidence_ids;
if(Array.isArray(data9)){
const len3 = data9.length;
for(let i3=0; i3<len3; i3++){
if(typeof data9[i3] !== "string"){
const err21 = {instancePath:instancePath+"/evidence_ids/" + i3,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath:instancePath+"/evidence_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.confidence !== undefined){
let data11 = data.confidence;
if(!(((data11 === "high") || (data11 === "medium")) || (data11 === "low"))){
const err23 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
validate25.errors = vErrors;
return errors === 0;
}
validate25.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema49 = {"type":"object","additionalProperties":false,"required":["level","status","finding","evidence_ids"],"properties":{"level":{"enum":["body","mind","relationship","population","environment"]},"status":{"enum":["present","absent","uncertain","not_applicable"]},"finding":{"type":"string","minLength":1},"evidence_ids":{"$ref":"#/$defs/stringArray"}}};

function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate27.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.level === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "level"},message:"must have required property '"+"level"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.status === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.finding === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "finding"},message:"must have required property '"+"finding"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.evidence_ids === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_ids"},message:"must have required property '"+"evidence_ids"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
for(const key0 in data){
if(!((((key0 === "level") || (key0 === "status")) || (key0 === "finding")) || (key0 === "evidence_ids"))){
const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.level !== undefined){
let data0 = data.level;
if(!(((((data0 === "body") || (data0 === "mind")) || (data0 === "relationship")) || (data0 === "population")) || (data0 === "environment"))){
const err5 = {instancePath:instancePath+"/level",schemaPath:"#/properties/level/enum",keyword:"enum",params:{allowedValues: schema49.properties.level.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.status !== undefined){
let data1 = data.status;
if(!((((data1 === "present") || (data1 === "absent")) || (data1 === "uncertain")) || (data1 === "not_applicable"))){
const err6 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema49.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.finding !== undefined){
let data2 = data.finding;
if(typeof data2 === "string"){
if(func2(data2) < 1){
const err7 = {instancePath:instancePath+"/finding",schemaPath:"#/properties/finding/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/finding",schemaPath:"#/properties/finding/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.evidence_ids !== undefined){
let data3 = data.evidence_ids;
if(Array.isArray(data3)){
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
if(typeof data3[i0] !== "string"){
const err9 = {instancePath:instancePath+"/evidence_ids/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath:instancePath+"/evidence_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
validate27.errors = vErrors;
return errors === 0;
}
validate27.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema51 = {"type":"object","additionalProperties":false,"required":["id","tradition","contribution","limitations","relevance","evidence_ids"],"properties":{"id":{"type":"string","minLength":1},"tradition":{"type":"string","minLength":1},"contribution":{"type":"string","minLength":1},"limitations":{"$ref":"#/$defs/nonEmptyStringArray"},"relevance":{"enum":["relevant","not_relevant","uncertain"]},"evidence_ids":{"$ref":"#/$defs/stringArray"}}};

function validate29(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate29.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.tradition === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "tradition"},message:"must have required property '"+"tradition"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.contribution === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "contribution"},message:"must have required property '"+"contribution"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.limitations === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.relevance === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "relevance"},message:"must have required property '"+"relevance"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.evidence_ids === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_ids"},message:"must have required property '"+"evidence_ids"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "tradition")) || (key0 === "contribution")) || (key0 === "limitations")) || (key0 === "relevance")) || (key0 === "evidence_ids"))){
const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(func2(data0) < 1){
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.tradition !== undefined){
let data1 = data.tradition;
if(typeof data1 === "string"){
if(func2(data1) < 1){
const err9 = {instancePath:instancePath+"/tradition",schemaPath:"#/properties/tradition/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/tradition",schemaPath:"#/properties/tradition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.contribution !== undefined){
let data2 = data.contribution;
if(typeof data2 === "string"){
if(func2(data2) < 1){
const err11 = {instancePath:instancePath+"/contribution",schemaPath:"#/properties/contribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/contribution",schemaPath:"#/properties/contribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.limitations !== undefined){
let data3 = data.limitations;
if(Array.isArray(data3)){
if(data3.length < 1){
const err13 = {instancePath:instancePath+"/limitations",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
if(typeof data4 === "string"){
if(func2(data4) < 1){
const err14 = {instancePath:instancePath+"/limitations/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/limitations/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath:instancePath+"/limitations",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.relevance !== undefined){
let data5 = data.relevance;
if(!(((data5 === "relevant") || (data5 === "not_relevant")) || (data5 === "uncertain"))){
const err17 = {instancePath:instancePath+"/relevance",schemaPath:"#/properties/relevance/enum",keyword:"enum",params:{allowedValues: schema51.properties.relevance.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.evidence_ids !== undefined){
let data6 = data.evidence_ids;
if(Array.isArray(data6)){
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
if(typeof data6[i1] !== "string"){
const err18 = {instancePath:instancePath+"/evidence_ids/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath:instancePath+"/evidence_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
else {
const err20 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
validate29.errors = vErrors;
return errors === 0;
}
validate29.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema54 = {"type":"object","additionalProperties":false,"required":["id","domain","name","scientific_definition","lived_context","governed_variation","authority_defining_normality","refusal_conditions","confidence"],"properties":{"id":{"type":"string","minLength":1},"domain":{"enum":["biological","cognitive_affective","reproductive","social_relational","symbolic","environmental"]},"name":{"type":"string","minLength":1},"scientific_definition":{"type":"string"},"lived_context":{"type":"string"},"governed_variation":{"type":"string"},"authority_defining_normality":{"type":"string"},"refusal_conditions":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate31(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate31.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.domain === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "domain"},message:"must have required property '"+"domain"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.name === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.scientific_definition === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scientific_definition"},message:"must have required property '"+"scientific_definition"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.lived_context === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "lived_context"},message:"must have required property '"+"lived_context"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.governed_variation === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "governed_variation"},message:"must have required property '"+"governed_variation"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.authority_defining_normality === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "authority_defining_normality"},message:"must have required property '"+"authority_defining_normality"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.refusal_conditions === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "refusal_conditions"},message:"must have required property '"+"refusal_conditions"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.confidence === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema54.properties, key0))){
const err9 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(func2(data0) < 1){
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.domain !== undefined){
let data1 = data.domain;
if(!((((((data1 === "biological") || (data1 === "cognitive_affective")) || (data1 === "reproductive")) || (data1 === "social_relational")) || (data1 === "symbolic")) || (data1 === "environmental"))){
const err12 = {instancePath:instancePath+"/domain",schemaPath:"#/properties/domain/enum",keyword:"enum",params:{allowedValues: schema54.properties.domain.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.name !== undefined){
let data2 = data.name;
if(typeof data2 === "string"){
if(func2(data2) < 1){
const err13 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.scientific_definition !== undefined){
if(typeof data.scientific_definition !== "string"){
const err15 = {instancePath:instancePath+"/scientific_definition",schemaPath:"#/properties/scientific_definition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.lived_context !== undefined){
if(typeof data.lived_context !== "string"){
const err16 = {instancePath:instancePath+"/lived_context",schemaPath:"#/properties/lived_context/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.governed_variation !== undefined){
if(typeof data.governed_variation !== "string"){
const err17 = {instancePath:instancePath+"/governed_variation",schemaPath:"#/properties/governed_variation/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.authority_defining_normality !== undefined){
if(typeof data.authority_defining_normality !== "string"){
const err18 = {instancePath:instancePath+"/authority_defining_normality",schemaPath:"#/properties/authority_defining_normality/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.refusal_conditions !== undefined){
if(typeof data.refusal_conditions !== "string"){
const err19 = {instancePath:instancePath+"/refusal_conditions",schemaPath:"#/properties/refusal_conditions/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.confidence !== undefined){
let data8 = data.confidence;
if(!(((data8 === "high") || (data8 === "medium")) || (data8 === "low"))){
const err20 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
else {
const err21 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
validate31.errors = vErrors;
return errors === 0;
}
validate31.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema56 = {"type":"object","additionalProperties":false,"required":["id","name","role","formal_mandate","material_interests","authority_sources","funding","information_advantages","enforcement_capacities","dependencies","stated_objectives","plausible_unstated_incentives","internal_disagreements","accountability","confidence"],"properties":{"id":{"type":"string","minLength":1},"name":{"type":"string","minLength":1},"role":{"enum":["decision_maker","implementer","expert","funder","beneficiary","intermediary","resisting_group","other"]},"formal_mandate":{"type":"string"},"material_interests":{"$ref":"#/$defs/stringArray"},"authority_sources":{"$ref":"#/$defs/stringArray"},"funding":{"$ref":"#/$defs/stringArray"},"information_advantages":{"$ref":"#/$defs/stringArray"},"enforcement_capacities":{"$ref":"#/$defs/stringArray"},"dependencies":{"$ref":"#/$defs/stringArray"},"stated_objectives":{"$ref":"#/$defs/stringArray"},"plausible_unstated_incentives":{"$ref":"#/$defs/stringArray"},"internal_disagreements":{"$ref":"#/$defs/stringArray"},"accountability":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate33(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate33.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.role === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "role"},message:"must have required property '"+"role"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.formal_mandate === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "formal_mandate"},message:"must have required property '"+"formal_mandate"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.material_interests === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "material_interests"},message:"must have required property '"+"material_interests"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.authority_sources === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "authority_sources"},message:"must have required property '"+"authority_sources"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.funding === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "funding"},message:"must have required property '"+"funding"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.information_advantages === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "information_advantages"},message:"must have required property '"+"information_advantages"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.enforcement_capacities === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "enforcement_capacities"},message:"must have required property '"+"enforcement_capacities"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.dependencies === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "dependencies"},message:"must have required property '"+"dependencies"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.stated_objectives === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "stated_objectives"},message:"must have required property '"+"stated_objectives"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.plausible_unstated_incentives === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "plausible_unstated_incentives"},message:"must have required property '"+"plausible_unstated_incentives"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.internal_disagreements === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "internal_disagreements"},message:"must have required property '"+"internal_disagreements"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.accountability === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "accountability"},message:"must have required property '"+"accountability"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.confidence === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema56.properties, key0))){
const err15 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(func2(data0) < 1){
const err16 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.name !== undefined){
let data1 = data.name;
if(typeof data1 === "string"){
if(func2(data1) < 1){
const err18 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.role !== undefined){
let data2 = data.role;
if(!((((((((data2 === "decision_maker") || (data2 === "implementer")) || (data2 === "expert")) || (data2 === "funder")) || (data2 === "beneficiary")) || (data2 === "intermediary")) || (data2 === "resisting_group")) || (data2 === "other"))){
const err20 = {instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema56.properties.role.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.formal_mandate !== undefined){
if(typeof data.formal_mandate !== "string"){
const err21 = {instancePath:instancePath+"/formal_mandate",schemaPath:"#/properties/formal_mandate/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.material_interests !== undefined){
let data4 = data.material_interests;
if(Array.isArray(data4)){
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
if(typeof data4[i0] !== "string"){
const err22 = {instancePath:instancePath+"/material_interests/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
else {
const err23 = {instancePath:instancePath+"/material_interests",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.authority_sources !== undefined){
let data6 = data.authority_sources;
if(Array.isArray(data6)){
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
if(typeof data6[i1] !== "string"){
const err24 = {instancePath:instancePath+"/authority_sources/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath:instancePath+"/authority_sources",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.funding !== undefined){
let data8 = data.funding;
if(Array.isArray(data8)){
const len2 = data8.length;
for(let i2=0; i2<len2; i2++){
if(typeof data8[i2] !== "string"){
const err26 = {instancePath:instancePath+"/funding/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
}
else {
const err27 = {instancePath:instancePath+"/funding",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.information_advantages !== undefined){
let data10 = data.information_advantages;
if(Array.isArray(data10)){
const len3 = data10.length;
for(let i3=0; i3<len3; i3++){
if(typeof data10[i3] !== "string"){
const err28 = {instancePath:instancePath+"/information_advantages/" + i3,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
else {
const err29 = {instancePath:instancePath+"/information_advantages",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.enforcement_capacities !== undefined){
let data12 = data.enforcement_capacities;
if(Array.isArray(data12)){
const len4 = data12.length;
for(let i4=0; i4<len4; i4++){
if(typeof data12[i4] !== "string"){
const err30 = {instancePath:instancePath+"/enforcement_capacities/" + i4,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
else {
const err31 = {instancePath:instancePath+"/enforcement_capacities",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.dependencies !== undefined){
let data14 = data.dependencies;
if(Array.isArray(data14)){
const len5 = data14.length;
for(let i5=0; i5<len5; i5++){
if(typeof data14[i5] !== "string"){
const err32 = {instancePath:instancePath+"/dependencies/" + i5,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
}
else {
const err33 = {instancePath:instancePath+"/dependencies",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.stated_objectives !== undefined){
let data16 = data.stated_objectives;
if(Array.isArray(data16)){
const len6 = data16.length;
for(let i6=0; i6<len6; i6++){
if(typeof data16[i6] !== "string"){
const err34 = {instancePath:instancePath+"/stated_objectives/" + i6,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
}
else {
const err35 = {instancePath:instancePath+"/stated_objectives",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.plausible_unstated_incentives !== undefined){
let data18 = data.plausible_unstated_incentives;
if(Array.isArray(data18)){
const len7 = data18.length;
for(let i7=0; i7<len7; i7++){
if(typeof data18[i7] !== "string"){
const err36 = {instancePath:instancePath+"/plausible_unstated_incentives/" + i7,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
}
else {
const err37 = {instancePath:instancePath+"/plausible_unstated_incentives",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data.internal_disagreements !== undefined){
let data20 = data.internal_disagreements;
if(Array.isArray(data20)){
const len8 = data20.length;
for(let i8=0; i8<len8; i8++){
if(typeof data20[i8] !== "string"){
const err38 = {instancePath:instancePath+"/internal_disagreements/" + i8,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
}
else {
const err39 = {instancePath:instancePath+"/internal_disagreements",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data.accountability !== undefined){
let data22 = data.accountability;
if(Array.isArray(data22)){
const len9 = data22.length;
for(let i9=0; i9<len9; i9++){
if(typeof data22[i9] !== "string"){
const err40 = {instancePath:instancePath+"/accountability/" + i9,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
}
else {
const err41 = {instancePath:instancePath+"/accountability",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.confidence !== undefined){
let data24 = data.confidence;
if(!(((data24 === "high") || (data24 === "medium")) || (data24 === "low"))){
const err42 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
}
else {
const err43 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
validate33.errors = vErrors;
return errors === 0;
}
validate33.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema68 = {"type":"object","additionalProperties":false,"required":["id","name","classification","exposure","benefits","burdens","agency","missing_from_record","confidence"],"properties":{"id":{"type":"string","minLength":1},"name":{"type":"string","minLength":1},"classification":{"type":"string"},"exposure":{"$ref":"#/$defs/stringArray"},"benefits":{"$ref":"#/$defs/stringArray"},"burdens":{"$ref":"#/$defs/stringArray"},"agency":{"type":"string"},"missing_from_record":{"type":"boolean"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate35(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate35.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.classification === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "classification"},message:"must have required property '"+"classification"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.exposure === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "exposure"},message:"must have required property '"+"exposure"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.benefits === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "benefits"},message:"must have required property '"+"benefits"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.burdens === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "burdens"},message:"must have required property '"+"burdens"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.agency === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "agency"},message:"must have required property '"+"agency"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.missing_from_record === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "missing_from_record"},message:"must have required property '"+"missing_from_record"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.confidence === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema68.properties, key0))){
const err9 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(func2(data0) < 1){
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.name !== undefined){
let data1 = data.name;
if(typeof data1 === "string"){
if(func2(data1) < 1){
const err12 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.classification !== undefined){
if(typeof data.classification !== "string"){
const err14 = {instancePath:instancePath+"/classification",schemaPath:"#/properties/classification/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.exposure !== undefined){
let data3 = data.exposure;
if(Array.isArray(data3)){
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
if(typeof data3[i0] !== "string"){
const err15 = {instancePath:instancePath+"/exposure/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath:instancePath+"/exposure",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.benefits !== undefined){
let data5 = data.benefits;
if(Array.isArray(data5)){
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
if(typeof data5[i1] !== "string"){
const err17 = {instancePath:instancePath+"/benefits/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath:instancePath+"/benefits",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.burdens !== undefined){
let data7 = data.burdens;
if(Array.isArray(data7)){
const len2 = data7.length;
for(let i2=0; i2<len2; i2++){
if(typeof data7[i2] !== "string"){
const err19 = {instancePath:instancePath+"/burdens/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
else {
const err20 = {instancePath:instancePath+"/burdens",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.agency !== undefined){
if(typeof data.agency !== "string"){
const err21 = {instancePath:instancePath+"/agency",schemaPath:"#/properties/agency/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.missing_from_record !== undefined){
if(typeof data.missing_from_record !== "boolean"){
const err22 = {instancePath:instancePath+"/missing_from_record",schemaPath:"#/properties/missing_from_record/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.confidence !== undefined){
let data11 = data.confidence;
if(!(((data11 === "high") || (data11 === "medium")) || (data11 === "low"))){
const err23 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
validate35.errors = vErrors;
return errors === 0;
}
validate35.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema73 = {"type":"object","additionalProperties":false,"required":["id","name","mandate","role","accountability","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"mandate":{"type":"string"},"role":{"type":"string"},"accountability":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate37.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.mandate === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mandate"},message:"must have required property '"+"mandate"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.role === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "role"},message:"must have required property '"+"role"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.accountability === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "accountability"},message:"must have required property '"+"accountability"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.confidence === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "name")) || (key0 === "mandate")) || (key0 === "role")) || (key0 === "accountability")) || (key0 === "confidence"))){
const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err8 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.mandate !== undefined){
if(typeof data.mandate !== "string"){
const err9 = {instancePath:instancePath+"/mandate",schemaPath:"#/properties/mandate/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.role !== undefined){
if(typeof data.role !== "string"){
const err10 = {instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.accountability !== undefined){
let data4 = data.accountability;
if(Array.isArray(data4)){
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
if(typeof data4[i0] !== "string"){
const err11 = {instancePath:instancePath+"/accountability/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
else {
const err12 = {instancePath:instancePath+"/accountability",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.confidence !== undefined){
let data6 = data.confidence;
if(!(((data6 === "high") || (data6 === "medium")) || (data6 === "low"))){
const err13 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
validate37.errors = vErrors;
return errors === 0;
}
validate37.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema76 = {"type":"object","additionalProperties":false,"required":["id","between","resource","effect","confidence"],"properties":{"id":{"type":"string"},"between":{"$ref":"#/$defs/nonEmptyStringArray"},"resource":{"type":"string"},"effect":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate39(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate39.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.between === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "between"},message:"must have required property '"+"between"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.resource === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "resource"},message:"must have required property '"+"resource"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.effect === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "effect"},message:"must have required property '"+"effect"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.confidence === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "id") || (key0 === "between")) || (key0 === "resource")) || (key0 === "effect")) || (key0 === "confidence"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err6 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.between !== undefined){
let data1 = data.between;
if(Array.isArray(data1)){
if(data1.length < 1){
const err7 = {instancePath:instancePath+"/between",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
if(typeof data2 === "string"){
if(func2(data2) < 1){
const err8 = {instancePath:instancePath+"/between/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/between/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath:instancePath+"/between",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.resource !== undefined){
if(typeof data.resource !== "string"){
const err11 = {instancePath:instancePath+"/resource",schemaPath:"#/properties/resource/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.effect !== undefined){
if(typeof data.effect !== "string"){
const err12 = {instancePath:instancePath+"/effect",schemaPath:"#/properties/effect/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.confidence !== undefined){
let data5 = data.confidence;
if(!(((data5 === "high") || (data5 === "medium")) || (data5 === "low"))){
const err13 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
validate39.errors = vErrors;
return errors === 0;
}
validate39.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema79 = {"type":"object","additionalProperties":false,"required":["id","name","type","mechanism","scale","stated_purpose","ownership","oversight","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string","minLength":1},"type":{"enum":["law","force","architecture","money","expertise","statistics","surveillance","incentive","norm","algorithm","narrative","infrastructure","medical","other"]},"mechanism":{"type":"string","minLength":1},"scale":{"$ref":"#/$defs/nonEmptyStringArray"},"stated_purpose":{"type":"string"},"ownership":{"type":"string"},"oversight":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate41(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate41.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.type === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.mechanism === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanism"},message:"must have required property '"+"mechanism"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.scale === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.stated_purpose === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "stated_purpose"},message:"must have required property '"+"stated_purpose"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.ownership === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "ownership"},message:"must have required property '"+"ownership"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.oversight === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "oversight"},message:"must have required property '"+"oversight"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.confidence === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema79.properties, key0))){
const err9 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.name !== undefined){
let data1 = data.name;
if(typeof data1 === "string"){
if(func2(data1) < 1){
const err11 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.type !== undefined){
let data2 = data.type;
if(!((((((((((((((data2 === "law") || (data2 === "force")) || (data2 === "architecture")) || (data2 === "money")) || (data2 === "expertise")) || (data2 === "statistics")) || (data2 === "surveillance")) || (data2 === "incentive")) || (data2 === "norm")) || (data2 === "algorithm")) || (data2 === "narrative")) || (data2 === "infrastructure")) || (data2 === "medical")) || (data2 === "other"))){
const err13 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema79.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.mechanism !== undefined){
let data3 = data.mechanism;
if(typeof data3 === "string"){
if(func2(data3) < 1){
const err14 = {instancePath:instancePath+"/mechanism",schemaPath:"#/properties/mechanism/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/mechanism",schemaPath:"#/properties/mechanism/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.scale !== undefined){
let data4 = data.scale;
if(Array.isArray(data4)){
if(data4.length < 1){
const err16 = {instancePath:instancePath+"/scale",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
if(typeof data5 === "string"){
if(func2(data5) < 1){
const err17 = {instancePath:instancePath+"/scale/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/scale/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath:instancePath+"/scale",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.stated_purpose !== undefined){
if(typeof data.stated_purpose !== "string"){
const err20 = {instancePath:instancePath+"/stated_purpose",schemaPath:"#/properties/stated_purpose/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.ownership !== undefined){
if(typeof data.ownership !== "string"){
const err21 = {instancePath:instancePath+"/ownership",schemaPath:"#/properties/ownership/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.oversight !== undefined){
if(typeof data.oversight !== "string"){
const err22 = {instancePath:instancePath+"/oversight",schemaPath:"#/properties/oversight/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.confidence !== undefined){
let data9 = data.confidence;
if(!(((data9 === "high") || (data9 === "medium")) || (data9 === "low"))){
const err23 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
validate41.errors = vErrors;
return errors === 0;
}
validate41.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema82 = {"type":"object","additionalProperties":false,"required":["id","name","owner","dependency_created","actions_enabled_or_blocked","access_conditions","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"owner":{"type":"string"},"dependency_created":{"type":"string"},"actions_enabled_or_blocked":{"$ref":"#/$defs/stringArray"},"access_conditions":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate43(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate43.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.owner === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "owner"},message:"must have required property '"+"owner"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.dependency_created === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "dependency_created"},message:"must have required property '"+"dependency_created"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.actions_enabled_or_blocked === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "actions_enabled_or_blocked"},message:"must have required property '"+"actions_enabled_or_blocked"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.access_conditions === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "access_conditions"},message:"must have required property '"+"access_conditions"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.confidence === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "name")) || (key0 === "owner")) || (key0 === "dependency_created")) || (key0 === "actions_enabled_or_blocked")) || (key0 === "access_conditions")) || (key0 === "confidence"))){
const err7 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err8 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err9 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.owner !== undefined){
if(typeof data.owner !== "string"){
const err10 = {instancePath:instancePath+"/owner",schemaPath:"#/properties/owner/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.dependency_created !== undefined){
if(typeof data.dependency_created !== "string"){
const err11 = {instancePath:instancePath+"/dependency_created",schemaPath:"#/properties/dependency_created/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.actions_enabled_or_blocked !== undefined){
let data4 = data.actions_enabled_or_blocked;
if(Array.isArray(data4)){
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
if(typeof data4[i0] !== "string"){
const err12 = {instancePath:instancePath+"/actions_enabled_or_blocked/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath:instancePath+"/actions_enabled_or_blocked",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.access_conditions !== undefined){
let data6 = data.access_conditions;
if(Array.isArray(data6)){
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
if(typeof data6[i1] !== "string"){
const err14 = {instancePath:instancePath+"/access_conditions/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath:instancePath+"/access_conditions",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.confidence !== undefined){
let data8 = data.confidence;
if(!(((data8 === "high") || (data8 === "medium")) || (data8 === "low"))){
const err16 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
else {
const err17 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
validate43.errors = vErrors;
return errors === 0;
}
validate43.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema86 = {"type":"object","additionalProperties":false,"required":["id","ownership","labor","profit","unpaid_care","privatized_risks","socialized_costs","scarcity_mechanism","dependency_model","confidence"],"properties":{"id":{"type":"string"},"ownership":{"type":"string"},"labor":{"type":"string"},"profit":{"type":"string"},"unpaid_care":{"type":"string"},"privatized_risks":{"$ref":"#/$defs/stringArray"},"socialized_costs":{"$ref":"#/$defs/stringArray"},"scarcity_mechanism":{"type":"string"},"dependency_model":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate45(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate45.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.ownership === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "ownership"},message:"must have required property '"+"ownership"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.labor === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "labor"},message:"must have required property '"+"labor"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.profit === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "profit"},message:"must have required property '"+"profit"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.unpaid_care === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "unpaid_care"},message:"must have required property '"+"unpaid_care"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.privatized_risks === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "privatized_risks"},message:"must have required property '"+"privatized_risks"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.socialized_costs === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "socialized_costs"},message:"must have required property '"+"socialized_costs"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.scarcity_mechanism === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scarcity_mechanism"},message:"must have required property '"+"scarcity_mechanism"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.dependency_model === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "dependency_model"},message:"must have required property '"+"dependency_model"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.confidence === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema86.properties, key0))){
const err10 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err11 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.ownership !== undefined){
if(typeof data.ownership !== "string"){
const err12 = {instancePath:instancePath+"/ownership",schemaPath:"#/properties/ownership/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.labor !== undefined){
if(typeof data.labor !== "string"){
const err13 = {instancePath:instancePath+"/labor",schemaPath:"#/properties/labor/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.profit !== undefined){
if(typeof data.profit !== "string"){
const err14 = {instancePath:instancePath+"/profit",schemaPath:"#/properties/profit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.unpaid_care !== undefined){
if(typeof data.unpaid_care !== "string"){
const err15 = {instancePath:instancePath+"/unpaid_care",schemaPath:"#/properties/unpaid_care/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.privatized_risks !== undefined){
let data5 = data.privatized_risks;
if(Array.isArray(data5)){
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
if(typeof data5[i0] !== "string"){
const err16 = {instancePath:instancePath+"/privatized_risks/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
else {
const err17 = {instancePath:instancePath+"/privatized_risks",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.socialized_costs !== undefined){
let data7 = data.socialized_costs;
if(Array.isArray(data7)){
const len1 = data7.length;
for(let i1=0; i1<len1; i1++){
if(typeof data7[i1] !== "string"){
const err18 = {instancePath:instancePath+"/socialized_costs/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath:instancePath+"/socialized_costs",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.scarcity_mechanism !== undefined){
if(typeof data.scarcity_mechanism !== "string"){
const err20 = {instancePath:instancePath+"/scarcity_mechanism",schemaPath:"#/properties/scarcity_mechanism/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.dependency_model !== undefined){
if(typeof data.dependency_model !== "string"){
const err21 = {instancePath:instancePath+"/dependency_model",schemaPath:"#/properties/dependency_model/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.confidence !== undefined){
let data11 = data.confidence;
if(!(((data11 === "high") || (data11 === "medium")) || (data11 === "low"))){
const err22 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
else {
const err23 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
validate45.errors = vErrors;
return errors === 0;
}
validate45.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema90 = {"type":"object","additionalProperties":false,"required":["mode","mechanism","evidence_ids","confidence"],"properties":{"mode":{"enum":["sovereign_power","disciplinary_power","biopower","governmentality","pastoral_power","psychopolitics","necropolitics","datafication","algorithmic_governance","political_economy","coloniality","ecological_governmentality"]},"mechanism":{"type":"string"},"evidence_ids":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate47(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate47.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.mode === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.mechanism === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanism"},message:"must have required property '"+"mechanism"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.evidence_ids === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_ids"},message:"must have required property '"+"evidence_ids"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.confidence === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
for(const key0 in data){
if(!((((key0 === "mode") || (key0 === "mechanism")) || (key0 === "evidence_ids")) || (key0 === "confidence"))){
const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.mode !== undefined){
let data0 = data.mode;
if(!((((((((((((data0 === "sovereign_power") || (data0 === "disciplinary_power")) || (data0 === "biopower")) || (data0 === "governmentality")) || (data0 === "pastoral_power")) || (data0 === "psychopolitics")) || (data0 === "necropolitics")) || (data0 === "datafication")) || (data0 === "algorithmic_governance")) || (data0 === "political_economy")) || (data0 === "coloniality")) || (data0 === "ecological_governmentality"))){
const err5 = {instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema90.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.mechanism !== undefined){
if(typeof data.mechanism !== "string"){
const err6 = {instancePath:instancePath+"/mechanism",schemaPath:"#/properties/mechanism/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.evidence_ids !== undefined){
let data2 = data.evidence_ids;
if(Array.isArray(data2)){
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
if(typeof data2[i0] !== "string"){
const err7 = {instancePath:instancePath+"/evidence_ids/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
else {
const err8 = {instancePath:instancePath+"/evidence_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.confidence !== undefined){
let data4 = data.confidence;
if(!(((data4 === "high") || (data4 === "medium")) || (data4 === "low"))){
const err9 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
validate47.errors = vErrors;
return errors === 0;
}
validate47.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema93 = {"type":"object","additionalProperties":false,"required":["id","name","definition","authority","subject_position","alternatives","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"definition":{"type":"string"},"authority":{"type":"string"},"subject_position":{"type":"string"},"alternatives":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate49(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate49.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.definition === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "definition"},message:"must have required property '"+"definition"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.authority === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "authority"},message:"must have required property '"+"authority"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.subject_position === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "subject_position"},message:"must have required property '"+"subject_position"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.alternatives === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "alternatives"},message:"must have required property '"+"alternatives"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.confidence === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "name")) || (key0 === "definition")) || (key0 === "authority")) || (key0 === "subject_position")) || (key0 === "alternatives")) || (key0 === "confidence"))){
const err7 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err8 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err9 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.definition !== undefined){
if(typeof data.definition !== "string"){
const err10 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.authority !== undefined){
if(typeof data.authority !== "string"){
const err11 = {instancePath:instancePath+"/authority",schemaPath:"#/properties/authority/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.subject_position !== undefined){
if(typeof data.subject_position !== "string"){
const err12 = {instancePath:instancePath+"/subject_position",schemaPath:"#/properties/subject_position/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.alternatives !== undefined){
let data5 = data.alternatives;
if(Array.isArray(data5)){
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
if(typeof data5[i0] !== "string"){
const err13 = {instancePath:instancePath+"/alternatives/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath:instancePath+"/alternatives",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.confidence !== undefined){
let data7 = data.confidence;
if(!(((data7 === "high") || (data7 === "medium")) || (data7 === "low"))){
const err15 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
validate49.errors = vErrors;
return errors === 0;
}
validate49.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema96 = {"type":"object","additionalProperties":false,"required":["id","claim","authorizing_institutions","validation_procedure","funding_or_interest","excluded_knowledge","evidence_quality","confidence"],"properties":{"id":{"type":"string"},"claim":{"type":"string"},"authorizing_institutions":{"$ref":"#/$defs/stringArray"},"validation_procedure":{"type":"string"},"funding_or_interest":{"type":"string"},"excluded_knowledge":{"$ref":"#/$defs/stringArray"},"evidence_quality":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate51(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate51.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.claim === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "claim"},message:"must have required property '"+"claim"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.authorizing_institutions === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "authorizing_institutions"},message:"must have required property '"+"authorizing_institutions"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.validation_procedure === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "validation_procedure"},message:"must have required property '"+"validation_procedure"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.funding_or_interest === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "funding_or_interest"},message:"must have required property '"+"funding_or_interest"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.excluded_knowledge === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "excluded_knowledge"},message:"must have required property '"+"excluded_knowledge"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.evidence_quality === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_quality"},message:"must have required property '"+"evidence_quality"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.confidence === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key0 in data){
if(!((((((((key0 === "id") || (key0 === "claim")) || (key0 === "authorizing_institutions")) || (key0 === "validation_procedure")) || (key0 === "funding_or_interest")) || (key0 === "excluded_knowledge")) || (key0 === "evidence_quality")) || (key0 === "confidence"))){
const err8 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err9 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.claim !== undefined){
if(typeof data.claim !== "string"){
const err10 = {instancePath:instancePath+"/claim",schemaPath:"#/properties/claim/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.authorizing_institutions !== undefined){
let data2 = data.authorizing_institutions;
if(Array.isArray(data2)){
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
if(typeof data2[i0] !== "string"){
const err11 = {instancePath:instancePath+"/authorizing_institutions/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
else {
const err12 = {instancePath:instancePath+"/authorizing_institutions",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.validation_procedure !== undefined){
if(typeof data.validation_procedure !== "string"){
const err13 = {instancePath:instancePath+"/validation_procedure",schemaPath:"#/properties/validation_procedure/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.funding_or_interest !== undefined){
if(typeof data.funding_or_interest !== "string"){
const err14 = {instancePath:instancePath+"/funding_or_interest",schemaPath:"#/properties/funding_or_interest/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.excluded_knowledge !== undefined){
let data6 = data.excluded_knowledge;
if(Array.isArray(data6)){
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
if(typeof data6[i1] !== "string"){
const err15 = {instancePath:instancePath+"/excluded_knowledge/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath:instancePath+"/excluded_knowledge",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.evidence_quality !== undefined){
if(typeof data.evidence_quality !== "string"){
const err17 = {instancePath:instancePath+"/evidence_quality",schemaPath:"#/properties/evidence_quality/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.confidence !== undefined){
let data9 = data.confidence;
if(!(((data9 === "high") || (data9 === "medium")) || (data9 === "low"))){
const err18 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
validate51.errors = vErrors;
return errors === 0;
}
validate51.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema100 = {"type":"object","additionalProperties":false,"required":["id","category","definition","decision_use","error_risks","contestability","confidence"],"properties":{"id":{"type":"string"},"category":{"type":"string"},"definition":{"type":"string"},"decision_use":{"type":"string"},"error_risks":{"$ref":"#/$defs/stringArray"},"contestability":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate53(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate53.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.category === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "category"},message:"must have required property '"+"category"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.definition === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "definition"},message:"must have required property '"+"definition"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.decision_use === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "decision_use"},message:"must have required property '"+"decision_use"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.error_risks === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "error_risks"},message:"must have required property '"+"error_risks"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.contestability === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "contestability"},message:"must have required property '"+"contestability"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.confidence === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "category")) || (key0 === "definition")) || (key0 === "decision_use")) || (key0 === "error_risks")) || (key0 === "contestability")) || (key0 === "confidence"))){
const err7 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err8 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.category !== undefined){
if(typeof data.category !== "string"){
const err9 = {instancePath:instancePath+"/category",schemaPath:"#/properties/category/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.definition !== undefined){
if(typeof data.definition !== "string"){
const err10 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.decision_use !== undefined){
if(typeof data.decision_use !== "string"){
const err11 = {instancePath:instancePath+"/decision_use",schemaPath:"#/properties/decision_use/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.error_risks !== undefined){
let data4 = data.error_risks;
if(Array.isArray(data4)){
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
if(typeof data4[i0] !== "string"){
const err12 = {instancePath:instancePath+"/error_risks/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath:instancePath+"/error_risks",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.contestability !== undefined){
if(typeof data.contestability !== "string"){
const err14 = {instancePath:instancePath+"/contestability",schemaPath:"#/properties/contestability/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.confidence !== undefined){
let data7 = data.confidence;
if(!(((data7 === "high") || (data7 === "medium")) || (data7 === "low"))){
const err15 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
validate53.errors = vErrors;
return errors === 0;
}
validate53.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema103 = {"type":"object","additionalProperties":false,"required":["id","classification_id","institutional_response","altered_opportunity_or_identity","behavioral_adaptation","new_data","confirmation_or_revision","falsified_if","confidence"],"properties":{"id":{"type":"string"},"classification_id":{"type":"string"},"institutional_response":{"type":"string"},"altered_opportunity_or_identity":{"type":"string"},"behavioral_adaptation":{"type":"string"},"new_data":{"type":"string"},"confirmation_or_revision":{"type":"string"},"falsified_if":{"$ref":"#/$defs/nonEmptyStringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate55(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate55.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.classification_id === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "classification_id"},message:"must have required property '"+"classification_id"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.institutional_response === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "institutional_response"},message:"must have required property '"+"institutional_response"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.altered_opportunity_or_identity === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "altered_opportunity_or_identity"},message:"must have required property '"+"altered_opportunity_or_identity"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.behavioral_adaptation === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "behavioral_adaptation"},message:"must have required property '"+"behavioral_adaptation"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.new_data === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "new_data"},message:"must have required property '"+"new_data"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.confirmation_or_revision === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confirmation_or_revision"},message:"must have required property '"+"confirmation_or_revision"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.falsified_if === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "falsified_if"},message:"must have required property '"+"falsified_if"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.confidence === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema103.properties, key0))){
const err9 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.classification_id !== undefined){
if(typeof data.classification_id !== "string"){
const err11 = {instancePath:instancePath+"/classification_id",schemaPath:"#/properties/classification_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.institutional_response !== undefined){
if(typeof data.institutional_response !== "string"){
const err12 = {instancePath:instancePath+"/institutional_response",schemaPath:"#/properties/institutional_response/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.altered_opportunity_or_identity !== undefined){
if(typeof data.altered_opportunity_or_identity !== "string"){
const err13 = {instancePath:instancePath+"/altered_opportunity_or_identity",schemaPath:"#/properties/altered_opportunity_or_identity/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.behavioral_adaptation !== undefined){
if(typeof data.behavioral_adaptation !== "string"){
const err14 = {instancePath:instancePath+"/behavioral_adaptation",schemaPath:"#/properties/behavioral_adaptation/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.new_data !== undefined){
if(typeof data.new_data !== "string"){
const err15 = {instancePath:instancePath+"/new_data",schemaPath:"#/properties/new_data/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.confirmation_or_revision !== undefined){
if(typeof data.confirmation_or_revision !== "string"){
const err16 = {instancePath:instancePath+"/confirmation_or_revision",schemaPath:"#/properties/confirmation_or_revision/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.falsified_if !== undefined){
let data7 = data.falsified_if;
if(Array.isArray(data7)){
if(data7.length < 1){
const err17 = {instancePath:instancePath+"/falsified_if",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
if(typeof data8 === "string"){
if(func2(data8) < 1){
const err18 = {instancePath:instancePath+"/falsified_if/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/falsified_if/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
else {
const err20 = {instancePath:instancePath+"/falsified_if",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.confidence !== undefined){
let data9 = data.confidence;
if(!(((data9 === "high") || (data9 === "medium")) || (data9 === "low"))){
const err21 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
validate55.errors = vErrors;
return errors === 0;
}
validate55.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema106 = {"type":"object","additionalProperties":false,"required":["id","name","target_function_ids","actor_ids","instrument_ids","modality","stated_benefit","evidence_of_benefit","documented_harms","necessity","proportionality","dependency_created","consent","exit","contestability","confidence"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"target_function_ids":{"$ref":"#/$defs/nonEmptyStringArray"},"actor_ids":{"$ref":"#/$defs/stringArray"},"instrument_ids":{"$ref":"#/$defs/nonEmptyStringArray"},"modality":{"enum":["protection","assistance","treatment","regulation","persuasion","incentivization","manipulation","exploitation","coercion","capture","expropriation","mixed","undetermined"]},"stated_benefit":{"type":"string"},"evidence_of_benefit":{"$ref":"#/$defs/stringArray"},"documented_harms":{"$ref":"#/$defs/stringArray"},"necessity":{"enum":["supported","partly_supported","unsupported","unknown"]},"proportionality":{"enum":["proportionate","mixed","disproportionate","unknown"]},"dependency_created":{"type":"string"},"consent":{"type":"string"},"exit":{"type":"string"},"contestability":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate57(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate57.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.target_function_ids === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "target_function_ids"},message:"must have required property '"+"target_function_ids"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.actor_ids === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "actor_ids"},message:"must have required property '"+"actor_ids"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.instrument_ids === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "instrument_ids"},message:"must have required property '"+"instrument_ids"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.modality === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "modality"},message:"must have required property '"+"modality"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.stated_benefit === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "stated_benefit"},message:"must have required property '"+"stated_benefit"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.evidence_of_benefit === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_of_benefit"},message:"must have required property '"+"evidence_of_benefit"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.documented_harms === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "documented_harms"},message:"must have required property '"+"documented_harms"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.necessity === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "necessity"},message:"must have required property '"+"necessity"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.proportionality === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "proportionality"},message:"must have required property '"+"proportionality"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.dependency_created === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "dependency_created"},message:"must have required property '"+"dependency_created"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.consent === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "consent"},message:"must have required property '"+"consent"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.exit === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "exit"},message:"must have required property '"+"exit"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.contestability === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "contestability"},message:"must have required property '"+"contestability"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.confidence === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema106.properties, key0))){
const err16 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err17 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err18 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.target_function_ids !== undefined){
let data2 = data.target_function_ids;
if(Array.isArray(data2)){
if(data2.length < 1){
const err19 = {instancePath:instancePath+"/target_function_ids",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
if(typeof data3 === "string"){
if(func2(data3) < 1){
const err20 = {instancePath:instancePath+"/target_function_ids/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/target_function_ids/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath:instancePath+"/target_function_ids",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.actor_ids !== undefined){
let data4 = data.actor_ids;
if(Array.isArray(data4)){
const len1 = data4.length;
for(let i1=0; i1<len1; i1++){
if(typeof data4[i1] !== "string"){
const err23 = {instancePath:instancePath+"/actor_ids/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath:instancePath+"/actor_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.instrument_ids !== undefined){
let data6 = data.instrument_ids;
if(Array.isArray(data6)){
if(data6.length < 1){
const err25 = {instancePath:instancePath+"/instrument_ids",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
const len2 = data6.length;
for(let i2=0; i2<len2; i2++){
let data7 = data6[i2];
if(typeof data7 === "string"){
if(func2(data7) < 1){
const err26 = {instancePath:instancePath+"/instrument_ids/" + i2,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
else {
const err27 = {instancePath:instancePath+"/instrument_ids/" + i2,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
else {
const err28 = {instancePath:instancePath+"/instrument_ids",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.modality !== undefined){
let data8 = data.modality;
if(!(((((((((((((data8 === "protection") || (data8 === "assistance")) || (data8 === "treatment")) || (data8 === "regulation")) || (data8 === "persuasion")) || (data8 === "incentivization")) || (data8 === "manipulation")) || (data8 === "exploitation")) || (data8 === "coercion")) || (data8 === "capture")) || (data8 === "expropriation")) || (data8 === "mixed")) || (data8 === "undetermined"))){
const err29 = {instancePath:instancePath+"/modality",schemaPath:"#/properties/modality/enum",keyword:"enum",params:{allowedValues: schema106.properties.modality.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.stated_benefit !== undefined){
if(typeof data.stated_benefit !== "string"){
const err30 = {instancePath:instancePath+"/stated_benefit",schemaPath:"#/properties/stated_benefit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data.evidence_of_benefit !== undefined){
let data10 = data.evidence_of_benefit;
if(Array.isArray(data10)){
const len3 = data10.length;
for(let i3=0; i3<len3; i3++){
if(typeof data10[i3] !== "string"){
const err31 = {instancePath:instancePath+"/evidence_of_benefit/" + i3,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
}
else {
const err32 = {instancePath:instancePath+"/evidence_of_benefit",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.documented_harms !== undefined){
let data12 = data.documented_harms;
if(Array.isArray(data12)){
const len4 = data12.length;
for(let i4=0; i4<len4; i4++){
if(typeof data12[i4] !== "string"){
const err33 = {instancePath:instancePath+"/documented_harms/" + i4,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
}
else {
const err34 = {instancePath:instancePath+"/documented_harms",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data.necessity !== undefined){
let data14 = data.necessity;
if(!((((data14 === "supported") || (data14 === "partly_supported")) || (data14 === "unsupported")) || (data14 === "unknown"))){
const err35 = {instancePath:instancePath+"/necessity",schemaPath:"#/properties/necessity/enum",keyword:"enum",params:{allowedValues: schema106.properties.necessity.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.proportionality !== undefined){
let data15 = data.proportionality;
if(!((((data15 === "proportionate") || (data15 === "mixed")) || (data15 === "disproportionate")) || (data15 === "unknown"))){
const err36 = {instancePath:instancePath+"/proportionality",schemaPath:"#/properties/proportionality/enum",keyword:"enum",params:{allowedValues: schema106.properties.proportionality.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.dependency_created !== undefined){
if(typeof data.dependency_created !== "string"){
const err37 = {instancePath:instancePath+"/dependency_created",schemaPath:"#/properties/dependency_created/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data.consent !== undefined){
if(typeof data.consent !== "string"){
const err38 = {instancePath:instancePath+"/consent",schemaPath:"#/properties/consent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.exit !== undefined){
if(typeof data.exit !== "string"){
const err39 = {instancePath:instancePath+"/exit",schemaPath:"#/properties/exit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data.contestability !== undefined){
if(typeof data.contestability !== "string"){
const err40 = {instancePath:instancePath+"/contestability",schemaPath:"#/properties/contestability/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data.confidence !== undefined){
let data20 = data.confidence;
if(!(((data20 === "high") || (data20 === "medium")) || (data20 === "low"))){
const err41 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
}
else {
const err42 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
validate57.errors = vErrors;
return errors === 0;
}
validate57.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema113 = {"type":"object","additionalProperties":false,"required":["status","criteria","counter_evidence","legitimate_benefits","conclusion","confidence"],"properties":{"status":{"enum":["no_capture","limited_capture","mixed_capture","substantial_capture","undetermined"]},"criteria":{"type":"array","minItems":13,"maxItems":13,"items":{"$ref":"#/$defs/captureCriterion"}},"counter_evidence":{"$ref":"#/$defs/nonEmptyStringArray"},"legitimate_benefits":{"$ref":"#/$defs/stringArray"},"conclusion":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};
const schema114 = {"type":"object","additionalProperties":false,"required":["criterion","status","evidence_ids","reason"],"properties":{"criterion":{"enum":["knowledge_deficit","consent_failure","vulnerability_exploitation","unequal_distribution","disproportionate_power_or_profit","dependency_or_costly_exit","alternatives_suppressed","behavior_optimized_without_oversight","choice_architecture_constraint","data_repurposing","human_capacity_commercialized","classification_not_contestable","environmental_unavoidability"]},"status":{"enum":["present","absent","uncertain","not_applicable"]},"evidence_ids":{"$ref":"#/$defs/stringArray"},"reason":{"type":"string"}}};

function validate60(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate60.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.criterion === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "criterion"},message:"must have required property '"+"criterion"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.status === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.evidence_ids === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_ids"},message:"must have required property '"+"evidence_ids"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.reason === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "reason"},message:"must have required property '"+"reason"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
for(const key0 in data){
if(!((((key0 === "criterion") || (key0 === "status")) || (key0 === "evidence_ids")) || (key0 === "reason"))){
const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.criterion !== undefined){
let data0 = data.criterion;
if(!(((((((((((((data0 === "knowledge_deficit") || (data0 === "consent_failure")) || (data0 === "vulnerability_exploitation")) || (data0 === "unequal_distribution")) || (data0 === "disproportionate_power_or_profit")) || (data0 === "dependency_or_costly_exit")) || (data0 === "alternatives_suppressed")) || (data0 === "behavior_optimized_without_oversight")) || (data0 === "choice_architecture_constraint")) || (data0 === "data_repurposing")) || (data0 === "human_capacity_commercialized")) || (data0 === "classification_not_contestable")) || (data0 === "environmental_unavoidability"))){
const err5 = {instancePath:instancePath+"/criterion",schemaPath:"#/properties/criterion/enum",keyword:"enum",params:{allowedValues: schema114.properties.criterion.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.status !== undefined){
let data1 = data.status;
if(!((((data1 === "present") || (data1 === "absent")) || (data1 === "uncertain")) || (data1 === "not_applicable"))){
const err6 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema114.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.evidence_ids !== undefined){
let data2 = data.evidence_ids;
if(Array.isArray(data2)){
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
if(typeof data2[i0] !== "string"){
const err7 = {instancePath:instancePath+"/evidence_ids/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
else {
const err8 = {instancePath:instancePath+"/evidence_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.reason !== undefined){
if(typeof data.reason !== "string"){
const err9 = {instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
validate60.errors = vErrors;
return errors === 0;
}
validate60.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate59(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate59.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.status === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.criteria === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "criteria"},message:"must have required property '"+"criteria"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.counter_evidence === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "counter_evidence"},message:"must have required property '"+"counter_evidence"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.legitimate_benefits === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "legitimate_benefits"},message:"must have required property '"+"legitimate_benefits"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.conclusion === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "conclusion"},message:"must have required property '"+"conclusion"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.confidence === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "status") || (key0 === "criteria")) || (key0 === "counter_evidence")) || (key0 === "legitimate_benefits")) || (key0 === "conclusion")) || (key0 === "confidence"))){
const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.status !== undefined){
let data0 = data.status;
if(!(((((data0 === "no_capture") || (data0 === "limited_capture")) || (data0 === "mixed_capture")) || (data0 === "substantial_capture")) || (data0 === "undetermined"))){
const err7 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema113.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.criteria !== undefined){
let data1 = data.criteria;
if(Array.isArray(data1)){
if(data1.length > 13){
const err8 = {instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/maxItems",keyword:"maxItems",params:{limit: 13},message:"must NOT have more than 13 items"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data1.length < 13){
const err9 = {instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/minItems",keyword:"minItems",params:{limit: 13},message:"must NOT have fewer than 13 items"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
if(!(validate60(data1[i0], {instancePath:instancePath+"/criteria/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate60.errors : vErrors.concat(validate60.errors);
errors = vErrors.length;
}
}
}
else {
const err10 = {instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.counter_evidence !== undefined){
let data3 = data.counter_evidence;
if(Array.isArray(data3)){
if(data3.length < 1){
const err11 = {instancePath:instancePath+"/counter_evidence",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
const len1 = data3.length;
for(let i1=0; i1<len1; i1++){
let data4 = data3[i1];
if(typeof data4 === "string"){
if(func2(data4) < 1){
const err12 = {instancePath:instancePath+"/counter_evidence/" + i1,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/counter_evidence/" + i1,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath:instancePath+"/counter_evidence",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.legitimate_benefits !== undefined){
let data5 = data.legitimate_benefits;
if(Array.isArray(data5)){
const len2 = data5.length;
for(let i2=0; i2<len2; i2++){
if(typeof data5[i2] !== "string"){
const err15 = {instancePath:instancePath+"/legitimate_benefits/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath:instancePath+"/legitimate_benefits",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.conclusion !== undefined){
if(typeof data.conclusion !== "string"){
const err17 = {instancePath:instancePath+"/conclusion",schemaPath:"#/properties/conclusion/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.confidence !== undefined){
let data8 = data.confidence;
if(!(((data8 === "high") || (data8 === "medium")) || (data8 === "low"))){
const err18 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
validate59.errors = vErrors;
return errors === 0;
}
validate59.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema119 = {"type":"object","additionalProperties":false,"required":["id","care_claim","control_effects","interpretation","severity","confidence"],"properties":{"id":{"type":"string"},"care_claim":{"type":"string"},"control_effects":{"$ref":"#/$defs/nonEmptyStringArray"},"interpretation":{"type":"string"},"severity":{"type":"number","minimum":0,"maximum":5},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate63(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate63.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.care_claim === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "care_claim"},message:"must have required property '"+"care_claim"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.control_effects === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "control_effects"},message:"must have required property '"+"control_effects"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.interpretation === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "interpretation"},message:"must have required property '"+"interpretation"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.severity === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "severity"},message:"must have required property '"+"severity"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.confidence === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "care_claim")) || (key0 === "control_effects")) || (key0 === "interpretation")) || (key0 === "severity")) || (key0 === "confidence"))){
const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.care_claim !== undefined){
if(typeof data.care_claim !== "string"){
const err8 = {instancePath:instancePath+"/care_claim",schemaPath:"#/properties/care_claim/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.control_effects !== undefined){
let data2 = data.control_effects;
if(Array.isArray(data2)){
if(data2.length < 1){
const err9 = {instancePath:instancePath+"/control_effects",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
if(typeof data3 === "string"){
if(func2(data3) < 1){
const err10 = {instancePath:instancePath+"/control_effects/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/control_effects/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
else {
const err12 = {instancePath:instancePath+"/control_effects",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.interpretation !== undefined){
if(typeof data.interpretation !== "string"){
const err13 = {instancePath:instancePath+"/interpretation",schemaPath:"#/properties/interpretation/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.severity !== undefined){
let data5 = data.severity;
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 5 || isNaN(data5)){
const err14 = {instancePath:instancePath+"/severity",schemaPath:"#/properties/severity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data5 < 0 || isNaN(data5)){
const err15 = {instancePath:instancePath+"/severity",schemaPath:"#/properties/severity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/severity",schemaPath:"#/properties/severity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.confidence !== undefined){
let data6 = data.confidence;
if(!(((data6 === "high") || (data6 === "medium")) || (data6 === "low"))){
const err17 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
validate63.errors = vErrors;
return errors === 0;
}
validate63.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema122 = {"type":"object","additionalProperties":false,"required":["scales","immediate_effects","medium_term_adaptations","intergenerational_effects","historical_continuities","path_dependencies","future_feedback_loops"],"properties":{"scales":{"$ref":"#/$defs/nonEmptyStringArray"},"immediate_effects":{"$ref":"#/$defs/nonEmptyStringArray"},"medium_term_adaptations":{"$ref":"#/$defs/stringArray"},"intergenerational_effects":{"$ref":"#/$defs/stringArray"},"historical_continuities":{"$ref":"#/$defs/stringArray"},"path_dependencies":{"$ref":"#/$defs/stringArray"},"future_feedback_loops":{"type":"array","items":{"$ref":"#/$defs/futureLoop"}}}};
const schema129 = {"type":"object","additionalProperties":false,"required":["id","name","timeframe","drivers","early_signals","falsified_if","rationale","probability"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"timeframe":{"type":"string"},"drivers":{"$ref":"#/$defs/stringArray"},"early_signals":{"$ref":"#/$defs/stringArray"},"falsified_if":{"$ref":"#/$defs/nonEmptyStringArray"},"rationale":{"type":"string"},"probability":{"type":"number","minimum":0,"maximum":100}}};

function validate66(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate66.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.timeframe === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "timeframe"},message:"must have required property '"+"timeframe"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.drivers === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "drivers"},message:"must have required property '"+"drivers"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.early_signals === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "early_signals"},message:"must have required property '"+"early_signals"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.falsified_if === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "falsified_if"},message:"must have required property '"+"falsified_if"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.rationale === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rationale"},message:"must have required property '"+"rationale"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.probability === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "probability"},message:"must have required property '"+"probability"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key0 in data){
if(!((((((((key0 === "id") || (key0 === "name")) || (key0 === "timeframe")) || (key0 === "drivers")) || (key0 === "early_signals")) || (key0 === "falsified_if")) || (key0 === "rationale")) || (key0 === "probability"))){
const err8 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err9 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err10 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.timeframe !== undefined){
if(typeof data.timeframe !== "string"){
const err11 = {instancePath:instancePath+"/timeframe",schemaPath:"#/properties/timeframe/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.drivers !== undefined){
let data3 = data.drivers;
if(Array.isArray(data3)){
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
if(typeof data3[i0] !== "string"){
const err12 = {instancePath:instancePath+"/drivers/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath:instancePath+"/drivers",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.early_signals !== undefined){
let data5 = data.early_signals;
if(Array.isArray(data5)){
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
if(typeof data5[i1] !== "string"){
const err14 = {instancePath:instancePath+"/early_signals/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath:instancePath+"/early_signals",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.falsified_if !== undefined){
let data7 = data.falsified_if;
if(Array.isArray(data7)){
if(data7.length < 1){
const err16 = {instancePath:instancePath+"/falsified_if",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
const len2 = data7.length;
for(let i2=0; i2<len2; i2++){
let data8 = data7[i2];
if(typeof data8 === "string"){
if(func2(data8) < 1){
const err17 = {instancePath:instancePath+"/falsified_if/" + i2,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/falsified_if/" + i2,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath:instancePath+"/falsified_if",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.rationale !== undefined){
if(typeof data.rationale !== "string"){
const err20 = {instancePath:instancePath+"/rationale",schemaPath:"#/properties/rationale/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.probability !== undefined){
let data10 = data.probability;
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 100 || isNaN(data10)){
const err21 = {instancePath:instancePath+"/probability",schemaPath:"#/properties/probability/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data10 < 0 || isNaN(data10)){
const err22 = {instancePath:instancePath+"/probability",schemaPath:"#/properties/probability/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/probability",schemaPath:"#/properties/probability/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
validate66.errors = vErrors;
return errors === 0;
}
validate66.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate65(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate65.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.scales === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scales"},message:"must have required property '"+"scales"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.immediate_effects === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "immediate_effects"},message:"must have required property '"+"immediate_effects"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.medium_term_adaptations === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "medium_term_adaptations"},message:"must have required property '"+"medium_term_adaptations"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.intergenerational_effects === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "intergenerational_effects"},message:"must have required property '"+"intergenerational_effects"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.historical_continuities === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "historical_continuities"},message:"must have required property '"+"historical_continuities"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.path_dependencies === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "path_dependencies"},message:"must have required property '"+"path_dependencies"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.future_feedback_loops === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "future_feedback_loops"},message:"must have required property '"+"future_feedback_loops"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "scales") || (key0 === "immediate_effects")) || (key0 === "medium_term_adaptations")) || (key0 === "intergenerational_effects")) || (key0 === "historical_continuities")) || (key0 === "path_dependencies")) || (key0 === "future_feedback_loops"))){
const err7 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.scales !== undefined){
let data0 = data.scales;
if(Array.isArray(data0)){
if(data0.length < 1){
const err8 = {instancePath:instancePath+"/scales",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(typeof data1 === "string"){
if(func2(data1) < 1){
const err9 = {instancePath:instancePath+"/scales/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/scales/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath:instancePath+"/scales",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.immediate_effects !== undefined){
let data2 = data.immediate_effects;
if(Array.isArray(data2)){
if(data2.length < 1){
const err12 = {instancePath:instancePath+"/immediate_effects",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
const len1 = data2.length;
for(let i1=0; i1<len1; i1++){
let data3 = data2[i1];
if(typeof data3 === "string"){
if(func2(data3) < 1){
const err13 = {instancePath:instancePath+"/immediate_effects/" + i1,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/immediate_effects/" + i1,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath:instancePath+"/immediate_effects",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.medium_term_adaptations !== undefined){
let data4 = data.medium_term_adaptations;
if(Array.isArray(data4)){
const len2 = data4.length;
for(let i2=0; i2<len2; i2++){
if(typeof data4[i2] !== "string"){
const err16 = {instancePath:instancePath+"/medium_term_adaptations/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
else {
const err17 = {instancePath:instancePath+"/medium_term_adaptations",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.intergenerational_effects !== undefined){
let data6 = data.intergenerational_effects;
if(Array.isArray(data6)){
const len3 = data6.length;
for(let i3=0; i3<len3; i3++){
if(typeof data6[i3] !== "string"){
const err18 = {instancePath:instancePath+"/intergenerational_effects/" + i3,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath:instancePath+"/intergenerational_effects",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.historical_continuities !== undefined){
let data8 = data.historical_continuities;
if(Array.isArray(data8)){
const len4 = data8.length;
for(let i4=0; i4<len4; i4++){
if(typeof data8[i4] !== "string"){
const err20 = {instancePath:instancePath+"/historical_continuities/" + i4,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
else {
const err21 = {instancePath:instancePath+"/historical_continuities",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.path_dependencies !== undefined){
let data10 = data.path_dependencies;
if(Array.isArray(data10)){
const len5 = data10.length;
for(let i5=0; i5<len5; i5++){
if(typeof data10[i5] !== "string"){
const err22 = {instancePath:instancePath+"/path_dependencies/" + i5,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
else {
const err23 = {instancePath:instancePath+"/path_dependencies",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.future_feedback_loops !== undefined){
let data12 = data.future_feedback_loops;
if(Array.isArray(data12)){
const len6 = data12.length;
for(let i6=0; i6<len6; i6++){
if(!(validate66(data12[i6], {instancePath:instancePath+"/future_feedback_loops/" + i6,parentData:data12,parentDataProperty:i6,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate66.errors : vErrors.concat(validate66.errors);
errors = vErrors.length;
}
}
}
else {
const err24 = {instancePath:instancePath+"/future_feedback_loops",schemaPath:"#/properties/future_feedback_loops/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
validate65.errors = vErrors;
return errors === 0;
}
validate65.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema133 = {"type":"object","additionalProperties":false,"required":["id","population_id","benefits","burdens","protection","opportunity","recognition","profit","voice","risk","surveillance","discipline","displacement","illness_injury_death","axes","scale","time_horizon","outcome_character","confidence"],"properties":{"id":{"type":"string"},"population_id":{"type":"string"},"benefits":{"$ref":"#/$defs/stringArray"},"burdens":{"$ref":"#/$defs/stringArray"},"protection":{"$ref":"#/$defs/stringArray"},"opportunity":{"$ref":"#/$defs/stringArray"},"recognition":{"$ref":"#/$defs/stringArray"},"profit":{"$ref":"#/$defs/stringArray"},"voice":{"$ref":"#/$defs/stringArray"},"risk":{"$ref":"#/$defs/stringArray"},"surveillance":{"$ref":"#/$defs/stringArray"},"discipline":{"$ref":"#/$defs/stringArray"},"displacement":{"$ref":"#/$defs/stringArray"},"illness_injury_death":{"$ref":"#/$defs/stringArray"},"axes":{"$ref":"#/$defs/stringArray"},"scale":{"$ref":"#/$defs/stringArray"},"time_horizon":{"type":"string"},"outcome_character":{"enum":["intended","tolerated","concealed","unforeseen","uncertain"]},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate69(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate69.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.population_id === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "population_id"},message:"must have required property '"+"population_id"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.benefits === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "benefits"},message:"must have required property '"+"benefits"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.burdens === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "burdens"},message:"must have required property '"+"burdens"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.protection === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "protection"},message:"must have required property '"+"protection"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.opportunity === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "opportunity"},message:"must have required property '"+"opportunity"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.recognition === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "recognition"},message:"must have required property '"+"recognition"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.profit === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "profit"},message:"must have required property '"+"profit"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.voice === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "voice"},message:"must have required property '"+"voice"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.risk === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "risk"},message:"must have required property '"+"risk"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.surveillance === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "surveillance"},message:"must have required property '"+"surveillance"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.discipline === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "discipline"},message:"must have required property '"+"discipline"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.displacement === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "displacement"},message:"must have required property '"+"displacement"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.illness_injury_death === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "illness_injury_death"},message:"must have required property '"+"illness_injury_death"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.axes === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "axes"},message:"must have required property '"+"axes"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.scale === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.time_horizon === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "time_horizon"},message:"must have required property '"+"time_horizon"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.outcome_character === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "outcome_character"},message:"must have required property '"+"outcome_character"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.confidence === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema133.properties, key0))){
const err19 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err20 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.population_id !== undefined){
if(typeof data.population_id !== "string"){
const err21 = {instancePath:instancePath+"/population_id",schemaPath:"#/properties/population_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.benefits !== undefined){
let data2 = data.benefits;
if(Array.isArray(data2)){
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
if(typeof data2[i0] !== "string"){
const err22 = {instancePath:instancePath+"/benefits/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
else {
const err23 = {instancePath:instancePath+"/benefits",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.burdens !== undefined){
let data4 = data.burdens;
if(Array.isArray(data4)){
const len1 = data4.length;
for(let i1=0; i1<len1; i1++){
if(typeof data4[i1] !== "string"){
const err24 = {instancePath:instancePath+"/burdens/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath:instancePath+"/burdens",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.protection !== undefined){
let data6 = data.protection;
if(Array.isArray(data6)){
const len2 = data6.length;
for(let i2=0; i2<len2; i2++){
if(typeof data6[i2] !== "string"){
const err26 = {instancePath:instancePath+"/protection/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
}
else {
const err27 = {instancePath:instancePath+"/protection",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.opportunity !== undefined){
let data8 = data.opportunity;
if(Array.isArray(data8)){
const len3 = data8.length;
for(let i3=0; i3<len3; i3++){
if(typeof data8[i3] !== "string"){
const err28 = {instancePath:instancePath+"/opportunity/" + i3,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
else {
const err29 = {instancePath:instancePath+"/opportunity",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.recognition !== undefined){
let data10 = data.recognition;
if(Array.isArray(data10)){
const len4 = data10.length;
for(let i4=0; i4<len4; i4++){
if(typeof data10[i4] !== "string"){
const err30 = {instancePath:instancePath+"/recognition/" + i4,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
else {
const err31 = {instancePath:instancePath+"/recognition",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.profit !== undefined){
let data12 = data.profit;
if(Array.isArray(data12)){
const len5 = data12.length;
for(let i5=0; i5<len5; i5++){
if(typeof data12[i5] !== "string"){
const err32 = {instancePath:instancePath+"/profit/" + i5,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
}
else {
const err33 = {instancePath:instancePath+"/profit",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.voice !== undefined){
let data14 = data.voice;
if(Array.isArray(data14)){
const len6 = data14.length;
for(let i6=0; i6<len6; i6++){
if(typeof data14[i6] !== "string"){
const err34 = {instancePath:instancePath+"/voice/" + i6,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
}
else {
const err35 = {instancePath:instancePath+"/voice",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.risk !== undefined){
let data16 = data.risk;
if(Array.isArray(data16)){
const len7 = data16.length;
for(let i7=0; i7<len7; i7++){
if(typeof data16[i7] !== "string"){
const err36 = {instancePath:instancePath+"/risk/" + i7,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
}
else {
const err37 = {instancePath:instancePath+"/risk",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data.surveillance !== undefined){
let data18 = data.surveillance;
if(Array.isArray(data18)){
const len8 = data18.length;
for(let i8=0; i8<len8; i8++){
if(typeof data18[i8] !== "string"){
const err38 = {instancePath:instancePath+"/surveillance/" + i8,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
}
else {
const err39 = {instancePath:instancePath+"/surveillance",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data.discipline !== undefined){
let data20 = data.discipline;
if(Array.isArray(data20)){
const len9 = data20.length;
for(let i9=0; i9<len9; i9++){
if(typeof data20[i9] !== "string"){
const err40 = {instancePath:instancePath+"/discipline/" + i9,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
}
else {
const err41 = {instancePath:instancePath+"/discipline",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.displacement !== undefined){
let data22 = data.displacement;
if(Array.isArray(data22)){
const len10 = data22.length;
for(let i10=0; i10<len10; i10++){
if(typeof data22[i10] !== "string"){
const err42 = {instancePath:instancePath+"/displacement/" + i10,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
}
else {
const err43 = {instancePath:instancePath+"/displacement",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data.illness_injury_death !== undefined){
let data24 = data.illness_injury_death;
if(Array.isArray(data24)){
const len11 = data24.length;
for(let i11=0; i11<len11; i11++){
if(typeof data24[i11] !== "string"){
const err44 = {instancePath:instancePath+"/illness_injury_death/" + i11,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
}
else {
const err45 = {instancePath:instancePath+"/illness_injury_death",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data.axes !== undefined){
let data26 = data.axes;
if(Array.isArray(data26)){
const len12 = data26.length;
for(let i12=0; i12<len12; i12++){
if(typeof data26[i12] !== "string"){
const err46 = {instancePath:instancePath+"/axes/" + i12,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
else {
const err47 = {instancePath:instancePath+"/axes",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data.scale !== undefined){
let data28 = data.scale;
if(Array.isArray(data28)){
const len13 = data28.length;
for(let i13=0; i13<len13; i13++){
if(typeof data28[i13] !== "string"){
const err48 = {instancePath:instancePath+"/scale/" + i13,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
}
else {
const err49 = {instancePath:instancePath+"/scale",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data.time_horizon !== undefined){
if(typeof data.time_horizon !== "string"){
const err50 = {instancePath:instancePath+"/time_horizon",schemaPath:"#/properties/time_horizon/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data.outcome_character !== undefined){
let data31 = data.outcome_character;
if(!(((((data31 === "intended") || (data31 === "tolerated")) || (data31 === "concealed")) || (data31 === "unforeseen")) || (data31 === "uncertain"))){
const err51 = {instancePath:instancePath+"/outcome_character",schemaPath:"#/properties/outcome_character/enum",keyword:"enum",params:{allowedValues: schema133.properties.outcome_character.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data.confidence !== undefined){
let data32 = data.confidence;
if(!(((data32 === "high") || (data32 === "medium")) || (data32 === "low"))){
const err52 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
}
else {
const err53 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
validate69.errors = vErrors;
return errors === 0;
}
validate69.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema149 = {"type":"object","additionalProperties":false,"required":["axis","mechanism","affected_groups","evidence_ids","confidence"],"properties":{"axis":{"enum":["class","race","gender","disability","age","citizenship","other"]},"mechanism":{"type":"string"},"affected_groups":{"$ref":"#/$defs/stringArray"},"evidence_ids":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate71(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate71.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.axis === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "axis"},message:"must have required property '"+"axis"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.mechanism === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanism"},message:"must have required property '"+"mechanism"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.affected_groups === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "affected_groups"},message:"must have required property '"+"affected_groups"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.evidence_ids === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_ids"},message:"must have required property '"+"evidence_ids"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.confidence === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "axis") || (key0 === "mechanism")) || (key0 === "affected_groups")) || (key0 === "evidence_ids")) || (key0 === "confidence"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.axis !== undefined){
let data0 = data.axis;
if(!(((((((data0 === "class") || (data0 === "race")) || (data0 === "gender")) || (data0 === "disability")) || (data0 === "age")) || (data0 === "citizenship")) || (data0 === "other"))){
const err6 = {instancePath:instancePath+"/axis",schemaPath:"#/properties/axis/enum",keyword:"enum",params:{allowedValues: schema149.properties.axis.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.mechanism !== undefined){
if(typeof data.mechanism !== "string"){
const err7 = {instancePath:instancePath+"/mechanism",schemaPath:"#/properties/mechanism/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.affected_groups !== undefined){
let data2 = data.affected_groups;
if(Array.isArray(data2)){
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
if(typeof data2[i0] !== "string"){
const err8 = {instancePath:instancePath+"/affected_groups/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
else {
const err9 = {instancePath:instancePath+"/affected_groups",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.evidence_ids !== undefined){
let data4 = data.evidence_ids;
if(Array.isArray(data4)){
const len1 = data4.length;
for(let i1=0; i1<len1; i1++){
if(typeof data4[i1] !== "string"){
const err10 = {instancePath:instancePath+"/evidence_ids/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath:instancePath+"/evidence_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.confidence !== undefined){
let data6 = data.confidence;
if(!(((data6 === "high") || (data6 === "medium")) || (data6 === "low"))){
const err12 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
validate71.errors = vErrors;
return errors === 0;
}
validate71.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema153 = {"type":"object","additionalProperties":false,"required":["id","population_id","exposure","causal_character","visibility","protection_gap","confidence"],"properties":{"id":{"type":"string"},"population_id":{"type":"string"},"exposure":{"type":"string"},"causal_character":{"enum":["deliberate","reckless_indifference","structural_exposure","administrative_failure","unintended_harm","uncertain"]},"visibility":{"type":"string"},"protection_gap":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate73(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate73.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.population_id === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "population_id"},message:"must have required property '"+"population_id"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.exposure === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "exposure"},message:"must have required property '"+"exposure"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.causal_character === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "causal_character"},message:"must have required property '"+"causal_character"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.visibility === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "visibility"},message:"must have required property '"+"visibility"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.protection_gap === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "protection_gap"},message:"must have required property '"+"protection_gap"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.confidence === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "population_id")) || (key0 === "exposure")) || (key0 === "causal_character")) || (key0 === "visibility")) || (key0 === "protection_gap")) || (key0 === "confidence"))){
const err7 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err8 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.population_id !== undefined){
if(typeof data.population_id !== "string"){
const err9 = {instancePath:instancePath+"/population_id",schemaPath:"#/properties/population_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.exposure !== undefined){
if(typeof data.exposure !== "string"){
const err10 = {instancePath:instancePath+"/exposure",schemaPath:"#/properties/exposure/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.causal_character !== undefined){
let data3 = data.causal_character;
if(!((((((data3 === "deliberate") || (data3 === "reckless_indifference")) || (data3 === "structural_exposure")) || (data3 === "administrative_failure")) || (data3 === "unintended_harm")) || (data3 === "uncertain"))){
const err11 = {instancePath:instancePath+"/causal_character",schemaPath:"#/properties/causal_character/enum",keyword:"enum",params:{allowedValues: schema153.properties.causal_character.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.visibility !== undefined){
if(typeof data.visibility !== "string"){
const err12 = {instancePath:instancePath+"/visibility",schemaPath:"#/properties/visibility/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.protection_gap !== undefined){
if(typeof data.protection_gap !== "string"){
const err13 = {instancePath:instancePath+"/protection_gap",schemaPath:"#/properties/protection_gap/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.confidence !== undefined){
let data6 = data.confidence;
if(!(((data6 === "high") || (data6 === "medium")) || (data6 === "low"))){
const err14 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
validate73.errors = vErrors;
return errors === 0;
}
validate73.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema155 = {"type":"object","additionalProperties":false,"required":["consent_status","informed","specific","revocable","comprehensible","materially_voluntary","exit_conditions","contestability","accountability"],"properties":{"consent_status":{"enum":["valid","partial","invalid","not_applicable","unknown"]},"informed":{"enum":["yes","partial","no","unknown"]},"specific":{"enum":["yes","partial","no","unknown"]},"revocable":{"enum":["yes","partial","no","unknown"]},"comprehensible":{"enum":["yes","partial","no","unknown"]},"materially_voluntary":{"enum":["yes","partial","no","unknown"]},"exit_conditions":{"$ref":"#/$defs/stringArray"},"contestability":{"$ref":"#/$defs/stringArray"},"accountability":{"$ref":"#/$defs/stringArray"}}};

function validate75(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate75.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.consent_status === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "consent_status"},message:"must have required property '"+"consent_status"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.informed === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "informed"},message:"must have required property '"+"informed"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.specific === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "specific"},message:"must have required property '"+"specific"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.revocable === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "revocable"},message:"must have required property '"+"revocable"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.comprehensible === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "comprehensible"},message:"must have required property '"+"comprehensible"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.materially_voluntary === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "materially_voluntary"},message:"must have required property '"+"materially_voluntary"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.exit_conditions === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "exit_conditions"},message:"must have required property '"+"exit_conditions"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.contestability === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "contestability"},message:"must have required property '"+"contestability"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.accountability === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "accountability"},message:"must have required property '"+"accountability"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema155.properties, key0))){
const err9 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.consent_status !== undefined){
let data0 = data.consent_status;
if(!(((((data0 === "valid") || (data0 === "partial")) || (data0 === "invalid")) || (data0 === "not_applicable")) || (data0 === "unknown"))){
const err10 = {instancePath:instancePath+"/consent_status",schemaPath:"#/properties/consent_status/enum",keyword:"enum",params:{allowedValues: schema155.properties.consent_status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.informed !== undefined){
let data1 = data.informed;
if(!((((data1 === "yes") || (data1 === "partial")) || (data1 === "no")) || (data1 === "unknown"))){
const err11 = {instancePath:instancePath+"/informed",schemaPath:"#/properties/informed/enum",keyword:"enum",params:{allowedValues: schema155.properties.informed.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.specific !== undefined){
let data2 = data.specific;
if(!((((data2 === "yes") || (data2 === "partial")) || (data2 === "no")) || (data2 === "unknown"))){
const err12 = {instancePath:instancePath+"/specific",schemaPath:"#/properties/specific/enum",keyword:"enum",params:{allowedValues: schema155.properties.specific.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.revocable !== undefined){
let data3 = data.revocable;
if(!((((data3 === "yes") || (data3 === "partial")) || (data3 === "no")) || (data3 === "unknown"))){
const err13 = {instancePath:instancePath+"/revocable",schemaPath:"#/properties/revocable/enum",keyword:"enum",params:{allowedValues: schema155.properties.revocable.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.comprehensible !== undefined){
let data4 = data.comprehensible;
if(!((((data4 === "yes") || (data4 === "partial")) || (data4 === "no")) || (data4 === "unknown"))){
const err14 = {instancePath:instancePath+"/comprehensible",schemaPath:"#/properties/comprehensible/enum",keyword:"enum",params:{allowedValues: schema155.properties.comprehensible.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.materially_voluntary !== undefined){
let data5 = data.materially_voluntary;
if(!((((data5 === "yes") || (data5 === "partial")) || (data5 === "no")) || (data5 === "unknown"))){
const err15 = {instancePath:instancePath+"/materially_voluntary",schemaPath:"#/properties/materially_voluntary/enum",keyword:"enum",params:{allowedValues: schema155.properties.materially_voluntary.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.exit_conditions !== undefined){
let data6 = data.exit_conditions;
if(Array.isArray(data6)){
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
if(typeof data6[i0] !== "string"){
const err16 = {instancePath:instancePath+"/exit_conditions/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
else {
const err17 = {instancePath:instancePath+"/exit_conditions",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.contestability !== undefined){
let data8 = data.contestability;
if(Array.isArray(data8)){
const len1 = data8.length;
for(let i1=0; i1<len1; i1++){
if(typeof data8[i1] !== "string"){
const err18 = {instancePath:instancePath+"/contestability/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath:instancePath+"/contestability",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.accountability !== undefined){
let data10 = data.accountability;
if(Array.isArray(data10)){
const len2 = data10.length;
for(let i2=0; i2<len2; i2++){
if(typeof data10[i2] !== "string"){
const err20 = {instancePath:instancePath+"/accountability/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
else {
const err21 = {instancePath:instancePath+"/accountability",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
validate75.errors = vErrors;
return errors === 0;
}
validate75.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema159 = {"type":"object","additionalProperties":false,"required":["id","type","relevance","evidentiary_status","claim","mechanism","supporting_evidence_ids","counter_evidence_ids","falsified_if","confidence"],"properties":{"id":{"type":"string"},"type":{"enum":["official","public_interest","political_economy","institutional_inertia","security","cultural","technological","critical_biopolitical","actor_error_unintended_consequence"]},"relevance":{"enum":["relevant","not_relevant","uncertain"]},"evidentiary_status":{"enum":["supported","plausible","disputed","unsupported","not_assessed"]},"claim":{"type":"string"},"mechanism":{"type":"string"},"supporting_evidence_ids":{"$ref":"#/$defs/stringArray"},"counter_evidence_ids":{"$ref":"#/$defs/stringArray"},"falsified_if":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate77(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate77.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.type === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.relevance === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "relevance"},message:"must have required property '"+"relevance"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.evidentiary_status === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidentiary_status"},message:"must have required property '"+"evidentiary_status"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.claim === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "claim"},message:"must have required property '"+"claim"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.mechanism === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanism"},message:"must have required property '"+"mechanism"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.supporting_evidence_ids === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "supporting_evidence_ids"},message:"must have required property '"+"supporting_evidence_ids"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.counter_evidence_ids === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "counter_evidence_ids"},message:"must have required property '"+"counter_evidence_ids"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.falsified_if === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "falsified_if"},message:"must have required property '"+"falsified_if"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.confidence === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema159.properties, key0))){
const err10 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err11 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.type !== undefined){
let data1 = data.type;
if(!(((((((((data1 === "official") || (data1 === "public_interest")) || (data1 === "political_economy")) || (data1 === "institutional_inertia")) || (data1 === "security")) || (data1 === "cultural")) || (data1 === "technological")) || (data1 === "critical_biopolitical")) || (data1 === "actor_error_unintended_consequence"))){
const err12 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema159.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.relevance !== undefined){
let data2 = data.relevance;
if(!(((data2 === "relevant") || (data2 === "not_relevant")) || (data2 === "uncertain"))){
const err13 = {instancePath:instancePath+"/relevance",schemaPath:"#/properties/relevance/enum",keyword:"enum",params:{allowedValues: schema159.properties.relevance.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.evidentiary_status !== undefined){
let data3 = data.evidentiary_status;
if(!(((((data3 === "supported") || (data3 === "plausible")) || (data3 === "disputed")) || (data3 === "unsupported")) || (data3 === "not_assessed"))){
const err14 = {instancePath:instancePath+"/evidentiary_status",schemaPath:"#/properties/evidentiary_status/enum",keyword:"enum",params:{allowedValues: schema159.properties.evidentiary_status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.claim !== undefined){
if(typeof data.claim !== "string"){
const err15 = {instancePath:instancePath+"/claim",schemaPath:"#/properties/claim/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.mechanism !== undefined){
if(typeof data.mechanism !== "string"){
const err16 = {instancePath:instancePath+"/mechanism",schemaPath:"#/properties/mechanism/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.supporting_evidence_ids !== undefined){
let data6 = data.supporting_evidence_ids;
if(Array.isArray(data6)){
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
if(typeof data6[i0] !== "string"){
const err17 = {instancePath:instancePath+"/supporting_evidence_ids/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath:instancePath+"/supporting_evidence_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.counter_evidence_ids !== undefined){
let data8 = data.counter_evidence_ids;
if(Array.isArray(data8)){
const len1 = data8.length;
for(let i1=0; i1<len1; i1++){
if(typeof data8[i1] !== "string"){
const err19 = {instancePath:instancePath+"/counter_evidence_ids/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
else {
const err20 = {instancePath:instancePath+"/counter_evidence_ids",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.falsified_if !== undefined){
let data10 = data.falsified_if;
if(Array.isArray(data10)){
const len2 = data10.length;
for(let i2=0; i2<len2; i2++){
if(typeof data10[i2] !== "string"){
const err21 = {instancePath:instancePath+"/falsified_if/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath:instancePath+"/falsified_if",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.confidence !== undefined){
let data12 = data.confidence;
if(!(((data12 === "high") || (data12 === "medium")) || (data12 === "low"))){
const err23 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
validate77.errors = vErrors;
return errors === 0;
}
validate77.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema164 = {"type":"object","additionalProperties":false,"required":["id","claim","epistemic_type","source_tier","source_title","source_url","source_locator","source_date","geography","population","measurement_method","denominator","sample_size","measurement_validity","causal_identification","replication_status","conflicts_of_interest","missing_data","selection_effects","relevant_comparison","cross_context_applicability","claim_source_fit","verification_status","verified_by","verification_date","uncertainty","limitations","counter_evidence","confidence"],"properties":{"id":{"type":"string"},"claim":{"type":"string"},"epistemic_type":{"enum":["verified_fact","quantitative_estimate","institutional_claim","scholarly_interpretation","political_narrative","legal_classification","ethical_judgment","plausible_inference","speculation","unsupported_allegation"]},"source_tier":{"enum":["primary_legal_policy","official_dataset","systematic_review_meta_analysis","individual_peer_reviewed_study","historical_archive","investigative_reporting","reputable_organization_report","expert_commentary","first_person_testimony","social_media_discourse"]},"source_title":{"type":"string"},"source_url":{"type":"string"},"source_locator":{"type":"string"},"source_date":{"type":"string"},"geography":{"type":"string"},"population":{"type":"string"},"measurement_method":{"type":"string"},"denominator":{"type":"string"},"sample_size":{"type":"string"},"measurement_validity":{"type":"string"},"causal_identification":{"type":"string"},"replication_status":{"enum":["replicated","partly_replicated","not_replicated","not_applicable","unknown"]},"conflicts_of_interest":{"type":"string"},"missing_data":{"type":"string"},"selection_effects":{"type":"string"},"relevant_comparison":{"type":"string"},"cross_context_applicability":{"type":"string"},"claim_source_fit":{"enum":["direct","indirect","context_only","mismatched","unknown"]},"verification_status":{"enum":["verified","partially_verified","unverified","disputed"]},"verified_by":{"type":"string"},"verification_date":{"type":"string"},"uncertainty":{"type":"string","minLength":1},"limitations":{"type":"string","minLength":1},"counter_evidence":{"type":"string","minLength":1},"confidence":{"$ref":"#/$defs/confidence"}},"allOf":[{"if":{"properties":{"verification_status":{"const":"verified"}},"required":["verification_status"]},"then":{"properties":{"source_title":{"type":"string","minLength":1},"source_date":{"type":"string","minLength":1},"verified_by":{"type":"string","minLength":1},"verification_date":{"type":"string","minLength":1}},"anyOf":[{"properties":{"source_url":{"type":"string","minLength":1}},"required":["source_url"]},{"properties":{"source_locator":{"type":"string","minLength":1}},"required":["source_locator"]}]}}]};

function validate79(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate79.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.verification_status === undefined) && (missing0 = "verification_status")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.verification_status !== undefined){
if("verified" !== data.verification_status){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs5 = errors;
const _errs6 = errors;
let valid3 = false;
const _errs7 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.source_url === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/0/then/anyOf/0/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.source_url !== undefined){
let data1 = data.source_url;
if(typeof data1 === "string"){
if(func2(data1) < 1){
const err3 = {instancePath:instancePath+"/source_url",schemaPath:"#/allOf/0/then/anyOf/0/properties/source_url/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/source_url",schemaPath:"#/allOf/0/then/anyOf/0/properties/source_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
var _valid1 = _errs7 === errors;
valid3 = valid3 || _valid1;
if(_valid1){
var props0 = {};
props0.source_url = true;
}
const _errs10 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.source_locator === undefined){
const err5 = {instancePath,schemaPath:"#/allOf/0/then/anyOf/1/required",keyword:"required",params:{missingProperty: "source_locator"},message:"must have required property '"+"source_locator"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.source_locator !== undefined){
let data2 = data.source_locator;
if(typeof data2 === "string"){
if(func2(data2) < 1){
const err6 = {instancePath:instancePath+"/source_locator",schemaPath:"#/allOf/0/then/anyOf/1/properties/source_locator/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/source_locator",schemaPath:"#/allOf/0/then/anyOf/1/properties/source_locator/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
var _valid1 = _errs10 === errors;
valid3 = valid3 || _valid1;
if(_valid1){
if(props0 !== true){
props0 = props0 || {};
props0.source_locator = true;
}
}
if(!valid3){
const err8 = {instancePath,schemaPath:"#/allOf/0/then/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(props0 !== true){
props0 = props0 || {};
props0.source_title = true;
props0.source_date = true;
props0.verified_by = true;
props0.verification_date = true;
}
if(data.source_title !== undefined){
let data3 = data.source_title;
if(typeof data3 === "string"){
if(func2(data3) < 1){
const err9 = {instancePath:instancePath+"/source_title",schemaPath:"#/allOf/0/then/properties/source_title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/source_title",schemaPath:"#/allOf/0/then/properties/source_title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.source_date !== undefined){
let data4 = data.source_date;
if(typeof data4 === "string"){
if(func2(data4) < 1){
const err11 = {instancePath:instancePath+"/source_date",schemaPath:"#/allOf/0/then/properties/source_date/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/source_date",schemaPath:"#/allOf/0/then/properties/source_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.verified_by !== undefined){
let data5 = data.verified_by;
if(typeof data5 === "string"){
if(func2(data5) < 1){
const err13 = {instancePath:instancePath+"/verified_by",schemaPath:"#/allOf/0/then/properties/verified_by/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/verified_by",schemaPath:"#/allOf/0/then/properties/verified_by/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.verification_date !== undefined){
let data6 = data.verification_date;
if(typeof data6 === "string"){
if(func2(data6) < 1){
const err15 = {instancePath:instancePath+"/verification_date",schemaPath:"#/allOf/0/then/properties/verification_date/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/verification_date",schemaPath:"#/allOf/0/then/properties/verification_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
var _valid0 = _errs5 === errors;
valid1 = _valid0;
if(valid1){
if(props0 !== true){
props0 = props0 || {};
props0.verification_status = true;
}
}
}
if(!valid1){
const err17 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data.claim === undefined){
const err19 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "claim"},message:"must have required property '"+"claim"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data.epistemic_type === undefined){
const err20 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "epistemic_type"},message:"must have required property '"+"epistemic_type"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data.source_tier === undefined){
const err21 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_tier"},message:"must have required property '"+"source_tier"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data.source_title === undefined){
const err22 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_title"},message:"must have required property '"+"source_title"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data.source_url === undefined){
const err23 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data.source_locator === undefined){
const err24 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_locator"},message:"must have required property '"+"source_locator"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data.source_date === undefined){
const err25 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_date"},message:"must have required property '"+"source_date"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data.geography === undefined){
const err26 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "geography"},message:"must have required property '"+"geography"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data.population === undefined){
const err27 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "population"},message:"must have required property '"+"population"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data.measurement_method === undefined){
const err28 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "measurement_method"},message:"must have required property '"+"measurement_method"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data.denominator === undefined){
const err29 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "denominator"},message:"must have required property '"+"denominator"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data.sample_size === undefined){
const err30 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sample_size"},message:"must have required property '"+"sample_size"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data.measurement_validity === undefined){
const err31 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "measurement_validity"},message:"must have required property '"+"measurement_validity"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data.causal_identification === undefined){
const err32 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "causal_identification"},message:"must have required property '"+"causal_identification"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data.replication_status === undefined){
const err33 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "replication_status"},message:"must have required property '"+"replication_status"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data.conflicts_of_interest === undefined){
const err34 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "conflicts_of_interest"},message:"must have required property '"+"conflicts_of_interest"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data.missing_data === undefined){
const err35 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "missing_data"},message:"must have required property '"+"missing_data"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data.selection_effects === undefined){
const err36 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "selection_effects"},message:"must have required property '"+"selection_effects"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data.relevant_comparison === undefined){
const err37 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "relevant_comparison"},message:"must have required property '"+"relevant_comparison"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data.cross_context_applicability === undefined){
const err38 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "cross_context_applicability"},message:"must have required property '"+"cross_context_applicability"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data.claim_source_fit === undefined){
const err39 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "claim_source_fit"},message:"must have required property '"+"claim_source_fit"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data.verification_status === undefined){
const err40 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "verification_status"},message:"must have required property '"+"verification_status"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data.verified_by === undefined){
const err41 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "verified_by"},message:"must have required property '"+"verified_by"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data.verification_date === undefined){
const err42 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "verification_date"},message:"must have required property '"+"verification_date"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data.uncertainty === undefined){
const err43 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data.limitations === undefined){
const err44 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data.counter_evidence === undefined){
const err45 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "counter_evidence"},message:"must have required property '"+"counter_evidence"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data.confidence === undefined){
const err46 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema164.properties, key0))){
const err47 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err48 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data.claim !== undefined){
if(typeof data.claim !== "string"){
const err49 = {instancePath:instancePath+"/claim",schemaPath:"#/properties/claim/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data.epistemic_type !== undefined){
let data9 = data.epistemic_type;
if(!((((((((((data9 === "verified_fact") || (data9 === "quantitative_estimate")) || (data9 === "institutional_claim")) || (data9 === "scholarly_interpretation")) || (data9 === "political_narrative")) || (data9 === "legal_classification")) || (data9 === "ethical_judgment")) || (data9 === "plausible_inference")) || (data9 === "speculation")) || (data9 === "unsupported_allegation"))){
const err50 = {instancePath:instancePath+"/epistemic_type",schemaPath:"#/properties/epistemic_type/enum",keyword:"enum",params:{allowedValues: schema164.properties.epistemic_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data.source_tier !== undefined){
let data10 = data.source_tier;
if(!((((((((((data10 === "primary_legal_policy") || (data10 === "official_dataset")) || (data10 === "systematic_review_meta_analysis")) || (data10 === "individual_peer_reviewed_study")) || (data10 === "historical_archive")) || (data10 === "investigative_reporting")) || (data10 === "reputable_organization_report")) || (data10 === "expert_commentary")) || (data10 === "first_person_testimony")) || (data10 === "social_media_discourse"))){
const err51 = {instancePath:instancePath+"/source_tier",schemaPath:"#/properties/source_tier/enum",keyword:"enum",params:{allowedValues: schema164.properties.source_tier.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data.source_title !== undefined){
if(typeof data.source_title !== "string"){
const err52 = {instancePath:instancePath+"/source_title",schemaPath:"#/properties/source_title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data.source_url !== undefined){
if(typeof data.source_url !== "string"){
const err53 = {instancePath:instancePath+"/source_url",schemaPath:"#/properties/source_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data.source_locator !== undefined){
if(typeof data.source_locator !== "string"){
const err54 = {instancePath:instancePath+"/source_locator",schemaPath:"#/properties/source_locator/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data.source_date !== undefined){
if(typeof data.source_date !== "string"){
const err55 = {instancePath:instancePath+"/source_date",schemaPath:"#/properties/source_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data.geography !== undefined){
if(typeof data.geography !== "string"){
const err56 = {instancePath:instancePath+"/geography",schemaPath:"#/properties/geography/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data.population !== undefined){
if(typeof data.population !== "string"){
const err57 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data.measurement_method !== undefined){
if(typeof data.measurement_method !== "string"){
const err58 = {instancePath:instancePath+"/measurement_method",schemaPath:"#/properties/measurement_method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data.denominator !== undefined){
if(typeof data.denominator !== "string"){
const err59 = {instancePath:instancePath+"/denominator",schemaPath:"#/properties/denominator/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data.sample_size !== undefined){
if(typeof data.sample_size !== "string"){
const err60 = {instancePath:instancePath+"/sample_size",schemaPath:"#/properties/sample_size/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data.measurement_validity !== undefined){
if(typeof data.measurement_validity !== "string"){
const err61 = {instancePath:instancePath+"/measurement_validity",schemaPath:"#/properties/measurement_validity/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data.causal_identification !== undefined){
if(typeof data.causal_identification !== "string"){
const err62 = {instancePath:instancePath+"/causal_identification",schemaPath:"#/properties/causal_identification/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data.replication_status !== undefined){
let data22 = data.replication_status;
if(!(((((data22 === "replicated") || (data22 === "partly_replicated")) || (data22 === "not_replicated")) || (data22 === "not_applicable")) || (data22 === "unknown"))){
const err63 = {instancePath:instancePath+"/replication_status",schemaPath:"#/properties/replication_status/enum",keyword:"enum",params:{allowedValues: schema164.properties.replication_status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data.conflicts_of_interest !== undefined){
if(typeof data.conflicts_of_interest !== "string"){
const err64 = {instancePath:instancePath+"/conflicts_of_interest",schemaPath:"#/properties/conflicts_of_interest/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data.missing_data !== undefined){
if(typeof data.missing_data !== "string"){
const err65 = {instancePath:instancePath+"/missing_data",schemaPath:"#/properties/missing_data/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data.selection_effects !== undefined){
if(typeof data.selection_effects !== "string"){
const err66 = {instancePath:instancePath+"/selection_effects",schemaPath:"#/properties/selection_effects/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data.relevant_comparison !== undefined){
if(typeof data.relevant_comparison !== "string"){
const err67 = {instancePath:instancePath+"/relevant_comparison",schemaPath:"#/properties/relevant_comparison/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
if(data.cross_context_applicability !== undefined){
if(typeof data.cross_context_applicability !== "string"){
const err68 = {instancePath:instancePath+"/cross_context_applicability",schemaPath:"#/properties/cross_context_applicability/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data.claim_source_fit !== undefined){
let data28 = data.claim_source_fit;
if(!(((((data28 === "direct") || (data28 === "indirect")) || (data28 === "context_only")) || (data28 === "mismatched")) || (data28 === "unknown"))){
const err69 = {instancePath:instancePath+"/claim_source_fit",schemaPath:"#/properties/claim_source_fit/enum",keyword:"enum",params:{allowedValues: schema164.properties.claim_source_fit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data.verification_status !== undefined){
let data29 = data.verification_status;
if(!((((data29 === "verified") || (data29 === "partially_verified")) || (data29 === "unverified")) || (data29 === "disputed"))){
const err70 = {instancePath:instancePath+"/verification_status",schemaPath:"#/properties/verification_status/enum",keyword:"enum",params:{allowedValues: schema164.properties.verification_status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data.verified_by !== undefined){
if(typeof data.verified_by !== "string"){
const err71 = {instancePath:instancePath+"/verified_by",schemaPath:"#/properties/verified_by/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data.verification_date !== undefined){
if(typeof data.verification_date !== "string"){
const err72 = {instancePath:instancePath+"/verification_date",schemaPath:"#/properties/verification_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
if(data.uncertainty !== undefined){
let data32 = data.uncertainty;
if(typeof data32 === "string"){
if(func2(data32) < 1){
const err73 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
else {
const err74 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data.limitations !== undefined){
let data33 = data.limitations;
if(typeof data33 === "string"){
if(func2(data33) < 1){
const err75 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
else {
const err76 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data.counter_evidence !== undefined){
let data34 = data.counter_evidence;
if(typeof data34 === "string"){
if(func2(data34) < 1){
const err77 = {instancePath:instancePath+"/counter_evidence",schemaPath:"#/properties/counter_evidence/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/counter_evidence",schemaPath:"#/properties/counter_evidence/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data.confidence !== undefined){
let data35 = data.confidence;
if(!(((data35 === "high") || (data35 === "medium")) || (data35 === "low"))){
const err79 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
}
else {
const err80 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
validate79.errors = vErrors;
return errors === 0;
}
validate79.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema166 = {"type":"object","additionalProperties":false,"required":["id","assumption","risk","disproving_test","implication_if_wrong","confidence"],"properties":{"id":{"type":"string"},"assumption":{"type":"string"},"risk":{"enum":["low","medium","high"]},"disproving_test":{"type":"string"},"implication_if_wrong":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate81(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate81.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.assumption === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assumption"},message:"must have required property '"+"assumption"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.risk === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "risk"},message:"must have required property '"+"risk"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.disproving_test === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "disproving_test"},message:"must have required property '"+"disproving_test"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.implication_if_wrong === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "implication_if_wrong"},message:"must have required property '"+"implication_if_wrong"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.confidence === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "assumption")) || (key0 === "risk")) || (key0 === "disproving_test")) || (key0 === "implication_if_wrong")) || (key0 === "confidence"))){
const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.assumption !== undefined){
if(typeof data.assumption !== "string"){
const err8 = {instancePath:instancePath+"/assumption",schemaPath:"#/properties/assumption/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.risk !== undefined){
let data2 = data.risk;
if(!(((data2 === "low") || (data2 === "medium")) || (data2 === "high"))){
const err9 = {instancePath:instancePath+"/risk",schemaPath:"#/properties/risk/enum",keyword:"enum",params:{allowedValues: schema166.properties.risk.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.disproving_test !== undefined){
if(typeof data.disproving_test !== "string"){
const err10 = {instancePath:instancePath+"/disproving_test",schemaPath:"#/properties/disproving_test/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.implication_if_wrong !== undefined){
if(typeof data.implication_if_wrong !== "string"){
const err11 = {instancePath:instancePath+"/implication_if_wrong",schemaPath:"#/properties/implication_if_wrong/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.confidence !== undefined){
let data5 = data.confidence;
if(!(((data5 === "high") || (data5 === "medium")) || (data5 === "low"))){
const err12 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
validate81.errors = vErrors;
return errors === 0;
}
validate81.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema168 = {"type":"object","additionalProperties":false,"required":["id","actor_or_population","form","mechanism","effect_on_system","constraints","confidence"],"properties":{"id":{"type":"string"},"actor_or_population":{"type":"string"},"form":{"enum":["refusal","protest","evasion","mutual_aid","counterknowledge","litigation","unionization","artistic_intervention","technological_adaptation","alternative_institution","other"]},"mechanism":{"type":"string"},"effect_on_system":{"type":"string"},"constraints":{"$ref":"#/$defs/stringArray"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate83(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate83.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.actor_or_population === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "actor_or_population"},message:"must have required property '"+"actor_or_population"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.form === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "form"},message:"must have required property '"+"form"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.mechanism === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanism"},message:"must have required property '"+"mechanism"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.effect_on_system === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "effect_on_system"},message:"must have required property '"+"effect_on_system"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.constraints === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "constraints"},message:"must have required property '"+"constraints"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.confidence === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "actor_or_population")) || (key0 === "form")) || (key0 === "mechanism")) || (key0 === "effect_on_system")) || (key0 === "constraints")) || (key0 === "confidence"))){
const err7 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err8 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.actor_or_population !== undefined){
if(typeof data.actor_or_population !== "string"){
const err9 = {instancePath:instancePath+"/actor_or_population",schemaPath:"#/properties/actor_or_population/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.form !== undefined){
let data2 = data.form;
if(!(((((((((((data2 === "refusal") || (data2 === "protest")) || (data2 === "evasion")) || (data2 === "mutual_aid")) || (data2 === "counterknowledge")) || (data2 === "litigation")) || (data2 === "unionization")) || (data2 === "artistic_intervention")) || (data2 === "technological_adaptation")) || (data2 === "alternative_institution")) || (data2 === "other"))){
const err10 = {instancePath:instancePath+"/form",schemaPath:"#/properties/form/enum",keyword:"enum",params:{allowedValues: schema168.properties.form.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.mechanism !== undefined){
if(typeof data.mechanism !== "string"){
const err11 = {instancePath:instancePath+"/mechanism",schemaPath:"#/properties/mechanism/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.effect_on_system !== undefined){
if(typeof data.effect_on_system !== "string"){
const err12 = {instancePath:instancePath+"/effect_on_system",schemaPath:"#/properties/effect_on_system/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.constraints !== undefined){
let data5 = data.constraints;
if(Array.isArray(data5)){
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
if(typeof data5[i0] !== "string"){
const err13 = {instancePath:instancePath+"/constraints/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath:instancePath+"/constraints",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.confidence !== undefined){
let data7 = data.confidence;
if(!(((data7 === "high") || (data7 === "medium")) || (data7 === "low"))){
const err15 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
validate83.errors = vErrors;
return errors === 0;
}
validate83.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema171 = {"type":"object","additionalProperties":false,"required":["id","level","proposal","mechanism","feasibility","tradeoffs","rights_safeguards","evidence_needed","lower_harm_rationale"],"properties":{"id":{"type":"string"},"level":{"enum":["individual","community","institutional","national","transnational"]},"proposal":{"type":"string"},"mechanism":{"type":"string"},"feasibility":{"enum":["high","medium","low"]},"tradeoffs":{"$ref":"#/$defs/stringArray"},"rights_safeguards":{"$ref":"#/$defs/nonEmptyStringArray"},"evidence_needed":{"$ref":"#/$defs/stringArray"},"lower_harm_rationale":{"type":"string"}}};

function validate85(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate85.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.level === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "level"},message:"must have required property '"+"level"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.proposal === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "proposal"},message:"must have required property '"+"proposal"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.mechanism === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanism"},message:"must have required property '"+"mechanism"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.feasibility === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "feasibility"},message:"must have required property '"+"feasibility"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.tradeoffs === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "tradeoffs"},message:"must have required property '"+"tradeoffs"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.rights_safeguards === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rights_safeguards"},message:"must have required property '"+"rights_safeguards"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.evidence_needed === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_needed"},message:"must have required property '"+"evidence_needed"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.lower_harm_rationale === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "lower_harm_rationale"},message:"must have required property '"+"lower_harm_rationale"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema171.properties, key0))){
const err9 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.level !== undefined){
let data1 = data.level;
if(!(((((data1 === "individual") || (data1 === "community")) || (data1 === "institutional")) || (data1 === "national")) || (data1 === "transnational"))){
const err11 = {instancePath:instancePath+"/level",schemaPath:"#/properties/level/enum",keyword:"enum",params:{allowedValues: schema171.properties.level.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.proposal !== undefined){
if(typeof data.proposal !== "string"){
const err12 = {instancePath:instancePath+"/proposal",schemaPath:"#/properties/proposal/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.mechanism !== undefined){
if(typeof data.mechanism !== "string"){
const err13 = {instancePath:instancePath+"/mechanism",schemaPath:"#/properties/mechanism/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.feasibility !== undefined){
let data4 = data.feasibility;
if(!(((data4 === "high") || (data4 === "medium")) || (data4 === "low"))){
const err14 = {instancePath:instancePath+"/feasibility",schemaPath:"#/properties/feasibility/enum",keyword:"enum",params:{allowedValues: schema171.properties.feasibility.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.tradeoffs !== undefined){
let data5 = data.tradeoffs;
if(Array.isArray(data5)){
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
if(typeof data5[i0] !== "string"){
const err15 = {instancePath:instancePath+"/tradeoffs/" + i0,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath:instancePath+"/tradeoffs",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.rights_safeguards !== undefined){
let data7 = data.rights_safeguards;
if(Array.isArray(data7)){
if(data7.length < 1){
const err17 = {instancePath:instancePath+"/rights_safeguards",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
const len1 = data7.length;
for(let i1=0; i1<len1; i1++){
let data8 = data7[i1];
if(typeof data8 === "string"){
if(func2(data8) < 1){
const err18 = {instancePath:instancePath+"/rights_safeguards/" + i1,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/rights_safeguards/" + i1,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
else {
const err20 = {instancePath:instancePath+"/rights_safeguards",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.evidence_needed !== undefined){
let data9 = data.evidence_needed;
if(Array.isArray(data9)){
const len2 = data9.length;
for(let i2=0; i2<len2; i2++){
if(typeof data9[i2] !== "string"){
const err21 = {instancePath:instancePath+"/evidence_needed/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath:instancePath+"/evidence_needed",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.lower_harm_rationale !== undefined){
if(typeof data.lower_harm_rationale !== "string"){
const err23 = {instancePath:instancePath+"/lower_harm_rationale",schemaPath:"#/properties/lower_harm_rationale/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
validate85.errors = vErrors;
return errors === 0;
}
validate85.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema175 = {"type":"object","additionalProperties":false,"required":["strongly_supported","plausible_unconfirmed","disputed","unknown","evidence_that_would_change","overall_confidence"],"properties":{"strongly_supported":{"$ref":"#/$defs/nonEmptyStringArray"},"plausible_unconfirmed":{"$ref":"#/$defs/stringArray"},"disputed":{"$ref":"#/$defs/stringArray"},"unknown":{"$ref":"#/$defs/nonEmptyStringArray"},"evidence_that_would_change":{"$ref":"#/$defs/nonEmptyStringArray"},"overall_confidence":{"$ref":"#/$defs/confidence"}}};

function validate87(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate87.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.strongly_supported === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "strongly_supported"},message:"must have required property '"+"strongly_supported"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.plausible_unconfirmed === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "plausible_unconfirmed"},message:"must have required property '"+"plausible_unconfirmed"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.disputed === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "disputed"},message:"must have required property '"+"disputed"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.unknown === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "unknown"},message:"must have required property '"+"unknown"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.evidence_that_would_change === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_that_would_change"},message:"must have required property '"+"evidence_that_would_change"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.overall_confidence === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "overall_confidence"},message:"must have required property '"+"overall_confidence"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "strongly_supported") || (key0 === "plausible_unconfirmed")) || (key0 === "disputed")) || (key0 === "unknown")) || (key0 === "evidence_that_would_change")) || (key0 === "overall_confidence"))){
const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.strongly_supported !== undefined){
let data0 = data.strongly_supported;
if(Array.isArray(data0)){
if(data0.length < 1){
const err7 = {instancePath:instancePath+"/strongly_supported",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(typeof data1 === "string"){
if(func2(data1) < 1){
const err8 = {instancePath:instancePath+"/strongly_supported/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/strongly_supported/" + i0,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath:instancePath+"/strongly_supported",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.plausible_unconfirmed !== undefined){
let data2 = data.plausible_unconfirmed;
if(Array.isArray(data2)){
const len1 = data2.length;
for(let i1=0; i1<len1; i1++){
if(typeof data2[i1] !== "string"){
const err11 = {instancePath:instancePath+"/plausible_unconfirmed/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
else {
const err12 = {instancePath:instancePath+"/plausible_unconfirmed",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.disputed !== undefined){
let data4 = data.disputed;
if(Array.isArray(data4)){
const len2 = data4.length;
for(let i2=0; i2<len2; i2++){
if(typeof data4[i2] !== "string"){
const err13 = {instancePath:instancePath+"/disputed/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath:instancePath+"/disputed",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.unknown !== undefined){
let data6 = data.unknown;
if(Array.isArray(data6)){
if(data6.length < 1){
const err15 = {instancePath:instancePath+"/unknown",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
const len3 = data6.length;
for(let i3=0; i3<len3; i3++){
let data7 = data6[i3];
if(typeof data7 === "string"){
if(func2(data7) < 1){
const err16 = {instancePath:instancePath+"/unknown/" + i3,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/unknown/" + i3,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath:instancePath+"/unknown",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.evidence_that_would_change !== undefined){
let data8 = data.evidence_that_would_change;
if(Array.isArray(data8)){
if(data8.length < 1){
const err19 = {instancePath:instancePath+"/evidence_that_would_change",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
const len4 = data8.length;
for(let i4=0; i4<len4; i4++){
let data9 = data8[i4];
if(typeof data9 === "string"){
if(func2(data9) < 1){
const err20 = {instancePath:instancePath+"/evidence_that_would_change/" + i4,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/evidence_that_would_change/" + i4,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath:instancePath+"/evidence_that_would_change",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.overall_confidence !== undefined){
let data10 = data.overall_confidence;
if(!(((data10 === "high") || (data10 === "medium")) || (data10 === "low"))){
const err23 = {instancePath:instancePath+"/overall_confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
validate87.errors = vErrors;
return errors === 0;
}
validate87.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema182 = {"type":"object","additionalProperties":false,"required":["malicious_intent_without_evidence","institutional_claims_uncritically","metaphor_as_mechanism","human_function_identified","mechanism_explained","care_control_overlap","material_and_meaning","history_included","political_economy_included","inequality_dimensions","agency_resistance","competing_explanations","statistics_quotations_verified","uncertainty_stated","benefits_costs_identified","realistic_alternatives","stigmatization_risk_checked","falsifier_identified"],"properties":{"malicious_intent_without_evidence":{"$ref":"#/$defs/auditStatus"},"institutional_claims_uncritically":{"$ref":"#/$defs/auditStatus"},"metaphor_as_mechanism":{"$ref":"#/$defs/auditStatus"},"human_function_identified":{"$ref":"#/$defs/auditStatus"},"mechanism_explained":{"$ref":"#/$defs/auditStatus"},"care_control_overlap":{"$ref":"#/$defs/auditStatus"},"material_and_meaning":{"$ref":"#/$defs/auditStatus"},"history_included":{"$ref":"#/$defs/auditStatus"},"political_economy_included":{"$ref":"#/$defs/auditStatus"},"inequality_dimensions":{"$ref":"#/$defs/auditStatus"},"agency_resistance":{"$ref":"#/$defs/auditStatus"},"competing_explanations":{"$ref":"#/$defs/auditStatus"},"statistics_quotations_verified":{"$ref":"#/$defs/auditStatus"},"uncertainty_stated":{"$ref":"#/$defs/auditStatus"},"benefits_costs_identified":{"$ref":"#/$defs/auditStatus"},"realistic_alternatives":{"$ref":"#/$defs/auditStatus"},"stigmatization_risk_checked":{"$ref":"#/$defs/auditStatus"},"falsifier_identified":{"$ref":"#/$defs/auditStatus"}}};
const schema183 = {"enum":["pass","concern","not_applicable"]};

function validate89(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate89.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.malicious_intent_without_evidence === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "malicious_intent_without_evidence"},message:"must have required property '"+"malicious_intent_without_evidence"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.institutional_claims_uncritically === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "institutional_claims_uncritically"},message:"must have required property '"+"institutional_claims_uncritically"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.metaphor_as_mechanism === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "metaphor_as_mechanism"},message:"must have required property '"+"metaphor_as_mechanism"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.human_function_identified === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "human_function_identified"},message:"must have required property '"+"human_function_identified"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.mechanism_explained === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanism_explained"},message:"must have required property '"+"mechanism_explained"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.care_control_overlap === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "care_control_overlap"},message:"must have required property '"+"care_control_overlap"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.material_and_meaning === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "material_and_meaning"},message:"must have required property '"+"material_and_meaning"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.history_included === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "history_included"},message:"must have required property '"+"history_included"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.political_economy_included === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "political_economy_included"},message:"must have required property '"+"political_economy_included"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.inequality_dimensions === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "inequality_dimensions"},message:"must have required property '"+"inequality_dimensions"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.agency_resistance === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "agency_resistance"},message:"must have required property '"+"agency_resistance"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.competing_explanations === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "competing_explanations"},message:"must have required property '"+"competing_explanations"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.statistics_quotations_verified === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "statistics_quotations_verified"},message:"must have required property '"+"statistics_quotations_verified"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.uncertainty_stated === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "uncertainty_stated"},message:"must have required property '"+"uncertainty_stated"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.benefits_costs_identified === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "benefits_costs_identified"},message:"must have required property '"+"benefits_costs_identified"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.realistic_alternatives === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "realistic_alternatives"},message:"must have required property '"+"realistic_alternatives"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.stigmatization_risk_checked === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "stigmatization_risk_checked"},message:"must have required property '"+"stigmatization_risk_checked"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.falsifier_identified === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "falsifier_identified"},message:"must have required property '"+"falsifier_identified"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema182.properties, key0))){
const err18 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.malicious_intent_without_evidence !== undefined){
let data0 = data.malicious_intent_without_evidence;
if(!(((data0 === "pass") || (data0 === "concern")) || (data0 === "not_applicable"))){
const err19 = {instancePath:instancePath+"/malicious_intent_without_evidence",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.institutional_claims_uncritically !== undefined){
let data1 = data.institutional_claims_uncritically;
if(!(((data1 === "pass") || (data1 === "concern")) || (data1 === "not_applicable"))){
const err20 = {instancePath:instancePath+"/institutional_claims_uncritically",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.metaphor_as_mechanism !== undefined){
let data2 = data.metaphor_as_mechanism;
if(!(((data2 === "pass") || (data2 === "concern")) || (data2 === "not_applicable"))){
const err21 = {instancePath:instancePath+"/metaphor_as_mechanism",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.human_function_identified !== undefined){
let data3 = data.human_function_identified;
if(!(((data3 === "pass") || (data3 === "concern")) || (data3 === "not_applicable"))){
const err22 = {instancePath:instancePath+"/human_function_identified",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.mechanism_explained !== undefined){
let data4 = data.mechanism_explained;
if(!(((data4 === "pass") || (data4 === "concern")) || (data4 === "not_applicable"))){
const err23 = {instancePath:instancePath+"/mechanism_explained",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.care_control_overlap !== undefined){
let data5 = data.care_control_overlap;
if(!(((data5 === "pass") || (data5 === "concern")) || (data5 === "not_applicable"))){
const err24 = {instancePath:instancePath+"/care_control_overlap",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.material_and_meaning !== undefined){
let data6 = data.material_and_meaning;
if(!(((data6 === "pass") || (data6 === "concern")) || (data6 === "not_applicable"))){
const err25 = {instancePath:instancePath+"/material_and_meaning",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.history_included !== undefined){
let data7 = data.history_included;
if(!(((data7 === "pass") || (data7 === "concern")) || (data7 === "not_applicable"))){
const err26 = {instancePath:instancePath+"/history_included",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.political_economy_included !== undefined){
let data8 = data.political_economy_included;
if(!(((data8 === "pass") || (data8 === "concern")) || (data8 === "not_applicable"))){
const err27 = {instancePath:instancePath+"/political_economy_included",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.inequality_dimensions !== undefined){
let data9 = data.inequality_dimensions;
if(!(((data9 === "pass") || (data9 === "concern")) || (data9 === "not_applicable"))){
const err28 = {instancePath:instancePath+"/inequality_dimensions",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.agency_resistance !== undefined){
let data10 = data.agency_resistance;
if(!(((data10 === "pass") || (data10 === "concern")) || (data10 === "not_applicable"))){
const err29 = {instancePath:instancePath+"/agency_resistance",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.competing_explanations !== undefined){
let data11 = data.competing_explanations;
if(!(((data11 === "pass") || (data11 === "concern")) || (data11 === "not_applicable"))){
const err30 = {instancePath:instancePath+"/competing_explanations",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data.statistics_quotations_verified !== undefined){
let data12 = data.statistics_quotations_verified;
if(!(((data12 === "pass") || (data12 === "concern")) || (data12 === "not_applicable"))){
const err31 = {instancePath:instancePath+"/statistics_quotations_verified",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.uncertainty_stated !== undefined){
let data13 = data.uncertainty_stated;
if(!(((data13 === "pass") || (data13 === "concern")) || (data13 === "not_applicable"))){
const err32 = {instancePath:instancePath+"/uncertainty_stated",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.benefits_costs_identified !== undefined){
let data14 = data.benefits_costs_identified;
if(!(((data14 === "pass") || (data14 === "concern")) || (data14 === "not_applicable"))){
const err33 = {instancePath:instancePath+"/benefits_costs_identified",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.realistic_alternatives !== undefined){
let data15 = data.realistic_alternatives;
if(!(((data15 === "pass") || (data15 === "concern")) || (data15 === "not_applicable"))){
const err34 = {instancePath:instancePath+"/realistic_alternatives",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data.stigmatization_risk_checked !== undefined){
let data16 = data.stigmatization_risk_checked;
if(!(((data16 === "pass") || (data16 === "concern")) || (data16 === "not_applicable"))){
const err35 = {instancePath:instancePath+"/stigmatization_risk_checked",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.falsifier_identified !== undefined){
let data17 = data.falsifier_identified;
if(!(((data17 === "pass") || (data17 === "concern")) || (data17 === "not_applicable"))){
const err36 = {instancePath:instancePath+"/falsifier_identified",schemaPath:"#/$defs/auditStatus/enum",keyword:"enum",params:{allowedValues: schema183.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
}
else {
const err37 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
validate89.errors = vErrors;
return errors === 0;
}
validate89.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema202 = {"type":"object","additionalProperties":false,"required":["from","to","relation","mechanism","confidence"],"properties":{"from":{"type":"string"},"to":{"type":"string"},"relation":{"enum":["causes","enables","constrains","classifies","legitimizes","commodifies","distributes","exposes","resists","feeds_back","contradicts"]},"mechanism":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate91(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate91.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.from === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "from"},message:"must have required property '"+"from"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.to === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "to"},message:"must have required property '"+"to"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.relation === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "relation"},message:"must have required property '"+"relation"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.mechanism === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanism"},message:"must have required property '"+"mechanism"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.confidence === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "from") || (key0 === "to")) || (key0 === "relation")) || (key0 === "mechanism")) || (key0 === "confidence"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.from !== undefined){
if(typeof data.from !== "string"){
const err6 = {instancePath:instancePath+"/from",schemaPath:"#/properties/from/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.to !== undefined){
if(typeof data.to !== "string"){
const err7 = {instancePath:instancePath+"/to",schemaPath:"#/properties/to/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.relation !== undefined){
let data2 = data.relation;
if(!(((((((((((data2 === "causes") || (data2 === "enables")) || (data2 === "constrains")) || (data2 === "classifies")) || (data2 === "legitimizes")) || (data2 === "commodifies")) || (data2 === "distributes")) || (data2 === "exposes")) || (data2 === "resists")) || (data2 === "feeds_back")) || (data2 === "contradicts"))){
const err8 = {instancePath:instancePath+"/relation",schemaPath:"#/properties/relation/enum",keyword:"enum",params:{allowedValues: schema202.properties.relation.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.mechanism !== undefined){
if(typeof data.mechanism !== "string"){
const err9 = {instancePath:instancePath+"/mechanism",schemaPath:"#/properties/mechanism/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.confidence !== undefined){
let data4 = data.confidence;
if(!(((data4 === "high") || (data4 === "medium")) || (data4 === "low"))){
const err10 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema48.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
validate91.errors = vErrors;
return errors === 0;
}
validate91.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://jarbou3i.example/schema/biopolitical-analysis-v2.1.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate20.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.schema_version === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.analysis_contract === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "analysis_contract"},message:"must have required property '"+"analysis_contract"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.contract_status === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "contract_status"},message:"must have required property '"+"contract_status"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.analysis_id === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "analysis_id"},message:"must have required property '"+"analysis_id"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.generated_at === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "generated_at"},message:"must have required property '"+"generated_at"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.language === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "language"},message:"must have required property '"+"language"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.model_mode === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "model_mode"},message:"must have required property '"+"model_mode"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.analysis_lens === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "analysis_lens"},message:"must have required property '"+"analysis_lens"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.subject === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "subject"},message:"must have required property '"+"subject"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.framing === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "framing"},message:"must have required property '"+"framing"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.legal_framework === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "legal_framework"},message:"must have required property '"+"legal_framework"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.international_comparison === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "international_comparison"},message:"must have required property '"+"international_comparison"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.capture_levels === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "capture_levels"},message:"must have required property '"+"capture_levels"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.theoretical_comparison === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "theoretical_comparison"},message:"must have required property '"+"theoretical_comparison"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.human_functions === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "human_functions"},message:"must have required property '"+"human_functions"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.power_map === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "power_map"},message:"must have required property '"+"power_map"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.mechanisms === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mechanisms"},message:"must have required property '"+"mechanisms"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.meaning_systems === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "meaning_systems"},message:"must have required property '"+"meaning_systems"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.intervention_assessment === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "intervention_assessment"},message:"must have required property '"+"intervention_assessment"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data.scale_time === undefined){
const err19 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scale_time"},message:"must have required property '"+"scale_time"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data.distribution === undefined){
const err20 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "distribution"},message:"must have required property '"+"distribution"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data.consent_exit === undefined){
const err21 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "consent_exit"},message:"must have required property '"+"consent_exit"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data.competing_explanations === undefined){
const err22 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "competing_explanations"},message:"must have required property '"+"competing_explanations"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data.evidence === undefined){
const err23 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence"},message:"must have required property '"+"evidence"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data.assumptions === undefined){
const err24 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assumptions"},message:"must have required property '"+"assumptions"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data.resistance_agency === undefined){
const err25 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "resistance_agency"},message:"must have required property '"+"resistance_agency"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data.alternatives === undefined){
const err26 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "alternatives"},message:"must have required property '"+"alternatives"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data.calibrated_conclusion === undefined){
const err27 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "calibrated_conclusion"},message:"must have required property '"+"calibrated_conclusion"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data.self_audit === undefined){
const err28 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "self_audit"},message:"must have required property '"+"self_audit"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data.self_audit_notes === undefined){
const err29 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "self_audit_notes"},message:"must have required property '"+"self_audit_notes"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data.links === undefined){
const err30 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "links"},message:"must have required property '"+"links"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data.migration === undefined){
const err31 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "migration"},message:"must have required property '"+"migration"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema31.properties, key0))){
const err32 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("2.1.0" !== data.schema_version){
const err33 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "2.1.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.analysis_contract !== undefined){
if("biopolitical-training-map-v2" !== data.analysis_contract){
const err34 = {instancePath:instancePath+"/analysis_contract",schemaPath:"#/properties/analysis_contract/const",keyword:"const",params:{allowedValue: "biopolitical-training-map-v2"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data.contract_status !== undefined){
if("canonical" !== data.contract_status){
const err35 = {instancePath:instancePath+"/contract_status",schemaPath:"#/properties/contract_status/const",keyword:"const",params:{allowedValue: "canonical"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.analysis_id !== undefined){
let data3 = data.analysis_id;
if(typeof data3 === "string"){
if(func2(data3) < 1){
const err36 = {instancePath:instancePath+"/analysis_id",schemaPath:"#/properties/analysis_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/analysis_id",schemaPath:"#/properties/analysis_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data.generated_at !== undefined){
let data4 = data.generated_at;
if(typeof data4 === "string"){
if(func2(data4) < 1){
const err38 = {instancePath:instancePath+"/generated_at",schemaPath:"#/properties/generated_at/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
else {
const err39 = {instancePath:instancePath+"/generated_at",schemaPath:"#/properties/generated_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data.language !== undefined){
let data5 = data.language;
if(!(((data5 === "ar") || (data5 === "en")) || (data5 === "fr"))){
const err40 = {instancePath:instancePath+"/language",schemaPath:"#/properties/language/enum",keyword:"enum",params:{allowedValues: schema31.properties.language.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data.model_mode !== undefined){
let data6 = data.model_mode;
if(!((((data6 === "simple") || (data6 === "focused")) || (data6 === "expert")) || (data6 === "research"))){
const err41 = {instancePath:instancePath+"/model_mode",schemaPath:"#/properties/model_mode/enum",keyword:"enum",params:{allowedValues: schema31.properties.model_mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.analysis_lens !== undefined){
if("biopolitical" !== data.analysis_lens){
const err42 = {instancePath:instancePath+"/analysis_lens",schemaPath:"#/properties/analysis_lens/const",keyword:"const",params:{allowedValue: "biopolitical"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data.subject !== undefined){
let data8 = data.subject;
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
if(data8.title === undefined){
const err43 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data8.context === undefined){
const err44 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "context"},message:"must have required property '"+"context"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data8.research_question === undefined){
const err45 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "research_question"},message:"must have required property '"+"research_question"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data8.executive_finding === undefined){
const err46 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "executive_finding"},message:"must have required property '"+"executive_finding"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
for(const key1 in data8){
if(!((((key1 === "title") || (key1 === "context")) || (key1 === "research_question")) || (key1 === "executive_finding"))){
const err47 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data8.title !== undefined){
let data9 = data8.title;
if(typeof data9 === "string"){
if(func2(data9) < 1){
const err48 = {instancePath:instancePath+"/subject/title",schemaPath:"#/properties/subject/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
else {
const err49 = {instancePath:instancePath+"/subject/title",schemaPath:"#/properties/subject/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data8.context !== undefined){
if(typeof data8.context !== "string"){
const err50 = {instancePath:instancePath+"/subject/context",schemaPath:"#/properties/subject/properties/context/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data8.research_question !== undefined){
let data11 = data8.research_question;
if(typeof data11 === "string"){
if(func2(data11) < 1){
const err51 = {instancePath:instancePath+"/subject/research_question",schemaPath:"#/properties/subject/properties/research_question/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
else {
const err52 = {instancePath:instancePath+"/subject/research_question",schemaPath:"#/properties/subject/properties/research_question/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data8.executive_finding !== undefined){
let data12 = data8.executive_finding;
if(typeof data12 === "string"){
if(func2(data12) < 1){
const err53 = {instancePath:instancePath+"/subject/executive_finding",schemaPath:"#/properties/subject/properties/executive_finding/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/subject/executive_finding",schemaPath:"#/properties/subject/properties/executive_finding/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data.framing !== undefined){
let data13 = data.framing;
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.contested_terms === undefined){
const err56 = {instancePath:instancePath+"/framing",schemaPath:"#/properties/framing/required",keyword:"required",params:{missingProperty: "contested_terms"},message:"must have required property '"+"contested_terms"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data13.historical_context === undefined){
const err57 = {instancePath:instancePath+"/framing",schemaPath:"#/properties/framing/required",keyword:"required",params:{missingProperty: "historical_context"},message:"must have required property '"+"historical_context"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(data13.official_problem_definition === undefined){
const err58 = {instancePath:instancePath+"/framing",schemaPath:"#/properties/framing/required",keyword:"required",params:{missingProperty: "official_problem_definition"},message:"must have required property '"+"official_problem_definition"+"'"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(data13.critical_problem_definition === undefined){
const err59 = {instancePath:instancePath+"/framing",schemaPath:"#/properties/framing/required",keyword:"required",params:{missingProperty: "critical_problem_definition"},message:"must have required property '"+"critical_problem_definition"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data13.unknowns === undefined){
const err60 = {instancePath:instancePath+"/framing",schemaPath:"#/properties/framing/required",keyword:"required",params:{missingProperty: "unknowns"},message:"must have required property '"+"unknowns"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
for(const key2 in data13){
if(!(((((key2 === "contested_terms") || (key2 === "historical_context")) || (key2 === "official_problem_definition")) || (key2 === "critical_problem_definition")) || (key2 === "unknowns"))){
const err61 = {instancePath:instancePath+"/framing",schemaPath:"#/properties/framing/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data13.contested_terms !== undefined){
let data14 = data13.contested_terms;
if(Array.isArray(data14)){
if(data14.length < 1){
const err62 = {instancePath:instancePath+"/framing/contested_terms",schemaPath:"#/properties/framing/properties/contested_terms/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
const len0 = data14.length;
for(let i0=0; i0<len0; i0++){
if(!(validate21(data14[i0], {instancePath:instancePath+"/framing/contested_terms/" + i0,parentData:data14,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
errors = vErrors.length;
}
}
}
else {
const err63 = {instancePath:instancePath+"/framing/contested_terms",schemaPath:"#/properties/framing/properties/contested_terms/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data13.historical_context !== undefined){
let data16 = data13.historical_context;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.summary === undefined){
const err64 = {instancePath:instancePath+"/framing/historical_context",schemaPath:"#/properties/framing/properties/historical_context/required",keyword:"required",params:{missingProperty: "summary"},message:"must have required property '"+"summary"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data16.turning_points === undefined){
const err65 = {instancePath:instancePath+"/framing/historical_context",schemaPath:"#/properties/framing/properties/historical_context/required",keyword:"required",params:{missingProperty: "turning_points"},message:"must have required property '"+"turning_points"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data16.continuities === undefined){
const err66 = {instancePath:instancePath+"/framing/historical_context",schemaPath:"#/properties/framing/properties/historical_context/required",keyword:"required",params:{missingProperty: "continuities"},message:"must have required property '"+"continuities"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
for(const key3 in data16){
if(!(((key3 === "summary") || (key3 === "turning_points")) || (key3 === "continuities"))){
const err67 = {instancePath:instancePath+"/framing/historical_context",schemaPath:"#/properties/framing/properties/historical_context/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
if(data16.summary !== undefined){
let data17 = data16.summary;
if(typeof data17 === "string"){
if(func2(data17) < 1){
const err68 = {instancePath:instancePath+"/framing/historical_context/summary",schemaPath:"#/properties/framing/properties/historical_context/properties/summary/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
else {
const err69 = {instancePath:instancePath+"/framing/historical_context/summary",schemaPath:"#/properties/framing/properties/historical_context/properties/summary/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data16.turning_points !== undefined){
let data18 = data16.turning_points;
if(Array.isArray(data18)){
const len1 = data18.length;
for(let i1=0; i1<len1; i1++){
if(typeof data18[i1] !== "string"){
const err70 = {instancePath:instancePath+"/framing/historical_context/turning_points/" + i1,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath:instancePath+"/framing/historical_context/turning_points",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data16.continuities !== undefined){
let data20 = data16.continuities;
if(Array.isArray(data20)){
const len2 = data20.length;
for(let i2=0; i2<len2; i2++){
if(typeof data20[i2] !== "string"){
const err72 = {instancePath:instancePath+"/framing/historical_context/continuities/" + i2,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
}
else {
const err73 = {instancePath:instancePath+"/framing/historical_context/continuities",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
}
else {
const err74 = {instancePath:instancePath+"/framing/historical_context",schemaPath:"#/properties/framing/properties/historical_context/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data13.official_problem_definition !== undefined){
if(typeof data13.official_problem_definition !== "string"){
const err75 = {instancePath:instancePath+"/framing/official_problem_definition",schemaPath:"#/properties/framing/properties/official_problem_definition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data13.critical_problem_definition !== undefined){
if(typeof data13.critical_problem_definition !== "string"){
const err76 = {instancePath:instancePath+"/framing/critical_problem_definition",schemaPath:"#/properties/framing/properties/critical_problem_definition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data13.unknowns !== undefined){
let data24 = data13.unknowns;
if(Array.isArray(data24)){
if(data24.length < 1){
const err77 = {instancePath:instancePath+"/framing/unknowns",schemaPath:"#/$defs/nonEmptyStringArray/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
const len3 = data24.length;
for(let i3=0; i3<len3; i3++){
let data25 = data24[i3];
if(typeof data25 === "string"){
if(func2(data25) < 1){
const err78 = {instancePath:instancePath+"/framing/unknowns/" + i3,schemaPath:"#/$defs/nonEmptyStringArray/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
else {
const err79 = {instancePath:instancePath+"/framing/unknowns/" + i3,schemaPath:"#/$defs/nonEmptyStringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
}
else {
const err80 = {instancePath:instancePath+"/framing/unknowns",schemaPath:"#/$defs/nonEmptyStringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
}
else {
const err81 = {instancePath:instancePath+"/framing",schemaPath:"#/properties/framing/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data.legal_framework !== undefined){
if(!(validate23(data.legal_framework, {instancePath:instancePath+"/legal_framework",parentData:data,parentDataProperty:"legal_framework",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
if(data.international_comparison !== undefined){
let data27 = data.international_comparison;
if(Array.isArray(data27)){
const len4 = data27.length;
for(let i4=0; i4<len4; i4++){
if(!(validate25(data27[i4], {instancePath:instancePath+"/international_comparison/" + i4,parentData:data27,parentDataProperty:i4,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
}
}
else {
const err82 = {instancePath:instancePath+"/international_comparison",schemaPath:"#/properties/international_comparison/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data.capture_levels !== undefined){
let data29 = data.capture_levels;
if(Array.isArray(data29)){
if(data29.length > 5){
const err83 = {instancePath:instancePath+"/capture_levels",schemaPath:"#/properties/capture_levels/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
if(data29.length < 5){
const err84 = {instancePath:instancePath+"/capture_levels",schemaPath:"#/properties/capture_levels/minItems",keyword:"minItems",params:{limit: 5},message:"must NOT have fewer than 5 items"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
const len5 = data29.length;
for(let i5=0; i5<len5; i5++){
if(!(validate27(data29[i5], {instancePath:instancePath+"/capture_levels/" + i5,parentData:data29,parentDataProperty:i5,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
errors = vErrors.length;
}
}
}
else {
const err85 = {instancePath:instancePath+"/capture_levels",schemaPath:"#/properties/capture_levels/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data.theoretical_comparison !== undefined){
let data31 = data.theoretical_comparison;
if(Array.isArray(data31)){
const len6 = data31.length;
for(let i6=0; i6<len6; i6++){
if(!(validate29(data31[i6], {instancePath:instancePath+"/theoretical_comparison/" + i6,parentData:data31,parentDataProperty:i6,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
errors = vErrors.length;
}
}
}
else {
const err86 = {instancePath:instancePath+"/theoretical_comparison",schemaPath:"#/properties/theoretical_comparison/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data.human_functions !== undefined){
let data33 = data.human_functions;
if(Array.isArray(data33)){
if(data33.length < 1){
const err87 = {instancePath:instancePath+"/human_functions",schemaPath:"#/properties/human_functions/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
const len7 = data33.length;
for(let i7=0; i7<len7; i7++){
if(!(validate31(data33[i7], {instancePath:instancePath+"/human_functions/" + i7,parentData:data33,parentDataProperty:i7,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
errors = vErrors.length;
}
}
}
else {
const err88 = {instancePath:instancePath+"/human_functions",schemaPath:"#/properties/human_functions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data.power_map !== undefined){
let data35 = data.power_map;
if(data35 && typeof data35 == "object" && !Array.isArray(data35)){
if(data35.actors === undefined){
const err89 = {instancePath:instancePath+"/power_map",schemaPath:"#/properties/power_map/required",keyword:"required",params:{missingProperty: "actors"},message:"must have required property '"+"actors"+"'"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data35.affected_populations === undefined){
const err90 = {instancePath:instancePath+"/power_map",schemaPath:"#/properties/power_map/required",keyword:"required",params:{missingProperty: "affected_populations"},message:"must have required property '"+"affected_populations"+"'"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
if(data35.institutions === undefined){
const err91 = {instancePath:instancePath+"/power_map",schemaPath:"#/properties/power_map/required",keyword:"required",params:{missingProperty: "institutions"},message:"must have required property '"+"institutions"+"'"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data35.power_asymmetries === undefined){
const err92 = {instancePath:instancePath+"/power_map",schemaPath:"#/properties/power_map/required",keyword:"required",params:{missingProperty: "power_asymmetries"},message:"must have required property '"+"power_asymmetries"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
for(const key4 in data35){
if(!((((key4 === "actors") || (key4 === "affected_populations")) || (key4 === "institutions")) || (key4 === "power_asymmetries"))){
const err93 = {instancePath:instancePath+"/power_map",schemaPath:"#/properties/power_map/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
if(data35.actors !== undefined){
let data36 = data35.actors;
if(Array.isArray(data36)){
if(data36.length < 1){
const err94 = {instancePath:instancePath+"/power_map/actors",schemaPath:"#/properties/power_map/properties/actors/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
const len8 = data36.length;
for(let i8=0; i8<len8; i8++){
if(!(validate33(data36[i8], {instancePath:instancePath+"/power_map/actors/" + i8,parentData:data36,parentDataProperty:i8,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
}
}
else {
const err95 = {instancePath:instancePath+"/power_map/actors",schemaPath:"#/properties/power_map/properties/actors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data35.affected_populations !== undefined){
let data38 = data35.affected_populations;
if(Array.isArray(data38)){
if(data38.length < 1){
const err96 = {instancePath:instancePath+"/power_map/affected_populations",schemaPath:"#/properties/power_map/properties/affected_populations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
const len9 = data38.length;
for(let i9=0; i9<len9; i9++){
if(!(validate35(data38[i9], {instancePath:instancePath+"/power_map/affected_populations/" + i9,parentData:data38,parentDataProperty:i9,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate35.errors : vErrors.concat(validate35.errors);
errors = vErrors.length;
}
}
}
else {
const err97 = {instancePath:instancePath+"/power_map/affected_populations",schemaPath:"#/properties/power_map/properties/affected_populations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data35.institutions !== undefined){
let data40 = data35.institutions;
if(Array.isArray(data40)){
const len10 = data40.length;
for(let i10=0; i10<len10; i10++){
if(!(validate37(data40[i10], {instancePath:instancePath+"/power_map/institutions/" + i10,parentData:data40,parentDataProperty:i10,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
}
}
else {
const err98 = {instancePath:instancePath+"/power_map/institutions",schemaPath:"#/properties/power_map/properties/institutions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data35.power_asymmetries !== undefined){
let data42 = data35.power_asymmetries;
if(Array.isArray(data42)){
const len11 = data42.length;
for(let i11=0; i11<len11; i11++){
if(!(validate39(data42[i11], {instancePath:instancePath+"/power_map/power_asymmetries/" + i11,parentData:data42,parentDataProperty:i11,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
errors = vErrors.length;
}
}
}
else {
const err99 = {instancePath:instancePath+"/power_map/power_asymmetries",schemaPath:"#/properties/power_map/properties/power_asymmetries/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
}
else {
const err100 = {instancePath:instancePath+"/power_map",schemaPath:"#/properties/power_map/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data.mechanisms !== undefined){
let data44 = data.mechanisms;
const _errs83 = errors;
let valid32 = false;
const _errs84 = errors;
if(data44 && typeof data44 == "object" && !Array.isArray(data44)){
if(data44.infrastructures !== undefined){
let data45 = data44.infrastructures;
if(Array.isArray(data45)){
if(data45.length < 1){
const err101 = {instancePath:instancePath+"/mechanisms/infrastructures",schemaPath:"#/properties/mechanisms/anyOf/0/properties/infrastructures/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
else {
const err102 = {instancePath:instancePath+"/mechanisms/infrastructures",schemaPath:"#/properties/mechanisms/anyOf/0/properties/infrastructures/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
}
var _valid0 = _errs84 === errors;
valid32 = valid32 || _valid0;
if(_valid0){
var props0 = {};
props0.infrastructures = true;
}
const _errs87 = errors;
if(data44 && typeof data44 == "object" && !Array.isArray(data44)){
if(data44.political_economy !== undefined){
let data46 = data44.political_economy;
if(Array.isArray(data46)){
if(data46.length < 1){
const err103 = {instancePath:instancePath+"/mechanisms/political_economy",schemaPath:"#/properties/mechanisms/anyOf/1/properties/political_economy/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
else {
const err104 = {instancePath:instancePath+"/mechanisms/political_economy",schemaPath:"#/properties/mechanisms/anyOf/1/properties/political_economy/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
}
var _valid0 = _errs87 === errors;
valid32 = valid32 || _valid0;
if(_valid0){
if(props0 !== true){
props0 = props0 || {};
props0.political_economy = true;
}
}
if(!valid32){
const err105 = {instancePath:instancePath+"/mechanisms",schemaPath:"#/properties/mechanisms/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
else {
errors = _errs83;
if(vErrors !== null){
if(_errs83){
vErrors.length = _errs83;
}
else {
vErrors = null;
}
}
}
if(data44 && typeof data44 == "object" && !Array.isArray(data44)){
if(data44.instruments === undefined){
const err106 = {instancePath:instancePath+"/mechanisms",schemaPath:"#/properties/mechanisms/required",keyword:"required",params:{missingProperty: "instruments"},message:"must have required property '"+"instruments"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(data44.infrastructures === undefined){
const err107 = {instancePath:instancePath+"/mechanisms",schemaPath:"#/properties/mechanisms/required",keyword:"required",params:{missingProperty: "infrastructures"},message:"must have required property '"+"infrastructures"+"'"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data44.political_economy === undefined){
const err108 = {instancePath:instancePath+"/mechanisms",schemaPath:"#/properties/mechanisms/required",keyword:"required",params:{missingProperty: "political_economy"},message:"must have required property '"+"political_economy"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data44.power_modes === undefined){
const err109 = {instancePath:instancePath+"/mechanisms",schemaPath:"#/properties/mechanisms/required",keyword:"required",params:{missingProperty: "power_modes"},message:"must have required property '"+"power_modes"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
for(const key5 in data44){
if(!((((key5 === "instruments") || (key5 === "infrastructures")) || (key5 === "political_economy")) || (key5 === "power_modes"))){
const err110 = {instancePath:instancePath+"/mechanisms",schemaPath:"#/properties/mechanisms/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
if(data44.instruments !== undefined){
let data47 = data44.instruments;
if(Array.isArray(data47)){
if(data47.length < 1){
const err111 = {instancePath:instancePath+"/mechanisms/instruments",schemaPath:"#/properties/mechanisms/properties/instruments/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
const len12 = data47.length;
for(let i12=0; i12<len12; i12++){
if(!(validate41(data47[i12], {instancePath:instancePath+"/mechanisms/instruments/" + i12,parentData:data47,parentDataProperty:i12,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
errors = vErrors.length;
}
}
}
else {
const err112 = {instancePath:instancePath+"/mechanisms/instruments",schemaPath:"#/properties/mechanisms/properties/instruments/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data44.infrastructures !== undefined){
let data49 = data44.infrastructures;
if(Array.isArray(data49)){
const len13 = data49.length;
for(let i13=0; i13<len13; i13++){
if(!(validate43(data49[i13], {instancePath:instancePath+"/mechanisms/infrastructures/" + i13,parentData:data49,parentDataProperty:i13,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate43.errors : vErrors.concat(validate43.errors);
errors = vErrors.length;
}
}
}
else {
const err113 = {instancePath:instancePath+"/mechanisms/infrastructures",schemaPath:"#/properties/mechanisms/properties/infrastructures/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
if(data44.political_economy !== undefined){
let data51 = data44.political_economy;
if(Array.isArray(data51)){
const len14 = data51.length;
for(let i14=0; i14<len14; i14++){
if(!(validate45(data51[i14], {instancePath:instancePath+"/mechanisms/political_economy/" + i14,parentData:data51,parentDataProperty:i14,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
errors = vErrors.length;
}
}
}
else {
const err114 = {instancePath:instancePath+"/mechanisms/political_economy",schemaPath:"#/properties/mechanisms/properties/political_economy/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
if(data44.power_modes !== undefined){
let data53 = data44.power_modes;
if(Array.isArray(data53)){
if(data53.length < 1){
const err115 = {instancePath:instancePath+"/mechanisms/power_modes",schemaPath:"#/properties/mechanisms/properties/power_modes/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
const len15 = data53.length;
for(let i15=0; i15<len15; i15++){
if(!(validate47(data53[i15], {instancePath:instancePath+"/mechanisms/power_modes/" + i15,parentData:data53,parentDataProperty:i15,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate47.errors : vErrors.concat(validate47.errors);
errors = vErrors.length;
}
}
}
else {
const err116 = {instancePath:instancePath+"/mechanisms/power_modes",schemaPath:"#/properties/mechanisms/properties/power_modes/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
}
else {
const err117 = {instancePath:instancePath+"/mechanisms",schemaPath:"#/properties/mechanisms/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data.meaning_systems !== undefined){
let data55 = data.meaning_systems;
if(data55 && typeof data55 == "object" && !Array.isArray(data55)){
if(data55.norms === undefined){
const err118 = {instancePath:instancePath+"/meaning_systems",schemaPath:"#/properties/meaning_systems/required",keyword:"required",params:{missingProperty: "norms"},message:"must have required property '"+"norms"+"'"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
if(data55.regimes_of_truth === undefined){
const err119 = {instancePath:instancePath+"/meaning_systems",schemaPath:"#/properties/meaning_systems/required",keyword:"required",params:{missingProperty: "regimes_of_truth"},message:"must have required property '"+"regimes_of_truth"+"'"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if(data55.classifications === undefined){
const err120 = {instancePath:instancePath+"/meaning_systems",schemaPath:"#/properties/meaning_systems/required",keyword:"required",params:{missingProperty: "classifications"},message:"must have required property '"+"classifications"+"'"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
if(data55.looping_effects === undefined){
const err121 = {instancePath:instancePath+"/meaning_systems",schemaPath:"#/properties/meaning_systems/required",keyword:"required",params:{missingProperty: "looping_effects"},message:"must have required property '"+"looping_effects"+"'"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
for(const key6 in data55){
if(!((((key6 === "norms") || (key6 === "regimes_of_truth")) || (key6 === "classifications")) || (key6 === "looping_effects"))){
const err122 = {instancePath:instancePath+"/meaning_systems",schemaPath:"#/properties/meaning_systems/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data55.norms !== undefined){
let data56 = data55.norms;
if(Array.isArray(data56)){
if(data56.length < 1){
const err123 = {instancePath:instancePath+"/meaning_systems/norms",schemaPath:"#/properties/meaning_systems/properties/norms/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
const len16 = data56.length;
for(let i16=0; i16<len16; i16++){
if(!(validate49(data56[i16], {instancePath:instancePath+"/meaning_systems/norms/" + i16,parentData:data56,parentDataProperty:i16,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate49.errors : vErrors.concat(validate49.errors);
errors = vErrors.length;
}
}
}
else {
const err124 = {instancePath:instancePath+"/meaning_systems/norms",schemaPath:"#/properties/meaning_systems/properties/norms/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data55.regimes_of_truth !== undefined){
let data58 = data55.regimes_of_truth;
if(Array.isArray(data58)){
if(data58.length < 1){
const err125 = {instancePath:instancePath+"/meaning_systems/regimes_of_truth",schemaPath:"#/properties/meaning_systems/properties/regimes_of_truth/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
const len17 = data58.length;
for(let i17=0; i17<len17; i17++){
if(!(validate51(data58[i17], {instancePath:instancePath+"/meaning_systems/regimes_of_truth/" + i17,parentData:data58,parentDataProperty:i17,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
}
}
else {
const err126 = {instancePath:instancePath+"/meaning_systems/regimes_of_truth",schemaPath:"#/properties/meaning_systems/properties/regimes_of_truth/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data55.classifications !== undefined){
let data60 = data55.classifications;
if(Array.isArray(data60)){
if(data60.length < 1){
const err127 = {instancePath:instancePath+"/meaning_systems/classifications",schemaPath:"#/properties/meaning_systems/properties/classifications/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
const len18 = data60.length;
for(let i18=0; i18<len18; i18++){
if(!(validate53(data60[i18], {instancePath:instancePath+"/meaning_systems/classifications/" + i18,parentData:data60,parentDataProperty:i18,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate53.errors : vErrors.concat(validate53.errors);
errors = vErrors.length;
}
}
}
else {
const err128 = {instancePath:instancePath+"/meaning_systems/classifications",schemaPath:"#/properties/meaning_systems/properties/classifications/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data55.looping_effects !== undefined){
let data62 = data55.looping_effects;
if(Array.isArray(data62)){
const len19 = data62.length;
for(let i19=0; i19<len19; i19++){
if(!(validate55(data62[i19], {instancePath:instancePath+"/meaning_systems/looping_effects/" + i19,parentData:data62,parentDataProperty:i19,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate55.errors : vErrors.concat(validate55.errors);
errors = vErrors.length;
}
}
}
else {
const err129 = {instancePath:instancePath+"/meaning_systems/looping_effects",schemaPath:"#/properties/meaning_systems/properties/looping_effects/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
}
else {
const err130 = {instancePath:instancePath+"/meaning_systems",schemaPath:"#/properties/meaning_systems/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
if(data.intervention_assessment !== undefined){
let data64 = data.intervention_assessment;
if(data64 && typeof data64 == "object" && !Array.isArray(data64)){
if(data64.interventions === undefined){
const err131 = {instancePath:instancePath+"/intervention_assessment",schemaPath:"#/properties/intervention_assessment/required",keyword:"required",params:{missingProperty: "interventions"},message:"must have required property '"+"interventions"+"'"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data64.capture_assessment === undefined){
const err132 = {instancePath:instancePath+"/intervention_assessment",schemaPath:"#/properties/intervention_assessment/required",keyword:"required",params:{missingProperty: "capture_assessment"},message:"must have required property '"+"capture_assessment"+"'"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(data64.care_control_tensions === undefined){
const err133 = {instancePath:instancePath+"/intervention_assessment",schemaPath:"#/properties/intervention_assessment/required",keyword:"required",params:{missingProperty: "care_control_tensions"},message:"must have required property '"+"care_control_tensions"+"'"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
for(const key7 in data64){
if(!(((key7 === "interventions") || (key7 === "capture_assessment")) || (key7 === "care_control_tensions"))){
const err134 = {instancePath:instancePath+"/intervention_assessment",schemaPath:"#/properties/intervention_assessment/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data64.interventions !== undefined){
let data65 = data64.interventions;
if(Array.isArray(data65)){
if(data65.length < 1){
const err135 = {instancePath:instancePath+"/intervention_assessment/interventions",schemaPath:"#/properties/intervention_assessment/properties/interventions/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
const len20 = data65.length;
for(let i20=0; i20<len20; i20++){
if(!(validate57(data65[i20], {instancePath:instancePath+"/intervention_assessment/interventions/" + i20,parentData:data65,parentDataProperty:i20,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate57.errors : vErrors.concat(validate57.errors);
errors = vErrors.length;
}
}
}
else {
const err136 = {instancePath:instancePath+"/intervention_assessment/interventions",schemaPath:"#/properties/intervention_assessment/properties/interventions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
}
if(data64.capture_assessment !== undefined){
if(!(validate59(data64.capture_assessment, {instancePath:instancePath+"/intervention_assessment/capture_assessment",parentData:data64,parentDataProperty:"capture_assessment",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate59.errors : vErrors.concat(validate59.errors);
errors = vErrors.length;
}
}
if(data64.care_control_tensions !== undefined){
let data68 = data64.care_control_tensions;
if(Array.isArray(data68)){
const len21 = data68.length;
for(let i21=0; i21<len21; i21++){
if(!(validate63(data68[i21], {instancePath:instancePath+"/intervention_assessment/care_control_tensions/" + i21,parentData:data68,parentDataProperty:i21,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate63.errors : vErrors.concat(validate63.errors);
errors = vErrors.length;
}
}
}
else {
const err137 = {instancePath:instancePath+"/intervention_assessment/care_control_tensions",schemaPath:"#/properties/intervention_assessment/properties/care_control_tensions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
}
else {
const err138 = {instancePath:instancePath+"/intervention_assessment",schemaPath:"#/properties/intervention_assessment/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
if(data.scale_time !== undefined){
if(!(validate65(data.scale_time, {instancePath:instancePath+"/scale_time",parentData:data,parentDataProperty:"scale_time",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate65.errors : vErrors.concat(validate65.errors);
errors = vErrors.length;
}
}
if(data.distribution !== undefined){
let data71 = data.distribution;
if(data71 && typeof data71 == "object" && !Array.isArray(data71)){
if(data71.items === undefined){
const err139 = {instancePath:instancePath+"/distribution",schemaPath:"#/properties/distribution/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
if(data71.inequality_dimensions === undefined){
const err140 = {instancePath:instancePath+"/distribution",schemaPath:"#/properties/distribution/required",keyword:"required",params:{missingProperty: "inequality_dimensions"},message:"must have required property '"+"inequality_dimensions"+"'"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
if(data71.necropolitical_dimensions === undefined){
const err141 = {instancePath:instancePath+"/distribution",schemaPath:"#/properties/distribution/required",keyword:"required",params:{missingProperty: "necropolitical_dimensions"},message:"must have required property '"+"necropolitical_dimensions"+"'"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
for(const key8 in data71){
if(!(((key8 === "items") || (key8 === "inequality_dimensions")) || (key8 === "necropolitical_dimensions"))){
const err142 = {instancePath:instancePath+"/distribution",schemaPath:"#/properties/distribution/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
if(data71.items !== undefined){
let data72 = data71.items;
if(Array.isArray(data72)){
if(data72.length < 1){
const err143 = {instancePath:instancePath+"/distribution/items",schemaPath:"#/properties/distribution/properties/items/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
const len22 = data72.length;
for(let i22=0; i22<len22; i22++){
if(!(validate69(data72[i22], {instancePath:instancePath+"/distribution/items/" + i22,parentData:data72,parentDataProperty:i22,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
errors = vErrors.length;
}
}
}
else {
const err144 = {instancePath:instancePath+"/distribution/items",schemaPath:"#/properties/distribution/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
if(data71.inequality_dimensions !== undefined){
let data74 = data71.inequality_dimensions;
if(Array.isArray(data74)){
const len23 = data74.length;
for(let i23=0; i23<len23; i23++){
if(!(validate71(data74[i23], {instancePath:instancePath+"/distribution/inequality_dimensions/" + i23,parentData:data74,parentDataProperty:i23,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate71.errors : vErrors.concat(validate71.errors);
errors = vErrors.length;
}
}
}
else {
const err145 = {instancePath:instancePath+"/distribution/inequality_dimensions",schemaPath:"#/properties/distribution/properties/inequality_dimensions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data71.necropolitical_dimensions !== undefined){
let data76 = data71.necropolitical_dimensions;
if(Array.isArray(data76)){
const len24 = data76.length;
for(let i24=0; i24<len24; i24++){
if(!(validate73(data76[i24], {instancePath:instancePath+"/distribution/necropolitical_dimensions/" + i24,parentData:data76,parentDataProperty:i24,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate73.errors : vErrors.concat(validate73.errors);
errors = vErrors.length;
}
}
}
else {
const err146 = {instancePath:instancePath+"/distribution/necropolitical_dimensions",schemaPath:"#/properties/distribution/properties/necropolitical_dimensions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
}
else {
const err147 = {instancePath:instancePath+"/distribution",schemaPath:"#/properties/distribution/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data.consent_exit !== undefined){
if(!(validate75(data.consent_exit, {instancePath:instancePath+"/consent_exit",parentData:data,parentDataProperty:"consent_exit",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate75.errors : vErrors.concat(validate75.errors);
errors = vErrors.length;
}
}
if(data.competing_explanations !== undefined){
let data79 = data.competing_explanations;
if(Array.isArray(data79)){
if(data79.length > 9){
const err148 = {instancePath:instancePath+"/competing_explanations",schemaPath:"#/properties/competing_explanations/maxItems",keyword:"maxItems",params:{limit: 9},message:"must NOT have more than 9 items"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
if(data79.length < 9){
const err149 = {instancePath:instancePath+"/competing_explanations",schemaPath:"#/properties/competing_explanations/minItems",keyword:"minItems",params:{limit: 9},message:"must NOT have fewer than 9 items"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
const len25 = data79.length;
for(let i25=0; i25<len25; i25++){
if(!(validate77(data79[i25], {instancePath:instancePath+"/competing_explanations/" + i25,parentData:data79,parentDataProperty:i25,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
}
}
else {
const err150 = {instancePath:instancePath+"/competing_explanations",schemaPath:"#/properties/competing_explanations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
if(data.evidence !== undefined){
let data81 = data.evidence;
if(data81 && typeof data81 == "object" && !Array.isArray(data81)){
if(data81.items === undefined){
const err151 = {instancePath:instancePath+"/evidence",schemaPath:"#/properties/evidence/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
for(const key9 in data81){
if(!(key9 === "items")){
const err152 = {instancePath:instancePath+"/evidence",schemaPath:"#/properties/evidence/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
}
if(data81.items !== undefined){
let data82 = data81.items;
if(Array.isArray(data82)){
if(data82.length < 1){
const err153 = {instancePath:instancePath+"/evidence/items",schemaPath:"#/properties/evidence/properties/items/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
const len26 = data82.length;
for(let i26=0; i26<len26; i26++){
if(!(validate79(data82[i26], {instancePath:instancePath+"/evidence/items/" + i26,parentData:data82,parentDataProperty:i26,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate79.errors : vErrors.concat(validate79.errors);
errors = vErrors.length;
}
}
}
else {
const err154 = {instancePath:instancePath+"/evidence/items",schemaPath:"#/properties/evidence/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
}
else {
const err155 = {instancePath:instancePath+"/evidence",schemaPath:"#/properties/evidence/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
if(data.assumptions !== undefined){
let data84 = data.assumptions;
if(data84 && typeof data84 == "object" && !Array.isArray(data84)){
if(data84.items === undefined){
const err156 = {instancePath:instancePath+"/assumptions",schemaPath:"#/properties/assumptions/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
for(const key10 in data84){
if(!(key10 === "items")){
const err157 = {instancePath:instancePath+"/assumptions",schemaPath:"#/properties/assumptions/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data84.items !== undefined){
let data85 = data84.items;
if(Array.isArray(data85)){
const len27 = data85.length;
for(let i27=0; i27<len27; i27++){
if(!(validate81(data85[i27], {instancePath:instancePath+"/assumptions/items/" + i27,parentData:data85,parentDataProperty:i27,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate81.errors : vErrors.concat(validate81.errors);
errors = vErrors.length;
}
}
}
else {
const err158 = {instancePath:instancePath+"/assumptions/items",schemaPath:"#/properties/assumptions/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
}
else {
const err159 = {instancePath:instancePath+"/assumptions",schemaPath:"#/properties/assumptions/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
if(data.resistance_agency !== undefined){
let data87 = data.resistance_agency;
if(data87 && typeof data87 == "object" && !Array.isArray(data87)){
if(data87.items === undefined){
const err160 = {instancePath:instancePath+"/resistance_agency",schemaPath:"#/properties/resistance_agency/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
for(const key11 in data87){
if(!(key11 === "items")){
const err161 = {instancePath:instancePath+"/resistance_agency",schemaPath:"#/properties/resistance_agency/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data87.items !== undefined){
let data88 = data87.items;
if(Array.isArray(data88)){
if(data88.length < 1){
const err162 = {instancePath:instancePath+"/resistance_agency/items",schemaPath:"#/properties/resistance_agency/properties/items/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
const len28 = data88.length;
for(let i28=0; i28<len28; i28++){
if(!(validate83(data88[i28], {instancePath:instancePath+"/resistance_agency/items/" + i28,parentData:data88,parentDataProperty:i28,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate83.errors : vErrors.concat(validate83.errors);
errors = vErrors.length;
}
}
}
else {
const err163 = {instancePath:instancePath+"/resistance_agency/items",schemaPath:"#/properties/resistance_agency/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
}
else {
const err164 = {instancePath:instancePath+"/resistance_agency",schemaPath:"#/properties/resistance_agency/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data.alternatives !== undefined){
let data90 = data.alternatives;
if(data90 && typeof data90 == "object" && !Array.isArray(data90)){
if(data90.items === undefined){
const err165 = {instancePath:instancePath+"/alternatives",schemaPath:"#/properties/alternatives/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
for(const key12 in data90){
if(!(key12 === "items")){
const err166 = {instancePath:instancePath+"/alternatives",schemaPath:"#/properties/alternatives/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
if(data90.items !== undefined){
let data91 = data90.items;
if(Array.isArray(data91)){
if(data91.length < 1){
const err167 = {instancePath:instancePath+"/alternatives/items",schemaPath:"#/properties/alternatives/properties/items/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
const len29 = data91.length;
for(let i29=0; i29<len29; i29++){
if(!(validate85(data91[i29], {instancePath:instancePath+"/alternatives/items/" + i29,parentData:data91,parentDataProperty:i29,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate85.errors : vErrors.concat(validate85.errors);
errors = vErrors.length;
}
}
}
else {
const err168 = {instancePath:instancePath+"/alternatives/items",schemaPath:"#/properties/alternatives/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
}
else {
const err169 = {instancePath:instancePath+"/alternatives",schemaPath:"#/properties/alternatives/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
}
if(data.calibrated_conclusion !== undefined){
if(!(validate87(data.calibrated_conclusion, {instancePath:instancePath+"/calibrated_conclusion",parentData:data,parentDataProperty:"calibrated_conclusion",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate87.errors : vErrors.concat(validate87.errors);
errors = vErrors.length;
}
}
if(data.self_audit !== undefined){
if(!(validate89(data.self_audit, {instancePath:instancePath+"/self_audit",parentData:data,parentDataProperty:"self_audit",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate89.errors : vErrors.concat(validate89.errors);
errors = vErrors.length;
}
}
if(data.self_audit_notes !== undefined){
let data95 = data.self_audit_notes;
if(Array.isArray(data95)){
const len30 = data95.length;
for(let i30=0; i30<len30; i30++){
if(typeof data95[i30] !== "string"){
const err170 = {instancePath:instancePath+"/self_audit_notes/" + i30,schemaPath:"#/$defs/stringArray/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
}
}
else {
const err171 = {instancePath:instancePath+"/self_audit_notes",schemaPath:"#/$defs/stringArray/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
}
if(data.links !== undefined){
let data97 = data.links;
if(Array.isArray(data97)){
const len31 = data97.length;
for(let i31=0; i31<len31; i31++){
if(!(validate91(data97[i31], {instancePath:instancePath+"/links/" + i31,parentData:data97,parentDataProperty:i31,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate91.errors : vErrors.concat(validate91.errors);
errors = vErrors.length;
}
}
}
else {
const err172 = {instancePath:instancePath+"/links",schemaPath:"#/properties/links/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
if(data.migration !== undefined){
if(data.migration !== null){
const err173 = {instancePath:instancePath+"/migration",schemaPath:"#/properties/migration/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
}
else {
const err174 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

exports.migratedDraft = validate93;
const schema204 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://jarbou3i.example/schema/biopolitical-migrated-draft-v1.schema.json","title":"Jarbou3i Biopolitical Migrated Draft Contract v1","description":"A deliberately incomplete review state produced from the historical six-layer Biopolitical format. It preserves source material and gaps without claiming canonical Training Map v2.1 validity.","type":"object","required":["schema_version","analysis_contract","contract_status","analysis_lens","analysis_id","language","subject","migration"],"properties":{"schema_version":{"const":"1.0.0"},"analysis_contract":{"const":"biopolitical-migrated-draft-v1"},"contract_status":{"const":"migrated_draft"},"analysis_lens":{"const":"biopolitical"},"analysis_id":{"type":"string"},"generated_at":{"type":"string"},"language":{"enum":["ar","en","fr"]},"model_mode":{"type":"string"},"subject":{"type":"object","required":["title","context","research_question","executive_finding"],"properties":{"title":{"type":"string"},"context":{"type":"string"},"research_question":{"type":"string"},"executive_finding":{"type":"string"}},"additionalProperties":false},"migration":{"type":"object","required":["from_schema","adapter","warnings","canonical_target"],"properties":{"from_schema":{"type":"string"},"adapter":{"const":"legacy-six-layer-to-biopolitical-draft-v1"},"warnings":{"type":"array","minItems":1,"items":{"type":"string","minLength":1}},"canonical_target":{"const":"biopolitical-training-map-v2@2.1.0"}},"additionalProperties":false}},"additionalProperties":true};

function validate93(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://jarbou3i.example/schema/biopolitical-migrated-draft-v1.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate93.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.schema_version === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.analysis_contract === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "analysis_contract"},message:"must have required property '"+"analysis_contract"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.contract_status === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "contract_status"},message:"must have required property '"+"contract_status"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.analysis_lens === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "analysis_lens"},message:"must have required property '"+"analysis_lens"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.analysis_id === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "analysis_id"},message:"must have required property '"+"analysis_id"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.language === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "language"},message:"must have required property '"+"language"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.subject === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "subject"},message:"must have required property '"+"subject"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.migration === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "migration"},message:"must have required property '"+"migration"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err8 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.analysis_contract !== undefined){
if("biopolitical-migrated-draft-v1" !== data.analysis_contract){
const err9 = {instancePath:instancePath+"/analysis_contract",schemaPath:"#/properties/analysis_contract/const",keyword:"const",params:{allowedValue: "biopolitical-migrated-draft-v1"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.contract_status !== undefined){
if("migrated_draft" !== data.contract_status){
const err10 = {instancePath:instancePath+"/contract_status",schemaPath:"#/properties/contract_status/const",keyword:"const",params:{allowedValue: "migrated_draft"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.analysis_lens !== undefined){
if("biopolitical" !== data.analysis_lens){
const err11 = {instancePath:instancePath+"/analysis_lens",schemaPath:"#/properties/analysis_lens/const",keyword:"const",params:{allowedValue: "biopolitical"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.analysis_id !== undefined){
if(typeof data.analysis_id !== "string"){
const err12 = {instancePath:instancePath+"/analysis_id",schemaPath:"#/properties/analysis_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.generated_at !== undefined){
if(typeof data.generated_at !== "string"){
const err13 = {instancePath:instancePath+"/generated_at",schemaPath:"#/properties/generated_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.language !== undefined){
let data6 = data.language;
if(!(((data6 === "ar") || (data6 === "en")) || (data6 === "fr"))){
const err14 = {instancePath:instancePath+"/language",schemaPath:"#/properties/language/enum",keyword:"enum",params:{allowedValues: schema204.properties.language.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.model_mode !== undefined){
if(typeof data.model_mode !== "string"){
const err15 = {instancePath:instancePath+"/model_mode",schemaPath:"#/properties/model_mode/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.subject !== undefined){
let data8 = data.subject;
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
if(data8.title === undefined){
const err16 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data8.context === undefined){
const err17 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "context"},message:"must have required property '"+"context"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data8.research_question === undefined){
const err18 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "research_question"},message:"must have required property '"+"research_question"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data8.executive_finding === undefined){
const err19 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "executive_finding"},message:"must have required property '"+"executive_finding"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
for(const key0 in data8){
if(!((((key0 === "title") || (key0 === "context")) || (key0 === "research_question")) || (key0 === "executive_finding"))){
const err20 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data8.title !== undefined){
if(typeof data8.title !== "string"){
const err21 = {instancePath:instancePath+"/subject/title",schemaPath:"#/properties/subject/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data8.context !== undefined){
if(typeof data8.context !== "string"){
const err22 = {instancePath:instancePath+"/subject/context",schemaPath:"#/properties/subject/properties/context/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data8.research_question !== undefined){
if(typeof data8.research_question !== "string"){
const err23 = {instancePath:instancePath+"/subject/research_question",schemaPath:"#/properties/subject/properties/research_question/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data8.executive_finding !== undefined){
if(typeof data8.executive_finding !== "string"){
const err24 = {instancePath:instancePath+"/subject/executive_finding",schemaPath:"#/properties/subject/properties/executive_finding/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.migration !== undefined){
let data13 = data.migration;
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.from_schema === undefined){
const err26 = {instancePath:instancePath+"/migration",schemaPath:"#/properties/migration/required",keyword:"required",params:{missingProperty: "from_schema"},message:"must have required property '"+"from_schema"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data13.adapter === undefined){
const err27 = {instancePath:instancePath+"/migration",schemaPath:"#/properties/migration/required",keyword:"required",params:{missingProperty: "adapter"},message:"must have required property '"+"adapter"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data13.warnings === undefined){
const err28 = {instancePath:instancePath+"/migration",schemaPath:"#/properties/migration/required",keyword:"required",params:{missingProperty: "warnings"},message:"must have required property '"+"warnings"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data13.canonical_target === undefined){
const err29 = {instancePath:instancePath+"/migration",schemaPath:"#/properties/migration/required",keyword:"required",params:{missingProperty: "canonical_target"},message:"must have required property '"+"canonical_target"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
for(const key1 in data13){
if(!((((key1 === "from_schema") || (key1 === "adapter")) || (key1 === "warnings")) || (key1 === "canonical_target"))){
const err30 = {instancePath:instancePath+"/migration",schemaPath:"#/properties/migration/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data13.from_schema !== undefined){
if(typeof data13.from_schema !== "string"){
const err31 = {instancePath:instancePath+"/migration/from_schema",schemaPath:"#/properties/migration/properties/from_schema/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data13.adapter !== undefined){
if("legacy-six-layer-to-biopolitical-draft-v1" !== data13.adapter){
const err32 = {instancePath:instancePath+"/migration/adapter",schemaPath:"#/properties/migration/properties/adapter/const",keyword:"const",params:{allowedValue: "legacy-six-layer-to-biopolitical-draft-v1"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data13.warnings !== undefined){
let data16 = data13.warnings;
if(Array.isArray(data16)){
if(data16.length < 1){
const err33 = {instancePath:instancePath+"/migration/warnings",schemaPath:"#/properties/migration/properties/warnings/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
const len0 = data16.length;
for(let i0=0; i0<len0; i0++){
let data17 = data16[i0];
if(typeof data17 === "string"){
if(func2(data17) < 1){
const err34 = {instancePath:instancePath+"/migration/warnings/" + i0,schemaPath:"#/properties/migration/properties/warnings/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/migration/warnings/" + i0,schemaPath:"#/properties/migration/properties/warnings/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
}
else {
const err36 = {instancePath:instancePath+"/migration/warnings",schemaPath:"#/properties/migration/properties/warnings/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data13.canonical_target !== undefined){
if("biopolitical-training-map-v2@2.1.0" !== data13.canonical_target){
const err37 = {instancePath:instancePath+"/migration/canonical_target",schemaPath:"#/properties/migration/properties/canonical_target/const",keyword:"const",params:{allowedValue: "biopolitical-training-map-v2@2.1.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
else {
const err38 = {instancePath:instancePath+"/migration",schemaPath:"#/properties/migration/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
}
else {
const err39 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
validate93.errors = vErrors;
return errors === 0;
}
validate93.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

  root.Jarbou3iBiopoliticsSchemaValidators = Object.freeze(module.exports);
})(typeof window !== "undefined" ? window : globalThis);
