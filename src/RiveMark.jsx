import { useEffect, useRef, useState } from 'react';
import { Alignment, Fit, Layout, Rive, RuntimeLoader } from '@rive-app/canvas';
import wasmUrl from '@rive-app/canvas/rive.wasm?url';

RuntimeLoader.setWasmUrl(wasmUrl);

export default function RiveMark({ paused = false, replay = 0 }) {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const riveRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setLoaded(false); setReduced(query.matches); };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const instance = new Rive({
      src: '/building.riv', canvas: canvasRef.current,
      animations: 'Follow the current', autoplay: false,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => { instance.resizeDrawingSurfaceToCanvas(); setLoaded(true); },
      onLoadError: () => setFailed(true),
    });
    riveRef.current = instance;
    const observer = new ResizeObserver(() => instance.resizeDrawingSurfaceToCanvas());
    observer.observe(canvasRef.current);
    return () => { observer.disconnect(); instance.cleanup(); riveRef.current = null; };
  }, [reduced]);

  useEffect(() => {
    const update = () => {
      if (!loaded || !riveRef.current) return;
      if (paused || document.hidden) riveRef.current.pause();
      else riveRef.current.play('Follow the current');
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, [loaded, paused, reduced]);

  useEffect(() => {
    if (!replay || !loaded || reduced || !riveRef.current) return;
    riveRef.current.stop('Follow the current');
    riveRef.current.play('Follow the current');
  }, [replay, loaded, reduced]);

  const fallback = reduced || failed || !loaded;
  return <div className="building-art" role="img" aria-label="One continuous electrical cable powers a cafe, an office, a workshop and a hospital in sequence.">
    <img className={fallback ? '' : 'art-hidden'} src="/building.svg" alt="" aria-hidden="true" />
    {!reduced && <canvas ref={canvasRef} className={fallback ? 'art-hidden' : ''} aria-hidden="true" />}
  </div>;
}
