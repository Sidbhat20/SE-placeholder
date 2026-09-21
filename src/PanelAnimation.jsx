import { useEffect, useRef, useState } from 'react';
import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas';

export default function PanelAnimation() {
  const host = useRef(null);
  const canvas = useRef(null);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => { setReady(false); setReduced(query.matches); };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    const node = host.current;
    let player;
    let resize;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !player) {
        player = new Rive({
          src: '/panel.riv', canvas: canvas.current, animations: 'Panel rhythm', autoplay: true,
          layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
          onLoad: () => { player.resizeDrawingSurfaceToCanvas(); setReady(true); },
          onLoadError: () => setReady(false),
        });
        resize = new ResizeObserver(() => player.resizeDrawingSurfaceToCanvas());
        resize.observe(node);
      }
      if (player) {
        if (entry.isIntersecting && !document.hidden) player.play('Panel rhythm');
        else player.pause();
      }
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => { observer.disconnect(); resize?.disconnect(); player?.cleanup(); };
  }, [reduced]);

  return <div ref={host} className="panel-animation" role="img" aria-label="An electrician connects and tests a graphite electrical panel.">
    <img src="/panel.png" alt="" style={{ visibility: ready && !reduced ? 'hidden' : 'visible' }} />
    {!reduced && <canvas ref={canvas} aria-hidden="true" style={{ visibility: ready ? 'visible' : 'hidden' }} />}
  </div>;
}
