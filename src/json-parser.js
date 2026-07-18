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
    return removeTrailingCommas(stripJsonComments(stripBom(source)));
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
        return { value: JSON.parse(recovered), recovered: true, source: recovered };
      } catch {}
    }
    throw new Error("invalid");
  }

  root.Jarbou3iJson = Object.freeze({
    stripJsonComments,
    removeTrailingCommas,
    balancedJsonSlice,
    recoverCandidate,
    extractJson,
  });
})(typeof window !== "undefined" ? window : globalThis);
