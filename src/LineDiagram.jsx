import { useEffect, useRef, useState } from 'react';
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

const LABEL =
  'Single-line diagram of a typical 66/11 KV substation: incoming high-tension ' +
  'supply, isolator, two-winding transformer, busbar, and four outgoing feeders ' +
  'with breakers. Current flows along the conductors.';

// Motion here is the whole point of the element, so reduced-motion gets the
// finished diagram as a still rather than a frozen half-drawn one.
function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function LineDiagram() {
  const canvasRef = useRef(null);
  const [still] = useState(() => prefersReducedMotion());
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (still || failed) return undefined;

    const rive = new Rive({
      src: '/sld.riv',
      canvas: canvasRef.current,
      autoplay: true,
      stateMachines: 'State Machine 1',
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => rive.resizeDrawingSurfaceToCanvas(),
      // A runtime that cannot read the file should degrade to the still,
      // not leave an empty canvas in the hero.
      onLoadError: () => setFailed(true),
    });

    const onResize = () => rive.resizeDrawingSurfaceToCanvas();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      rive.cleanup();
    };
  }, [still, failed]);

  if (still || failed) {
    return (
      <div className="hero-diagram">
        <img src="/sld.png" alt={LABEL} width="600" height="460" />
        <p className="mono diagram-caption">
          Typical 66/11 KV substation — incoming, transformer, busbar, feeders
        </p>
      </div>
    );
  }

  return (
    <div className="hero-diagram">
      <canvas ref={canvasRef} role="img" aria-label={LABEL} />
      <p className="mono diagram-caption">
        Typical 66/11 KV substation — incoming, transformer, busbar, feeders
      </p>
    </div>
  );
}
