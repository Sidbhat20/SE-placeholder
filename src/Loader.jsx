import { useEffect, useRef, useState } from 'react';
export default function Loader(){
 const mark=useRef(null);
 const [show,setShow]=useState(()=>{try{return !sessionStorage.getItem('se-loader-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}});
 useEffect(()=>{if(!show)return;try{sessionStorage.setItem('se-loader-seen','1')}catch{/* Storage is optional. */}
 let animation;const move=setTimeout(()=>{const target=document.querySelector('.brand-logo');if(!target||!mark.current)return;const a=mark.current.getBoundingClientRect(),b=target.getBoundingClientRect();animation=mark.current.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(${b.width/a.width},${b.height/a.height})`}],{duration:550,easing:'cubic-bezier(.23,1,.32,1)',fill:'forwards'});},700);
 const end=setTimeout(()=>setShow(false),1450);return()=>{clearTimeout(move);clearTimeout(end);animation?.cancel()};},[show]);
 if(!show)return null;
 return <div className="site-loader" aria-hidden="true"><div ref={mark} className="loader-mark"><img src="/brand-logo.png?v=2" alt=""/><span/></div></div>;
}
