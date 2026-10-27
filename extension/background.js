// A toolbar click grants access only to this tab. No persistent site permissions.
chrome.action.onClicked.addListener(async tab => {
  if (!tab.id) return;
  try {
    await chrome.scripting.executeScript({target:{tabId:tab.id},files:['engine.js','motion.js','panel.js','content.js']});
    await chrome.action.setBadgeText({tabId:tab.id,text:''});
    await chrome.action.setTitle({tabId:tab.id,title:'Lifter — L을 가져가~'});
  } catch {
    await chrome.action.setBadgeText({tabId:tab.id,text:'!'});
    await chrome.action.setBadgeBackgroundColor({tabId:tab.id,color:'#7654D6'});
    await chrome.action.setTitle({tabId:tab.id,title:'이 페이지에는 Lifter를 띄울 수 없어. 일반 웹사이트에서 눌러 줘.'});
  }
});
