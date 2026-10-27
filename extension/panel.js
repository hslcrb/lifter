(() => {
  if (globalThis.LifterPanel) return;
  function create(doc, engine, {motion = true, save = () => {}} = {}) {
    const win = doc.defaultView;
    const host = doc.createElement('div');
    host.dataset.lifterRoot = ''; host.dataset.lifterPanel = '';
    host.style.cssText = 'all:initial!important;position:fixed!important;right:20px!important;bottom:20px!important;z-index:2147483646!important;width:min(340px,calc(100vw - 32px))!important;color-scheme:light!important;';
    const root = host.attachShadow({mode:'closed'});
    root.innerHTML = `<style>
      :host{--lemon:#F9EF53;--violet:#7654D6;--ink:#211C2D;--paper:#FFFDF3;--lilac:#E4DAFF}
      *{box-sizing:border-box} [hidden]{display:none!important}
      .panel{font:14px/1.4 Arial,sans-serif;color:var(--ink);background:var(--paper);border:3px solid var(--ink);border-radius:16px;box-shadow:7px 7px var(--ink);user-select:none;-webkit-user-select:none;overflow:hidden;max-height:calc(100dvh - 40px);overflow-y:auto}
      .panel.copying,.panel.copying *{user-select:text;-webkit-user-select:text;cursor:text} .copying ::selection{background:var(--lemon);color:var(--ink)}
      button{font:700 14px/1.2 Arial,sans-serif;cursor:pointer;color:var(--ink);border:2px solid var(--ink);background:var(--paper);border-radius:8px;min-height:36px;padding:8px 12px;user-select:none!important;-webkit-user-select:none!important}
      button:hover{background:var(--lilac)}button:active{transform:translate(2px,2px);box-shadow:none}button:focus-visible,input:focus-visible{outline:3px solid var(--violet);outline-offset:3px}button:disabled{opacity:.45;cursor:default;transform:none}
      header{display:flex;align-items:center;padding:14px 16px;border-bottom:3px solid var(--ink);gap:8px} .brand{font-size:26px;letter-spacing:-1.4px;font-weight:900;flex:1} .brand em{color:var(--violet);font-style:normal}header button{width:32px;min-height:30px;padding:3px;font-size:18px}
      .body{padding:16px;display:grid;gap:12px}.stage{position:relative;border:2px solid var(--ink);border-radius:10px;background:var(--lilac);height:142px;display:flex;align-items:center;justify-content:space-around;overflow:hidden}.tag{position:absolute;top:9px;left:10px;font-size:9px;font-weight:800;letter-spacing:1.3px}
      .pocket{position:relative;margin-top:22px;width:88px;height:76px;background:var(--lemon);border:3px solid var(--ink);border-radius:9px 9px 28px 28px;box-shadow:4px 4px var(--ink);transform:rotate(-7deg)}.pocket:before{content:'L ㄴ';position:absolute;top:-20px;left:12px;font-size:30px;font-weight:900;letter-spacing:2px;transform:rotate(7deg)}.face{position:absolute;left:24px;top:30px;font-size:24px;font-weight:900;letter-spacing:3px}.stats{text-align:center;margin-top:16px}.stats strong{display:block;font-size:50px;line-height:1;font-weight:900;letter-spacing:-3px}.stats small{font-size:11px}
      h2{font-size:19px;letter-spacing:-.7px;margin:0}.family{margin:0;font-size:12px;color:#544565}.actions{display:grid;grid-template-columns:1fr 88px;gap:8px}.primary{height:48px;background:var(--lemon);font-size:17px;box-shadow:3px 3px var(--ink)}.primary:hover{background:#fff575}.restore{height:48px;font-size:12px}.settings{display:flex;align-items:center;justify-content:space-between;font-size:12px}.settings label{display:flex;align-items:center;gap:5px}input{accent-color:var(--violet);width:16px;height:16px;margin:0}.hint{font-size:10px;color:#544565}.status{margin:0;min-height:38px;border-left:3px solid var(--violet);padding:2px 8px;font-size:12px;line-height:1.5}footer{font-size:9px;font-weight:700;letter-spacing:1px;border-top:2px solid var(--ink);padding:9px 16px;display:flex;justify-content:space-between}
      #copy-menu{margin:0 16px 12px;padding:6px;background:var(--lemon);border:2px solid var(--ink);box-shadow:3px 3px var(--ink);border-radius:9px}#copy-menu button{width:100%;border:0;background:transparent;text-align:left}#copy-help{padding:10px;background:var(--lemon);border:2px dashed var(--ink);font-size:12px;border-radius:8px}#copy-help p{margin:0 0 8px}#copy-help button{font-size:11px;min-height:30px;padding:5px 8px}.panel.minimized .body,.panel.minimized footer{display:none}.panel.minimized header{border:0}
      @media(max-height:550px){.stage{height:106px}.body{gap:8px;padding:12px}.pocket{height:60px}.face{top:24px}.stats strong{font-size:40px}}
    </style>
    <section class="panel" role="dialog" aria-label="Lifter 글자 수집" aria-modal="false" tabindex="-1">
      <header><span class="brand">Lifter<em>.</em></span><button id="minimize" aria-label="패널 접기" aria-expanded="true">−</button><button id="close" aria-label="패널 닫기">×</button></header>
      <div id="copy-menu" hidden><button id="copy-mode">▰ 복사 — 형광펜 모드</button></div>
      <div class="body"><div class="stage"><span class="tag">SMALL CRIME. BIG SMILE.</span><div class="pocket" aria-hidden="true"><span class="face">•ᴗ•</span></div><div class="stats"><strong id="count">0</strong><small>주머니에 쏙!</small></div></div>
      <h2>닮았으면, 일단 가져감.</h2><p class="family">L l ㄴ └ ℓ Ⅼ … 모두 한패잖아 ㅋㅋ</p>
      <div class="actions"><button id="steal" class="primary">L을 가져가~ ↗</button><button id="restore" class="restore" disabled>돌려놓기 ↶</button></div>
      <div class="settings"><label><input id="motion" type="checkbox" checked>뿌숭빠슝 효과</label><span class="hint">우클릭 → 복사</span></div>
      <div id="copy-help" hidden><p>형광펜 ON! 글자를 드래그한 뒤<br>Ctrl/Cmd+C 또는 아래 복사 버튼.</p><button id="copy-selection">선택한 글자 복사 ✦</button> <button id="copy-done">완료</button></div>
      <p id="status" class="status" role="status" aria-live="polite">이 페이지의 L 친구들을 데려와 봐.<br>돌려놓기도 언제든 가능해.</p></div>
      <footer><span>TAKE THE L. LITERALLY.</span><span>LOCAL ONLY ↗</span></footer>
    </section>`;
    doc.documentElement.append(host);
    const $ = id => root.getElementById(id), card = root.querySelector('.panel');
    let fx, destroyed=false, copiedTimer, operation=0;
    $('motion').checked=motion;
    const status = text => { $('status').textContent=text; };
    const target = () => {const r=root.querySelector('.pocket').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};};
    function sync(){const s=engine.status();$('count').textContent=String(s.count);$('restore').disabled=!s.pending;$('steal').disabled=s.busy;}
    function copyMode(on){if(on){operation++;win.clearTimeout(copiedTimer);$('minimize').textContent='−';$('minimize').setAttribute('aria-label','패널 접기');}card.classList.toggle('copying',on);$('copy-help').hidden=!on;$('copy-menu').hidden=true;if(on){card.classList.remove('minimized');$('minimize').setAttribute('aria-expanded','true');status('슥슥— 드래그해서 형광펜을 칠해 봐.');}}
    function celebrate(){fx?.clear();fx=LifterMotion.create(doc,$('motion').checked,target());fx.celebrate?.('복사 완료!');status('복사 완료! 클립보드로 쏙. ✦');win.clearTimeout(copiedTimer);copiedTimer=win.setTimeout(()=>copyMode(false),1200);}
    function selectionText(){const selection=root.getSelection?.() || win.getSelection();if(!selection || selection.isCollapsed)return '';const inside=node=>node && root.contains(node);return inside(selection.anchorNode)&&inside(selection.focusNode)?selection.toString():'';}
    function nativeCopy(event){if(!card.classList.contains('copying'))return;const text=selectionText();if(!text || !event.clipboardData)return;event.clipboardData.setData('text/plain',text);event.preventDefault();celebrate();}
    root.addEventListener('copy',nativeCopy);
    // Copy events are composed in Chromium; the root listener owns this selection.
    card.addEventListener('dragstart',e=>{if(!card.classList.contains('copying'))e.preventDefault();});
    card.addEventListener('contextmenu',e=>{e.preventDefault();$('copy-menu').hidden=false;$('copy-mode').focus();});
    $('copy-mode').onclick=()=>copyMode(true);$('copy-done').onclick=()=>{operation++;win.clearTimeout(copiedTimer);copyMode(false);};
    $('copy-selection').addEventListener('pointerdown',e=>e.preventDefault());
    $('copy-selection').onclick=async()=>{const text=selectionText();if(!text){status('먼저 복사할 글자를 드래그해 줘.');return;}const run=++operation;try{await win.navigator.clipboard.writeText(text);if(!destroyed && run===operation)celebrate();}catch{if(destroyed || run!==operation)return;status('Ctrl/Cmd+C로 복사해 줘. 브라우저가 버튼 복사를 막았어.');}};
    $('steal').onclick=async()=>{
      if(engine.status().busy)return;
      const run=++operation;copyMode(false);fx?.clear();fx=LifterMotion.create(doc,$('motion').checked,target());$('steal').disabled=true;status('뿌숭— 닮은 글자를 찾는 중!');
      try{const result=await engine.steal({onGlyph:fx.glyph});if(destroyed || run!==operation)return;fx.finish(result.count);status(result.cancelled?'수집을 멈췄어.':result.count?`${result.count}개 확보! L도 ㄴ도 내 주머니로 ㅋㅋ`:'여긴 깨끗하군… 가져갈 친구가 없어.');}catch{if(destroyed || run!==operation)return;fx.clear();status('수집을 마치지 못했어. 돌려놓기로 복원할 수 있어.');}finally{if(!destroyed)sync();}
    };
    $('restore').onclick=()=>{operation++;fx?.clear();const r=engine.restore();sync();status(`${r.restored}개 돌려놨어. ${r.skipped?`사이트가 바꾼 ${r.skipped}곳은 그대로 뒀어.`:'아무 일도 없었던 걸로~'}`);};
    $('motion').onchange=()=>{if(!$('motion').checked)fx?.clear();Promise.resolve(save({motion:$('motion').checked})).catch(()=>status('효과 설정은 이 페이지에서만 유지돼.'));};
    $('minimize').onclick=()=>{const minimized=card.classList.toggle('minimized');$('minimize').textContent=minimized?'+':'−';$('minimize').setAttribute('aria-expanded',String(!minimized));$('minimize').setAttribute('aria-label',minimized?'패널 펼치기':'패널 접기');$('copy-menu').hidden=true;};
    $('close').onclick=()=>{operation++;win.clearTimeout(copiedTimer);host.style.setProperty('display','none','important');fx?.clear();};
    card.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();if(card.classList.contains('copying'))copyMode(false);else if(!$('copy-menu').hidden)$('copy-menu').hidden=true;else $('close').click();}});
    function show(){host.style.removeProperty('display');sync();card.focus({preventScroll:true});}
    function destroy(){destroyed=true;operation++;engine.cancel();fx?.clear();win.clearTimeout(copiedTimer);host.remove();}
    sync();return {show,destroy};
  }
  globalThis.LifterPanel={create};
})();
