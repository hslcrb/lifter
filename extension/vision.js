(() => {
  function boxes(data,width,height){
    const found=[];
    for(const block of data.blocks||[])for(const paragraph of block.paragraphs||[])for(const line of paragraph.lines||[])for(const word of line.words||[])for(const symbol of word.symbols||[]){
      if(!/^[LlℓℒⅬⅼＬｌㄴᄂᆫ└┗╰⌊∟]$/u.test(symbol.text) || symbol.confidence<75)continue;
      const b=symbol.bbox,l=line.bbox||b;if(!b||![b.x0,b.x1,l.y0,l.y1].every(Number.isFinite))continue;
      const x=Math.max(0,b.x0-2),y=Math.max(0,l.y0-2),right=Math.min(width,b.x1+2),bottom=Math.min(height,l.y1+2);
      if(right>x&&bottom>y)found.push({x,y,width:right-x,height:bottom-y,letter:symbol.text});
    }
    return found.slice(0,500);
  }
  globalThis.LifterVision={boxes};
})();
