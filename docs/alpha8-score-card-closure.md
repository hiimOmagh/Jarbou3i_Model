# Alpha.8 Score-Card Closure

The complete Alpha.7 visual evidence matrix exposed a shared presentation-contract mismatch in the overview metrics. The renderer emitted `metricCard` and `metricTop`, while the design system defined `scoreMetricCard` and `metricHead`. This left otherwise valid Strategic and Biopolitical scores without their intended card containment and caused localized labels to touch `/100` values.

Alpha.8 aligns the renderer with the existing design-system selectors and marks the explanatory copy with `metricHint`. The correction applies equally to Strategic and Biopolitical overview metrics in Arabic, English, and French, across both themes and responsive layouts.

No score, formula, analytical record, schema, evidence rule, import behavior, report payload, or relationship graph is changed. A static regression contract requires the corrected classes and rejects the obsolete markup.
