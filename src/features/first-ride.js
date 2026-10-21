// The first visit: the trip drawn as a route map above the setup, with two
// ways in and a skip. It shows for a visitor with no settings yet, stays until
// one of its buttons is used or an analysis opens, and does not come back on
// its own; "How it works" in the setup rail brings it back.

const KEY = "jarbou3i-ride";

export function createFirstRide({ document, storage, isNewVisitor, onStart, onExample }) {
  const byId = (id) => document.getElementById(id);
  const read = () => {
    try {
      return storage.getItem(KEY);
    } catch {
      return "seen";
    }
  };
  const write = (value) => {
    try {
      storage.setItem(KEY, value);
    } catch {
      // Storage refused (private mode): it shows again on the next visit.
    }
  };
  // "open" until it is left, so a visitor who reloads first still sees it.
  let open = read() === "open" || (read() === null && isNewVisitor);
  if (open) write("open");

  function sync() {
    byId("firstRide").hidden = !open;
    byId("rideOpen").hidden = open;
  }
  // Leaving folds the map away and the setup moves up under the header; with
  // reduced motion it is simply gone.
  function leave(then, { fold = true } = {}) {
    open = false;
    write("seen");
    const section = byId("firstRide");
    const still = document.defaultView.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fold || still || section.hidden) {
      sync();
    } else {
      section.style.overflow = "hidden";
      const folding = section.animate(
        [
          { height: `${section.offsetHeight}px`, opacity: 1 },
          { height: "0px", opacity: 0, paddingTop: "0px", paddingBottom: "0px", marginBottom: "0px" },
        ],
        { duration: 240, easing: "cubic-bezier(.4, 0, 1, 1)", fill: "forwards" },
      );
      // Folded until hidden, then the animation goes, so it opens whole again.
      folding.finished.catch(() => {}).finally(() => {
        section.style.overflow = "";
        sync();
        folding.cancel();
      });
    }
    then();
  }

  byId("rideStart").addEventListener("click", () => leave(onStart));
  byId("rideSkip").addEventListener("click", () => leave(onStart));
  byId("rideExample").addEventListener("click", () => leave(onExample, { fold: false }));
  byId("rideOpen").addEventListener("click", () => {
    open = true;
    write("open");
    sync();
    byId("firstRide").scrollIntoView({ block: "start" });
    byId("rideTitle").focus();
  });

  return {
    // An open analysis means the visitor is past the first ride.
    render(hasAnalysis) {
      if (hasAnalysis && open) {
        open = false;
        write("seen");
      }
      sync();
    },
    // A full reset makes the next visit a first one again.
    forget() {
      try {
        storage.removeItem(KEY);
      } catch {
        // Nothing kept.
      }
    },
  };
}
