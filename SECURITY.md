# Security and Safety Policy

## Scope

Jarbou3i Model is a static client-side tool. It has no backend, database, authentication, analytics, or server-side processing. The browser validator and semantic-integrity gate run locally.

## Sensitive content

Generated prompts may be pasted into external AI assistants. Do not include confidential, classified, proprietary, personal, legally sensitive, or regulated information unless you are authorized and understand the destination provider’s retention and privacy policies.

Biopolitical analysis can involve health, disability, identity, movement, work, citizenship, and other sensitive domains. Do not use the tool to profile individuals, infer sensitive traits from weak proxies, convert group findings into individual predictions, target vulnerable groups, facilitate coercive surveillance, or produce operational guidance for repression or manipulation.

## Untrusted input boundary

Imported JSON is untrusted input. The application:

- parses it conservatively without altering URLs or comment-like string content;
- rejects unknown and future Biopolitical contracts;
- validates canonical data before normalization;
- checks global IDs and typed references;
- escapes all rendered and exported human-readable values;
- embeds export JSON with script-closing characters neutralized.

The generated Biopolitical prompt also encloses topic and context as untrusted analytical material and instructs the model not to follow embedded commands.

## Reporting

Report security or safety issues for:

- XSS, unsafe rendering, or unsafe JSON/HTML export;
- schema-validation or contract-bypass behavior;
- privacy-sensitive or discriminatory behavior;
- unexpected network requests;
- false publication-ready status or evidence-verification bypass;
- broken Arabic/RTL rendering that could materially alter meaning.

Include the app version, browser, minimal reproduction, expected result, and observed result. Do not include real sensitive data in a public report.

## Expected network behavior

The deployed application should function without runtime network calls. Any future analytics, API, font, CDN, or other external dependency must be documented and security-reviewed before release.
