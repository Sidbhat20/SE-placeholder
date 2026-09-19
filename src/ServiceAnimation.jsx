import { useEffect, useRef, useState } from 'react';
import { Rive, Layout, Fit } from '@rive-app/canvas';
export default function ServiceAnimation({ kind, label }) {
  const host = useRef(null), canvas = useRef(null), rive = useRef(null);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReady(false); setReduce(q.matches); };
    q.addEventListener('change', change); return () => q.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (reduce) return;
    let player, resize, started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (started) { if (entry.isIntersecting && !document.hidden) player?.play('Activate'); else player?.pause(); return; }
      if (!entry.isIntersecting) return;
      started = true;
      player = new Rive({ src: `/service-${kind}.riv`, canvas: canvas.current, animations: 'Activate', autoplay: true, layout: new Layout({ fit: Fit.Contain }), onLoad: () => { player.resizeDrawingSurfaceToCanvas(); setReady(true); }, onLoadError: () => setReady(false) });
      rive.current = player;
      resize = new ResizeObserver(() => player.resizeDrawingSurfaceToCanvas()); resize.observe(host.current);
    }, { threshold: .2 });
    observer.observe(host.current);
    const visibility = () => { if (document.hidden) player?.pause(); else { const r = host.current.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) player?.play('Activate'); } };
    document.addEventListener('visibilitychange', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); observer.disconnect(); resize?.disconnect(); player?.cleanup(); rive.current = null; };
  }, [kind, reduce]);
  return <div ref={host} className="service-art" role="img" aria-label={`${label}: animated electrical illustration`}> 
    <img src={`/service-${kind}.png`} alt="" style={{ visibility: ready && !reduce ? 'hidden' : 'visible' }} />
    {!reduce && <canvas ref={canvas} aria-hidden="true" style={{ visibility: ready ? 'visible' : 'hidden' }} />}
  </div>;
}
