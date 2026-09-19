import { useEffect, useRef, useState } from 'react';
import { Rive, RuntimeLoader, Layout, Fit } from '@rive-app/canvas';
import wasm from '@rive-app/canvas/rive.wasm?url';
RuntimeLoader.setWasmUrl(wasm);
const outlines = {
  portrait: 'M35 70H115L138 57 155 78 173 55 190 70H355',
  plan: 'M95 120V35H285V120H95M155 120V75H220V120',
  install: 'M50 78H104V52H158V78H217V108H273V78H340',
  test: 'M95 110V65L120 37 160 25H210L255 40 280 70V110ZM190 100 224 52',
  handover: 'M135 125V25H230L260 55V125ZM157 88 179 105 228 63',
};
export default function DetailAnimation({ kind }) {
  const host = useRef(null), canvas = useRef(null);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReady(false); setReduce(q.matches); };
    q.addEventListener('change', change);
    return () => q.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (reduce) return;
    let played = false, loaded = false, visible = false;
    const play = () => { if (loaded && visible && !played) { player.play('Reveal'); played = true; } };
    const player = new Rive({ src: `/detail-${kind}.riv`, canvas: canvas.current, animations: 'Reveal', autoplay: false, layout: new Layout({ fit: Fit.Contain }), onLoad: () => { loaded = true; player.resizeDrawingSurfaceToCanvas(); setReady(true); play(); }, onLoadError: () => setReady(false) });
    const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; play(); }, { threshold: .25 }); observer.observe(host.current);
    const resize = new ResizeObserver(() => player.resizeDrawingSurfaceToCanvas()); resize.observe(host.current);
    return () => { observer.disconnect(); resize.disconnect(); player.cleanup(); };
  }, [kind, reduce]);
  return <div className={`detail-animation detail-${kind}`} ref={host} aria-hidden="true"><svg viewBox="0 0 390 150" style={{ visibility: ready && !reduce ? 'hidden' : 'visible' }}><path d={outlines[kind]} fill="none" stroke="#798469" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>{!reduce && <canvas ref={canvas} style={{ visibility: ready ? 'visible' : 'hidden' }} />}</div>;
}
