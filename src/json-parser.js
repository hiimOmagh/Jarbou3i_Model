/* Jarbou3i Model — conservative JSON extraction and recovery */
(function attachJsonParser(root) {
  "use strict";

  const stripBom = (value) => String(value || "").replace(/^\uFEFF/, "").trim();

  function transformOutsideStrings(source, transform) {
    const text = String(source || "");
    let out = "";
    let inString = false;
    let escaped = false;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        out += char;
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') {
        inString = true;
        out += char;
        continue;
      }
      const result = transform({ text, index, char });
      if (result && typeof result === "object") {
        out += result.value || "";
        index = Number.isInteger(result.skipTo) ? result.skipTo : index;
      } else {
        out += result === undefined ? char : result;
      }
    }
    return out;
  }

  function stripJsonComments(source) {
    return transformOutsideStrings(source, ({ text, index, char }) => {
      if (char !== "/") return undefined;
      const next = text[index + 1];
      if (next === "/") {
        let end = index + 2;
        while (end < text.length && !["\n", "\r"].includes(text[end])) end += 1;
        return { value: "", skipTo: end - 1 };
      }
      if (next === "*") {
        const end = text.indexOf("*/", index + 2);
        if (end < 0) return undefined;
        return { value: "", skipTo: end + 1 };
      }
      return undefined;
    });
  }

  function removeTrailingCommas(source) {
    return transformOutsideStrings(source, ({ text, index, char }) => {
      if (char !== ",") return undefined;
      let lookahead = index + 1;
      while (lookahead < text.length && /\s/.test(text[lookahead])) lookahead += 1;
      return ["}", "]"].includes(text[lookahead]) ? "" : undefined;
    });
  }

  function objectHasTopLevelKey(text, opening, expectedKey) {
    let depth = 1;
    let inString = false;
    let escaped = false;
    let stringStart = -1;
    for (let index = opening + 1; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === '"') {
          inString = false;
          if (depth === 1) {
            let colon = index + 1;
            while (colon < text.length && /\s/.test(text[colon])) colon += 1;
            if (text[colon] === ":") {
              try {
                if (
                  JSON.parse(text.slice(stringStart, index + 1)) === expectedKey
                ) {
                  return true;
                }
              } catch {}
            }
          }
        }
        continue;
      }
      if (char === '"') {
        inString = true;
        stringStart = index;
      } else if (char === "{") depth += 1;
      else if (char === "}" && --depth === 0) return false;
    }
    return false;
  }

  function repairLabeledArrayEntries(source) {
    const text = String(source || "");
    const stack = [];
    let out = "";
    let inString = false;
    let escaped = false;
    let count = 0;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        out += char;
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"' && stack.at(-1) === "[") {
        let end = index + 1;
        let labelEscaped = false;
        for (; end < text.length; end += 1) {
          if (labelEscaped) labelEscaped = false;
          else if (text[end] === "\\") labelEscaped = true;
          else if (text[end] === '"') break;
        }
        if (end < text.length) {
          let colon = end + 1;
          while (colon < text.length && /\s/.test(text[colon])) colon += 1;
          if (text[colon] === ":") {
            let opening = colon + 1;
            while (opening < text.length && /\s/.test(text[opening])) opening += 1;
            let label = "";
            try {
              label = JSON.parse(text.slice(index, end + 1));
            } catch {}
            if (
              text[opening] === "{" &&
              /^[A-Z][A-Z0-9_-]{1,31}$/.test(label) &&
              !objectHasTopLevelKey(text, opening, "id")
            ) {
              out += `{"id":${JSON.stringify(label)},`;
              stack.push("{");
              index = opening;
              count += 1;
              continue;
            }
          }
        }
      }
      if (char === '"') inString = true;
      if (["{", "["].includes(char)) stack.push(char);
      if (["}", "]"].includes(char)) stack.pop();
      out += char;
    }
    return { source: out, count };
  }

  // A "[" opens JSON only when it opens an array of objects or arrays, so
  // assistant citation markers such as [1] or [source] in prose are skipped.
  function isJsonStart(text, index) {
    if (text[index] === "{") return true;
    if (text[index] !== "[") return false;
    let next = index + 1;
    while (next < text.length && /\s/.test(text[next])) next += 1;
    return ["{", "["].includes(text[next]);
  }

  function balancedJsonSlice(source) {
    const text = String(source || "");
    let start = -1;
    for (let index = 0; index < text.length; index += 1) {
      if (isJsonStart(text, index)) {
        start = index;
        break;
      }
    }
    if (start < 0) return "";
    const stack = [];
    let inString = false;
    let escaped = false;
    for (let index = start; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') {
        inString = true;
        continue;
      }
      if (["{", "["].includes(char)) stack.push(char);
      if (["}", "]"].includes(char)) {
        const expected = char === "}" ? "{" : "[";
        if (stack.at(-1) !== expected) return "";
        stack.pop();
        if (!stack.length) return text.slice(start, index + 1);
      }
    }
    return "";
  }

  // An extra closing brace can end the root object before the answer does:
  // '{"a":{"b":1}},"c":2}'. Parsing only the part before it would silently
  // drop the rest, so each early close followed by another member is removed.
  // An answer that is also cut off comes back unclosed, to be completed.
  function rejoinEarlyCloses(source) {
    let text = String(source || "");
    let count = 0;
    for (;;) {
      const slice = balancedJsonSlice(text);
      if (!slice.startsWith("{")) return count ? { source: text, count } : null;
      const rest = text.slice(text.indexOf(slice) + slice.length);
      if (!/^\s*,\s*"(?:[^"\\]|\\.)*"\s*:/.test(rest)) {
        return count ? { source: slice, count } : null;
      }
      text = slice.slice(0, -1) + rest;
      count += 1;
    }
  }

  function recoverCandidate(source) {
    const conservative = removeTrailingCommas(stripJsonComments(stripBom(source)));
    return repairLabeledArrayEntries(conservative).source;
  }

  function structuralState(source) {
    const text = String(source || "");
    const stack = [];
    let started = false;
    let inString = false;
    let escaped = false;
    let mismatched = false;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (!started) {
        if (!isJsonStart(text, index)) continue;
        started = true;
        stack.push(char);
        continue;
      }
      if (inString) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') {
        inString = true;
        continue;
      }
      if (["{", "["].includes(char)) stack.push(char);
      if (["}", "]"].includes(char)) {
        const expected = char === "}" ? "{" : "[";
        if (stack.at(-1) !== expected) {
          mismatched = true;
          break;
        }
        stack.pop();
        if (!stack.length) break;
      }
    }
    return Object.freeze({
      started,
      incomplete:
        started && !mismatched && (stack.length > 0 || inString || escaped),
      openDepth: stack.length,
      unterminatedString: inString,
      mismatched,
    });
  }

  function extractJson(source) {
    const raw = stripBom(source);
    if (!raw) throw new Error("empty");
    const attempts = [raw];
    const fenceMatches = [...raw.matchAll(/```(?:json|JSON)?\s*([\s\S]*?)```/g)];
    // One fenced block and nothing else is the form the prompts ask for, so
    // removing its fence is not a repair. An answer completed through the
    // continue prompt keeps only the opening fence of its cut-off first part.
    const opening = /^```(?:json|JSON)?\s*/;
    const askedForm =
      fenceMatches.length === 1 && fenceMatches[0][0] === raw
        ? stripBom(fenceMatches[0][1])
        : fenceMatches.length === 0 && opening.test(raw)
          ? stripBom(raw.replace(opening, ""))
          : null;
    // Every fenced block, largest first: a short format example before or
    // after the answer must not be taken for the answer.
    const fences = fenceMatches
      .map((match) => match[1])
      .sort((a, b) => b.length - a.length);
    attempts.push(...fences);
    const balanced = balancedJsonSlice(raw);
    // After an early close, that slice is only the first part of the answer.
    const earlyClose = rejoinEarlyCloses(raw);
    if (balanced && !earlyClose) attempts.push(balanced);

    const seen = new Set();
    for (const candidate of attempts) {
      const clean = stripBom(candidate);
      if (!clean || seen.has(clean)) continue;
      seen.add(clean);
      try {
        return {
          value: JSON.parse(clean),
          recovered: clean !== raw && clean !== askedForm,
          source: clean,
        };
      } catch {}
      const recovered = recoverCandidate(clean);
      if (!recovered) continue;
      const labeledEntries = repairLabeledArrayEntries(
        removeTrailingCommas(stripJsonComments(clean)),
      ).count;
      const rejoined = rejoinEarlyCloses(recovered);
      for (const [text, earlyCloses] of [
        [recovered, 0],
        [rejoined?.source, rejoined?.count],
      ]) {
        if (!text || seen.has(text)) continue;
        seen.add(text);
        try {
          return {
            value: JSON.parse(text),
            recovered: true,
            source: text,
            repairs: Object.freeze([
              ...(labeledEntries
                ? [{ code: "LABELED_ARRAY_ENTRIES", count: labeledEntries }]
                : []),
              ...(earlyCloses
                ? [{ code: "EARLY_CLOSE_REJOINED", count: earlyCloses }]
                : []),
            ]),
          };
        } catch {}
      }
    }
    const structure = structuralState(earlyClose ? earlyClose.source : raw);
    const error = new Error(structure.incomplete ? "truncated" : "invalid");
    error.code = structure.incomplete
      ? "TRUNCATED_JSON"
      : "INVALID_JSON";
    error.structure = structure;
    throw error;
  }

  // Appends a model's "continue" reply to a cut-off answer. Fences are removed,
  // line breaks at the seam are dropped (JSON strings cannot contain them), and
  // a repeated tail of the cut-off answer is not duplicated.
  function joinContinuation(base, continuation) {
    const head = String(base || "").replace(/[\r\n\t]+$/, "");
    // A fenced reply ("Here is the rest:\n```json\n...\n```") contributes only
    // the fenced block. A leading space can be string content ("quick| brown"),
    // so only line breaks, fences, and the BOM are removed at the seam.
    const reply = String(continuation || "").replace(/^﻿/, "");
    const fenced = /```(?:[a-zA-Z]+(?=\s))?[ \t]*\r?\n?([\s\S]*?)(?:\r?\n?```|$)/.exec(reply);
    const tail = (fenced ? fenced[1] : reply)
      .replace(/^[\r\n\t]+/, "")
      .replace(/\s+$/, "");
    for (let size = Math.min(400, head.length, tail.length); size >= 8; size -= 1) {
      const overlap = tail.slice(0, size);
      if (!head.endsWith(overlap)) continue;
      // Repetitive text ("0,0,0,0,") matches itself at any seam; trimming it
      // could delete real content, so only a distinctive repeat is removed.
      return isPeriodic(overlap) ? head + tail : head + tail.slice(size);
    }
    return head + tail;
  }

  function isPeriodic(text) {
    for (let period = 1; period <= text.length / 2; period += 1) {
      if (text.slice(period) === text.slice(0, text.length - period)) return true;
    }
    return false;
  }

  root.Jarbou3iJson = Object.freeze({
    joinContinuation,
    stripJsonComments,
    removeTrailingCommas,
    repairLabeledArrayEntries,
    balancedJsonSlice,
    recoverCandidate,
    structuralState,
    extractJson,
  });
})(typeof window !== "undefined" ? window : globalThis);
