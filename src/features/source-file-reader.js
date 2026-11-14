/* The temporary reader for a source file (RESEARCH-1D, D1). One file is read at
   a time, on the device; its bytes and text live only in the result handed to
   the caller, who keeps them in memory while passages are chosen. Nothing is
   stored here. A read that is cancelled, replaced or timed out never reports
   its bytes: its caller hears "cancelled" and nothing else. */

import { SOURCE_FILE_BYTE_LIMIT, extractFileTextAsync, fileKind } from "../core/source-file-text.js";

export const SOURCE_FILE_DEADLINE_MS = 15_000;

export function createSourceFileReader({ FileReaderImpl = globalThis.FileReader, deadline = SOURCE_FILE_DEADLINE_MS, setTimer = setTimeout, clearTimer = clearTimeout, yieldNow } = {}) {
  let active = null;

  function finish(read, result) {
    if (active !== read) return;
    active = null;
    clearTimer(read.timer);
    read.settle({ ...result, token: read.token });
  }

  // The file's name and size are checked before a byte is read. The promise
  // always settles, with the token it was started for: the caller drops a
  // result whose case is no longer on screen.
  function read(file, token = null) {
    cancel();
    return new Promise((settle) => {
      const kind = fileKind(file?.name);
      if (!kind) return settle({ ok: false, code: "unsupported", token });
      if (file.size > SOURCE_FILE_BYTE_LIMIT) return settle({ ok: false, code: "too-large", token });
      if (!file.size) return settle({ ok: false, code: "empty", token });
      const reader = new FileReaderImpl();
      const entry = { token, settle, reader, timer: 0 };
      active = entry;
      reader.onload = () => {
        if (active !== entry) return;
        // HTML is tokenized in slices with a turn for other work between them, so
        // Cancel and the deadline are heard; a read that has ended stops it.
        extractFileTextAsync({ name: file.name, bytes: new Uint8Array(reader.result) }, { yieldNow, alive: () => active === entry }).then(
          (done) => finish(entry, done),
          () => finish(entry, { ok: false, code: "read-failed" }),
        );
      };
      reader.onerror = () => finish(entry, { ok: false, code: "read-failed" });
      reader.onabort = () => finish(entry, { ok: false, code: "cancelled" });
      entry.timer = setTimer(() => {
        if (active !== entry) return;
        finish(entry, { ok: false, code: "timed-out" });
        try { reader.abort(); } catch { /* already settled */ }
      }, deadline);
      try {
        reader.readAsArrayBuffer(file);
      } catch {
        finish(entry, { ok: false, code: "read-failed" });
      }
    });
  }

  function cancel() {
    const entry = active;
    if (!entry) return false;
    active = null;
    clearTimer(entry.timer);
    try { entry.reader.abort(); } catch { /* nothing left to stop */ }
    entry.settle({ ok: false, code: "cancelled", token: entry.token });
    return true;
  }

  return { read, cancel, get busy() { return active !== null; } };
}
