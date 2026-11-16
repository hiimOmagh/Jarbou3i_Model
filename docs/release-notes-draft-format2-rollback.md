# Draft release note: dossier rollback risk

Status: Compatibility warning retained for release. Caps were reverted in a67f2f8; this did not revert format-2 storage or remove the rollback risk.

Dossier format 2 stores sources and excerpts in the case record (docs/decisions/0005-sources-in-the-dossier-record.md:36). If you roll back to the released build that reads only format 1, a format-2 case cannot be read or shown; the older app treats it as corrupt but does not delete it (docs/decisions/0005-sources-in-the-dossier-record.md:15-16; docs/features/research-sources.md:218). Cases without sources can remain in format 1 (docs/decisions/0005-sources-in-the-dossier-record.md:39).
