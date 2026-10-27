/* Lifter DOM engine. Loaded in an isolated extension world; no page data leaves it. */
(() => {
  if (globalThis.LifterEngine) return;
  const EXCLUDE = 'script,style,noscript,template,textarea,input,select,option,svg,canvas,iframe,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[data-lifter-root]';
  function create(doc) {
    const saved = new Map();
    let busy = false, generation = 0;
    const win = doc.defaultView;
    function excluded(el) {
      for (let p = el; p; p = p.parentElement || p.getRootNode()?.host) {
        if (p.matches?.(EXCLUDE) || p.hidden || p.inert) return true;
        const s = win.getComputedStyle(p);
        if (s.display === 'none' || s.visibility === 'hidden' || s.visibility === 'collapse' || s.opacity === '0') return true;
      }
      return false;
    }
    function status() {
      let count = 0;
      for (const [node, item] of saved) {
        if (!node.isConnected || node.data !== item.after) { saved.delete(node); continue; }
        count += item.count;
      }
      return { count, busy };
    }
    async function steal({ lowercase = false, onGlyph = () => {} } = {}) {
      if (busy) return { count: 0, busy: true };
      busy = true;
      const run = ++generation;
      let count = 0, visited = 0, particles = 0;
      const roots = doc.body ? [doc.body] : [];
      const pattern = lowercase ? /[Ll]/g : /L/g;
      try {
        for (let r = 0; r < roots.length && run === generation; r++) {
          const root = roots[r];
          if (root.host && excluded(root.host)) continue;
          const walker = doc.createTreeWalker(root, 5, {acceptNode(node) {
            if (node.nodeType === 1 && excluded(node)) return 2;
            return 1;
          }});
          let node;
          while (run === generation && (node = walker.nextNode())) {
            if (node.nodeType === 1) {
              if (node.shadowRoot) roots.push(node.shadowRoot);
            } else if (node.isConnected && !excluded(node.parentElement || node.getRootNode().host)) {
              const before = node.data;
              const hits = [...before.matchAll(pattern)];
              if (hits.length) {
                for (const hit of hits) {
                  if (particles >= 24) break;
                  try {
                    const range = doc.createRange();
                    range.setStart(node, hit.index); range.setEnd(node, hit.index + 1);
                    const rect = range.getBoundingClientRect();
                    if (rect.width && rect.top >= 0 && rect.bottom <= win.innerHeight && rect.left >= 0 && rect.right <= win.innerWidth) {
                      onGlyph({ letter: hit[0], x: rect.left, y: rect.top, size: rect.height, index: particles++ });
                    }
                  } catch { /* Geometry unavailable: still collect text. */ }
                }
                const old = saved.get(node);
                const original = old && old.after === before ? old.original : before;
                const prior = old && old.after === before ? old.count : 0;
                const after = before.replace(pattern, '');
                saved.set(node, { original, after, count: prior + hits.length });
                node.data = after;
                count += hits.length;
              }
            }
            if (++visited % 160 === 0) await new Promise(resolve => win.setTimeout(resolve, 0));
          }
        }
        return { count, cancelled: run !== generation, total: status().count };
      } finally { busy = false; }
    }
    function restore() {
      generation++;
      let restored = 0, skipped = 0;
      for (const [node, item] of saved) {
        if (node.isConnected && node.data === item.after) { node.data = item.original; restored += item.count; }
        else skipped++;
      }
      saved.clear();
      return { restored, skipped };
    }
    return { steal, restore, status, cancel() { generation++; } };
  }
  globalThis.LifterEngine = { create };
})();
