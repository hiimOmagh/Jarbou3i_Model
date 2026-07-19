# RC 15 Runner Addendum

Candidate: `2.0.0-bio-rc.15`  
Scope: test-runner correctness only

## Finding

RC 13 and RC 14 each exposed the same non-product failure on Windows: all completed assertions passed, but Chrome Headless Shell occasionally did not exit after Playwright requested browser shutdown. Playwright then waited five minutes, force-killed the worker, and left one queued case unexecuted. A summary such as `231 passed, 1 did not run` is not a release pass.

## Root cause and remediation

The project lockfile resolved Playwright Test 1.60.0 and the default projects launched Chrome Headless Shell. Microsoft tracked the same runner defect as `microsoft/playwright#39753`, identifying that shell as the process that occasionally failed to exit. Playwright’s documented `channel: 'chromium'` option uses the newer real-Chrome headless mode. Microsoft also merged `microsoft/playwright#40637`, adding a worker-stop watchdog that terminates the process tree on Windows and surfaces a runner error instead of hanging indefinitely.

RC 15 moves both the desktop Chromium and mobile Chrome projects to `channel: 'chromium'`, pins `@playwright/test` to `1.61.1`, and adds no-browser contract assertions for both decisions. No application code, analysis contract, schema, fixture, or presentation behavior changed.

## Acceptance

- `npm ci` resolves Playwright Test 1.61.1 from the public npm registry.
- desktop Chromium and mobile Chrome launch the new headless mode rather than Chrome Headless Shell.
- `npm run test:ci:no-browser` passes, including the new dependency lock assertion.
- `npm run test:browser:core` must finish with all 232 cases executed and zero runner errors.
- Hosted and visual evidence gates remain unchanged from RC 14 and must still pass before deployment.
