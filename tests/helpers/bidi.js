// Figures shown with a percent sign whose sign sits left of the figure: in an
// Arabic paragraph, a figure that follows Arabic text takes the sign to its
// left unless it is isolated. The app and the reports keep it on the right.
export function misplacedPercents(page) {
  return page.evaluate(() => {
    const box = (node, at) => {
      const range = document.createRange();
      range.setStart(node, at);
      range.setEnd(node, at + 1);
      return range.getBoundingClientRect();
    };
    const found = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const at = node.textContent.search(/[0-9]%/);
      if (at < 0 || !node.parentElement.getClientRects().length) continue;
      if (box(node, at + 1).left < box(node, at).left) found.push(node.parentElement.textContent.trim());
    }
    // A ring sets its figure and its sign apart.
    for (const ring of document.querySelectorAll(".rRing")) {
      if (ring.querySelector("small").getBoundingClientRect().left < ring.querySelector("span").getBoundingClientRect().left) found.push(ring.textContent);
    }
    return found;
  });
}
