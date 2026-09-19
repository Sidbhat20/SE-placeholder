import { useEffect, useRef } from 'react';
import './projects.css';

export default function ProjectStory({ project, origin, onClose, onNext }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    el.showModal();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && origin) {
      const rect = el.getBoundingClientRect();
      el.animate([
        { transform: `translate(${origin.x + origin.width / 2 - rect.x - rect.width / 2}px, ${origin.y + origin.height / 2 - rect.y - rect.height / 2}px) scale(${Math.max(.25, origin.width / rect.width)})`, opacity: .25 },
        { transform: 'none', opacity: 1 },
      ], { duration: 480, easing: 'cubic-bezier(.23,1,.32,1)' });
    }
    closeButton.current?.focus({ preventScroll: true });
    return () => { el.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, [origin]);
  return <dialog ref={dialog} className="project-dialog" aria-labelledby="project-story-title" onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }}>
    <div className="project-dialog-content">
      <header className="project-dialog-header"><div><p>{project.label}</p><h2 id="project-story-title">{project.title}</h2><span>{project.meta}</span></div><button ref={closeButton} className="project-close" type="button" onClick={onClose} aria-label="Close project"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></header>
      <div className={`expanded-placeholder ${project.tone}`} role="img" aria-label={`Image placeholder for ${project.title}`}><div className="placeholder-lines" /><span className="placeholder-label">Project image<br />to be supplied</span></div>
      <footer className="project-story-footer"><a href="#contact" onClick={onClose}>Discuss a similar project <span aria-hidden="true">↗</span></a><button type="button" onClick={onNext}>Next project <span aria-hidden="true">→</span></button></footer>
    </div>
  </dialog>;
}
