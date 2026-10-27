(() => {
  if (globalThis.__lifterInstalled) return;
  globalThis.__lifterInstalled = true;
  const engine=LifterEngine.create(document);
  let motion;
  chrome.runtime.onMessage.addListener((message,sender,respond)=>{
    if(sender.id!==chrome.runtime.id || message?.source!=='lifter')return;
    if(message.action==='status'){respond(engine.status());return;}
    if(message.action==='restore'){motion?.clear();respond(engine.restore());return;}
    if(message.action==='steal'){
      if(engine.status().busy){respond({busy:true});return;}
      motion?.clear();motion=LifterMotion.create(document,message.motion!==false);
      engine.steal({lowercase:message.lowercase===true,onGlyph:motion.glyph})
        .then(result=>{motion.finish();respond(result);})
        .catch(()=>{motion.clear();respond({error:'수집을 마치지 못했어. 돌려놓기로 복원할 수 있어.'});});
      return true;
    }
  });
})();
