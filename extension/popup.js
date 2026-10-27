(() => {
  const $=id=>document.getElementById(id);
  const steal=$('steal'),restore=$('restore'),lowercase=$('lowercase'),motion=$('motion');
  let tabId, available=false, total=0, pending=0, poll;
  const say=text=>{$('status').textContent=text;};
  function paint(count, remaining=count){total=count||0;pending=remaining||0;$('count').textContent=total.toLocaleString('ko-KR');restore.disabled=!available||pending===0;$('headline').textContent=total?'가져갔다. 진짜로.':'오늘의 L, 내가 가져감.';$('mission').textContent=total?'MISSION ACCOMPLISHED':'SMALL CRIME. BIG SMILE.';}
  function lock(busy){steal.disabled=busy||!available;restore.disabled=busy||!available||!pending;lowercase.disabled=busy;motion.disabled=busy;}
  const send=action=>chrome.tabs.sendMessage(tabId,{source:'lifter',action,lowercase:lowercase.checked,motion:motion.checked});
  async function refresh(){const s=await send('status');paint(s.count,s.pending??s.count);lock(s.busy);return s;}
  async function waitForIdle(){clearTimeout(poll);try{const s=await refresh();if(s.busy){say('주머니에 담는 중…');poll=setTimeout(waitForIdle,300);}else say(s.count?'수집 완료. 돌려놓기도 가능!':'버튼을 누르면 이 페이지에서 시작해.');}catch{unavailable();}}
  function unavailable(){available=false;lock(false);say('이 페이지에서는 잠깐 쉬어갈게. 일반 웹사이트에서 다시 열어줘.');}
  for(const input of [lowercase,motion])input.addEventListener('change',()=>chrome.storage.local.set({lowercase:lowercase.checked,motion:motion.checked}).catch(()=>say('설정을 저장하지 못했어. 이번에는 그대로 사용할게.')));
  steal.addEventListener('click',async()=>{
    lock(true);say('L을 주머니에 담는 중…');
    try{const r=await send('steal');if(r.error)throw Error(r.error);if(r.busy){await waitForIdle();return;}paint(r.total);say(r.count?`${r.count.toLocaleString('ko-KR')}개의 L을 챙겼어. 돌려놓기도 가능!`:'가져갈 L이 없어. 소문자 옵션도 확인해 봐.');}
    catch{say('수집을 마치지 못했어. 새로고침 후 다시 열어줘.');try{await refresh();}catch{unavailable();}}
    finally{lock(false);}
  });
  restore.addEventListener('click',async()=>{
    lock(true);try{const r=await send('restore');paint(0);say(r.skipped?`${r.restored}개 복원. 사이트가 바꾼 ${r.skipped}곳은 그대로 뒀어.`:`${r.restored}개의 L을 제자리에 돌려놨어.`);}catch{say('페이지가 바뀌었어. 새로고침하면 원래대로 돌아와.');}finally{lock(false);}
  });
  async function init(){lock(true);if(!globalThis.chrome?.tabs){unavailable();return;}try{const prefs=await chrome.storage.local.get(['lowercase','motion']);lowercase.checked=prefs.lowercase===true;motion.checked=prefs.motion!==false;const [tab]=await chrome.tabs.query({active:true,currentWindow:true});if(!tab?.id||!/^https?:\/\//.test(tab.url||'')){unavailable();return;}tabId=tab.id;try{await send('status');}catch{await chrome.scripting.executeScript({target:{tabId},files:['engine.js','motion.js','content.js']});}available=true;const state=await refresh();if(state.busy)await waitForIdle();}catch{unavailable();}}
  window.addEventListener('pagehide',()=>clearTimeout(poll));
  init();
})();
