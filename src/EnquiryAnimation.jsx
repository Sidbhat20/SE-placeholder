import { useEffect, useRef, useState } from 'react';
import { Rive, RuntimeLoader, Layout, Fit } from '@rive-app/canvas';
import wasm from '@rive-app/canvas/rive.wasm?url';
RuntimeLoader.setWasmUrl(wasm);

export default function EnquiryAnimation() {
  const canvas = useRef(null);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReady(false); setReduced(query.matches); };
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (reduced) return;
    const player = new Rive({ src: '/enquiry.riv', canvas: canvas.current, animations: 'Prepare enquiry', autoplay: true, layout: new Layout({ fit: Fit.Contain }), onLoad: () => { player.resizeDrawingSurfaceToCanvas(); setReady(true); }, onLoadError: () => setReady(false) });
    const observer = new ResizeObserver(() => player.resizeDrawingSurfaceToCanvas());
    observer.observe(canvas.current);
    return () => { observer.disconnect(); player.cleanup(); };
  }, [reduced]);
  return <div className="enquiry-animation" aria-hidden="true">
    {(!ready || reduced) && <svg viewBox="0 0 320 160"><circle cx="160" cy="80" r="44" fill="#e0e9da"/><path d="m137 80 16 16 31-34" fill="none" stroke="#5b7860" strokeWidth="4"/></svg>}
    {!reduced && <canvas ref={canvas} style={{ visibility: ready ? 'visible' : 'hidden' }} />}
  </div>;
}
