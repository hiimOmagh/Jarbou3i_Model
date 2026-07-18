# Schema verification map

`tests/schema-check.mjs` compiles the canonical and migrated-draft Biopolitical schemas with Ajv 2020 in strict mode, validates all trilingual canonical fixtures, validates the legacy adapter output against the draft schema, and proves that the draft cannot pass as canonical.

`scripts/generate-biopolitical-validator.mjs` compiles the same schemas into `src/biopolitics-schema-validator.js`. `npm run build:validator` runs before the no-browser CI gates so generated code cannot drift from the source schemas.

Strategic v1.1 fixture validation remains separate and backward-compatible.
