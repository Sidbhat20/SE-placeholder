import { useEffect, useRef, useState } from 'react';

export default function Loader() {
  const mark = useRef(null);
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('se-loader-seen') && !matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch { return false; }
  });

  useEffect(() => {
    if (!show) return undefined;
    const root = document.documentElement;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = [];
    const timers = [];
    let stopped = false;
    const finish = () => {
      if (stopped) return;
      stopped = true;
      timers.forEach(clearTimeout);
      animations.forEach(animation => animation.cancel());
      root.classList.remove('is-loading', 'loader-flight', 'loader-handoff');
      setShow(false);
    };
    const later = (fn, delay) => timers.push(setTimeout(fn, delay));
    root.classList.add('is-loading');
    try { sessionStorage.setItem('se-loader-seen', '1'); } catch { /* Storage is optional. */ }
    const image = mark.current?.querySelector('img');
    const begin = async () => {
      try { await image?.decode(); } catch { finish(); return; }
      if (stopped || motion.matches) return finish();
      animations.push(mark.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 400, fill: 'forwards', easing: 'ease-out',
      }));
      later(() => {
        const target = document.querySelector('.brand-logo');
        if (!target || !mark.current) return finish();
        const from = mark.current.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        if (!to.width || !to.height) return finish();
        const dx = to.left + to.width / 2 - from.left - from.width / 2;
        const dy = to.top + to.height / 2 - from.top - from.height / 2;
        root.classList.add('loader-flight');
        animations.push(mark.current.animate([
          { transform: 'translate3d(0,0,0) scale(1)' },
          { transform: `translate3d(${dx}px,${dy}px,0) scale(${to.width / from.width})` },
        ], { duration: 950, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }));
        later(() => root.classList.add('loader-handoff'), 950);
        later(finish, 1110);
      }, 720);
    };
    begin();
    later(finish, 2500);
    const onMotion = () => { if (motion.matches) finish(); };
    // A changed viewport or user interaction should reveal the real interface, not a stale target.
    window.addEventListener('resize', finish);
    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    motion.addEventListener('change', onMotion);
    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
      animations.forEach(animation => animation.cancel());
      root.classList.remove('is-loading', 'loader-flight', 'loader-handoff');
      window.removeEventListener('resize', finish);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
      motion.removeEventListener('change', onMotion);
    };
  }, [show]);

  if (!show) return null;
  return <div className="site-loader" aria-hidden="true"><div ref={mark} className="loader-mark"><img src="/brand-logo.png?v=2" width="480" height="358" alt="" /></div></div>;
}
