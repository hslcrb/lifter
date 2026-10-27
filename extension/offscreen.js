let workerPromise,queue=Promise.resolve(),idleTimer;
const dbPromise=LifterVault.open();
async function worker(){
  clearTimeout(idleTimer);
  if(!workerPromise)workerPromise=Tesseract.createWorker(['eng','kor'],1,{workerPath:chrome.runtime.getURL('vendor/ocr/worker.min.js'),corePath:chrome.runtime.getURL('vendor/ocr'),langPath:chrome.runtime.getURL('vendor/ocr'),workerBlobURL:false,cacheMethod:'none',gzip:true}).catch(e=>{workerPromise=null;throw e;});
  return workerPromise;
}
async function processImage({origin,url}){
  const response=await fetch(url,{credentials:'omit',redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!response.ok || !/^image\/(png|jpeg|webp|bmp)/.test(response.headers.get('content-type')||''))throw Error('PNG/JPEG/WebP 이미지가 아니거나 불러올 수 없어.');
  const reader=response.body.getReader(),chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>8*1024*1024){await reader.cancel();throw Error('이미지는 8MB까지만 살펴볼 수 있어.');}chunks.push(value);}
  const bytes=await new Blob(chunks).arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
  const key=origin+'|v3|'+hash,db=await dbPromise,cached=await db.getImage(key);if(cached)return {...cached,cached:true};
  const bitmap=await createImageBitmap(new Blob([bytes]));
  if(bitmap.width*bitmap.height>4e6){bitmap.close();throw Error('400만 픽셀을 넘는 이미지는 건너뛰었어.');}
  const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);bitmap.close();
  const ocr=await worker();await ocr.setParameters({tessedit_pageseg_mode:'11'});
  const {data}=await ocr.recognize(canvas,{}, {blocks:true,text:true});
  const boxes=LifterVision.boxes(data,canvas.width,canvas.height);for(const b of boxes)ctx.clearRect(b.x,b.y,b.width,b.height);
  const result={key,origin,png:boxes.length?canvas.toDataURL('image/png'):null,count:boxes.length,boxes,width:canvas.width,height:canvas.height};
  // Forgetting while OCR is running must not recreate the forgotten site's cache.
  if(await db.getSite(origin))await db.putImage(result);
  idleTimer=setTimeout(async()=>{const p=workerPromise;workerPromise=null;if(p)await (await p).terminate();},60000);
  return result;
}
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(sender.id!==chrome.runtime.id || sender.tab || message?.target!=='lifter-offscreen')return;
  const task=queue.then(()=>processImage(message));queue=task.catch(()=>{});
  task.then(respond,e=>respond({error:e.message}));return true;
});
