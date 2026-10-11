// Behaviour for kernel controls that CSS cannot give (UIX-1).

// A .j-seg radiogroup: one tab stop, arrows move and select (mirrored in
// right-to-left pages), Home and End jump to the ends. onChange receives the
// chosen option's data-value.
export function bindSegmented(group, onChange = () => {}) {
  const options = () => [...group.querySelectorAll(':scope > [role="radio"]')];
  const select = (option, focus) => {
    for (const other of options()) {
      const on = other === option;
      other.setAttribute("aria-checked", String(on));
      other.tabIndex = on ? 0 : -1;
    }
    if (focus) option.focus();
    onChange(option.dataset.value);
  };
  for (const option of options()) option.tabIndex = option.getAttribute("aria-checked") === "true" ? 0 : -1;
  group.addEventListener("click", (event) => {
    const option = event.target.closest('[role="radio"]');
    if (option && group.contains(option)) select(option, false);
  });
  group.addEventListener("keydown", (event) => {
    const list = options();
    const index = list.indexOf(document.activeElement);
    if (index < 0) return;
    const rtl = getComputedStyle(group).direction === "rtl";
    const step = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
    const target =
      event.key === "Home" ? list[0]
        : event.key === "End" ? list[list.length - 1]
          : step ? list[(index + step + list.length) % list.length]
            : null;
    if (!target) return;
    event.preventDefault();
    select(target, true);
  });
}
