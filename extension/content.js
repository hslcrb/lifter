(() => {
 if(globalThis.__lifterInstalled)return;
 globalThis.__lifterInstalled=(async()=>{
  let prefs={};try{prefs=await chrome.storage.local.get('motion');}catch{}
  const request=m=>chrome.runtime.sendMessage({target:'lifter-background',...m});
  const engine=LifterController.create(document,request);
  const panel=LifterPanel.create(document,engine,{motion:prefs.motion!==false,save:v=>chrome.storage.local.set(v),hidden:true});
  engine.onChange(panel.sync);LifterFonts(document);
  chrome.runtime.onMessage.addListener((m,sender)=>{if(sender.id===chrome.runtime.id&&m?.source==='lifter-background'&&m.action==='forgotten')engine.forgotten();});
  await engine.init();return panel;
 })();
})();
