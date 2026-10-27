(() => {
 if(globalThis.LifterFonts)return;
 globalThis.LifterFonts=async function(doc){if(!doc.fonts||typeof FontFace==='undefined')return;const specs=[['LifterJalnan','Jalnan.woff','400'],['LifterPretendard','Pretendard-Regular.woff2','400'],['LifterPretendard','Pretendard-Bold.woff2','700']];await Promise.allSettled(specs.map(async([family,file,weight])=>{const url=typeof chrome!=='undefined'&&chrome.runtime?.getURL?chrome.runtime.getURL('assets/fonts/'+file):'../../extension/assets/fonts/'+file;const bytes=await (await fetch(url)).arrayBuffer(),face=new FontFace(family,bytes,{weight,display:'swap'});await face.load();doc.fonts.add(face);}));};
})();
