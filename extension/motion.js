(() => {
  if (globalThis.LifterMotion) return;
  function create(doc, enabled) {
    const win = doc.defaultView;
    if (!enabled || win.matchMedia('(prefers-reduced-motion: reduce)').matches) return {glyph:null,finish(){},clear(){}};
    const host = doc.createElement('div');
    host.dataset.lifterRoot = ''; host.setAttribute('aria-hidden','true');
    host.style.cssText='all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;';
    const root=host.attachShadow({mode:'closed'});
    const style=doc.createElement('style');
    style.textContent='*{box-sizing:border-box}.bag{position:fixed;right:22px;bottom:22px;background:#F9EF53;color:#211C2D;border:3px solid #211C2D;border-radius:12px 12px 24px 24px;box-shadow:5px 5px #211C2D;width:64px;height:60px;font:bold 30px/52px Arial;text-align:center}.glyph{position:fixed;left:0;top:0;font:bold 28px/1 Arial;color:#211C2D;background:#F9EF53;border:2px solid #211C2D;border-radius:6px;padding:2px 6px;box-shadow:3px 3px #7654D6;will-change:transform}';
    root.append(style);const bag=doc.createElement('div');bag.className='bag';bag.textContent='L';root.append(bag);doc.documentElement.append(host);
    const animations=[];let timer,removed=false;
    function clear(){removed=true;win.clearTimeout(timer);animations.forEach(a=>a.cancel());host.remove();}
    function glyph({letter,x,y,index}){
      if(removed)return;
      const el=doc.createElement('span');el.className='glyph';el.textContent=letter;root.append(el);
      const dx=win.innerWidth-54,dy=win.innerHeight-52;
      const a=el.animate([{transform:`translate(${x}px,${y}px) rotate(-12deg) scale(1)`,opacity:1},{transform:`translate(${(x+dx)/2}px,${Math.min(y,dy)-55}px) rotate(10deg) scale(1.08)`,offset:.45,opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(0deg) scale(.12)`,opacity:0}],{duration:620,delay:Math.min(index*14,240),easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
      animations.push(a);a.finished.then(()=>el.remove()).catch(()=>el.remove());
    }
    function finish(){timer=win.setTimeout(()=>{if(removed)return;const a=bag.animate([{transform:'scale(1)'},{transform:'scale(1.15,.85)'},{transform:'scale(1)'}],{duration:180,easing:'ease-out'});animations.push(a);a.finished.then(()=>{timer=win.setTimeout(clear,500);}).catch(()=>{});},860);}
    return {glyph,finish,clear};
  }
  globalThis.LifterMotion={create};
})();
