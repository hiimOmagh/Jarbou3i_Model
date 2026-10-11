// Generated from fixtures/sample-analysis-{,bio-}{en,ar,fr}.json — do not edit by hand.
// Regenerate: node prototypes/ux-0/build-samples.mjs
// (Inlined because the production CSP sets connect-src none, which blocks fetch().)
export const SAMPLES = {
 "en": {
  "schema_version": "1.1.0",
  "analysis_id": "sample-wwii-en",
  "generated_at": "2026-04-27T00:00:00Z",
  "language": "en",
  "model_mode": "research",
  "analysis_lens": "strategic",
  "subject": {
   "title": "Sample: World War II outcomes",
   "context": "1939–1947, international order",
   "question": "How did World War II outcomes reshape the global system?",
   "executive_thesis": "World War II ended the old European balance of power and opened a bipolar order led by the United States and the Soviet Union."
  },
  "interests": [
   {
    "name": "Prevent renewed German hegemony",
    "type": "strategic",
    "intensity": 5,
    "horizon": "long",
    "stakes": "existential",
    "confidence": "high",
    "rationale": "Two world wars made German containment a central Allied security interest.",
    "id": "I1"
   }
  ],
  "actors": [
   {
    "name": "United States",
    "category": "state",
    "financial": 5,
    "decision_access": 5,
    "disruption_capacity": 4,
    "media_influence": 4,
    "confidence": "high",
    "rationale": "Industrial, financial, and military capacity enabled postwar leadership.",
    "id": "A1"
   }
  ],
  "tools": [
   {
    "name": "New international institutions",
    "type": "diplomatic",
    "cost": 3,
    "risk": 2,
    "speed": 3,
    "reversibility": 2,
    "deniability": 1,
    "confidence": "high",
    "rationale": "The UN and Bretton Woods institutions provided coordination and legitimacy.",
    "id": "T1"
   }
  ],
  "narrative": [
   {
    "name": "Prevent another total war",
    "frame": "security",
    "coherence": 5,
    "media_alignment": 4,
    "public_acceptance": 5,
    "confidence": "high",
    "rationale": "The narrative was coherent after unprecedented losses.",
    "id": "N1"
   }
  ],
  "results": [
   {
    "name": "Rise of bipolarity",
    "type": "direct",
    "goal_achieved_pct": 70,
    "cost_benefit": 3,
    "power_balance_impact": "strengthened",
    "confidence": "high",
    "rationale": "Europe receded while Washington and Moscow rose.",
    "id": "R1"
   }
  ],
  "feedback": [
   {
    "description": "Mutual fear drove military alliances and arms competition.",
    "adapts": "tools",
    "speed": "fast",
    "confidence": "high",
    "rationale": "Security outcomes reshaped tools and alliances.",
    "id": "F1"
   }
  ],
  "contradictions": {
   "items": [
    {
     "rhetoric": "Liberating peoples and preventing tyranny",
     "contradiction_type": "rhetoric_vs_action",
     "affected_layers": [
      "narrative",
      "tools",
      "results"
     ],
     "actions": [
      "Division of spheres of influence in Europe",
      "Acceptance of dependent regimes inside the Soviet sphere"
     ],
     "interpretation": "Moral rhetoric operated alongside hard security calculations.",
     "severity": 4,
     "confidence": "high",
     "id": "C1"
    }
   ]
  },
  "scenarios": {
   "items": [
    {
     "name": "Consolidation of bipolar order",
     "probability": 70,
     "timeframe": "1947–1955",
     "drivers": [
      "Ideological polarization"
     ],
     "early_signals": [
      "Marshall Plan",
      "Truman Doctrine"
     ],
     "disproven_if": [
      "Successful pan-European security settlement"
     ],
     "rationale": "Early indicators supported institutional and military division.",
     "id": "S1"
    }
   ]
  },
  "evidence": {
   "items": [
    {
     "claim": "Europe lost centrality after the war.",
     "basis": "source_based",
     "source_note": "Inferred from post-1945 power distribution.",
     "confidence": "high",
     "id": "E1",
     "source_title": "Historical power distribution reference",
     "source_url": "",
     "source_date": "unknown",
     "source_type": "other",
     "evidence_strength": 3,
     "uncertainty": "Aggregated historical inference; source specificity should be improved in research use.",
     "counter_evidence": "Some European states retained substantial institutional and economic capacity after 1945."
    }
   ]
  },
  "assumptions": {
   "items": [
    {
     "assumption": "Great powers will prefer institutional stability over isolation.",
     "risk": "medium",
     "disproving_test": "Rapid U.S. withdrawal from Europe and collapse of Bretton Woods.",
     "implication_if_wrong": "The order becomes more fluid and less predictable.",
     "id": "AS1"
    }
   ]
  },
  "links": [
   {
    "from": "I1",
    "to": "A1",
    "relation": "motivates",
    "strength": 4
   },
   {
    "from": "A1",
    "to": "T1",
    "relation": "uses",
    "strength": 4
   },
   {
    "from": "T1",
    "to": "R1",
    "relation": "produces",
    "strength": 3
   }
  ],
  "quality_gate": {
   "publication_risk": "medium",
   "weakest_layer": "evidence",
   "next_improvement": "Replace generic historical notes with precise source citations."
  }
 },
 "ar": {
  "schema_version": "1.1.0",
  "analysis_id": "sample-wwii-ar",
  "generated_at": "2026-04-27T00:00:00Z",
  "language": "ar",
  "model_mode": "research",
  "analysis_lens": "strategic",
  "subject": {
   "title": "مثال: مخرجات الحرب العالمية الثانية",
   "context": "1939–1947، النظام الدولي",
   "question": "كيف أعادت مخرجات الحرب العالمية الثانية تشكيل النظام العالمي؟",
   "executive_thesis": "أنهت الحرب العالمية الثانية توازن القوى الأوروبي التقليدي وفتحت نظامًا ثنائي القطبية تقوده الولايات المتحدة والاتحاد السوفيتي."
  },
  "interests": [
   {
    "name": "منع عودة الهيمنة الألمانية",
    "type": "strategic",
    "intensity": 5,
    "horizon": "long",
    "stakes": "existential",
    "confidence": "high",
    "rationale": "جعلت الحربان العالميتان احتواء ألمانيا مصلحة أمنية مركزية للحلفاء.",
    "id": "I1"
   }
  ],
  "actors": [
   {
    "name": "الولايات المتحدة",
    "category": "state",
    "financial": 5,
    "decision_access": 5,
    "disruption_capacity": 4,
    "media_influence": 4,
    "confidence": "high",
    "rationale": "مكّنتها القدرات الصناعية والمالية والعسكرية من قيادة النظام الجديد.",
    "id": "A1"
   }
  ],
  "tools": [
   {
    "name": "مؤسسات دولية جديدة",
    "type": "diplomatic",
    "cost": 3,
    "risk": 2,
    "speed": 3,
    "reversibility": 2,
    "deniability": 1,
    "confidence": "high",
    "rationale": "وفّرت الأمم المتحدة وبريتون وودز آليات تنسيق وشرعية.",
    "id": "T1"
   }
  ],
  "narrative": [
   {
    "name": "منع تكرار الحرب الشاملة",
    "frame": "security",
    "coherence": 5,
    "media_alignment": 4,
    "public_acceptance": 5,
    "confidence": "high",
    "rationale": "كانت السردية متماسكة بعد خسائر غير مسبوقة.",
    "id": "N1"
   }
  ],
  "results": [
   {
    "name": "صعود الثنائية القطبية",
    "type": "direct",
    "goal_achieved_pct": 70,
    "cost_benefit": 3,
    "power_balance_impact": "strengthened",
    "confidence": "high",
    "rationale": "تراجع مركز الثقل الأوروبي وصعدت واشنطن وموسكو.",
    "id": "R1"
   }
  ],
  "feedback": [
   {
    "description": "الخوف المتبادل دفع إلى أحلاف عسكرية وسباق تسلح.",
    "adapts": "tools",
    "speed": "fast",
    "confidence": "high",
    "rationale": "أعادت النتائج الأمنية تشكيل الأدوات والتحالفات.",
    "id": "F1"
   }
  ],
  "contradictions": {
   "items": [
    {
     "rhetoric": "تحرير الشعوب ومنع الاستبداد",
     "contradiction_type": "rhetoric_vs_action",
     "affected_layers": [
      "narrative",
      "tools",
      "results"
     ],
     "actions": [
      "تقسيم مناطق النفوذ في أوروبا",
      "قبول أنظمة تابعة داخل المجال السوفيتي"
     ],
     "interpretation": "رافقت السردية الأخلاقية حسابات أمنية وصلبة.",
     "severity": 4,
     "confidence": "high",
     "id": "C1"
    }
   ]
  },
  "scenarios": {
   "items": [
    {
     "name": "ترسيخ النظام ثنائي القطبية",
     "probability": 70,
     "timeframe": "1947–1955",
     "drivers": [
      "الاستقطاب الأيديولوجي"
     ],
     "early_signals": [
      "خطة مارشال",
      "مبدأ ترومان"
     ],
     "disproven_if": [
      "نجاح تسوية أمنية أوروبية جامعة"
     ],
     "rationale": "دعمت المؤشرات المبكرة انقسامًا مؤسسيًا وعسكريًا.",
     "id": "S1"
    }
   ]
  },
  "evidence": {
   "items": [
    {
     "claim": "فقدت أوروبا مركزيتها بعد الحرب.",
     "basis": "source_based",
     "source_note": "مستنتج من توزيع القوة بعد 1945.",
     "confidence": "high",
     "id": "E1",
     "source_title": "Historical power distribution reference",
     "source_url": "",
     "source_date": "unknown",
     "source_type": "other",
     "evidence_strength": 3,
     "uncertainty": "Aggregated historical inference; source specificity should be improved in research use.",
     "counter_evidence": "Some European states retained substantial institutional and economic capacity after 1945."
    }
   ]
  },
  "assumptions": {
   "items": [
    {
     "assumption": "ستفضّل القوى الكبرى الاستقرار المؤسسي على العزلة.",
     "risk": "medium",
     "disproving_test": "انسحاب أمريكي سريع من أوروبا وانهيار بريتون وودز.",
     "implication_if_wrong": "سيصبح النظام أكثر سيولة وأقل قابلية للتوقع.",
     "id": "AS1"
    }
   ]
  },
  "links": [
   {
    "from": "I1",
    "to": "A1",
    "relation": "motivates",
    "strength": 4
   },
   {
    "from": "A1",
    "to": "T1",
    "relation": "uses",
    "strength": 4
   },
   {
    "from": "T1",
    "to": "R1",
    "relation": "produces",
    "strength": 3
   }
  ],
  "quality_gate": {
   "publication_risk": "medium",
   "weakest_layer": "evidence",
   "next_improvement": "Replace generic historical notes with precise source citations."
  }
 },
 "fr": {
  "schema_version": "1.1.0",
  "analysis_id": "sample-wwii-fr",
  "generated_at": "2026-04-27T00:00:00Z",
  "language": "fr",
  "model_mode": "research",
  "analysis_lens": "strategic",
  "subject": {
   "title": "Exemple : résultats de la Seconde Guerre mondiale",
   "context": "1939–1947, ordre international",
   "question": "Comment les résultats de la Seconde Guerre mondiale ont-ils remodelé l’ordre international ?",
   "executive_thesis": "La guerre a déplacé le centre de gravité du système international vers les États-Unis et l’Union soviétique, tout en créant une architecture institutionnelle destinée à empêcher une nouvelle guerre totale."
  },
  "interests": [
   {
    "name": "Empêcher le retour de l’hégémonie allemande",
    "type": "strategic",
    "intensity": 5,
    "horizon": "long",
    "stakes": "existential",
    "confidence": "high",
    "rationale": "Deux guerres mondiales ont transformé le contrôle de la puissance allemande en priorité de sécurité.",
    "id": "I1"
   }
  ],
  "actors": [
   {
    "name": "États-Unis",
    "category": "state",
    "financial": 5,
    "decision_access": 5,
    "disruption_capacity": 4,
    "media_influence": 4,
    "confidence": "high",
    "rationale": "Leur capacité industrielle, financière et militaire leur permettait d’organiser l’ordre d’après-guerre.",
    "id": "A1"
   }
  ],
  "tools": [
   {
    "name": "Institutions internationales",
    "type": "diplomatic",
    "cost": 3,
    "risk": 2,
    "speed": 3,
    "reversibility": 2,
    "deniability": 1,
    "confidence": "high",
    "rationale": "L’ONU et Bretton Woods ont fourni des instruments de coordination et de légitimité.",
    "id": "T1"
   }
  ],
  "narrative": [
   {
    "name": "Empêcher une nouvelle guerre totale",
    "frame": "security",
    "coherence": 5,
    "media_alignment": 4,
    "public_acceptance": 5,
    "confidence": "high",
    "rationale": "Le traumatisme humain et matériel rendait ce cadrage très puissant.",
    "id": "N1"
   }
  ],
  "results": [
   {
    "name": "Ordre bipolaire",
    "type": "direct",
    "goal_achieved_pct": 75,
    "cost_benefit": 3,
    "power_balance_impact": "strengthened",
    "confidence": "high",
    "rationale": "Le pouvoir s’est concentré autour de Washington et Moscou.",
    "id": "R1"
   }
  ],
  "feedback": [
   {
    "description": "La rivalité entre alliés a transformé la coopération militaire en compétition idéologique.",
    "adapts": "actors",
    "speed": "fast",
    "confidence": "high",
    "rationale": "Les intérêts de sécurité ont divergé dès la reconstruction.",
    "id": "F1"
   }
  ],
  "contradictions": {
   "items": [
    {
     "rhetoric": "La sécurité collective empêcherait une nouvelle guerre mondiale.",
     "contradiction_type": "result_vs_intention",
     "actions": [
      "Le Conseil de sécurité a donné un veto aux grandes puissances.",
      "La rivalité Est-Ouest a limité l’application collective."
     ],
     "affected_layers": [
      "narrative",
      "results",
      "feedback"
     ],
     "interpretation": "La sécurité collective dépendait d’une hiérarchie de puissances plutôt que d’une égalité souveraine complète.",
     "severity": 8,
     "confidence": "high",
     "id": "C1"
    }
   ]
  },
  "scenarios": {
   "items": [
    {
     "name": "Normalisation institutionnelle contenue",
     "probability": 45,
     "timeframe": "1947–1955",
     "drivers": [
      "Reconstruction européenne",
      "Dépendance à l’aide américaine",
      "Institutionnalisation multilatérale"
     ],
     "early_signals": [
      "Plans de reconstruction",
      "Nouvelles alliances",
      "Coordination économique"
     ],
     "disproven_if": [
      "Les grandes puissances acceptent une gouvernance réellement égalitaire."
     ],
     "rationale": "L’ordre devient stable mais hiérarchisé.",
     "id": "S1"
    }
   ]
  },
  "evidence": {
   "items": [
    {
     "claim": "Les États-Unis sortent de la guerre avec une puissance industrielle et financière exceptionnelle.",
     "basis": "source_based",
     "source_note": "Données historiques générales sur la production et le financement de guerre.",
     "confidence": "high",
     "id": "E1",
     "source_title": "Historical power distribution reference",
     "source_url": "",
     "source_date": "unknown",
     "source_type": "other",
     "evidence_strength": 3,
     "uncertainty": "Aggregated historical inference; source specificity should be improved in research use.",
     "counter_evidence": "Some European states retained substantial institutional and economic capacity after 1945."
    }
   ]
  },
  "assumptions": {
   "items": [
    {
     "assumption": "La stabilité d’après-guerre dépend de la capacité américaine à financer la reconstruction.",
     "risk": "medium",
     "disproving_test": "Montrer une reconstruction équivalente sans financement américain.",
     "implication_if_wrong": "Le poids causal des institutions américaines serait surestimé.",
     "id": "AS1"
    }
   ]
  },
  "links": [
   {
    "from": "I1",
    "to": "A1",
    "relation": "motivates",
    "strength": 4
   },
   {
    "from": "A1",
    "to": "T1",
    "relation": "uses",
    "strength": 4
   },
   {
    "from": "T1",
    "to": "R1",
    "relation": "produces",
    "strength": 3
   }
  ],
  "quality_gate": {
   "publication_risk": "medium",
   "weakest_layer": "evidence",
   "next_improvement": "Replace generic historical notes with precise source citations."
  }
 }
};
export const BIO_SAMPLES = {
 "en": {
  "schema_version": "2.1.0",
  "analysis_contract": "biopolitical-training-map-v2",
  "contract_status": "canonical",
  "analysis_id": "health-pass-v2-en",
  "generated_at": "2026-07-17T00:00:00Z",
  "language": "en",
  "model_mode": "research",
  "analysis_lens": "biopolitical",
  "subject": {
   "title": "Digital health passes and conditional mobility",
   "context": "2020–2022, selected European jurisdictions",
   "research_question": "Under what conditions did digital health passes protect public health, and under what conditions did they create durable systems of classification and conditional mobility?",
   "executive_finding": "Digital passes combined a legitimate public-health function with a new access-control infrastructure. Evidence supports a mixed intervention: protection and administrative coordination were real, while proportionality, reuse, unequal burdens, and practical exit varied by jurisdiction."
  },
  "framing": {
   "contested_terms": [
    {
     "term": "health pass",
     "definitions": [
      "A verifiable credential linking defined health information to an access decision."
     ],
     "working_definition": "A verifiable credential linking defined health information to an access decision.",
     "stakes": "The definition determines which practices count as health coordination versus generalized access control."
    }
   ],
   "historical_context": {
    "summary": "Pass systems emerged during an acute pandemic, building on pre-existing identity, vaccination, and border-control infrastructures.",
    "turning_points": [
     "Acute pandemic emergency",
     "Deployment of interoperable credentials",
     "Judicial and political review"
    ],
    "continuities": [
     "Identity verification",
     "Vaccination records",
     "Border health controls"
    ]
   },
   "official_problem_definition": "Verify defined health status to reduce avoidable transmission in selected settings.",
   "critical_problem_definition": "Convert embodied status into an authorization condition for ordinary participation.",
   "unknowns": [
    "Long-term normalization effects cannot be inferred from short-term adoption alone."
   ]
  },
  "legal_framework": {
   "status": "assessed",
   "jurisdictions": [
    "2020–2022, selected European jurisdictions"
   ],
   "applicable_authorities": [
    "Public-health law and data-protection law; exact instruments require jurisdiction-specific verification."
   ],
   "rights_engaged": [
    "Privacy, non-discrimination, movement, work, and access to essential services."
   ],
   "safeguards_and_remedies": [
    "Many schemes included sunset clauses, exemptions, free testing, judicial review, or were discontinued."
   ],
   "uncertainties": [
    "Long-term normalization effects cannot be inferred from short-term adoption alone."
   ]
  },
  "international_comparison": [
   {
    "id": "CMP1",
    "jurisdiction_or_context": "2020–2022, selected European jurisdictions",
    "comparison_basis": "Compare duration, exemptions, free alternatives, purpose limitation, appeal, and dismantling.",
    "similarities": [
     "Credential-based verification linked health information to access."
    ],
    "differences": [
     "Many schemes included sunset clauses, exemptions, free testing, judicial review, or were discontinued."
    ],
    "transfer_limits": [
     "Long-term normalization effects cannot be inferred from short-term adoption alone."
    ],
    "evidence_ids": [
     "E1",
     "E2"
    ],
    "confidence": "low"
   }
  ],
  "capture_levels": [
   {
    "level": "body",
    "status": "present",
    "finding": "The body level was explicitly considered; confidence remains limited by unverified fixture sources.",
    "evidence_ids": [
     "E1"
    ]
   },
   {
    "level": "mind",
    "status": "uncertain",
    "finding": "The mind level was explicitly considered; confidence remains limited by unverified fixture sources.",
    "evidence_ids": []
   },
   {
    "level": "relationship",
    "status": "uncertain",
    "finding": "The relationship level was explicitly considered; confidence remains limited by unverified fixture sources.",
    "evidence_ids": []
   },
   {
    "level": "population",
    "status": "present",
    "finding": "The population level was explicitly considered; confidence remains limited by unverified fixture sources.",
    "evidence_ids": [
     "E1"
    ]
   },
   {
    "level": "environment",
    "status": "not_applicable",
    "finding": "The environment level was explicitly considered; confidence remains limited by unverified fixture sources.",
    "evidence_ids": []
   }
  ],
  "theoretical_comparison": [
   {
    "id": "THEORY1",
    "tradition": "Governmentality and political economy",
    "contribution": "Governmentality traces classification and conduct; political economy tests ownership, labor, profit, and distributed costs.",
    "limitations": [
     "Neither tradition alone establishes intent, effectiveness, or proportionality."
    ],
    "relevance": "relevant",
    "evidence_ids": [
     "E1",
     "E2"
    ]
   }
  ],
  "human_functions": [
   {
    "id": "HF1",
    "domain": "biological",
    "name": "Mobility, health protection, and social participation",
    "scientific_definition": "Population-level infection risk interacts with individual health status and exposure.",
    "lived_context": "People experienced the same credential as protection, administrative burden, exclusion, or reassurance depending on risk, work, and legal context.",
    "governed_variation": "Different credentials and exemptions produced different access categories.",
    "authority_defining_normality": "Public-health authorities",
    "refusal_conditions": "Refusal was meaningful only where free alternatives and non-essential settings existed.",
    "confidence": "medium"
   }
  ],
  "power_map": {
   "actors": [
    {
     "id": "ACT1",
     "name": "Public-health authorities",
     "role": "decision_maker",
     "formal_mandate": "Protect public health under applicable law.",
     "material_interests": [
      "Administrative coordination",
      "Institutional legitimacy"
     ],
     "authority_sources": [
      "Public-health law",
      "Expertise"
     ],
     "funding": [
      "Public budget"
     ],
     "information_advantages": [
      "Epidemiological data"
     ],
     "enforcement_capacities": [
      "Access rules"
     ],
     "dependencies": [
      "Legislative authority",
      "Technical vendors"
     ],
     "stated_objectives": [
      "Reduce transmission risk"
     ],
     "plausible_unstated_incentives": [
      "Demonstrate governability during crisis"
     ],
     "internal_disagreements": [
      "Scope and duration"
     ],
     "accountability": [
      "Courts",
      "Legislatures",
      "Data-protection authorities"
     ],
     "confidence": "high"
    }
   ],
   "affected_populations": [
    {
     "id": "POP1",
     "name": "Workers and residents subject to access checks",
     "classification": "Eligible / temporarily ineligible for specified settings",
     "exposure": [
      "Access checks"
     ],
     "benefits": [
      "Lower-friction verification during an acute health emergency."
     ],
     "burdens": [
      "Exclusion and unequal burden where testing, vaccination, documentation, or appeal were inaccessible."
     ],
     "agency": "Litigation, protest, technical workarounds, and demands for sunset clauses changed implementation.",
     "missing_from_record": false,
     "confidence": "medium"
    }
   ],
   "institutions": [
    {
     "id": "INST1",
     "name": "Credential verification network",
     "mandate": "Implement defined access rules.",
     "role": "implementation",
     "accountability": [
      "Purpose limitation",
      "Audit",
      "Appeal"
     ],
     "confidence": "medium"
    }
   ],
   "power_asymmetries": [
    {
     "id": "ASYM1",
     "between": [
      "ACT1",
      "POP1"
     ],
     "resource": "infrastructure",
     "effect": "Authorities and venues could condition access; individuals had uneven ability to contest errors.",
     "confidence": "high"
    }
   ]
  },
  "mechanisms": {
   "instruments": [
    {
     "id": "INS1",
     "name": "QR credential and verification rule",
     "type": "infrastructure",
     "mechanism": "Transforms a defined health status into a machine-readable access decision.",
     "scale": [
      "individual",
      "institutional",
      "national"
     ],
     "stated_purpose": "Lower-friction verification during an acute health emergency.",
     "ownership": "Mixed public rules and public/private technical infrastructure.",
     "oversight": "Varied by jurisdiction.",
     "confidence": "high"
    }
   ],
   "infrastructures": [
    {
     "id": "INF1",
     "name": "Credential issuance and verification infrastructure",
     "owner": "Public authorities and contracted technical providers",
     "dependency_created": "Access could depend on device, documentation, testing, or recognized credential.",
     "actions_enabled_or_blocked": [
      "Entry to regulated settings"
     ],
     "access_conditions": [
      "Valid credential or recognized exemption"
     ],
     "confidence": "high"
    }
   ],
   "political_economy": [
    {
     "id": "PE1",
     "ownership": "Mixed public and vendor control",
     "labor": "Healthcare, administrative, and venue staff",
     "profit": "Vendor contracts and compliance services",
     "unpaid_care": "Households absorbed scheduling and documentation work",
     "privatized_risks": [
      "Time and access costs"
     ],
     "socialized_costs": [
      "Public testing and administration"
     ],
     "scarcity_mechanism": "Unequal access to tests and documents",
     "dependency_model": "Credential-dependent access",
     "confidence": "medium"
    }
   ],
   "power_modes": [
    {
     "mode": "biopower",
     "mechanism": "Population risk was administered through individual credentials.",
     "evidence_ids": [
      "E1"
     ],
     "confidence": "high"
    },
    {
     "mode": "datafication",
     "mechanism": "Health status became standardized data used for access decisions.",
     "evidence_ids": [
      "E1"
     ],
     "confidence": "high"
    }
   ]
  },
  "meaning_systems": {
   "norms": [
    {
     "id": "NORM1",
     "name": "Responsible participation through verifiable status",
     "definition": "Participation was framed as responsible when status could be verified.",
     "authority": "Public-health authorities",
     "subject_position": "The responsible, verifiable participant.",
     "alternatives": [
      "Universal precautions without status sorting"
     ],
     "confidence": "medium"
    }
   ],
   "regimes_of_truth": [
    {
     "id": "RT1",
     "claim": "Defined credentials were treated as operational proxies for lower risk.",
     "authorizing_institutions": [
      "Public-health authorities"
     ],
     "validation_procedure": "Policy and epidemiological review",
     "funding_or_interest": "Public-health administration",
     "excluded_knowledge": [
      "Context-specific behavioral variation"
     ],
     "evidence_quality": "Mixed and time-sensitive",
     "confidence": "medium"
    }
   ],
   "classifications": [
    {
     "id": "CLASS1",
     "category": "Eligible / temporarily ineligible for specified settings",
     "definition": "Rule-based credential status",
     "decision_use": "Access to specified settings",
     "error_risks": [
      "Outdated records",
      "Unequal document access"
     ],
     "contestability": "Varied by jurisdiction",
     "confidence": "high"
    }
   ],
   "looping_effects": [
    {
     "id": "LOOP1",
     "classification_id": "CLASS1",
     "institutional_response": "Grant or deny access",
     "altered_opportunity_or_identity": "Credential status became salient to participation",
     "behavioral_adaptation": "Testing, vaccination, avoidance, protest, or workarounds",
     "new_data": "Verification and uptake records",
     "confirmation_or_revision": "Rules were extended, narrowed, or withdrawn",
     "falsified_if": [
      "No behavioral or institutional adaptation follows classification"
     ],
     "confidence": "medium"
    }
   ]
  },
  "intervention_assessment": {
   "interventions": [
    {
     "id": "IV1",
     "name": "Conditional access using health evidence",
     "target_function_ids": [
      "HF1"
     ],
     "actor_ids": [
      "ACT1"
     ],
     "instrument_ids": [
      "INS1"
     ],
     "modality": "mixed",
     "stated_benefit": "Lower-friction verification during an acute health emergency.",
     "evidence_of_benefit": [
      "E1"
     ],
     "documented_harms": [
      "Exclusion and unequal burden where testing, vaccination, documentation, or appeal were inaccessible."
     ],
     "necessity": "partly_supported",
     "proportionality": "mixed",
     "dependency_created": "Credential or alternative proof could become necessary for participation.",
     "consent": "Partial: participation and alternatives varied.",
     "exit": "Stronger where sunset clauses and non-digital alternatives existed.",
     "contestability": "Varied by appeal and correction mechanisms.",
     "confidence": "medium"
    }
   ],
   "capture_assessment": {
    "status": "mixed_capture",
    "criteria": [
     {
      "criterion": "knowledge_deficit",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "The structural fixture does not contain enough verified evidence for a firmer finding."
     },
     {
      "criterion": "consent_failure",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "The structural fixture does not contain enough verified evidence for a firmer finding."
     },
     {
      "criterion": "vulnerability_exploitation",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "The structural fixture does not contain enough verified evidence for a firmer finding."
     },
     {
      "criterion": "unequal_distribution",
      "status": "present",
      "evidence_ids": [
       "E1"
      ],
      "reason": "Access burdens varied with testing, documentation, work flexibility, and digital access."
     },
     {
      "criterion": "disproportionate_power_or_profit",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "The structural fixture does not contain enough verified evidence for a firmer finding."
     },
     {
      "criterion": "dependency_or_costly_exit",
      "status": "present",
      "evidence_ids": [
       "E1"
      ],
      "reason": "Access to some settings depended on recognized proof or an available alternative."
     },
     {
      "criterion": "alternatives_suppressed",
      "status": "uncertain",
      "evidence_ids": [
       "E1",
       "E2"
      ],
      "reason": "Testing, exemptions, and non-digital alternatives varied across jurisdictions."
     },
     {
      "criterion": "behavior_optimized_without_oversight",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "The structural fixture does not contain enough verified evidence for a firmer finding."
     },
     {
      "criterion": "choice_architecture_constraint",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "The structural fixture does not contain enough verified evidence for a firmer finding."
     },
     {
      "criterion": "data_repurposing",
      "status": "uncertain",
      "evidence_ids": [
       "E2"
      ],
      "reason": "Cross-domain reuse must be demonstrated rather than inferred from technical possibility."
     },
     {
      "criterion": "human_capacity_commercialized",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "The structural fixture does not contain enough verified evidence for a firmer finding."
     },
     {
      "criterion": "classification_not_contestable",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "The structural fixture does not contain enough verified evidence for a firmer finding."
     },
     {
      "criterion": "environmental_unavoidability",
      "status": "not_applicable",
      "evidence_ids": [],
      "reason": "The case does not center an unavoidable environmental exposure."
     }
    ],
    "counter_evidence": [
     "Many schemes included sunset clauses, exemptions, free testing, judicial review, or were discontinued."
    ],
    "legitimate_benefits": [
     "Lower-friction verification during an acute health emergency."
    ],
    "conclusion": "The intervention combined protection with conditional access. A capture finding depends on duration, alternatives, purpose limitation, reuse, and contestability.",
    "confidence": "medium"
   },
   "care_control_tensions": [
    {
     "id": "TENSION1",
     "care_claim": "Collective protection",
     "control_effects": [
      "Conditional access",
      "Status verification"
     ],
     "interpretation": "Care and control overlapped without being identical.",
     "severity": 3,
     "confidence": "high"
    }
   ]
  },
  "scale_time": {
   "scales": [
    "individual",
    "institutional",
    "national",
    "transnational"
   ],
   "immediate_effects": [
    "Faster status verification",
    "Conditional access"
   ],
   "medium_term_adaptations": [
    "Rule changes",
    "Litigation",
    "Behavioral adaptation"
   ],
   "intergenerational_effects": [],
   "historical_continuities": [
    "Identity and border health controls"
   ],
   "path_dependencies": [
    "Investment in interoperable credential infrastructure"
   ],
   "future_feedback_loops": [
    {
     "id": "FUT1",
     "name": "Cross-domain reuse",
     "timeframe": "2–5 years",
     "drivers": [
      "Interoperability",
      "Institutional sunk costs"
     ],
     "early_signals": [
      "Use beyond the original health purpose"
     ],
     "falsified_if": [
      "Infrastructure is dismantled and reuse is legally prohibited"
     ],
     "rationale": "Reusable infrastructure can outlast the emergency that justified it.",
     "probability": 40
    }
   ]
  },
  "distribution": {
   "items": [
    {
     "id": "DIST1",
     "population_id": "POP1",
     "benefits": [
      "Lower-friction verification during an acute health emergency."
     ],
     "burdens": [
      "Exclusion and unequal burden where testing, vaccination, documentation, or appeal were inaccessible."
     ],
     "protection": [
      "Reduced exposure in some settings"
     ],
     "opportunity": [
      "Access conditional on proof"
     ],
     "recognition": [
      "Responsible participant identity"
     ],
     "profit": [
      "Vendor and compliance revenue"
     ],
     "voice": [
      "Uneven consultation"
     ],
     "risk": [
      "Exclusion error"
     ],
     "surveillance": [
      "Verification events"
     ],
     "discipline": [
      "Behavior shaped by access conditions"
     ],
     "displacement": [],
     "illness_injury_death": [
      "Potential avoided infection; effect size context-dependent"
     ],
     "axes": [
      "class",
      "disability",
      "age",
      "citizenship"
     ],
     "scale": [
      "individual",
      "institutional"
     ],
     "time_horizon": "immediate and medium term",
     "outcome_character": "uncertain",
     "confidence": "medium"
    }
   ],
   "inequality_dimensions": [
    {
     "axis": "class",
     "mechanism": "Unequal access to testing, documentation, flexible work, and digital devices.",
     "affected_groups": [
      "Workers and residents subject to access checks"
     ],
     "evidence_ids": [
      "E1"
     ],
     "confidence": "medium"
    }
   ],
   "necropolitical_dimensions": []
  },
  "consent_exit": {
   "consent_status": "partial",
   "informed": "partial",
   "specific": "partial",
   "revocable": "partial",
   "comprehensible": "partial",
   "materially_voluntary": "partial",
   "exit_conditions": [
    "Free testing",
    "Non-digital credential",
    "Exemption",
    "Sunset clause"
   ],
   "contestability": [
    "Correction process",
    "Administrative appeal",
    "Judicial review"
   ],
   "accountability": [
    "Data-protection oversight",
    "Legislative review"
   ]
  },
  "competing_explanations": [
   {
    "id": "EX1",
    "type": "official",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "A temporary public-health coordination tool reduced avoidable transmission risk.",
    "mechanism": "Risk verification and access coordination.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   },
   {
    "id": "EX2",
    "type": "public_interest",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "The intervention sought a lower-friction way to protect shared spaces while reopening activity.",
    "mechanism": "Collective-risk reduction through differentiated precautions.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   },
   {
    "id": "EX3",
    "type": "political_economy",
    "relevance": "relevant",
    "evidentiary_status": "not_assessed",
    "claim": "Contracting, compliance costs, and unequal work flexibility may have shaped implementation.",
    "mechanism": "Costs and benefits are distributed through ownership, labor, and procurement.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   },
   {
    "id": "EX4",
    "type": "institutional_inertia",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "Reusable infrastructure can outlast the emergency that justified it.",
    "mechanism": "Sunk costs and interoperability can favor continued institutional use.",
    "supporting_evidence_ids": [
     "E2"
    ],
    "counter_evidence_ids": [
     "E1"
    ],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   },
   {
    "id": "EX5",
    "type": "security",
    "relevance": "uncertain",
    "evidentiary_status": "not_assessed",
    "claim": "A broader security rationale may matter where health credentials intersect border control.",
    "mechanism": "Identity and risk systems can converge at borders.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   },
   {
    "id": "EX6",
    "type": "cultural",
    "relevance": "relevant",
    "evidentiary_status": "not_assessed",
    "claim": "Norms of solidarity, responsibility, and bodily autonomy shaped acceptance and refusal.",
    "mechanism": "Competing moral frames changed how the same rule was interpreted.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   },
   {
    "id": "EX7",
    "type": "technological",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "Interoperable QR infrastructure made rapid status verification administratively feasible.",
    "mechanism": "Standardized credentials reduce verification cost and increase scalability.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   },
   {
    "id": "EX8",
    "type": "critical_biopolitical",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "The pass normalized infrastructural classification of bodies and conditional participation.",
    "mechanism": "Datafication and classification condition participation.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   },
   {
    "id": "EX9",
    "type": "actor_error_unintended_consequence",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "Some exclusion may have resulted from implementation error rather than a coherent strategy of control.",
    "mechanism": "Administrative complexity and uneven capacity.",
    "supporting_evidence_ids": [
     "E2"
    ],
    "counter_evidence_ids": [
     "E1"
    ],
    "falsified_if": [
     "Better comparative evidence contradicts the proposed mechanism."
    ],
    "confidence": "low"
   }
  ],
  "evidence": {
   "items": [
    {
     "id": "E1",
     "claim": "Rules linked defined health credentials to access in specified settings.",
     "epistemic_type": "verified_fact",
     "source_tier": "primary_legal_policy",
     "source_title": "Jurisdiction-specific health-pass law or regulation — replace with verified source",
     "source_url": "",
     "source_locator": "",
     "source_date": "",
     "geography": "2020–2022, selected European jurisdictions",
     "population": "Workers and residents subject to access checks",
     "measurement_method": "Legal and policy document review",
     "denominator": "Not applicable",
     "sample_size": "Not applicable",
     "measurement_validity": "Requires verification against each jurisdiction's operative instrument.",
     "causal_identification": "Descriptive legal-policy evidence only.",
     "replication_status": "not_applicable",
     "conflicts_of_interest": "Not assessed in this structural fixture.",
     "missing_data": "Verified jurisdiction-specific sources are absent.",
     "selection_effects": "Jurisdictions are illustrative, not sampled.",
     "relevant_comparison": "Compare rules with and without free alternatives and sunset clauses.",
     "cross_context_applicability": "Do not generalize across jurisdictions without verification.",
     "claim_source_fit": "unknown",
     "verification_status": "unverified",
     "verified_by": "",
     "verification_date": "",
     "uncertainty": "Rules differed by jurisdiction and changed over time.",
     "limitations": "The fixture demonstrates structure and does not supply a universal empirical conclusion.",
     "counter_evidence": "Many schemes included sunset clauses, exemptions, free testing, judicial review, or were discontinued.",
     "confidence": "medium"
    },
    {
     "id": "E2",
     "claim": "Implementation and sunset conditions varied materially.",
     "epistemic_type": "plausible_inference",
     "source_tier": "reputable_organization_report",
     "source_title": "Comparative implementation review — replace with verified source",
     "source_url": "",
     "source_locator": "",
     "source_date": "",
     "geography": "2020–2022, selected European jurisdictions",
     "population": "Workers and residents subject to access checks",
     "measurement_method": "Comparative policy review",
     "denominator": "Not applicable",
     "sample_size": "Not reported in this structural fixture",
     "measurement_validity": "Unverified",
     "causal_identification": "Descriptive comparison only",
     "replication_status": "unknown",
     "conflicts_of_interest": "Unknown",
     "missing_data": "Underlying comparative sources are not supplied.",
     "selection_effects": "Case selection is not documented.",
     "relevant_comparison": "Rules across selected jurisdictions",
     "cross_context_applicability": "Unknown until sources are verified",
     "claim_source_fit": "unknown",
     "verification_status": "unverified",
     "verified_by": "",
     "verification_date": "",
     "uncertainty": "Incomplete cross-jurisdictional comparability.",
     "limitations": "Requires verified jurisdiction-specific sourcing.",
     "counter_evidence": "Some systems may have had weak oversight or durable technical reuse.",
     "confidence": "low"
    }
   ]
  },
  "assumptions": {
   "items": [
    {
     "id": "AS1",
     "assumption": "Technical interoperability increases the possibility of reuse.",
     "risk": "medium",
     "disproving_test": "Interoperable systems are dismantled or legally prevented from reuse.",
     "implication_if_wrong": "Path-dependency concerns would be overstated.",
     "confidence": "medium"
    }
   ]
  },
  "resistance_agency": {
   "items": [
    {
     "id": "RES1",
     "actor_or_population": "Workers and residents subject to access checks",
     "form": "litigation",
     "mechanism": "Litigation, protest, technical workarounds, and demands for sunset clauses changed implementation.",
     "effect_on_system": "Narrowed, clarified, or terminated some rules.",
     "constraints": [
      "Cost",
      "Unequal legal access"
     ],
     "confidence": "medium"
    }
   ]
  },
  "alternatives": {
   "items": [
    {
     "id": "ALT1",
     "level": "national",
     "proposal": "Narrow, time-limited rules with free alternatives, strict purpose limitation, independent audit, and accessible appeal.",
     "mechanism": "Preserve the protective objective while reducing dependency, exclusion, and function creep.",
     "feasibility": "medium",
     "tradeoffs": [
      "Administrative cost",
      "Potentially slower verification"
     ],
     "rights_safeguards": [
      "Purpose limitation",
      "Sunset clause",
      "Appeal",
      "Non-digital alternative"
     ],
     "evidence_needed": [
      "Comparative effectiveness and burden data"
     ],
     "lower_harm_rationale": "Maintains proportional protection while preserving exit and contestability."
    }
   ]
  },
  "calibrated_conclusion": {
   "strongly_supported": [
    "The credential converted health information into an access-control signal."
   ],
   "plausible_unconfirmed": [
    "Reusable infrastructure can outlast the emergency that justified it."
   ],
   "disputed": [
    "The net epidemiological benefit and distributional cost varied by jurisdiction and period."
   ],
   "unknown": [
    "Long-term normalization effects cannot be inferred from short-term adoption alone."
   ],
   "evidence_that_would_change": [
    "Comparative evidence showing either durable cross-domain reuse or complete institutional dismantling."
   ],
   "overall_confidence": "medium"
  },
  "self_audit": {
   "malicious_intent_without_evidence": "pass",
   "institutional_claims_uncritically": "pass",
   "metaphor_as_mechanism": "pass",
   "human_function_identified": "pass",
   "mechanism_explained": "pass",
   "care_control_overlap": "pass",
   "material_and_meaning": "pass",
   "history_included": "pass",
   "political_economy_included": "pass",
   "inequality_dimensions": "pass",
   "agency_resistance": "pass",
   "competing_explanations": "pass",
   "statistics_quotations_verified": "concern",
   "uncertainty_stated": "pass",
   "benefits_costs_identified": "pass",
   "realistic_alternatives": "pass",
   "stigmatization_risk_checked": "pass",
   "falsifier_identified": "pass"
  },
  "self_audit_notes": [
   "This fixture is a structural example; replace placeholder source titles with verified jurisdiction-specific evidence."
  ],
  "links": [
   {
    "from": "HF1",
    "to": "INS1",
    "relation": "enables",
    "mechanism": "Health risk became operational through credential verification.",
    "confidence": "high"
   },
   {
    "from": "INS1",
    "to": "CLASS1",
    "relation": "classifies",
    "mechanism": "Verification assigns access status.",
    "confidence": "high"
   },
   {
    "from": "CLASS1",
    "to": "DIST1",
    "relation": "distributes",
    "mechanism": "Status changes access and burden.",
    "confidence": "high"
   },
   {
    "from": "RES1",
    "to": "IV1",
    "relation": "resists",
    "mechanism": "Contestation changes scope and duration.",
    "confidence": "medium"
   }
  ],
  "migration": null
 },
 "ar": {
  "schema_version": "2.1.0",
  "analysis_contract": "biopolitical-training-map-v2",
  "contract_status": "canonical",
  "analysis_id": "health-pass-v2-ar",
  "generated_at": "2026-07-17T00:00:00Z",
  "language": "ar",
  "model_mode": "research",
  "analysis_lens": "biopolitical",
  "subject": {
   "title": "الجوازات الصحية الرقمية والحركة المشروطة",
   "context": "2020–2022، ولايات أوروبية مختارة",
   "research_question": "متى عملت الجوازات الصحية الرقمية كحماية للصحة العامة، ومتى أنشأت أنظمة دائمة للتصنيف والحركة المشروطة؟",
   "executive_finding": "جمعت الجوازات الرقمية بين وظيفة صحية عامة مشروعة وبنية جديدة لضبط الوصول. تدعم الأدلة وصفًا مختلطًا: كانت الحماية والتنسيق الإداري حقيقيين، بينما اختلف التناسب وإعادة الاستخدام والأعباء غير المتكافئة وإمكانية الخروج حسب الولاية."
  },
  "framing": {
   "contested_terms": [
    {
     "term": "الجواز الصحي",
     "definitions": [
      "وثيقة قابلة للتحقق تربط معلومة صحية محددة بقرار وصول."
     ],
     "working_definition": "وثيقة قابلة للتحقق تربط معلومة صحية محددة بقرار وصول.",
     "stakes": "يحدد التعريف الممارسات التي تُعد تنسيقًا صحيًا مقابل ضبط عام للوصول."
    }
   ],
   "historical_context": {
    "summary": "ظهرت أنظمة الجواز خلال جائحة حادة واعتمدت على بنى سابقة للهوية والتلقيح وضبط الحدود.",
    "turning_points": [
     "طارئ وبائي حاد",
     "نشر وثائق قابلة للتشغيل البيني",
     "مراجعة قضائية وسياسية"
    ],
    "continuities": [
     "التحقق من الهوية",
     "سجلات التلقيح",
     "الضوابط الصحية على الحدود"
    ]
   },
   "official_problem_definition": "التحقق من حالة صحية محددة لتقليل العدوى القابلة للتجنب في أماكن مختارة.",
   "critical_problem_definition": "تحويل الحالة الجسدية إلى شرط ترخيص للمشاركة العادية.",
   "unknowns": [
    "لا يمكن استنتاج التطبيع بعيد المدى من التبني القصير وحده."
   ]
  },
  "legal_framework": {
   "status": "assessed",
   "jurisdictions": [
    "2020–2022، ولايات أوروبية مختارة"
   ],
   "applicable_authorities": [
    "قانون الصحة العامة وقانون حماية البيانات؛ تتطلب الصكوك الدقيقة تحققًا خاصًا بكل ولاية."
   ],
   "rights_engaged": [
    "الخصوصية وعدم التمييز والحركة والعمل والوصول إلى الخدمات الأساسية."
   ],
   "safeguards_and_remedies": [
    "تضمنت أنظمة كثيرة بنود انتهاء وإعفاءات واختبارًا مجانيًا ومراجعة قضائية أو أُوقفت."
   ],
   "uncertainties": [
    "لا يمكن استنتاج التطبيع بعيد المدى من التبني القصير وحده."
   ]
  },
  "international_comparison": [
   {
    "id": "CMP1",
    "jurisdiction_or_context": "2020–2022، ولايات أوروبية مختارة",
    "comparison_basis": "قارن المدة والإعفاءات والبدائل المجانية وتقييد الغرض والطعن والتفكيك.",
    "similarities": [
     "ربط التحقق القائم على الوثائق المعلومات الصحية بالوصول."
    ],
    "differences": [
     "تضمنت أنظمة كثيرة بنود انتهاء وإعفاءات واختبارًا مجانيًا ومراجعة قضائية أو أُوقفت."
    ],
    "transfer_limits": [
     "لا يمكن استنتاج التطبيع بعيد المدى من التبني القصير وحده."
    ],
    "evidence_ids": [
     "E1",
     "E2"
    ],
    "confidence": "low"
   }
  ],
  "capture_levels": [
   {
    "level": "body",
    "status": "present",
    "finding": "جرى النظر صراحة في مستوى الجسد، وتظل الثقة محدودة بسبب عدم تحقق مصادر المثال.",
    "evidence_ids": [
     "E1"
    ]
   },
   {
    "level": "mind",
    "status": "uncertain",
    "finding": "جرى النظر صراحة في مستوى العقل، وتظل الثقة محدودة بسبب عدم تحقق مصادر المثال.",
    "evidence_ids": []
   },
   {
    "level": "relationship",
    "status": "uncertain",
    "finding": "جرى النظر صراحة في مستوى العلاقة، وتظل الثقة محدودة بسبب عدم تحقق مصادر المثال.",
    "evidence_ids": []
   },
   {
    "level": "population",
    "status": "present",
    "finding": "جرى النظر صراحة في مستوى السكان، وتظل الثقة محدودة بسبب عدم تحقق مصادر المثال.",
    "evidence_ids": [
     "E1"
    ]
   },
   {
    "level": "environment",
    "status": "not_applicable",
    "finding": "جرى النظر صراحة في مستوى البيئة، وتظل الثقة محدودة بسبب عدم تحقق مصادر المثال.",
    "evidence_ids": []
   }
  ],
  "theoretical_comparison": [
   {
    "id": "THEORY1",
    "tradition": "الحكمانية والاقتصاد السياسي",
    "contribution": "تتبع الحكمانية التصنيف والسلوك، ويختبر الاقتصاد السياسي الملكية والعمل والربح وتوزيع التكاليف.",
    "limitations": [
     "لا يثبت أي من التقليدين وحده النية أو الفعالية أو التناسب."
    ],
    "relevance": "relevant",
    "evidence_ids": [
     "E1",
     "E2"
    ]
   }
  ],
  "human_functions": [
   {
    "id": "HF1",
    "domain": "biological",
    "name": "الحركة والحماية الصحية والمشاركة الاجتماعية",
    "scientific_definition": "يتفاعل خطر العدوى على مستوى السكان مع الحالة الصحية الفردية والتعرض.",
    "lived_context": "اختبر الناس الوثيقة كحماية أو عبء إداري أو إقصاء أو طمأنة بحسب المخاطر والعمل والسياق القانوني.",
    "governed_variation": "أنتج اختلاف الوثائق والإعفاءات فئات وصول مختلفة.",
    "authority_defining_normality": "سلطات الصحة العامة",
    "refusal_conditions": "كان الرفض ذا معنى فقط حيث وُجدت بدائل مجانية وأماكن غير أساسية.",
    "confidence": "medium"
   }
  ],
  "power_map": {
   "actors": [
    {
     "id": "ACT1",
     "name": "سلطات الصحة العامة",
     "role": "decision_maker",
     "formal_mandate": "حماية الصحة العامة وفق القانون المنطبق.",
     "material_interests": [
      "التنسيق الإداري",
      "الشرعية المؤسسية"
     ],
     "authority_sources": [
      "قانون الصحة العامة",
      "الخبرة"
     ],
     "funding": [
      "الميزانية العامة"
     ],
     "information_advantages": [
      "البيانات الوبائية"
     ],
     "enforcement_capacities": [
      "قواعد الوصول"
     ],
     "dependencies": [
      "السلطة التشريعية",
      "الموردون التقنيون"
     ],
     "stated_objectives": [
      "تقليل خطر العدوى"
     ],
     "plausible_unstated_incentives": [
      "إظهار القدرة على الإدارة خلال الأزمة"
     ],
     "internal_disagreements": [
      "النطاق والمدة"
     ],
     "accountability": [
      "المحاكم",
      "الهيئات التشريعية",
      "سلطات حماية البيانات"
     ],
     "confidence": "high"
    }
   ],
   "affected_populations": [
    {
     "id": "POP1",
     "name": "عمال وسكان خاضعون لفحوص الوصول",
     "classification": "مؤهل / غير مؤهل مؤقتًا لأماكن محددة",
     "exposure": [
      "فحوص الوصول"
     ],
     "benefits": [
      "تحقق أقل احتكاكًا خلال طارئ صحي حاد."
     ],
     "burdens": [
      "إقصاء وعبء غير متكافئ عندما يتعذر الاختبار أو التلقيح أو التوثيق أو الطعن."
     ],
     "agency": "غيّرت الدعاوى والاحتجاجات والحلول التقنية والمطالبة ببنود الانتهاء طريقة التنفيذ.",
     "missing_from_record": false,
     "confidence": "medium"
    }
   ],
   "institutions": [
    {
     "id": "INST1",
     "name": "شبكة التحقق من الوثائق",
     "mandate": "تنفيذ قواعد الوصول المحددة.",
     "role": "تنفيذ",
     "accountability": [
      "تقييد الغرض",
      "التدقيق",
      "الطعن"
     ],
     "confidence": "medium"
    }
   ],
   "power_asymmetries": [
    {
     "id": "ASYM1",
     "between": [
      "ACT1",
      "POP1"
     ],
     "resource": "infrastructure",
     "effect": "استطاعت السلطات والأماكن اشتراط الوصول، بينما تفاوتت قدرة الأفراد على الطعن في الأخطاء.",
     "confidence": "high"
    }
   ]
  },
  "mechanisms": {
   "instruments": [
    {
     "id": "INS1",
     "name": "وثيقة QR وقاعدة تحقق",
     "type": "infrastructure",
     "mechanism": "تحوّل حالة صحية محددة إلى قرار وصول قابل للقراءة آليًا.",
     "scale": [
      "individual",
      "institutional",
      "national"
     ],
     "stated_purpose": "تحقق أقل احتكاكًا خلال طارئ صحي حاد.",
     "ownership": "قواعد عامة وبنية تقنية عامة/خاصة مختلطة.",
     "oversight": "اختلف حسب الولاية.",
     "confidence": "high"
    }
   ],
   "infrastructures": [
    {
     "id": "INF1",
     "name": "بنية إصدار الوثائق والتحقق منها",
     "owner": "السلطات العامة والمزودون التقنيون المتعاقدون",
     "dependency_created": "قد يعتمد الوصول على جهاز أو وثائق أو اختبار أو وثيقة معترف بها.",
     "actions_enabled_or_blocked": [
      "دخول الأماكن المنظمة"
     ],
     "access_conditions": [
      "وثيقة صالحة أو إعفاء معترف به"
     ],
     "confidence": "high"
    }
   ],
   "political_economy": [
    {
     "id": "PE1",
     "ownership": "سيطرة مختلطة بين القطاع العام والموردين",
     "labor": "العاملون في الصحة والإدارة والأماكن",
     "profit": "عقود الموردين وخدمات الامتثال",
     "unpaid_care": "تحملت الأسر أعمال المواعيد والتوثيق",
     "privatized_risks": [
      "تكاليف الوقت والوصول"
     ],
     "socialized_costs": [
      "الاختبار والإدارة الممولان عامًا"
     ],
     "scarcity_mechanism": "تفاوت الوصول إلى الاختبارات والوثائق",
     "dependency_model": "وصول يعتمد على الوثيقة",
     "confidence": "medium"
    }
   ],
   "power_modes": [
    {
     "mode": "biopower",
     "mechanism": "أُدير خطر السكان عبر وثائق فردية.",
     "evidence_ids": [
      "E1"
     ],
     "confidence": "high"
    },
    {
     "mode": "datafication",
     "mechanism": "أصبحت الحالة الصحية بيانات معيارية تُستخدم في قرارات الوصول.",
     "evidence_ids": [
      "E1"
     ],
     "confidence": "high"
    }
   ]
  },
  "meaning_systems": {
   "norms": [
    {
     "id": "NORM1",
     "name": "المشاركة المسؤولة عبر حالة قابلة للتحقق",
     "definition": "قُدّمت المشاركة على أنها مسؤولة عندما أمكن التحقق من الحالة.",
     "authority": "سلطات الصحة العامة",
     "subject_position": "المشارك المسؤول القابل للتحقق.",
     "alternatives": [
      "احتياطات شاملة دون فرز حسب الحالة"
     ],
     "confidence": "medium"
    }
   ],
   "regimes_of_truth": [
    {
     "id": "RT1",
     "claim": "عوملت الوثائق المحددة كبدائل تشغيلية لانخفاض الخطر.",
     "authorizing_institutions": [
      "سلطات الصحة العامة"
     ],
     "validation_procedure": "مراجعة السياسات والأدلة الوبائية",
     "funding_or_interest": "إدارة الصحة العامة",
     "excluded_knowledge": [
      "التباين السلوكي الخاص بالسياق"
     ],
     "evidence_quality": "مختلطة وحساسة للزمن",
     "confidence": "medium"
    }
   ],
   "classifications": [
    {
     "id": "CLASS1",
     "category": "مؤهل / غير مؤهل مؤقتًا لأماكن محددة",
     "definition": "حالة وثيقة قائمة على القواعد",
     "decision_use": "الوصول إلى أماكن محددة",
     "error_risks": [
      "سجلات قديمة",
      "تفاوت الوصول إلى الوثائق"
     ],
     "contestability": "اختلف حسب الولاية",
     "confidence": "high"
    }
   ],
   "looping_effects": [
    {
     "id": "LOOP1",
     "classification_id": "CLASS1",
     "institutional_response": "منح الوصول أو منعه",
     "altered_opportunity_or_identity": "أصبحت حالة الوثيقة حاسمة للمشاركة",
     "behavioral_adaptation": "الاختبار أو التلقيح أو التجنب أو الاحتجاج أو الحلول الالتفافية",
     "new_data": "سجلات التحقق والإقبال",
     "confirmation_or_revision": "وُسعت القواعد أو ضُيقت أو سُحبت",
     "falsified_if": [
      "لا يتبع التصنيف أي تكيف سلوكي أو مؤسسي"
     ],
     "confidence": "medium"
    }
   ]
  },
  "intervention_assessment": {
   "interventions": [
    {
     "id": "IV1",
     "name": "وصول مشروط باستخدام دليل صحي",
     "target_function_ids": [
      "HF1"
     ],
     "actor_ids": [
      "ACT1"
     ],
     "instrument_ids": [
      "INS1"
     ],
     "modality": "mixed",
     "stated_benefit": "تحقق أقل احتكاكًا خلال طارئ صحي حاد.",
     "evidence_of_benefit": [
      "E1"
     ],
     "documented_harms": [
      "إقصاء وعبء غير متكافئ عندما يتعذر الاختبار أو التلقيح أو التوثيق أو الطعن."
     ],
     "necessity": "partly_supported",
     "proportionality": "mixed",
     "dependency_created": "قد تصبح الوثيقة أو الإثبات البديل ضروريين للمشاركة.",
     "consent": "جزئية: اختلفت المشاركة والبدائل.",
     "exit": "أقوى حيث وُجدت بنود انتهاء وبدائل غير رقمية.",
     "contestability": "اختلفت باختلاف آليات الطعن والتصحيح.",
     "confidence": "medium"
    }
   ],
   "capture_assessment": {
    "status": "mixed_capture",
    "criteria": [
     {
      "criterion": "knowledge_deficit",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "لا يتضمن المثال البنيوي أدلة متحققة كافية لحكم أكثر حسمًا."
     },
     {
      "criterion": "consent_failure",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "لا يتضمن المثال البنيوي أدلة متحققة كافية لحكم أكثر حسمًا."
     },
     {
      "criterion": "vulnerability_exploitation",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "لا يتضمن المثال البنيوي أدلة متحققة كافية لحكم أكثر حسمًا."
     },
     {
      "criterion": "unequal_distribution",
      "status": "present",
      "evidence_ids": [
       "E1"
      ],
      "reason": "اختلفت أعباء الوصول باختلاف إتاحة الاختبار والتوثيق ومرونة العمل والوصول الرقمي."
     },
     {
      "criterion": "disproportionate_power_or_profit",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "لا يتضمن المثال البنيوي أدلة متحققة كافية لحكم أكثر حسمًا."
     },
     {
      "criterion": "dependency_or_costly_exit",
      "status": "present",
      "evidence_ids": [
       "E1"
      ],
      "reason": "اعتمد الوصول إلى بعض الأماكن على إثبات معترف به أو بديل متاح."
     },
     {
      "criterion": "alternatives_suppressed",
      "status": "uncertain",
      "evidence_ids": [
       "E1",
       "E2"
      ],
      "reason": "اختلفت الاختبارات والإعفاءات والبدائل غير الرقمية بين الولايات."
     },
     {
      "criterion": "behavior_optimized_without_oversight",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "لا يتضمن المثال البنيوي أدلة متحققة كافية لحكم أكثر حسمًا."
     },
     {
      "criterion": "choice_architecture_constraint",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "لا يتضمن المثال البنيوي أدلة متحققة كافية لحكم أكثر حسمًا."
     },
     {
      "criterion": "data_repurposing",
      "status": "uncertain",
      "evidence_ids": [
       "E2"
      ],
      "reason": "يجب إثبات إعادة الاستخدام عبر المجالات بدل استنتاجها من الإمكان التقني."
     },
     {
      "criterion": "human_capacity_commercialized",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "لا يتضمن المثال البنيوي أدلة متحققة كافية لحكم أكثر حسمًا."
     },
     {
      "criterion": "classification_not_contestable",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "لا يتضمن المثال البنيوي أدلة متحققة كافية لحكم أكثر حسمًا."
     },
     {
      "criterion": "environmental_unavoidability",
      "status": "not_applicable",
      "evidence_ids": [],
      "reason": "لا تتمحور الحالة حول تعرض بيئي لا يمكن تجنبه."
     }
    ],
    "counter_evidence": [
     "تضمنت أنظمة كثيرة بنود انتهاء وإعفاءات واختبارًا مجانيًا ومراجعة قضائية أو أُوقفت."
    ],
    "legitimate_benefits": [
     "تحقق أقل احتكاكًا خلال طارئ صحي حاد."
    ],
    "conclusion": "جمع التدخل بين الحماية والوصول المشروط. ويتوقف حكم الاستحواذ على المدة والبدائل وتقييد الغرض وإعادة الاستخدام وقابلية الطعن.",
    "confidence": "medium"
   },
   "care_control_tensions": [
    {
     "id": "TENSION1",
     "care_claim": "الحماية الجماعية",
     "control_effects": [
      "الوصول المشروط",
      "التحقق من الحالة"
     ],
     "interpretation": "تداخلت الرعاية والسيطرة دون أن تتطابقا.",
     "severity": 3,
     "confidence": "high"
    }
   ]
  },
  "scale_time": {
   "scales": [
    "individual",
    "institutional",
    "national",
    "transnational"
   ],
   "immediate_effects": [
    "تحقق أسرع من الحالة",
    "الوصول المشروط"
   ],
   "medium_term_adaptations": [
    "تغييرات القواعد",
    "التقاضي",
    "التكيف السلوكي"
   ],
   "intergenerational_effects": [],
   "historical_continuities": [
    "ضوابط الهوية والصحة الحدودية"
   ],
   "path_dependencies": [
    "الاستثمار في بنية وثائق قابلة للتشغيل البيني"
   ],
   "future_feedback_loops": [
    {
     "id": "FUT1",
     "name": "إعادة الاستخدام عبر المجالات",
     "timeframe": "من سنتين إلى خمس سنوات",
     "drivers": [
      "قابلية التشغيل البيني",
      "التكاليف المؤسسية الغارقة"
     ],
     "early_signals": [
      "الاستخدام خارج الغرض الصحي الأصلي"
     ],
     "falsified_if": [
      "تُفكك البنية ويُحظر إعادة استخدامها قانونيًا"
     ],
     "rationale": "قد تعيش البنية القابلة لإعادة الاستخدام أطول من الطارئ الذي بررها.",
     "probability": 40
    }
   ]
  },
  "distribution": {
   "items": [
    {
     "id": "DIST1",
     "population_id": "POP1",
     "benefits": [
      "تحقق أقل احتكاكًا خلال طارئ صحي حاد."
     ],
     "burdens": [
      "إقصاء وعبء غير متكافئ عندما يتعذر الاختبار أو التلقيح أو التوثيق أو الطعن."
     ],
     "protection": [
      "خفض التعرض في بعض الأماكن"
     ],
     "opportunity": [
      "وصول مشروط بإثبات"
     ],
     "recognition": [
      "هوية المشارك المسؤول"
     ],
     "profit": [
      "إيرادات الموردين والامتثال"
     ],
     "voice": [
      "تشاور غير متكافئ"
     ],
     "risk": [
      "خطأ إقصاء"
     ],
     "surveillance": [
      "وقائع التحقق"
     ],
     "discipline": [
      "سلوك تشكله شروط الوصول"
     ],
     "displacement": [],
     "illness_injury_death": [
      "عدوى محتملة جرى تجنبها؛ حجم الأثر يعتمد على السياق"
     ],
     "axes": [
      "class",
      "disability",
      "age",
      "citizenship"
     ],
     "scale": [
      "individual",
      "institutional"
     ],
     "time_horizon": "فوري ومتوسط المدى",
     "outcome_character": "uncertain",
     "confidence": "medium"
    }
   ],
   "inequality_dimensions": [
    {
     "axis": "class",
     "mechanism": "تفاوت الوصول إلى الاختبار والتوثيق والعمل المرن والأجهزة الرقمية.",
     "affected_groups": [
      "عمال وسكان خاضعون لفحوص الوصول"
     ],
     "evidence_ids": [
      "E1"
     ],
     "confidence": "medium"
    }
   ],
   "necropolitical_dimensions": []
  },
  "consent_exit": {
   "consent_status": "partial",
   "informed": "partial",
   "specific": "partial",
   "revocable": "partial",
   "comprehensible": "partial",
   "materially_voluntary": "partial",
   "exit_conditions": [
    "اختبار مجاني",
    "وثيقة غير رقمية",
    "إعفاء",
    "بند انتهاء"
   ],
   "contestability": [
    "إجراء تصحيح",
    "طعن إداري",
    "مراجعة قضائية"
   ],
   "accountability": [
    "رقابة حماية البيانات",
    "مراجعة تشريعية"
   ]
  },
  "competing_explanations": [
   {
    "id": "EX1",
    "type": "official",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "أداة مؤقتة لتنسيق الصحة العامة خفّضت مخاطر العدوى القابلة للتجنب.",
    "mechanism": "التحقق من المخاطر وتنسيق الوصول.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   },
   {
    "id": "EX2",
    "type": "public_interest",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "سعى التدخل إلى وسيلة أقل احتكاكًا لحماية الأماكن المشتركة مع إعادة فتح النشاط.",
    "mechanism": "خفض المخاطر الجماعية عبر احتياطات متمايزة.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   },
   {
    "id": "EX3",
    "type": "political_economy",
    "relevance": "relevant",
    "evidentiary_status": "not_assessed",
    "claim": "ربما شكّلت التعاقدات وتكاليف الامتثال وعدم تكافؤ مرونة العمل طريقة التنفيذ.",
    "mechanism": "تتوزع التكاليف والمنافع عبر الملكية والعمل والمشتريات.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   },
   {
    "id": "EX4",
    "type": "institutional_inertia",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "قد تعيش البنية القابلة لإعادة الاستخدام أطول من الطارئ الذي بررها.",
    "mechanism": "قد تدفع التكاليف الغارقة وقابلية التشغيل البيني إلى استمرار الاستخدام المؤسسي.",
    "supporting_evidence_ids": [
     "E2"
    ],
    "counter_evidence_ids": [
     "E1"
    ],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   },
   {
    "id": "EX5",
    "type": "security",
    "relevance": "uncertain",
    "evidentiary_status": "not_assessed",
    "claim": "قد يهم منطق أمني أوسع حين تتقاطع الوثائق الصحية مع ضبط الحدود.",
    "mechanism": "قد تتقارب أنظمة الهوية والمخاطر عند الحدود.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   },
   {
    "id": "EX6",
    "type": "cultural",
    "relevance": "relevant",
    "evidentiary_status": "not_assessed",
    "claim": "شكّلت معايير التضامن والمسؤولية والاستقلال الجسدي القبول والرفض.",
    "mechanism": "غيّرت الأطر الأخلاقية المتنافسة تفسير القاعدة نفسها.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   },
   {
    "id": "EX7",
    "type": "technological",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "جعلت بنية رموز QR القابلة للتشغيل البيني التحقق السريع من الحالة ممكنًا إداريًا.",
    "mechanism": "تخفض الوثائق المعيارية تكلفة التحقق وتزيد قابلية التوسع.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   },
   {
    "id": "EX8",
    "type": "critical_biopolitical",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "طبّع الجواز التصنيف البنيوي للأجساد والمشاركة المشروطة.",
    "mechanism": "تشترط البيانات والتصنيف المشاركة.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   },
   {
    "id": "EX9",
    "type": "actor_error_unintended_consequence",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "ربما نتج بعض الإقصاء عن أخطاء التنفيذ لا عن استراتيجية سيطرة متماسكة.",
    "mechanism": "التعقيد الإداري وتفاوت القدرة.",
    "supporting_evidence_ids": [
     "E2"
    ],
    "counter_evidence_ids": [
     "E1"
    ],
    "falsified_if": [
     "يناقض دليل مقارن أفضل الآلية المقترحة."
    ],
    "confidence": "low"
   }
  ],
  "evidence": {
   "items": [
    {
     "id": "E1",
     "claim": "ربطت القواعد وثائق صحية محددة بالوصول إلى أماكن بعينها.",
     "epistemic_type": "verified_fact",
     "source_tier": "primary_legal_policy",
     "source_title": "قانون أو لائحة للجواز الصحي خاصة بالولاية — استبدلها بمصدر متحقق",
     "source_url": "",
     "source_locator": "",
     "source_date": "",
     "geography": "2020–2022، ولايات أوروبية مختارة",
     "population": "عمال وسكان خاضعون لفحوص الوصول",
     "measurement_method": "مراجعة الوثائق القانونية والسياسات",
     "denominator": "غير منطبق",
     "sample_size": "غير منطبق",
     "measurement_validity": "يتطلب التحقق مقابل الصك النافذ في كل ولاية.",
     "causal_identification": "دليل وصفي قانوني وسياساتي فقط.",
     "replication_status": "not_applicable",
     "conflicts_of_interest": "غير مُقيّم في هذا المثال البنيوي.",
     "missing_data": "تغيب المصادر المتحققة الخاصة بكل ولاية.",
     "selection_effects": "الولايات توضيحية وليست عينة منهجية.",
     "relevant_comparison": "قارن القواعد بوجود بدائل مجانية وبنود انتهاء وبدونهما.",
     "cross_context_applicability": "لا تعمم عبر الولايات دون تحقق.",
     "claim_source_fit": "unknown",
     "verification_status": "unverified",
     "verified_by": "",
     "verification_date": "",
     "uncertainty": "اختلفت القواعد حسب الولاية وتغيرت بمرور الوقت.",
     "limitations": "يوضح المثال البنية ولا يقدم خلاصة تجريبية عامة.",
     "counter_evidence": "تضمنت أنظمة كثيرة بنود انتهاء وإعفاءات واختبارًا مجانيًا ومراجعة قضائية أو أُوقفت.",
     "confidence": "medium"
    },
    {
     "id": "E2",
     "claim": "اختلفت شروط التنفيذ والانتهاء اختلافًا جوهريًا.",
     "epistemic_type": "plausible_inference",
     "source_tier": "reputable_organization_report",
     "source_title": "مراجعة مقارنة للتنفيذ — استبدلها بمصدر متحقق",
     "source_url": "",
     "source_locator": "",
     "source_date": "",
     "geography": "2020–2022، ولايات أوروبية مختارة",
     "population": "عمال وسكان خاضعون لفحوص الوصول",
     "measurement_method": "مراجعة مقارنة للسياسات",
     "denominator": "غير منطبق",
     "sample_size": "غير مذكور في هذا المثال البنيوي",
     "measurement_validity": "غير متحقق",
     "causal_identification": "مقارنة وصفية فقط",
     "replication_status": "unknown",
     "conflicts_of_interest": "غير معلوم",
     "missing_data": "لم تُرفق المصادر المقارنة الأساسية.",
     "selection_effects": "اختيار الحالات غير موثق.",
     "relevant_comparison": "القواعد عبر ولايات مختارة",
     "cross_context_applicability": "غير معلوم حتى التحقق من المصادر",
     "claim_source_fit": "unknown",
     "verification_status": "unverified",
     "verified_by": "",
     "verification_date": "",
     "uncertainty": "قابلية المقارنة بين الولايات غير مكتملة.",
     "limitations": "يتطلب مصادر متحققة خاصة بكل ولاية.",
     "counter_evidence": "ربما اتسمت بعض الأنظمة برقابة ضعيفة أو إعادة استخدام تقني دائمة.",
     "confidence": "low"
    }
   ]
  },
  "assumptions": {
   "items": [
    {
     "id": "AS1",
     "assumption": "تزيد قابلية التشغيل البيني التقنية احتمال إعادة الاستخدام.",
     "risk": "medium",
     "disproving_test": "تُفكك الأنظمة القابلة للتشغيل البيني أو يُمنع إعادة استخدامها قانونيًا.",
     "implication_if_wrong": "ستكون مخاوف الاعتماد على المسار مبالغًا فيها.",
     "confidence": "medium"
    }
   ]
  },
  "resistance_agency": {
   "items": [
    {
     "id": "RES1",
     "actor_or_population": "عمال وسكان خاضعون لفحوص الوصول",
     "form": "litigation",
     "mechanism": "غيّرت الدعاوى والاحتجاجات والحلول التقنية والمطالبة ببنود الانتهاء طريقة التنفيذ.",
     "effect_on_system": "ضيّقت بعض القواعد أو أوضحتها أو أنهتها.",
     "constraints": [
      "الكلفة",
      "تفاوت الوصول القانوني"
     ],
     "confidence": "medium"
    }
   ]
  },
  "alternatives": {
   "items": [
    {
     "id": "ALT1",
     "level": "national",
     "proposal": "قواعد ضيقة ومحددة زمنيًا مع بدائل مجانية وتقييد صارم للغرض وتدقيق مستقل وطعن ميسّر.",
     "mechanism": "الحفاظ على هدف الحماية مع خفض التبعية والإقصاء وانحراف الوظيفة.",
     "feasibility": "medium",
     "tradeoffs": [
      "الكلفة الإدارية",
      "تحقق أبطأ محتملًا"
     ],
     "rights_safeguards": [
      "تقييد الغرض",
      "بند انتهاء",
      "الطعن",
      "بديل غير رقمي"
     ],
     "evidence_needed": [
      "بيانات مقارنة عن الفعالية والأعباء"
     ],
     "lower_harm_rationale": "يحافظ على حماية متناسبة مع صون الخروج وقابلية الطعن."
    }
   ]
  },
  "calibrated_conclusion": {
   "strongly_supported": [
    "حوّلت الوثيقة المعلومة الصحية إلى إشارة لضبط الوصول."
   ],
   "plausible_unconfirmed": [
    "قد تعيش البنية القابلة لإعادة الاستخدام أطول من الطارئ الذي بررها."
   ],
   "disputed": [
    "اختلف صافي المنفعة الوبائية والتكلفة التوزيعية حسب الولاية والفترة."
   ],
   "unknown": [
    "لا يمكن استنتاج التطبيع بعيد المدى من التبني القصير وحده."
   ],
   "evidence_that_would_change": [
    "دليل مقارن يثبت إعادة استخدام دائمة عبر مجالات أخرى أو تفكيكًا مؤسسيًا كاملًا."
   ],
   "overall_confidence": "medium"
  },
  "self_audit": {
   "malicious_intent_without_evidence": "pass",
   "institutional_claims_uncritically": "pass",
   "metaphor_as_mechanism": "pass",
   "human_function_identified": "pass",
   "mechanism_explained": "pass",
   "care_control_overlap": "pass",
   "material_and_meaning": "pass",
   "history_included": "pass",
   "political_economy_included": "pass",
   "inequality_dimensions": "pass",
   "agency_resistance": "pass",
   "competing_explanations": "pass",
   "statistics_quotations_verified": "concern",
   "uncertainty_stated": "pass",
   "benefits_costs_identified": "pass",
   "realistic_alternatives": "pass",
   "stigmatization_risk_checked": "pass",
   "falsifier_identified": "pass"
  },
  "self_audit_notes": [
   "هذا المثال بنيوي؛ استبدل عناوين المصادر النائبة بأدلة متحققة خاصة بكل ولاية."
  ],
  "links": [
   {
    "from": "HF1",
    "to": "INS1",
    "relation": "enables",
    "mechanism": "أصبح الخطر الصحي قابلًا للتشغيل عبر التحقق من الوثيقة.",
    "confidence": "high"
   },
   {
    "from": "INS1",
    "to": "CLASS1",
    "relation": "classifies",
    "mechanism": "يعيّن التحقق حالة الوصول.",
    "confidence": "high"
   },
   {
    "from": "CLASS1",
    "to": "DIST1",
    "relation": "distributes",
    "mechanism": "تغيّر الحالة الوصول والعبء.",
    "confidence": "high"
   },
   {
    "from": "RES1",
    "to": "IV1",
    "relation": "resists",
    "mechanism": "يغيّر الطعن النطاق والمدة.",
    "confidence": "medium"
   }
  ],
  "migration": null
 },
 "fr": {
  "schema_version": "2.1.0",
  "analysis_contract": "biopolitical-training-map-v2",
  "contract_status": "canonical",
  "analysis_id": "health-pass-v2-fr",
  "generated_at": "2026-07-17T00:00:00Z",
  "language": "fr",
  "model_mode": "research",
  "analysis_lens": "biopolitical",
  "subject": {
   "title": "Pass sanitaires numériques et mobilité conditionnelle",
   "context": "2020–2022, juridictions européennes sélectionnées",
   "research_question": "Dans quelles conditions les pass sanitaires ont-ils protégé la santé publique, et dans quelles conditions ont-ils créé des systèmes durables de classification et de mobilité conditionnelle ?",
   "executive_finding": "Les pass ont combiné une fonction sanitaire légitime et une nouvelle infrastructure de contrôle d’accès. Les preuves soutiennent une qualification mixte : protection et coordination étaient réelles, tandis que proportionnalité, réutilisation, charges inégales et possibilité de sortie variaient selon les juridictions."
  },
  "framing": {
   "contested_terms": [
    {
     "term": "pass sanitaire",
     "definitions": [
      "Justificatif vérifiable reliant une information sanitaire définie à une décision d’accès."
     ],
     "working_definition": "Justificatif vérifiable reliant une information sanitaire définie à une décision d’accès.",
     "stakes": "La définition détermine quelles pratiques relèvent de la coordination sanitaire ou d’un contrôle général de l’accès."
    }
   ],
   "historical_context": {
    "summary": "Les systèmes de pass sont apparus pendant une pandémie aiguë, sur des infrastructures d’identité, vaccination et frontière préexistantes.",
    "turning_points": [
     "Urgence pandémique aiguë",
     "Déploiement de justificatifs interopérables",
     "Contrôle judiciaire et politique"
    ],
    "continuities": [
     "Vérification de l’identité",
     "Registres de vaccination",
     "Contrôles sanitaires aux frontières"
    ]
   },
   "official_problem_definition": "Vérifier un statut sanitaire défini afin de réduire les transmissions évitables dans certains lieux.",
   "critical_problem_definition": "Transformer un statut corporel en condition d’autorisation de la participation ordinaire.",
   "unknowns": [
    "Les effets de normalisation à long terme ne découlent pas de la seule adoption temporaire."
   ]
  },
  "legal_framework": {
   "status": "assessed",
   "jurisdictions": [
    "2020–2022, juridictions européennes sélectionnées"
   ],
   "applicable_authorities": [
    "Droit de la santé publique et protection des données ; les instruments exacts exigent une vérification propre à chaque juridiction."
   ],
   "rights_engaged": [
    "Vie privée, non-discrimination, circulation, travail et accès aux services essentiels."
   ],
   "safeguards_and_remedies": [
    "De nombreux dispositifs avaient des clauses d’extinction, exemptions, tests gratuits, contrôle judiciaire ou furent abandonnés."
   ],
   "uncertainties": [
    "Les effets de normalisation à long terme ne découlent pas de la seule adoption temporaire."
   ]
  },
  "international_comparison": [
   {
    "id": "CMP1",
    "jurisdiction_or_context": "2020–2022, juridictions européennes sélectionnées",
    "comparison_basis": "Comparer durée, exemptions, alternatives gratuites, limitation de finalité, recours et démantèlement.",
    "similarities": [
     "La vérification par justificatif reliait information sanitaire et accès."
    ],
    "differences": [
     "De nombreux dispositifs avaient des clauses d’extinction, exemptions, tests gratuits, contrôle judiciaire ou furent abandonnés."
    ],
    "transfer_limits": [
     "Les effets de normalisation à long terme ne découlent pas de la seule adoption temporaire."
    ],
    "evidence_ids": [
     "E1",
     "E2"
    ],
    "confidence": "low"
   }
  ],
  "capture_levels": [
   {
    "level": "body",
    "status": "present",
    "finding": "Le niveau corps a été examiné explicitement ; la confiance reste limitée par les sources non vérifiées de l’exemple.",
    "evidence_ids": [
     "E1"
    ]
   },
   {
    "level": "mind",
    "status": "uncertain",
    "finding": "Le niveau esprit a été examiné explicitement ; la confiance reste limitée par les sources non vérifiées de l’exemple.",
    "evidence_ids": []
   },
   {
    "level": "relationship",
    "status": "uncertain",
    "finding": "Le niveau relation a été examiné explicitement ; la confiance reste limitée par les sources non vérifiées de l’exemple.",
    "evidence_ids": []
   },
   {
    "level": "population",
    "status": "present",
    "finding": "Le niveau population a été examiné explicitement ; la confiance reste limitée par les sources non vérifiées de l’exemple.",
    "evidence_ids": [
     "E1"
    ]
   },
   {
    "level": "environment",
    "status": "not_applicable",
    "finding": "Le niveau environnement a été examiné explicitement ; la confiance reste limitée par les sources non vérifiées de l’exemple.",
    "evidence_ids": []
   }
  ],
  "theoretical_comparison": [
   {
    "id": "THEORY1",
    "tradition": "Gouvernementalité et économie politique",
    "contribution": "La gouvernementalité suit classification et conduite ; l’économie politique examine propriété, travail, profit et répartition des coûts.",
    "limitations": [
     "Aucune de ces traditions n’établit à elle seule l’intention, l’efficacité ou la proportionnalité."
    ],
    "relevance": "relevant",
    "evidence_ids": [
     "E1",
     "E2"
    ]
   }
  ],
  "human_functions": [
   {
    "id": "HF1",
    "domain": "biological",
    "name": "Mobilité, protection sanitaire et participation sociale",
    "scientific_definition": "Le risque infectieux au niveau de la population interagit avec l’état de santé individuel et l’exposition.",
    "lived_context": "Selon le risque, le travail et le contexte juridique, le même justificatif fut vécu comme protection, charge administrative, exclusion ou réassurance.",
    "governed_variation": "Des justificatifs et exemptions différents ont produit des catégories d’accès distinctes.",
    "authority_defining_normality": "Autorités de santé publique",
    "refusal_conditions": "Le refus n’était effectif que là où existaient des alternatives gratuites et des espaces non essentiels.",
    "confidence": "medium"
   }
  ],
  "power_map": {
   "actors": [
    {
     "id": "ACT1",
     "name": "Autorités de santé publique",
     "role": "decision_maker",
     "formal_mandate": "Protéger la santé publique conformément au droit applicable.",
     "material_interests": [
      "Coordination administrative",
      "Légitimité institutionnelle"
     ],
     "authority_sources": [
      "Droit de la santé publique",
      "Expertise"
     ],
     "funding": [
      "Budget public"
     ],
     "information_advantages": [
      "Données épidémiologiques"
     ],
     "enforcement_capacities": [
      "Règles d’accès"
     ],
     "dependencies": [
      "Autorité législative",
      "Prestataires techniques"
     ],
     "stated_objectives": [
      "Réduire le risque de transmission"
     ],
     "plausible_unstated_incentives": [
      "Démontrer la capacité de gouvernement en période de crise"
     ],
     "internal_disagreements": [
      "Portée et durée"
     ],
     "accountability": [
      "Tribunaux",
      "Assemblées législatives",
      "Autorités de protection des données"
     ],
     "confidence": "high"
    }
   ],
   "affected_populations": [
    {
     "id": "POP1",
     "name": "Travailleurs et résidents soumis aux contrôles d’accès",
     "classification": "Éligible / temporairement inéligible à certains espaces",
     "exposure": [
      "Contrôles d’accès"
     ],
     "benefits": [
      "Vérification à faible friction pendant une urgence sanitaire aiguë."
     ],
     "burdens": [
      "Exclusion et charge inégale lorsque test, vaccination, documentation ou recours étaient inaccessibles."
     ],
     "agency": "Contentieux, protestations, contournements techniques et demandes de clauses d’extinction ont modifié la mise en œuvre.",
     "missing_from_record": false,
     "confidence": "medium"
    }
   ],
   "institutions": [
    {
     "id": "INST1",
     "name": "Réseau de vérification des justificatifs",
     "mandate": "Mettre en œuvre les règles d’accès définies.",
     "role": "mise en œuvre",
     "accountability": [
      "Limitation de finalité",
      "Audit",
      "Recours"
     ],
     "confidence": "medium"
    }
   ],
   "power_asymmetries": [
    {
     "id": "ASYM1",
     "between": [
      "ACT1",
      "POP1"
     ],
     "resource": "infrastructure",
     "effect": "Autorités et établissements pouvaient conditionner l’accès, tandis que la capacité individuelle à contester les erreurs était inégale.",
     "confidence": "high"
    }
   ]
  },
  "mechanisms": {
   "instruments": [
    {
     "id": "INS1",
     "name": "Justificatif QR et règle de vérification",
     "type": "infrastructure",
     "mechanism": "Transforme un statut sanitaire défini en décision d’accès lisible par machine.",
     "scale": [
      "individual",
      "institutional",
      "national"
     ],
     "stated_purpose": "Vérification à faible friction pendant une urgence sanitaire aiguë.",
     "ownership": "Règles publiques et infrastructure technique publique-privée mixtes.",
     "oversight": "Variable selon la juridiction.",
     "confidence": "high"
    }
   ],
   "infrastructures": [
    {
     "id": "INF1",
     "name": "Infrastructure d’émission et de vérification des justificatifs",
     "owner": "Autorités publiques et prestataires techniques sous contrat",
     "dependency_created": "L’accès pouvait dépendre d’un appareil, de documents, d’un test ou d’un justificatif reconnu.",
     "actions_enabled_or_blocked": [
      "Entrée dans les espaces réglementés"
     ],
     "access_conditions": [
      "Justificatif valide ou exemption reconnue"
     ],
     "confidence": "high"
    }
   ],
   "political_economy": [
    {
     "id": "PE1",
     "ownership": "Contrôle mixte public et prestataire",
     "labor": "Personnel sanitaire, administratif et des établissements",
     "profit": "Contrats de prestataires et services de conformité",
     "unpaid_care": "Les ménages ont absorbé le travail de planification et de documentation",
     "privatized_risks": [
      "Coûts de temps et d’accès"
     ],
     "socialized_costs": [
      "Tests et administration publics"
     ],
     "scarcity_mechanism": "Accès inégal aux tests et aux documents",
     "dependency_model": "Accès dépendant du justificatif",
     "confidence": "medium"
    }
   ],
   "power_modes": [
    {
     "mode": "biopower",
     "mechanism": "Le risque populationnel a été administré au moyen de justificatifs individuels.",
     "evidence_ids": [
      "E1"
     ],
     "confidence": "high"
    },
    {
     "mode": "datafication",
     "mechanism": "Le statut sanitaire est devenu une donnée standardisée utilisée dans les décisions d’accès.",
     "evidence_ids": [
      "E1"
     ],
     "confidence": "high"
    }
   ]
  },
  "meaning_systems": {
   "norms": [
    {
     "id": "NORM1",
     "name": "Participation responsable par statut vérifiable",
     "definition": "La participation était qualifiée de responsable lorsque le statut pouvait être vérifié.",
     "authority": "Autorités de santé publique",
     "subject_position": "Le participant responsable et vérifiable.",
     "alternatives": [
      "Précautions universelles sans tri par statut"
     ],
     "confidence": "medium"
    }
   ],
   "regimes_of_truth": [
    {
     "id": "RT1",
     "claim": "Les justificatifs définis ont servi de proxys opérationnels d’un risque moindre.",
     "authorizing_institutions": [
      "Autorités de santé publique"
     ],
     "validation_procedure": "Examen des politiques et des données épidémiologiques",
     "funding_or_interest": "Administration de la santé publique",
     "excluded_knowledge": [
      "Variation comportementale propre au contexte"
     ],
     "evidence_quality": "Mixte et sensible au temps",
     "confidence": "medium"
    }
   ],
   "classifications": [
    {
     "id": "CLASS1",
     "category": "Éligible / temporairement inéligible à certains espaces",
     "definition": "Statut de justificatif fondé sur des règles",
     "decision_use": "Accès à des lieux déterminés",
     "error_risks": [
      "Dossiers obsolètes",
      "Accès inégal aux documents"
     ],
     "contestability": "Variable selon la juridiction",
     "confidence": "high"
    }
   ],
   "looping_effects": [
    {
     "id": "LOOP1",
     "classification_id": "CLASS1",
     "institutional_response": "Autoriser ou refuser l’accès",
     "altered_opportunity_or_identity": "Le statut du justificatif est devenu déterminant pour la participation",
     "behavioral_adaptation": "Test, vaccination, évitement, protestation ou contournement",
     "new_data": "Registres de vérification et d’adoption",
     "confirmation_or_revision": "Les règles ont été étendues, resserrées ou retirées",
     "falsified_if": [
      "Aucune adaptation comportementale ou institutionnelle ne suit la classification"
     ],
     "confidence": "medium"
    }
   ]
  },
  "intervention_assessment": {
   "interventions": [
    {
     "id": "IV1",
     "name": "Accès conditionnel fondé sur une preuve sanitaire",
     "target_function_ids": [
      "HF1"
     ],
     "actor_ids": [
      "ACT1"
     ],
     "instrument_ids": [
      "INS1"
     ],
     "modality": "mixed",
     "stated_benefit": "Vérification à faible friction pendant une urgence sanitaire aiguë.",
     "evidence_of_benefit": [
      "E1"
     ],
     "documented_harms": [
      "Exclusion et charge inégale lorsque test, vaccination, documentation ou recours étaient inaccessibles."
     ],
     "necessity": "partly_supported",
     "proportionality": "mixed",
     "dependency_created": "Un justificatif ou une preuve alternative pouvait devenir nécessaire à la participation.",
     "consent": "Partiel : participation et alternatives variaient.",
     "exit": "Plus solide là où existaient des clauses d’extinction et des alternatives non numériques.",
     "contestability": "Variable selon les mécanismes de recours et de correction.",
     "confidence": "medium"
    }
   ],
   "capture_assessment": {
    "status": "mixed_capture",
    "criteria": [
     {
      "criterion": "knowledge_deficit",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "L’exemple structurel ne contient pas assez de preuves vérifiées pour une conclusion plus ferme."
     },
     {
      "criterion": "consent_failure",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "L’exemple structurel ne contient pas assez de preuves vérifiées pour une conclusion plus ferme."
     },
     {
      "criterion": "vulnerability_exploitation",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "L’exemple structurel ne contient pas assez de preuves vérifiées pour une conclusion plus ferme."
     },
     {
      "criterion": "unequal_distribution",
      "status": "present",
      "evidence_ids": [
       "E1"
      ],
      "reason": "Les charges d’accès variaient selon l’accès aux tests, aux documents, à la flexibilité du travail et au numérique."
     },
     {
      "criterion": "disproportionate_power_or_profit",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "L’exemple structurel ne contient pas assez de preuves vérifiées pour une conclusion plus ferme."
     },
     {
      "criterion": "dependency_or_costly_exit",
      "status": "present",
      "evidence_ids": [
       "E1"
      ],
      "reason": "L’accès à certains lieux dépendait d’un justificatif reconnu ou d’une alternative disponible."
     },
     {
      "criterion": "alternatives_suppressed",
      "status": "uncertain",
      "evidence_ids": [
       "E1",
       "E2"
      ],
      "reason": "Tests, exemptions et alternatives non numériques variaient selon les juridictions."
     },
     {
      "criterion": "behavior_optimized_without_oversight",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "L’exemple structurel ne contient pas assez de preuves vérifiées pour une conclusion plus ferme."
     },
     {
      "criterion": "choice_architecture_constraint",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "L’exemple structurel ne contient pas assez de preuves vérifiées pour une conclusion plus ferme."
     },
     {
      "criterion": "data_repurposing",
      "status": "uncertain",
      "evidence_ids": [
       "E2"
      ],
      "reason": "La réutilisation intersectorielle doit être démontrée et non déduite de la seule possibilité technique."
     },
     {
      "criterion": "human_capacity_commercialized",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "L’exemple structurel ne contient pas assez de preuves vérifiées pour une conclusion plus ferme."
     },
     {
      "criterion": "classification_not_contestable",
      "status": "uncertain",
      "evidence_ids": [],
      "reason": "L’exemple structurel ne contient pas assez de preuves vérifiées pour une conclusion plus ferme."
     },
     {
      "criterion": "environmental_unavoidability",
      "status": "not_applicable",
      "evidence_ids": [],
      "reason": "Le cas ne porte pas principalement sur une exposition environnementale inévitable."
     }
    ],
    "counter_evidence": [
     "De nombreux dispositifs avaient des clauses d’extinction, exemptions, tests gratuits, contrôle judiciaire ou furent abandonnés."
    ],
    "legitimate_benefits": [
     "Vérification à faible friction pendant une urgence sanitaire aiguë."
    ],
    "conclusion": "L’intervention combinait protection et accès conditionnel. Le constat de capture dépend de la durée, des alternatives, de la limitation de finalité, de la réutilisation et de la contestabilité.",
    "confidence": "medium"
   },
   "care_control_tensions": [
    {
     "id": "TENSION1",
     "care_claim": "Protection collective",
     "control_effects": [
      "Accès conditionnel",
      "Vérification du statut"
     ],
     "interpretation": "Soin et contrôle se chevauchaient sans être identiques.",
     "severity": 3,
     "confidence": "high"
    }
   ]
  },
  "scale_time": {
   "scales": [
    "individual",
    "institutional",
    "national",
    "transnational"
   ],
   "immediate_effects": [
    "Vérification plus rapide du statut",
    "Accès conditionnel"
   ],
   "medium_term_adaptations": [
    "Modification des règles",
    "Contentieux",
    "Adaptation comportementale"
   ],
   "intergenerational_effects": [],
   "historical_continuities": [
    "Contrôles d’identité et sanitaires aux frontières"
   ],
   "path_dependencies": [
    "Investissement dans une infrastructure de justificatifs interopérables"
   ],
   "future_feedback_loops": [
    {
     "id": "FUT1",
     "name": "Réutilisation intersectorielle",
     "timeframe": "2 à 5 ans",
     "drivers": [
      "Interopérabilité",
      "Coûts institutionnels irrécupérables"
     ],
     "early_signals": [
      "Usage au-delà de la finalité sanitaire initiale"
     ],
     "falsified_if": [
      "L’infrastructure est démantelée et sa réutilisation interdite par la loi"
     ],
     "rationale": "Une infrastructure réutilisable peut survivre à l’urgence qui l’a justifiée.",
     "probability": 40
    }
   ]
  },
  "distribution": {
   "items": [
    {
     "id": "DIST1",
     "population_id": "POP1",
     "benefits": [
      "Vérification à faible friction pendant une urgence sanitaire aiguë."
     ],
     "burdens": [
      "Exclusion et charge inégale lorsque test, vaccination, documentation ou recours étaient inaccessibles."
     ],
     "protection": [
      "Réduction de l’exposition dans certains lieux"
     ],
     "opportunity": [
      "Accès conditionné à une preuve"
     ],
     "recognition": [
      "Identité du participant responsable"
     ],
     "profit": [
      "Revenus des prestataires et de la conformité"
     ],
     "voice": [
      "Consultation inégale"
     ],
     "risk": [
      "Erreur d’exclusion"
     ],
     "surveillance": [
      "Événements de vérification"
     ],
     "discipline": [
      "Comportement façonné par les conditions d’accès"
     ],
     "displacement": [],
     "illness_injury_death": [
      "Infections potentiellement évitées ; ampleur de l’effet dépendante du contexte"
     ],
     "axes": [
      "class",
      "disability",
      "age",
      "citizenship"
     ],
     "scale": [
      "individual",
      "institutional"
     ],
     "time_horizon": "immédiat et moyen terme",
     "outcome_character": "uncertain",
     "confidence": "medium"
    }
   ],
   "inequality_dimensions": [
    {
     "axis": "class",
     "mechanism": "Accès inégal aux tests, aux documents, au travail flexible et aux appareils numériques.",
     "affected_groups": [
      "Travailleurs et résidents soumis aux contrôles d’accès"
     ],
     "evidence_ids": [
      "E1"
     ],
     "confidence": "medium"
    }
   ],
   "necropolitical_dimensions": []
  },
  "consent_exit": {
   "consent_status": "partial",
   "informed": "partial",
   "specific": "partial",
   "revocable": "partial",
   "comprehensible": "partial",
   "materially_voluntary": "partial",
   "exit_conditions": [
    "Tests gratuits",
    "Justificatif non numérique",
    "Exemption",
    "Clause d’extinction"
   ],
   "contestability": [
    "Procédure de correction",
    "Recours administratif",
    "Contrôle judiciaire"
   ],
   "accountability": [
    "Contrôle de la protection des données",
    "Contrôle législatif"
   ]
  },
  "competing_explanations": [
   {
    "id": "EX1",
    "type": "official",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "Un outil temporaire de coordination sanitaire a réduit un risque évitable de transmission.",
    "mechanism": "Vérification du risque et coordination de l’accès.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   },
   {
    "id": "EX2",
    "type": "public_interest",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "L’intervention cherchait un moyen moins contraignant de protéger les espaces partagés lors de la reprise d’activité.",
    "mechanism": "Réduction du risque collectif par des précautions différenciées.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   },
   {
    "id": "EX3",
    "type": "political_economy",
    "relevance": "relevant",
    "evidentiary_status": "not_assessed",
    "claim": "Les contrats, les coûts de conformité et l’inégale flexibilité du travail ont pu façonner la mise en œuvre.",
    "mechanism": "Coûts et bénéfices se répartissent par la propriété, le travail et les marchés publics.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   },
   {
    "id": "EX4",
    "type": "institutional_inertia",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "Une infrastructure réutilisable peut survivre à l’urgence qui l’a justifiée.",
    "mechanism": "Les coûts irrécupérables et l’interopérabilité peuvent favoriser la poursuite de l’usage institutionnel.",
    "supporting_evidence_ids": [
     "E2"
    ],
    "counter_evidence_ids": [
     "E1"
    ],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   },
   {
    "id": "EX5",
    "type": "security",
    "relevance": "uncertain",
    "evidentiary_status": "not_assessed",
    "claim": "Une logique sécuritaire plus large peut compter lorsque les justificatifs sanitaires croisent le contrôle frontalier.",
    "mechanism": "Les systèmes d’identité et de risque peuvent converger aux frontières.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   },
   {
    "id": "EX6",
    "type": "cultural",
    "relevance": "relevant",
    "evidentiary_status": "not_assessed",
    "claim": "Les normes de solidarité, de responsabilité et d’autonomie corporelle ont façonné acceptation et refus.",
    "mechanism": "Des cadres moraux concurrents ont modifié l’interprétation d’une même règle.",
    "supporting_evidence_ids": [],
    "counter_evidence_ids": [],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   },
   {
    "id": "EX7",
    "type": "technological",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "L’infrastructure QR interopérable a rendu administrativement possible une vérification rapide du statut.",
    "mechanism": "Les justificatifs standardisés réduisent le coût de vérification et augmentent la capacité de déploiement.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   },
   {
    "id": "EX8",
    "type": "critical_biopolitical",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "Le pass a normalisé une classification infrastructurelle des corps et de la participation.",
    "mechanism": "La mise en données et la classification conditionnent la participation.",
    "supporting_evidence_ids": [
     "E1"
    ],
    "counter_evidence_ids": [
     "E2"
    ],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   },
   {
    "id": "EX9",
    "type": "actor_error_unintended_consequence",
    "relevance": "relevant",
    "evidentiary_status": "plausible",
    "claim": "Une partie de l’exclusion peut provenir d’erreurs de mise en œuvre plutôt que d’une stratégie cohérente de contrôle.",
    "mechanism": "Complexité administrative et capacités inégales.",
    "supporting_evidence_ids": [
     "E2"
    ],
    "counter_evidence_ids": [
     "E1"
    ],
    "falsified_if": [
     "De meilleures preuves comparatives contredisent le mécanisme proposé."
    ],
    "confidence": "low"
   }
  ],
  "evidence": {
   "items": [
    {
     "id": "E1",
     "claim": "Des règles ont relié des justificatifs sanitaires définis à l’accès à certains lieux.",
     "epistemic_type": "verified_fact",
     "source_tier": "primary_legal_policy",
     "source_title": "Loi ou règlement propre à la juridiction sur le pass sanitaire — à remplacer par une source vérifiée",
     "source_url": "",
     "source_locator": "",
     "source_date": "",
     "geography": "2020–2022, juridictions européennes sélectionnées",
     "population": "Travailleurs et résidents soumis aux contrôles d’accès",
     "measurement_method": "Examen de documents juridiques et de politique publique",
     "denominator": "Non applicable",
     "sample_size": "Non applicable",
     "measurement_validity": "Exige une vérification au regard de l’instrument en vigueur dans chaque juridiction.",
     "causal_identification": "Preuve descriptive juridique et de politique publique uniquement.",
     "replication_status": "not_applicable",
     "conflicts_of_interest": "Non évalué dans cet exemple structurel.",
     "missing_data": "Les sources vérifiées propres aux juridictions sont absentes.",
     "selection_effects": "Les juridictions sont illustratives et ne constituent pas un échantillon.",
     "relevant_comparison": "Comparer les règles avec et sans alternatives gratuites ni clauses d’extinction.",
     "cross_context_applicability": "Ne pas généraliser entre juridictions sans vérification.",
     "claim_source_fit": "unknown",
     "verification_status": "unverified",
     "verified_by": "",
     "verification_date": "",
     "uncertainty": "Les règles différaient selon les juridictions et évoluaient dans le temps.",
     "limitations": "L’exemple illustre la structure sans fournir de conclusion empirique universelle.",
     "counter_evidence": "De nombreux dispositifs avaient des clauses d’extinction, exemptions, tests gratuits, contrôle judiciaire ou furent abandonnés.",
     "confidence": "medium"
    },
    {
     "id": "E2",
     "claim": "Les conditions de mise en œuvre et d’extinction variaient sensiblement.",
     "epistemic_type": "plausible_inference",
     "source_tier": "reputable_organization_report",
     "source_title": "Revue comparative de mise en œuvre — à remplacer par une source vérifiée",
     "source_url": "",
     "source_locator": "",
     "source_date": "",
     "geography": "2020–2022, juridictions européennes sélectionnées",
     "population": "Travailleurs et résidents soumis aux contrôles d’accès",
     "measurement_method": "Revue comparative des politiques",
     "denominator": "Non applicable",
     "sample_size": "Non indiqué dans cet exemple structurel",
     "measurement_validity": "Non vérifié",
     "causal_identification": "Comparaison descriptive uniquement",
     "replication_status": "unknown",
     "conflicts_of_interest": "Inconnu",
     "missing_data": "Les sources comparatives sous-jacentes ne sont pas fournies.",
     "selection_effects": "La sélection des cas n’est pas documentée.",
     "relevant_comparison": "Règles dans les juridictions sélectionnées",
     "cross_context_applicability": "Inconnu jusqu’à vérification des sources",
     "claim_source_fit": "unknown",
     "verification_status": "unverified",
     "verified_by": "",
     "verification_date": "",
     "uncertainty": "Comparabilité incomplète entre juridictions.",
     "limitations": "Exige des sources vérifiées propres à chaque juridiction.",
     "counter_evidence": "Certains systèmes ont pu connaître un contrôle faible ou une réutilisation technique durable.",
     "confidence": "low"
    }
   ]
  },
  "assumptions": {
   "items": [
    {
     "id": "AS1",
     "assumption": "L’interopérabilité technique augmente la possibilité de réutilisation.",
     "risk": "medium",
     "disproving_test": "Les systèmes interopérables sont démantelés ou leur réutilisation est interdite par la loi.",
     "implication_if_wrong": "Les préoccupations liées à la dépendance au sentier seraient surestimées.",
     "confidence": "medium"
    }
   ]
  },
  "resistance_agency": {
   "items": [
    {
     "id": "RES1",
     "actor_or_population": "Travailleurs et résidents soumis aux contrôles d’accès",
     "form": "litigation",
     "mechanism": "Contentieux, protestations, contournements techniques et demandes de clauses d’extinction ont modifié la mise en œuvre.",
     "effect_on_system": "A resserré, clarifié ou supprimé certaines règles.",
     "constraints": [
      "Coût",
      "Accès inégal au droit"
     ],
     "confidence": "medium"
    }
   ]
  },
  "alternatives": {
   "items": [
    {
     "id": "ALT1",
     "level": "national",
     "proposal": "Règles étroites et limitées dans le temps, alternatives gratuites, finalité stricte, audit indépendant et recours accessible.",
     "mechanism": "Préserver l’objectif protecteur tout en réduisant dépendance, exclusion et dérive de finalité.",
     "feasibility": "medium",
     "tradeoffs": [
      "Coût administratif",
      "Vérification potentiellement plus lente"
     ],
     "rights_safeguards": [
      "Limitation de finalité",
      "Clause d’extinction",
      "Recours",
      "Alternative non numérique"
     ],
     "evidence_needed": [
      "Données comparatives d’efficacité et de charge"
     ],
     "lower_harm_rationale": "Maintient une protection proportionnée tout en préservant sortie et contestabilité."
    }
   ]
  },
  "calibrated_conclusion": {
   "strongly_supported": [
    "Le justificatif a transformé l’information sanitaire en signal de contrôle d’accès."
   ],
   "plausible_unconfirmed": [
    "Une infrastructure réutilisable peut survivre à l’urgence qui l’a justifiée."
   ],
   "disputed": [
    "Le bénéfice épidémiologique net et le coût distributif variaient selon juridictions et périodes."
   ],
   "unknown": [
    "Les effets de normalisation à long terme ne découlent pas de la seule adoption temporaire."
   ],
   "evidence_that_would_change": [
    "Des comparaisons montrant soit une réutilisation durable intersectorielle, soit un démantèlement institutionnel complet."
   ],
   "overall_confidence": "medium"
  },
  "self_audit": {
   "malicious_intent_without_evidence": "pass",
   "institutional_claims_uncritically": "pass",
   "metaphor_as_mechanism": "pass",
   "human_function_identified": "pass",
   "mechanism_explained": "pass",
   "care_control_overlap": "pass",
   "material_and_meaning": "pass",
   "history_included": "pass",
   "political_economy_included": "pass",
   "inequality_dimensions": "pass",
   "agency_resistance": "pass",
   "competing_explanations": "pass",
   "statistics_quotations_verified": "concern",
   "uncertainty_stated": "pass",
   "benefits_costs_identified": "pass",
   "realistic_alternatives": "pass",
   "stigmatization_risk_checked": "pass",
   "falsifier_identified": "pass"
  },
  "self_audit_notes": [
   "Cet exemple est structurel ; remplacez les titres de sources provisoires par des preuves vérifiées propres aux juridictions."
  ],
  "links": [
   {
    "from": "HF1",
    "to": "INS1",
    "relation": "enables",
    "mechanism": "Le risque sanitaire est devenu opérationnel par la vérification du justificatif.",
    "confidence": "high"
   },
   {
    "from": "INS1",
    "to": "CLASS1",
    "relation": "classifies",
    "mechanism": "La vérification attribue un statut d’accès.",
    "confidence": "high"
   },
   {
    "from": "CLASS1",
    "to": "DIST1",
    "relation": "distributes",
    "mechanism": "Le statut modifie l’accès et la charge.",
    "confidence": "high"
   },
   {
    "from": "RES1",
    "to": "IV1",
    "relation": "resists",
    "mechanism": "La contestation modifie la portée et la durée.",
    "confidence": "medium"
   }
  ],
  "migration": null
 }
};
