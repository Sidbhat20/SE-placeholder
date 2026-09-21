import { useEffect, useRef, useState } from 'react';
import PowerCore from './PowerCore';
import EnquiryAnimation from './EnquiryAnimation';
import PanelAnimation from './PanelAnimation';
import DetailAnimation from './DetailAnimation';
import Loader from './Loader';
import './loader.css';
import './details.css';
import ClientMarquee from './ClientMarquee';
import ProjectStory from './ProjectStory';
import './hero.css';
import './street.css';
import './chrome.css';
import './responsive.css';
import './mobile.css';

const projects = [
  { id: '01', title: 'Chitradurga Substation', meta: '66 / 11 KV · 16 MVA', tone: 'sky', rotate: '-2deg', label: 'Substation / 2024' },
  { id: '02', title: 'Gunasheela Trinity Hospital', meta: '500 KVA · Basavanagudi', tone: 'peach', rotate: '2deg', label: 'Healthcare / 2023' },
  { id: '03', title: 'Rossell Techsys', meta: '250 KVA · Whitefield', tone: 'mint', rotate: '-1deg', label: 'Industrial / 2022' },
  { id: '04', title: 'Karnataka Housing Board', meta: '250 KVA · Koramangala', tone: 'lavender', rotate: '1.5deg', label: 'Residential / 2021' },
  { id: '05', title: 'Hotel Empire', meta: '315 KVA · Castle Street', tone: 'sky', rotate: '-2.5deg', label: 'Hospitality / 2020' },
  { id: '06', title: 'Azim Premji Foundation', meta: '200 KVA · Sarjapura', tone: 'peach', rotate: '2deg', label: 'Institutional / 2019' },
];

const services = ['Substations & HT systems', 'Commercial installations', 'Power audits & protection', 'Maintenance & commissioning'];

function useReveal() {
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');
  const observerRef = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observerRef.current?.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    observerRef.current.observe(node);
    return () => observerRef.current?.disconnect();
  }, []);

  return { visible, revealRef: (node) => { nodeRef.current = node; } };
}

function RevealSection({ children, className = '', delay = '', id }) {
  const { visible, revealRef } = useReveal();
  return <div ref={revealRef} id={id} className={`reveal-section ${visible ? 'is-visible' : ''} ${className}`} data-delay={delay}>{children}</div>;
}

function RainbowButton({ children }) {
  return <a className="rainbow-button" href="#contact"><span>{children}</span><b>↗</b></a>;
}

function Header() {
  return <header className="floating-nav">
    <a href="#top" className="wordmark" aria-label="Suchetana Electricals home"><img className="brand-logo" src="/brand-logo.png?v=2" alt="Suchetana Electricals" width="480" height="358" /></a>
    <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a><RainbowButton>Start a project</RainbowButton></nav>
  </header>;
}

function Hero() {
  return <section className="hero current-hero chrome-hero" id="top">
    <div className="hero-copy">
      <p className="hero-origin">Suchetana Electricals · Bengaluru, since 1969</p>
      <h1>Behind every great space,<br />a good connection.</h1>
      <p>From the first coffee to the last shift. We build the electrical systems that keep everyday life moving.</p>
      <div className="hero-actions"><RainbowButton>Plan your power system</RainbowButton><a href="#work" className="quiet-link">Explore our work <span>↗</span></a></div>
    </div>
    <div className="chrome-stage"><PowerCore /></div>
  </section>;
}

