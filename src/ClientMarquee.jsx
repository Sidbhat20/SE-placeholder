const clients = [
  ['Alder', 'HEALTHCARE', 'M16 4v24M4 16h24M8 8l16 16M24 8 8 24'],
  ['northmill', 'INDUSTRIES', 'M3 28V12l9 6V8l9 6V3h8v25ZM9 25v-3m8 3v-3m8 3v-3'],
  ['HAVEN', 'PROPERTIES', 'm3 16 13-12 13 12M7 13v15h18V13M13 28V18h6v10'],
  ['Meridian', 'HOTELS & RESORTS', 'M3 28V5l13 15L29 5v23M9 28V17l7 8 7-8v11'],
  ['fieldstone', 'LOGISTICS', 'm3 10 13-7 13 7v14l-13 7-13-7ZM3 10l13 8 13-8M16 18v13'],
  ['arcwell', 'WORKSPACES', 'M4 28V16a12 12 0 0 1 24 0v12M11 28V16a5 5 0 0 1 10 0v12'],
];

function Logos({ duplicate = false }) {
  return <ul className="client-logo-group" aria-hidden={duplicate || undefined}>
    {clients.map(([name, sector, path], index) => <li className={`client-logo logo-${index}`} key={name}>
      <svg viewBox="0 0 34 34" aria-hidden="true"><path d={path} /></svg>
      <span><strong>{name}</strong><small>{sector}</small></span>
    </li>)}
  </ul>;
}

export default function ClientMarquee() {
  return <section className="clients" aria-labelledby="clients-heading">
    <div className="clients-heading"><h2 id="clients-heading">The company we keep</h2>
    </div>
    <div className="client-marquee" tabIndex="0" aria-label="Illustrative clients; focus to pause scrolling">
      <div className="client-track"><Logos /><Logos duplicate /></div>
    </div>
  </section>;
}
