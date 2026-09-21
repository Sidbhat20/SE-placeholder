import { useEffect, useState } from 'react';

export default function Loader() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('se-loader-seen') && !matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch { return false; }
  });

  useEffect(() => {
    if (!show) return undefined;
    document.documentElement.classList.add('is-loading');
    try { sessionStorage.setItem('se-loader-seen', '1'); } catch { /* optional storage */ }
    const reveal = setTimeout(() => document.documentElement.classList.add('loader-handoff'), 820);
    const finish = setTimeout(() => {
      document.documentElement.classList.remove('is-loading', 'loader-handoff');
      setShow(false);
    }, 1420);
    return () => { clearTimeout(reveal); clearTimeout(finish); document.documentElement.classList.remove('is-loading', 'loader-handoff'); };
  }, [show]);

  if (!show) return null;
  return <div className="site-loader" aria-hidden="true"><div className="loader-mark"><img src="/brand-logo.png?v=2" alt="" /></div></div>;
}
