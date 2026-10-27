(() => {
  if (globalThis.LifterMotion) return;
  function create(doc, enabled, destination) {
    const win=doc.defaultView;
    if(!enabled || win.matchMedia('(prefers-reduced-motion: reduce)').matches)return {glyph:null,finish(){},celebrate(){},clear(){}};
    const target=destination || {x:win.innerWidth-54,y:win.innerHeight-52};
    const host=doc.createElement('div');host.dataset.lifterRoot='';host.setAttribute('aria-hidden','true');
    host.style.cssText='all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;';
    const root=host.attachShadow({mode:'closed'}),style=doc.createElement('style');
    style.textContent='*{box-sizing:border-box}.glyph,.word,.chip,.ring,.spark{position:fixed;left:0;top:0;pointer-events:none}.glyph{font:900 28px/1 Arial;color:#211C2D;background:#F9EF53;border:2px solid #211C2D;border-radius:6px;padding:2px 6px;box-shadow:3px 3px #7654D6}.word{font:900 23px/1.2 Arial;color:#211C2D;background:#F9EF53;border:3px solid #211C2D;padding:7px 12px;box-shadow:4px 4px #211C2D;border-radius:10px;white-space:nowrap}.chip{width:9px;height:15px;background:#7654D6;border:1.5px solid #211C2D}.ring{width:50px;height:50px;border:5px solid #7654D6;border-radius:50%}.spark{font:900 28px Arial;color:#7654D6}';
    root.append(style);doc.documentElement.append(host);
    const animations=new Set(),timers=new Set();let removed=false,letters=0,finished=false;
    const later=(fn,ms)=>{const id=win.setTimeout(()=>{timers.delete(id);if(!removed)fn();},ms);timers.add(id);};
    function animate(className,text,frames,options){if(removed)return;const el=doc.createElement('span');el.className=className;el.textContent=text;root.append(el);if(!el.animate){el.remove();return;}const a=el.animate(frames,{fill:'both',...options});animations.add(a);a.finished.then(()=>{animations.delete(a);el.remove();}).catch(()=>{animations.delete(a);el.remove();});}
    function clear(){removed=true;timers.forEach(id=>win.clearTimeout(id));timers.clear();animations.forEach(a=>a.cancel());animations.clear();host.remove();}
    function ring(x,y){animate('ring','',[{transform:`translate(${x-25}px,${y-25}px) scale(.2)`,opacity:1},{transform:`translate(${x-25}px,${y-25}px) scale(2.2)`,opacity:0}],{duration:350,easing:'ease-out'});}
    function word(text,x,y,delay=0){x=Math.max(12,Math.min(x,win.innerWidth-165));y=Math.max(12,Math.min(y,win.innerHeight-60));animate('word',text,[{transform:`translate(${x}px,${y+10}px) rotate(-9deg) scale(.6)`,opacity:0},{transform:`translate(${x}px,${y}px) rotate(-6deg) scale(1.08)`,opacity:1,offset:.18},{transform:`translate(${x}px,${y}px) rotate(-6deg) scale(1)`,opacity:1,offset:.75},{transform:`translate(${x}px,${y-15}px) rotate(-3deg) scale(.9)`,opacity:0}],{duration:680,delay,easing:'ease-out'});}
    function glyph({letter,x,y,index}){
      if(removed || letters++>=24)return;
      const dx=target.x,dy=target.y,delay=Math.min(index*18,260),bend=index%2?60:-60;
      animate('glyph',letter,[{transform:`translate(${x}px,${y}px) rotate(-8deg) scale(1)`,opacity:1},{transform:`translate(${x+bend/3}px,${y-20}px) rotate(${index%2?15:-15}deg) scale(1.25)`,offset:.16,opacity:1},{transform:`translate(${(x+dx)/2+bend}px,${Math.max(15,Math.min(y,dy)-65)}px) rotate(${index%2?130:-130}deg) scale(.85)`,offset:.6,opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(${index%2?250:-250}deg) scale(.05)`,opacity:0}],{duration:720,delay,easing:'cubic-bezier(.45,0,.25,1)'});
      if(index<6){animate('spark',index%2?'✦':'＋',[{transform:`translate(${x}px,${y}px) scale(.3)`,opacity:1},{transform:`translate(${x+(index%2?30:-30)}px,${y-35}px) scale(1.2) rotate(80deg)`,opacity:0}],{duration:360,delay});}
      if(index===0){ring(x,y);word('뿌숭!',x+22,y-48);}
      if(index===5)word('빠슝~',x-80,y-40,120);
    }
    function confetti(){for(let i=0;i<28;i++){const angle=(-170+i*13)*Math.PI/180,speed=60+(i%5)*22,x=target.x,y=target.y,dx=Math.cos(angle)*speed,dy=Math.sin(angle)*speed;animate('chip','',[{transform:`translate(${x}px,${y}px) rotate(0deg)`,opacity:1},{transform:`translate(${x+dx*.7}px,${y+dy-60}px) rotate(${i*31}deg)`,opacity:1,offset:.5},{transform:`translate(${x+dx}px,${y+dy+90}px) rotate(${i*67}deg)`,opacity:0}],{duration:650+(i%4)*70,easing:'cubic-bezier(.15,.5,.5,1)'});}}
    function celebrate(label='확보 완료!'){if(removed)return;ring(target.x,target.y);confetti();word(label,target.x-80,target.y-75);later(clear,1000);}
    function finish(count=1){if(finished||removed)return;finished=true;if(!count){clear();return;}later(()=>celebrate('쏙! 내 거~'),letters?980:0);}
    return {glyph,finish,celebrate,clear};
  }
  globalThis.LifterMotion={create};
})();