function Work() {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState(null);
  const [origin, setOrigin] = useState(null);
  const openProject = (project, event) => {
    setOrigin(event.currentTarget.getBoundingClientRect());
    setSelected(project);
  };
  const filtered = active === 'All' ? projects : projects.filter((project) => project.label.startsWith(active));
  const categories = ['All', 'Substation', 'Healthcare', 'Industrial', 'Residential', 'Hospitality', 'Institutional'];
  return <><RevealSection className="work-section" id="work"><div className="section-heading"><div><span className="eyebrow">The project wall</span><h2>Proof, with a<br /><em>place</em> attached.</h2></div></div><div className="filters" role="group" aria-label="Filter projects">{categories.map((category) => <button key={category} aria-pressed={active === category} className={active === category ? 'active' : ''} onClick={() => setActive(category)}>{category}</button>)}</div><div className="project-wall">{filtered.map((project) => <article className={`project-card ${project.tone}`} style={{ '--rotate': project.rotate }} key={project.id}><button type="button" className="project-open" onClick={(event) => openProject(project, event)} aria-label={`View project: ${project.title}`}><div className="project-photo"><div className="placeholder-lines" /><span className="placeholder-label">Project image<br />to be supplied</span><small>{project.id}</small><span className="project-view">View project <span aria-hidden="true">↗</span></span></div><div className="project-copy"><span className="eyebrow">{project.label}</span><h3>{project.title}</h3><p>{project.meta}</p></div></button></article>)}</div></RevealSection>{selected && <ProjectStory project={selected} origin={origin} onClose={() => setSelected(null)} onNext={() => setSelected(projects[(projects.findIndex((p) => p.id === selected.id) + 1) % projects.length])} />}</>;

}

function About() {
  return <RevealSection className="about-section" id="about"><div className="about-copy"><span className="eyebrow">A small, serious team</span><h2>Warm hands.<br /><em>Exact</em> systems.</h2><p>Suchetana Electricals is a family-led electrical contracting practice in Bengaluru. We make the infrastructure feel simple for the people who have to live with it.</p><a href="#contact" className="quiet-link">Meet the people behind the licence <span>↗</span></a></div><figure className="founder-portrait"><div className="portrait-mount"><img src="/madhusudan.png" alt="Madhusudan M.S., proprietor of Suchetana Electricals" loading="lazy" /><span className="portrait-corner corner-top" aria-hidden="true" /><span className="portrait-corner corner-bottom" aria-hidden="true" /></div><DetailAnimation kind="portrait" /><figcaption><strong>Madhusudan M.S.</strong><span>Proprietor & licence holder</span></figcaption><blockquote>“The best installation is the one that quietly lets the building do its thing.”</blockquote></figure></RevealSection>;
}

function Services() {
  return <RevealSection className="services-section"><div className="section-heading compact"><div><span className="eyebrow">What we carry</span><h2>From first<br /><em>spark</em> to handover.</h2></div><p>One accountable line across the whole job — planning, installation, testing and the aftercare that makes it last.</p></div><div className="services-feature"><div><span className="eyebrow">Built, wired, checked</span><p>Every system is assembled with a human eye on the details — clean routes, secure terminations and a quiet handover.</p></div><PanelAnimation /></div><div className="service-list">{services.map((service, index) => <div className="service-row" key={service}><span>0{index + 1}</span><h3>{service}</h3><span className="service-spark" aria-hidden="true">↗</span></div>)}</div></RevealSection>;
}

function Contact() {
  const [submission, setSubmission] = useState(0);
  return <section className="contact-section" id="contact"><div><span className="eyebrow">Open channel</span><h2>Have a load<br />in mind?</h2><p>Tell us the rough version — a location, a capacity, a deadline. We’ll help you find the clear next step.</p><div className="contact-details"><a href="tel:+919845013813">+91 98450 13813 <span>↗</span></a><a href="mailto:suchetanaele@gmail.com">suchetanaele@gmail.com <span>↗</span></a></div></div><form onSubmit={(event) => { event.preventDefault(); setSubmission((value) => value + 1); }}><label>Name<input name="name" autoComplete="name" required placeholder="Your name" /></label><label>Project type<input name="projectType" required placeholder="Home, hospital, factory…" /></label><label>Tell us a little<textarea name="message" required rows="3" placeholder="Location, approximate load, timing…" /></label><button type="submit" className="enquiry-submit"><span>{submission ? 'Preview enquiry again' : 'Send enquiry'}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg></button><small>Demo form — enquiries are not sent. Please email or call us to get in touch.</small>{submission > 0 && <div className="enquiry-feedback"><EnquiryAnimation key={submission} /><div role="status"><strong>Your next project starts here.</strong><p>This is a preview, not a sent message. Contact us by email or phone to continue.</p></div></div>}</form></section>;
}

export default function App() {
  return <><Loader /><Header /><main><Hero /><ClientMarquee /><Work /><About /><Services /><Contact /></main><footer><span>© {new Date().getFullYear()} Suchetana Electricals</span><span>Class I electrical contractors · Bengaluru</span><a href="#top">Back to top ↑</a></footer></>;
}
