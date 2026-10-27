(() => {
 if(globalThis.LifterImages)return;
 function create(doc,request){
  const saved=new Map(),seen=new WeakMap();let busy=false,generation=0;
  function candidates(){return [...doc.images].filter(img=>{const r=img.getBoundingClientRect(),s=doc.defaultView.getComputedStyle(img);return !img.closest('[data-lifter-root],[contenteditable]:not([contenteditable="false"])')&&img.complete&&img.naturalWidth>20&&r.width>20&&r.height>15&&s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'&&/^https?:/.test(img.currentSrc||img.src);});}
  function urls(){return candidates().map(img=>img.currentSrc||img.src);}
  function restore(){generation++;let restored=0,skipped=0;for(const [img,old] of saved){if(img.style.getPropertyValue('content')===old.applied){if(old.content)img.style.setProperty('content',old.content,old.priority);else img.style.removeProperty('content');restored+=old.count;}else skipped++;seen.delete(img);}saved.clear();return {restored,skipped};}
  async function scan({onProgress=()=>{},onGlyph=null}={}){
   if(busy)return {busy:true,count:0};busy=true;const run=generation;let count=0,skipped=0,errors=[];const pending=candidates().filter(img=>seen.get(img)!==(img.currentSrc||img.src)),imgs=pending.slice(0,40);
   try{for(let i=0;i<imgs.length&&run===generation;i++){
    const img=imgs[i],url=img.currentSrc||img.src;if(seen.get(img)===url)continue;
    const previous=saved.get(img);if(previous){if(img.style.getPropertyValue('content')===previous.applied){if(previous.content)img.style.setProperty('content',previous.content,previous.priority);else img.style.removeProperty('content');}saved.delete(img);}
    onProgress(i+1,imgs.length);try{
     const result=await request({action:'image',url});if(result.error)throw Error(result.error);if(run!==generation)break;
     if(!img.isConnected||(img.currentSrc||img.src)!==url)continue;
     seen.set(img,url);if(!result.png||!result.count)continue;
     let old=saved.get(img);if(old&&img.style.getPropertyValue('content')!==old.applied)old=null;
     const content=old?old.content:img.style.getPropertyValue('content'),priority=old?old.priority:img.style.getPropertyPriority('content');
     img.style.setProperty('content',`url("${result.png}")`,'important');
     saved.set(img,{content,priority,applied:img.style.getPropertyValue('content'),count:result.count});count+=result.count;
     if(onGlyph){const r=img.getBoundingClientRect();for(const [index,b] of result.boxes.slice(0,6).entries())onGlyph({letter:b.letter,x:r.x+b.x/result.width*r.width,y:r.y+b.y/result.height*r.height,index});}
    }catch(e){skipped++;errors.push(e.message);}
   }}finally{busy=false;}
   return {count,skipped,errors,remaining:Math.max(0,pending.length-imgs.length),cancelled:run!==generation};
  }
  return {scan,urls,restore,status:()=>({count:[...saved.values()].reduce((n,x)=>n+x.count,0),pending:saved.size,busy}),cancel(){generation++;}};
 }
 globalThis.LifterImages={create};
})();
