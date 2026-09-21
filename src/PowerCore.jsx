import { useEffect, useRef, useState } from 'react';
import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas';
export default function PowerCore() {
  const canvas=useRef(null); const [ready,setReady]=useState(false); const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const fn=()=>{setReady(false);setReduced(q.matches)};q.addEventListener('change',fn);return()=>q.removeEventListener('change',fn)},[]);
  useEffect(()=>{if(reduced)return;const player=new Rive({src:'/power-core.riv',canvas:canvas.current,animations:'Illuminate',autoplay:true,layout:new Layout({fit:Fit.Contain,alignment:Alignment.Center}),onLoad:()=>{player.resizeDrawingSurfaceToCanvas();setReady(true)},onLoadError:()=>setReady(false)});const resize=new ResizeObserver(()=>player.resizeDrawingSurfaceToCanvas());resize.observe(canvas.current);return()=>{resize.disconnect();player.cleanup()}},[reduced]);
  return <div className="power-core" role="img" aria-label="A suspended gallery sculpture of a glass power core, brass rings and four illuminated lamps."><img src="/power-core.png" alt="" style={{visibility:ready&&!reduced?'hidden':'visible'}} />{!reduced&&<canvas ref={canvas} style={{visibility:ready?'visible':'hidden'}} />}</div>;
}
