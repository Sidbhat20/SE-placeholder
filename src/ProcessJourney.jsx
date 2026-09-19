import { useEffect, useRef, useState } from 'react';
import DetailAnimation from './DetailAnimation';
const stages = [
  ['plan', 'Plan', 'Understand the space and its power needs.'],
  ['install', 'Install', 'Build the system with care.'],
  ['test', 'Test', 'Check the connections and performance.'],
  ['handover', 'Handover', 'Leave a clear, usable system behind.'],
];
export default function ProcessJourney() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const root = useRef(null);
  const buttons = useRef([]);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .4 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (manual || !visible || active === 3 || reduced) return;
    const timer = setTimeout(() => setActive((value) => Math.min(value + 1, 3)), 4500);
    return () => clearTimeout(timer);
  }, [active, manual, visible, reduced]);
  const select = (i) => { setManual(true); setActive(i); };
  return <div className="process-journey" ref={root}>
    <div className="process-tabs" role="tablist" aria-label="Project journey">{stages.map(([id, title], i) => <button ref={(node) => { buttons.current[i] = node; }} type="button" id={`stage-${id}`} key={id} role="tab" aria-selected={active === i} aria-controls="process-panel" tabIndex={active === i ? 0 : -1} onFocus={() => setManual(true)} onClick={() => select(i)} onKeyDown={(e) => { let next; if (e.key === 'ArrowRight') next = (i + 1) % 4; if (e.key === 'ArrowLeft') next = (i + 3) % 4; if (e.key === 'Home') next = 0; if (e.key === 'End') next = 3; if (next !== undefined) { e.preventDefault(); select(next); buttons.current[next]?.focus(); } }}><span>0{i + 1}</span>{title}</button>)}</div>
    <div id="process-panel" role="tabpanel" aria-labelledby={`stage-${stages[active][0]}`} className="process-panel"><DetailAnimation key={stages[active][0]} kind={stages[active][0]} /><div><h3>{stages[active][1]}</h3><p>{stages[active][2]}</p><small>Illustrative workflow · confirm project-specific requirements with our team.</small></div></div>
  </div>;
}
