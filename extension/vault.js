(() => {
  const NAME='lifter-vault-v3';
  async function open(){
    const db=await new Promise((resolve,reject)=>{const r=indexedDB.open(NAME,1);r.onupgradeneeded=()=>{r.result.createObjectStore('sites',{keyPath:'origin'});const images=r.result.createObjectStore('images',{keyPath:'key'});images.createIndex('origin','origin');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    function run(store,mode,fn){return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode),req=fn(tx.objectStore(store));let value;req.onsuccess=()=>value=req.result;tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('저장이 취소됐어.'));});}
    return {
      getSite:origin=>run('sites','readonly',s=>s.get(origin)),sites:()=>run('sites','readonly',s=>s.getAll()),
      putSite:site=>run('sites','readwrite',s=>s.put({...site,updated:Date.now()})),
      getImage:key=>run('images','readonly',s=>s.get(key)),
      async putImage(image){
        // Pixel results are a bounded cache; remembered site rules are never evicted here.
        const all=await run('images','readonly',s=>s.getAll());let entries=all.length;let bytes=all.reduce((n,x)=>n+(x.png?.length||0),0);
        for(const old of all.sort((a,b)=>a.updated-b.updated)){if(bytes+(image.png?.length||0)<40*1024*1024 && entries<100)break;await run('images','readwrite',s=>s.delete(old.key));bytes-=old.png?.length||0;entries--;}
        return run('images','readwrite',s=>s.put({...image,updated:Date.now()}));
      },
      async forget(origin){await run('sites','readwrite',s=>s.delete(origin));await new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite'),index=tx.objectStore('images').index('origin'),r=index.openCursor(origin);r.onsuccess=()=>{const c=r.result;if(c){c.delete();c.continue();}};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});},
      close:()=>db.close()
    };
  }
  globalThis.LifterVault={open};
})();
