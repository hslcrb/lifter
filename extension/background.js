importScripts('vault.js');
const files=['engine.js','motion.js','images.js','controller.js','fonts.js','panel.js','content.js'];
const db=LifterVault.open();let creating,registry=Promise.resolve();const generations=new Map();
const originOf=url=>{const u=new URL(url);if(!['http:','https:'].includes(u.protocol))throw Error('일반 웹사이트에서 사용할 수 있어.');return u.origin;};
async function siteId(origin){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(origin));return 'lifter-'+Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('').slice(0,24);}
async function register(origin){const id=await siteId(origin);const work=registry.then(async()=>{const scripts=await chrome.scripting.getRegisteredContentScripts({ids:[id]});if(!scripts.length)await chrome.scripting.registerContentScripts([{id,matches:[origin+'/*'],js:files,runAt:'document_idle',persistAcrossSessions:true}]);});registry=work.catch(()=>{});return work;}
async function offscreen(){if((await chrome.runtime.getContexts({contextTypes:['OFFSCREEN_DOCUMENT'],documentUrls:[chrome.runtime.getURL('offscreen.html')]})).length)return;if(!creating)creating=chrome.offscreen.createDocument({url:'offscreen.html',reasons:['WORKERS','BLOBS'],justification:'이미지의 L 글자를 기기 안에서만 인식하고 투명 PNG로 가공합니다.'}).finally(()=>creating=null);await creating;}
chrome.action.onClicked.addListener(async tab=>{
 if(!tab.id)return;
 try{await chrome.scripting.executeScript({target:{tabId:tab.id},files});await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>globalThis.__lifterInstalled?.then(panel=>panel.show())});await chrome.action.setBadgeText({tabId:tab.id,text:''});await chrome.action.setTitle({tabId:tab.id,title:'Lifter — L을 가져가~'});}
 catch{await chrome.action.setBadgeText({tabId:tab.id,text:'!'});await chrome.action.setBadgeBackgroundColor({tabId:tab.id,color:'#7654D6'});await chrome.action.setTitle({tabId:tab.id,title:'일반 웹사이트에서 Lifter를 눌러 줘.'});}
});
async function dispatch(m,sender){
 const origin=originOf(sender.tab.url);
 if(m.action==='forget')generations.set(origin,(generations.get(origin)||0)+1);
 const epoch=generations.get(origin)||0,valid=()=>epoch===(generations.get(origin)||0);
 // Chrome requires the request before the first await to retain the click gesture.
 let grant;
 if(m.action==='remember')grant=chrome.permissions.request({origins:[origin+'/*']});
 if(m.action==='image-grant'){const origins=[...new Set([origin,...(m.urls||[]).slice(0,40).map(originOf)])].slice(0,12).map(o=>o+'/*');grant=chrome.permissions.request({origins});}
 const vault=await db;
 if(m.action==='site')return await vault.getSite(origin)||{origin,remembered:false};
 if(m.action==='remember'){
  if(!await grant||!valid())return {remembered:false};
  await register(origin);if(!valid())return {remembered:false};await vault.putSite({origin,remembered:true,images:(await vault.getSite(origin))?.images||false});return {remembered:true};
 }
 if(m.action==='image-grant'){
  const granted=await grant;
  if(!valid())return {granted:false,remembered:false};
  if(granted){await register(origin);if(!valid())return {granted:false,remembered:false};await vault.putSite({origin,remembered:true,images:true});}return {granted,remembered:granted};
 }
 if(m.action==='image'){
  const imageOrigin=originOf(m.url);
  if(!await chrome.permissions.contains({origins:[imageOrigin+'/*']}))throw Error('이미지 주소에 대한 권한이 필요해. 이미지 버튼을 눌러 줘.');
  await offscreen();return chrome.runtime.sendMessage({target:'lifter-offscreen',url:m.url,origin});
 }
 if(m.action==='forget'){
  await vault.forget(origin);await registry.catch(()=>{});await chrome.scripting.unregisterContentScripts({ids:[await siteId(origin)]}).catch(()=>{});
  const tabs=await chrome.tabs.query({url:origin+'/*'});await Promise.allSettled(tabs.map(t=>chrome.tabs.sendMessage(t.id,{source:'lifter-background',action:'forgotten'})));
  await chrome.permissions.remove({origins:[origin+'/*']});return {forgotten:true};
 }
 throw Error('지원하지 않는 작업이야.');
}
chrome.runtime.onMessage.addListener((m,sender,respond)=>{if(sender.id!==chrome.runtime.id||!sender.tab||sender.frameId!==0||m?.target!=='lifter-background')return;dispatch(m,sender).then(respond,e=>respond({error:e.message}));return true;});
async function reconcile(){for(const site of await (await db).sites())if(await chrome.permissions.contains({origins:[site.origin+'/*']}))await register(site.origin);}
chrome.runtime.onStartup.addListener(()=>reconcile().catch(()=>{}));chrome.runtime.onInstalled.addListener(()=>reconcile().catch(()=>{}));
