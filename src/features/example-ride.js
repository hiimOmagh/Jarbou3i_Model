// The example ride: "Try the example first" opens the sample analysis and
// stops at four real places in it. A card at the foot of the view names the
// place and what it is for; the place itself is ringed in ink (src/ui/flow.css
// keys the ring on the root's data-ride-at, so a re-render keeps it). Nothing
// is dimmed or blocked. "Leave the ride", Esc in the card, the last stop or a
// closed analysis ends it.

// The same selectors draw the ring in src/ui/flow.css.
const STOPS = [
  { key: "Verdict", place: "#case-overview .j-brief:first-of-type", home: "case-overview" },
  { key: "Map", place: "#engineNav", home: "engineTitle" },
  { key: "Claim", place: "#case-evidence .j-recs:first-of-type > li:first-child > .j-rec", home: "case-evidence" },
  { key: "Exports", place: "#case-exports", home: "case-exports" },
];

export function createExampleRide({ document, t }) {
  const byId = (id) => document.getElementById(id);
  const root = document.documentElement;
  const card = byId("rideTrip");
  let at = -1;

  // Only a change is written, so the live region does not repeat itself.
  const say = (id, text) => {
    const el = byId(id);
    if (el.textContent !== text) el.textContent = text;
  };
  const place = () => document.querySelector(STOPS[at].place);

  function paint() {
    const { key } = STOPS[at];
    root.dataset.rideAt = key.toLowerCase();
    say("tripTitle", t(`trip${key}`));
    say("tripText", t(`trip${key}Text`));
    say("tripCount", t("tripCount").replace("{n}", at + 1).replace("{total}", STOPS.length));
    say("tripNext", t(at === STOPS.length - 1 ? "tripEnd" : "tripNext"));
    card.querySelectorAll(".j-trip-line > li").forEach((li, index) => {
      li.dataset.state = index < at ? "done" : index === at ? "current" : "next";
    });
  }
  // Said while hidden, the first stop is read once, from its focused title.
  function show() {
    card.hidden = false;
    // A place scrolled to, or focused under the card, clears it.
    root.style.setProperty("--j-trip-space", `${card.offsetHeight + 16}px`);
  }
  function go(index) {
    at = index;
    // A place this analysis does not have is passed by.
    while (at < STOPS.length && !place()) at += 1;
    if (at === STOPS.length) return end(false);
    paint();
    show();
    const still = document.defaultView.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = place();
    target.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
    // The ring closes in on the place as the ride arrives.
    if (!still) {
      target.animate([{ outlineColor: "transparent", outlineOffset: "24px", offset: 0 }], {
        duration: 320, delay: 160, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "backwards",
      });
    }
  }
  // Leaving puts the reader at the place they were shown.
  function end(focusPlace) {
    const home = byId(STOPS[at]?.home);
    at = -1;
    card.hidden = true;
    delete root.dataset.rideAt;
    root.style.removeProperty("--j-trip-space");
    if (focusPlace) home?.focus({ preventScroll: true });
  }

  byId("tripNext").addEventListener("click", () => (at === STOPS.length - 1 ? end(true) : go(at + 1)));
  byId("tripLeave").addEventListener("click", () => end(true));
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    end(true);
  });

  return {
    start() {
      go(0);
      if (at >= 0) byId("tripTitle").focus();
    },
    // A closed analysis ends the ride; a new language re-says the stop.
    render(hasAnalysis) {
      if (at < 0) return;
      if (!hasAnalysis) return end(false);
      paint();
      show();
    },
  };
}
