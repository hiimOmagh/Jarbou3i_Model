import { createResultsOrientation } from '../src/core/results-orientation.js';

const fail = (message) => {
  console.error(`Results orientation check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const source = {
  lens: 'strategic',
  topic: 'Regional water governance',
  conclusion: 'Institutions and incentives jointly shape the outcome.',
  publicationApproved: false,
  publicationLabel: 'Blocked',
  readiness: 142,
  coverage: 74.4,
  uncertainty: 'Cross-border enforcement remains uncertain.',
  nextAction: 'Verify the principal institutional claim.',
};
const orientation = createResultsOrientation(source);

assert(Object.isFrozen(orientation), 'view model must be immutable');
assert(Object.isFrozen(orientation.publication), 'publication state must be immutable');
assert(orientation.readiness === 100, 'readiness was not bounded');
assert(orientation.coverage === 74, 'coverage was not normalized');
assert(orientation.publication.approved === false, 'publication state drifted');
assert(orientation.uncertainty === source.uncertainty, 'authored uncertainty was not preserved');
assert(!('analysis' in orientation), 'canonical analysis leaked into the view model');

const fallback = createResultsOrientation({ lens: 'biopolitical' });
assert(fallback.conclusion === '—' && fallback.nextAction === '—', 'empty text fallback failed');

let rejected = false;
try {
  createResultsOrientation({ lens: 'unknown' });
} catch (error) {
  rejected = error instanceof TypeError;
}
assert(rejected, 'unregistered lens was accepted');

console.log('Results orientation checks passed.');
