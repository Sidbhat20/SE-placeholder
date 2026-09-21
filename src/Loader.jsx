import { useEffect, useRef, useState } from 'react';

export default function Loader() {
  const mark = useRef(null);
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('se-loader-seen') && !matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch { return false; }
  });

  useEffect(() => {
    if (!show) return undefined;
    try { sessionStorage.setItem('se-loader-seen', '1'); } catch { /* optional storage */ }
    const target = document.querySelector('.brand-logo');
    const timer = setTimeout(() => {
      if (!target || !mark.current) return;
      const from = mark.current.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      mark.current.animate([
        { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
        { transform: `translate3d(${dx}px,${dy}px,0) scale(${to.width / from.width})`, opacity: 1 },
      ], { duration: 620, delay: 0, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
    }, 360);
    const end = setTimeout(() => setShow(false), 1050);
    return () => { clearTimeout(timer); clearTimeout(end); };
  }, [show]);

  if (!show) return null;
  return <div className="site-loader" aria-hidden="true"><div ref={mark} className="loader-mark"><img src="/brand-logo.png?v=2" alt="" /></div></div>;
}
