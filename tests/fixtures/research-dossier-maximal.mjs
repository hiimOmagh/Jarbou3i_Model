// A contract-sized record, including strict 1A line fields. Every variable
// free text code unit needs the maximum six JSON bytes. UUIDs and ISO times retain
// their real shapes. Fifty distinct one-character hosts allow the shortest
// accepted link (http:// + host); trailing C0 controls remain in the stored
// link while normalizedUrl sees fifty distinct valid URLs. Each excerpt holds
// ten pointers with ids at DOSSIER_POINTER_ID_LIMIT, distinct by evidence id,
// with the longer kind ("fill") and the longer flag (false).
export function maximalDossierBody() {
  const fill = (length) => "\u0000".repeat(length);
  const distinct = (length, index) => fill(length - 8) + index.toString(2).padStart(8, "0").replaceAll("0", "\u0000").replaceAll("1", "\u0001");
  const id = (prefix, index) => prefix + "_00000000-0000-4000-8000-" + index.toString(16).padStart(12, "0");
  const instant = "9999-12-31T23:59:59.999Z";
  const hosts = "abcdefghijklmnopqrstuvwxyz0123456789-._~!$&'()*+,;=";
  return {
    format: "jarbou3i-research-dossier", format_version: 2,
    dossier_id: fill(4000), revision: Number.MAX_SAFE_INTEGER,
    // Date.parse accepts a one-digit date and a parenthesized comment.
    // Fill that comment with six-byte escapes, keeping each time 4000 units.
    created_at: "0(" + fill(3997) + ")", updated_at: "0(" + fill(3997) + ")",
    framing: {
      question: fill(4000), timeframe: fill(4000),
      scope_in: Array(50).fill(fill(4000)), scope_out: Array(50).fill(fill(4000)),
      contested_terms: Array.from({ length: 50 }, () => ({ term: fill(4000), working_definition: fill(4000) })),
      limits: Array(50).fill(fill(4000)),
    },
    completion: Array.from({ length: 50 }, (_, index) => ({ criterion_id: distinct(4000, index), text: distinct(4000, index), status: "met", rationale: fill(4000), decided_at: fill(4000) })),
    analyses: Array.from({ length: 50 }, (_, index) => ({ workspace_id: fill(4000), revision_id: distinct(4000, index), payload_checksum: fill(4000), linked_at: fill(4000) })),
    sources: Array.from({ length: 50 }, (_, index) => ({
      source_id: id("source", index), title: fill(500), url: "http://" + hosts[index] + fill(492),
      source_date: fill(500), accessed_on: "9999-12-31", send: false, added_at: instant,
    })),
    excerpts: Array.from({ length: 200 }, (_, index) => ({
      excerpt_id: id("excerpt", index), source_id: id("source", Math.floor(index / 50)),
      text: fill(2000), locator: fill(500), check: { status: "matches", reason: fill(1000), decided_at: instant }, added_at: instant,
      promotions: Array.from({ length: 10 }, (_, pointer) => ({
        workspace_id: fill(200), revision_id: fill(200), evidence_id: distinct(200, pointer),
        promoted_at: instant, kind: "fill", changed_since: false,
      })),
    })),
  };
}
