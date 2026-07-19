# Alpha.7 Evidence Verdict

The Alpha.6 CI artifacts were manually reviewed across all 120 visual captures and 18 measurements. The release corrected the Alpha.5 import-audit localization, mobile results density, standalone-report anchoring, report-surface coverage, and multi-reference separator defects.

One new localization defect was identified: the Arabic product title used `مِشرَحة`, whose ordinary meaning is a morgue or dissection room. Alpha.7 replaces it with `مساحة عمل`, giving the Strategic and Biopolitical lenses the professional titles `مساحة عمل التحليل الاستراتيجي` and `مساحة عمل التحليل الحيوسياسي`.

The GitHub workflow also upgrades artifact uploads from v4 to v5 so the workflow no longer invokes the deprecated Node 20 action runtime.

Alpha.7 changes presentation language and CI infrastructure only. The Strategic v1.1 and Biopolitical Training Map v2 analytical contracts, schemas, fixtures, import policy, evidence gates, exports, and relationship graph remain unchanged.
