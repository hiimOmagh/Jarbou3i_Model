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

  function balancedJsonSlice(source) {
    const text = String(source || "");
    let start = -1;
    for (let index = 0; index < text.length; index += 1) {
      if (["{", "["].includes(text[index])) {
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

  function recoverCandidate(source) {
    const conservative = removeTrailingCommas(stripJsonComments(stripBom(source)));
    return repairLabeledArrayEntries(conservative).source;
  }

  function extractJson(source) {
    const raw = stripBom(source);
    if (!raw) throw new Error("empty");
    const attempts = [raw];
    const fence = raw.match(/```(?:json|JSON)?\s*([\s\S]*?)```/);
    if (fence) attempts.push(fence[1]);
    const balanced = balancedJsonSlice(raw);
    if (balanced) attempts.push(balanced);

    const seen = new Set();
    for (const candidate of attempts) {
      const clean = stripBom(candidate);
      if (!clean || seen.has(clean)) continue;
      seen.add(clean);
      try {
        return { value: JSON.parse(clean), recovered: clean !== raw, source: clean };
      } catch {}
      const recovered = recoverCandidate(clean);
      if (!recovered || seen.has(recovered)) continue;
      seen.add(recovered);
      try {
        const labeledEntries = repairLabeledArrayEntries(
          removeTrailingCommas(stripJsonComments(clean)),
        ).count;
        return {
          value: JSON.parse(recovered),
          recovered: true,
          source: recovered,
          repairs: Object.freeze([
            ...(labeledEntries
              ? [{ code: "LABELED_ARRAY_ENTRIES", count: labeledEntries }]
              : []),
          ]),
        };
      } catch {}
    }
    throw new Error("invalid");
  }

  root.Jarbou3iJson = Object.freeze({
    stripJsonComments,
    removeTrailingCommas,
    repairLabeledArrayEntries,
    balancedJsonSlice,
    recoverCandidate,
    extractJson,
  });
})(typeof window !== "undefined" ? window : globalThis);
