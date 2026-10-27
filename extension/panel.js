(() => {
  if (globalThis.LifterPanel) return;
  function create(doc, engine, {motion = true, save = () => {}, hidden = false, compact = false, intro = null} = {}) {
    const win = doc.defaultView;
    const host = doc.createElement('div');
    host.dataset.lifterRoot = ''; host.dataset.lifterPanel = '';
    host.style.cssText = 'all:initial!important;position:fixed!important;right:20px!important;bottom:20px!important;z-index:2147483646!important;width:min(340px,calc(100vw - 32px))!important;color-scheme:light!important;';
    const root = host.attachShadow({mode:'closed'});
    root.innerHTML = `<style>
      :host{--font-display:LifterJalnan,LifterPretendard,Arial,sans-serif;--font-body:LifterPretendard,Arial,sans-serif;--lemon:#F9EF53;--violet:#7654D6;--ink:#211C2D;--paper:#FFFDF3;--lilac:#E4DAFF}
      *{box-sizing:border-box} [hidden]{display:none!important}
      .panel{font:14px/1.4 var(--font-body);color:var(--ink);background:var(--paper);border:3px solid var(--ink);border-radius:16px;box-shadow:7px 7px var(--ink);user-select:none;-webkit-user-select:none;overflow:hidden;max-height:calc(100dvh - 40px);overflow-y:auto}
      .panel.copying,.panel.copying *{user-select:text;-webkit-user-select:text;cursor:text} .copying ::selection{background:var(--lemon);color:var(--ink)}
      button{font:700 14px/1.2 var(--font-body);cursor:pointer;color:var(--ink);border:2px solid var(--ink);background:var(--paper);border-radius:8px;min-height:36px;padding:8px 12px;user-select:none!important;-webkit-user-select:none!important}
      button:hover{background:var(--lilac)}button:active{transform:translate(2px,2px);box-shadow:none}button:focus-visible,input:focus-visible{outline:3px solid var(--violet);outline-offset:3px}button:disabled{opacity:.45;cursor:default;transform:none}
      header{display:flex;align-items:center;padding:14px 16px;border-bottom:3px solid var(--ink);gap:8px} .brand{font-family:var(--font-display);font-size:26px;letter-spacing:-1.4px;font-weight:900;flex:1} .brand em{color:var(--violet);font-style:normal}header button{width:32px;min-height:30px;padding:3px;font-size:18px}
      .body{padding:16px;display:grid;gap:12px}.stage{position:relative;border:2px solid var(--ink);border-radius:10px;background:var(--lilac);height:142px;display:flex;align-items:center;justify-content:space-around;overflow:hidden}.tag{position:absolute;top:9px;left:10px;font-size:9px;font-weight:800;letter-spacing:1.3px}
      .pocket{position:relative;margin-top:22px;width:88px;height:76px;background:var(--lemon);border:3px solid var(--ink);border-radius:9px 9px 28px 28px;box-shadow:4px 4px var(--ink);transform:rotate(-7deg)}.pocket:before{content:'L ㄴ';position:absolute;top:-20px;left:12px;font-size:30px;font-weight:900;letter-spacing:2px;transform:rotate(7deg)}.face{position:absolute;left:24px;top:30px;font-size:24px;font-weight:900;letter-spacing:3px}.stats{text-align:center;margin-top:16px}.stats strong{display:block;font-size:50px;line-height:1;font-weight:900;letter-spacing:-3px}.stats small{font-size:11px}
      h2{font-family:var(--font-display);font-weight:400;font-size:19px;letter-spacing:-.7px;margin:0}.family{margin:0;font-size:12px;color:#544565}.actions{display:grid;grid-template-columns:1fr 88px;gap:8px}.primary{font-family:var(--font-display);font-weight:400;height:48px;background:var(--lemon);font-size:17px;box-shadow:3px 3px var(--ink)}.primary:hover{background:#fff575}.restore{height:48px;font-size:12px}.settings{display:flex;align-items:center;justify-content:space-between;font-size:12px}.settings label{display:flex;align-items:center;gap:5px}input{accent-color:var(--violet);width:16px;height:16px;margin:0}.hint{font-size:10px;color:#544565}.status{margin:0;min-height:38px;border-left:3px solid var(--violet);padding:2px 8px;font-size:12px;line-height:1.5}footer{font-size:9px;font-weight:700;letter-spacing:1px;border-top:2px solid var(--ink);padding:9px 16px;display:flex;justify-content:space-between}
      #copy-menu{margin:0 16px 12px;padding:6px;background:var(--lemon);border:2px solid var(--ink);box-shadow:3px 3px var(--ink);border-radius:9px}#copy-menu button{width:100%;border:0;background:transparent;text-align:left}#copy-help{padding:10px;background:var(--lemon);border:2px dashed var(--ink);font-size:12px;border-radius:8px}#copy-help p{margin:0 0 8px}#copy-help button{font-size:11px;min-height:30px;padding:5px 8px}.panel.minimized .body,.panel.minimized footer{display:none}.panel.minimized header{border:0}
      .extras{display:grid;gap:8px;border-top:2px solid var(--ink);padding-top:12px}.extras button{font-size:12px}.memory{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px}.memory strong{background:var(--lilac);padding:4px 7px;border-radius:5px}#forget{border:0;background:transparent;text-decoration:underline;font-size:11px;padding:2px;min-height:24px}#image-status{font-size:10px;color:#544565;margin:0}
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
      <div class="extras"><button id="images">▧ 이미지 속 L도 가져가</button><p id="image-status">기기 안에서 인식 · 글자 자리만 투명하게</p><div class="memory"><strong id="memory">이 사이트 기억 준비</strong><button id="forget">기억 지우기</button></div><p class="family">롯데 → 오떼 · 라면 → 아면 ㅋㅋ</p></div>
      <p id="status" class="status" role="status" aria-live="polite">가져가면 이 사이트를 기억해.<br>첫 실행에서 사이트 권한을 허용해 줘.</p></div>
      <footer><span>TAKE THE L. LITERALLY.</span><span>LOCAL ONLY ↗</span></footer>
    </section>`;
    if(hidden)host.style.setProperty('display','none','important');
    doc.documentElement.append(host);
    const $ = id => root.getElementById(id), card = root.querySelector('.panel');
    let fx, destroyed=false, copiedTimer, operation=0;
    $('motion').checked=motion;
    const status = text => { $('status').textContent=text; };
    const target = () => {const r=root.querySelector('.pocket').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};};
    function sync(){const s=engine.status();$('count').textContent=String(s.count);$('restore').disabled=!s.pending;$('steal').disabled=s.busy;$('images').disabled=s.busy;$('memory').textContent=s.remembered?(s.paused?'자동 수집 잠시 쉼':'이 사이트 기억 중 ✦'):'이번 방문만 · 미기억';}
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
      try{const result=await engine.steal({onGlyph:fx.glyph});if(destroyed || run!==operation)return;fx.finish(result.count);status(result.cancelled?'수집을 멈췄어.':result.count?`${result.count}개 확보! ${result.remembered?'다음에 와도 기억할게.':'이번 방문에서 가져왔어.'}`:'여긴 깨끗하군… 가져갈 친구가 없어.');}catch{if(destroyed || run!==operation)return;fx.clear();status('수집을 마치지 못했어. 돌려놓기로 복원할 수 있어.');}finally{if(!destroyed)sync();}
    };
    $('restore').onclick=()=>{operation++;fx?.clear();const r=engine.restore();sync();status(`${r.restored}개 돌려놨어. ${r.skipped?`사이트가 바꾼 ${r.skipped}곳은 그대로 뒀어.`:'아무 일도 없었던 걸로~'}`);};
    $('images').onclick=async()=>{if(!engine.scanImages){status('이미지 인식은 확장 프로그램에서 사용할 수 있어.');return;}if(engine.status().busy)return;const run=++operation;fx?.clear();fx=LifterMotion.create(doc,$('motion').checked,target());$('images').disabled=true;status('이미지를 살펴보는 중… 첫 인식은 잠깐 걸려.');try{const r=await engine.scanImages({onGlyph:fx.glyph,onProgress:(n,total)=>{$('image-status').textContent=`${n} / ${total} 이미지 살피는 중`;}});if(destroyed||run!==operation)return;fx.finish(r.count);$('image-status').textContent=`${r.count}개 투명 처리 · ${r.skipped||0}개 건너뜀`;status(r.errors?.length?r.errors[0]:r.count?'이미지 속 L도 쏙! 돌려놓기로 복원 가능.':'확실하게 인식한 L이 없어. 원본을 유지했어.');}catch(e){status(e.message);}finally{if(!destroyed)sync();}};
    $('forget').onclick=async()=>{operation++;fx?.clear();if(!engine.forget){engine.restore();sync();return;}try{await engine.forget();sync();status('기억과 이미지 캐시를 지우고 원래대로 돌렸어.');}catch(e){status(e.message);}};
    $('motion').onchange=()=>{if(!$('motion').checked)fx?.clear();Promise.resolve(save({motion:$('motion').checked})).catch(()=>status('효과 설정은 이 페이지에서만 유지돼.'));};
    $('minimize').onclick=()=>{const minimized=card.classList.toggle('minimized');$('minimize').textContent=minimized?'+':'−';$('minimize').setAttribute('aria-expanded',String(!minimized));$('minimize').setAttribute('aria-label',minimized?'패널 펼치기':'패널 접기');$('copy-menu').hidden=true;};
    $('close').onclick=()=>{operation++;win.clearTimeout(copiedTimer);host.style.setProperty('display','none','important');fx?.clear();};
    card.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();if(card.classList.contains('copying'))copyMode(false);else if(!$('copy-menu').hidden)$('copy-menu').hidden=true;else $('close').click();}});
    function show(){if(compact){card.classList.remove('minimized');$('minimize').textContent='−';$('minimize').setAttribute('aria-expanded','true');$('minimize').setAttribute('aria-label','패널 접기');}host.style.removeProperty('display');sync();card.focus({preventScroll:true});}
    function destroy(){destroyed=true;operation++;engine.cancel();fx?.clear();win.clearTimeout(copiedTimer);host.remove();}
    if(compact){card.classList.add('minimized');$('minimize').textContent='+';$('minimize').setAttribute('aria-expanded','false');$('minimize').setAttribute('aria-label','패널 펼치기');}
    if(intro)status(intro);
    sync();return {show,destroy,sync};
  }
  globalThis.LifterPanel={create};
})();
