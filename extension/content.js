(() => {
  if (globalThis.__lifterInstalled) {globalThis.__lifterInstalled.then(panel=>panel.show());return;}
  globalThis.__lifterInstalled = (async()=>{
    let prefs={};try{prefs=await chrome.storage.local.get('motion');}catch{/* Defaults work without storage. */}
    const engine=LifterEngine.create(document);
    const panel=LifterPanel.create(document,engine,{motion:prefs.motion!==false,save:value=>chrome.storage.local.set(value)});
    panel.show();return panel;
  })();
})();
