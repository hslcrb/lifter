(() => {
  function create(doc,{storage,image,onChange=()=>{}}){
    const core=LifterEngine.create(doc),key='lifter-playground-v1';
    let remembered=false,images=false,paused=false,epoch=0;
    try{const saved=JSON.parse(storage.getItem(key)||'null');remembered=saved?.remembered===true;images=saved?.images===true;}catch{}
    function persist(){try{storage.setItem(key,JSON.stringify({remembered:true,images}));remembered=true;}catch{remembered=false;}}
    function status(){const s=core.status();return {...s,count:s.count+image.count(),pending:s.pending+image.count(),remembered,paused};}
    async function steal(options={}){if(core.status().busy)return {count:0,busy:true};const run=epoch;paused=false;persist();const r=await core.steal(options);if(run===epoch)onChange('text',r.count);return {...r,remembered};}
    async function scanImages(options={}){if(core.status().busy)return {count:0,busy:true};paused=false;images=true;persist();const count=image.collect(options.onGlyph);options.onProgress?.(1,1);onChange('image',count);return {count,skipped:0,errors:[]};}
    function restore(){epoch++;paused=true;core.cancel();const r=core.restore();r.restored+=image.restore();onChange('restore',r.restored);return r;}
    async function forget(){restore();remembered=false;images=false;try{storage.removeItem(key);}catch{}onChange('forget',0);}
    async function init(){if(!remembered)return;const run=epoch;await core.steal();if(run!==epoch)return;if(images)image.collect();onChange('init',status().count);}
    return {status,steal,scanImages,restore,forget,init,cancel(){epoch++;core.cancel();}};
  }
  globalThis.LifterPlaygroundEngine={create};
})();
