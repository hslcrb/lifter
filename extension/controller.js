(() => {
 if(globalThis.LifterController)return;
 function create(doc,request){
  const core=LifterEngine.create(doc),images=LifterImages.create(doc,request),win=doc.defaultView;
  let remembered=false,autoImages=false,paused=false,observer,timer,running=false,dirty=false,epoch=0,notify=()=>{};
  function status(){const a=core.status(),b=images.status();return {count:a.count+b.count,pending:a.pending+b.pending,busy:a.busy||b.busy||running,remembered,autoImages,paused};}
  function schedule(){dirty=true;win.clearTimeout(timer);timer=win.setTimeout(auto,180);}
  async function auto(){if(!remembered||paused)return;if(running){dirty=true;return;}running=true;dirty=false;const run=epoch;try{await core.steal();if(autoImages&&!paused&&run===epoch){const result=await images.scan();if(result.remaining)dirty=true;}}finally{running=false;notify();if(dirty&&!paused&&remembered)schedule();}}
  function loaded(event){if(event.target?.tagName==='IMG')schedule();}
  function watch(){if(observer)return;observer=new win.MutationObserver(changes=>{if(changes.every(m=>m.target.nodeType===1&&m.target.closest?.('[data-lifter-root]') || m.target.parentElement?.closest('[data-lifter-root]')))return;schedule();});observer.observe(doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['src','srcset']});doc.addEventListener('load',loaded,true);}
  function restore(){paused=true;dirty=false;epoch++;win.clearTimeout(timer);const a=core.restore(),b=images.restore();notify();return {restored:a.restored+b.restored,skipped:a.skipped+b.skipped};}
  return {
   status,restore,cancel(){epoch++;core.cancel();images.cancel();},onChange(fn){notify=fn;},
   async init(){const state=await request({action:'site'});remembered=!!state.remembered;autoImages=!!state.images;if(remembered){watch();await auto();}return status();},
   async steal(options={}){const run=++epoch;paused=true;let memory;try{memory=await request({action:'remember'});}catch{memory={remembered:false};}if(run!==epoch)return {count:0,cancelled:true};remembered=!!memory.remembered;const result=await core.steal(options);if(run===epoch){paused=false;if(remembered)watch();}notify();return {...result,total:status().count,remembered};},
   async scanImages(options={}){const run=++epoch;paused=true;const grant=await request({action:'image-grant',urls:images.urls()});if(run!==epoch)return {count:0,cancelled:true};if(!grant.granted){paused=false;return {count:0,skipped:0,errors:['이미지 접근 권한을 허용해야 해.']};}remembered=!!grant.remembered||remembered;autoImages=remembered;if(remembered)watch();const result=await images.scan(options);if(run===epoch){paused=false;if(result.remaining)schedule();}notify();return result;},
   async forget(){restore();remembered=false;autoImages=false;observer?.disconnect();observer=null;doc.removeEventListener('load',loaded,true);const result=await request({action:'forget'});if(result.error)throw Error(result.error);notify();return result;},
   forgotten(){restore();remembered=false;autoImages=false;observer?.disconnect();observer=null;doc.removeEventListener('load',loaded,true);notify();},
   destroy(){restore();observer?.disconnect();doc.removeEventListener('load',loaded,true);}
  };
 }
 globalThis.LifterController={create};
})();
