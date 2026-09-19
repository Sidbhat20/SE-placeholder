import { useEffect, useRef } from 'react';

/** Balanced mobile with nested pivots and photographic studio reflections. */
export default function KineticMobile() {
  const host = useRef(null);
  const push = useRef(() => {});
  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    import('three').then((T) => {
      if (cancelled) return;
      const root = host.current;
      let renderer;
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      root.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(33, 1, .1, 100);
      camera.position.set(0, 0, 8.6);
      // A bright photographic studio with dark negative-fill surfaces.
      const studio = new T.Scene();
      studio.background = new T.Color('#93979a');
      const cards = [];
      const card = (color, intensity, w, h, pos) => {
        const material = new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(intensity), side: T.DoubleSide });
        const mesh = new T.Mesh(new T.PlaneGeometry(w, h), material);
        mesh.position.set(...pos); mesh.lookAt(0, 0, 0); studio.add(mesh); cards.push(mesh);
      };
      card('#ffffff', 7, 3, 10, [-4, 2, 4]);
      card('#fff0d5', 4, 2, 8, [4, 1, 2]);
      card('#ffffff', 5, 8, 2, [0, 5, 0]);
      card('#111b23', .2, 5, 9, [0, 0, -4]);
      card('#27343e', .3, 2, 8, [-1, -2, 5]);
      card('#e6ecff', 3, 5, 2, [0, -4, 2]);
      const pmrem = new T.PMREMGenerator(renderer);
      const env = pmrem.fromScene(studio, .045);
      scene.environment = env.texture;
      cards.forEach((mesh) => { mesh.geometry.dispose(); mesh.material.dispose(); });
      pmrem.dispose();
      const silver = new T.MeshPhysicalMaterial({ color: '#d9dedc', metalness: 1, roughness: .23, clearcoat: 1 });
      const brass = new T.MeshPhysicalMaterial({ color: '#bfa176', metalness: .95, roughness: .28 });
      const stone = new T.MeshStandardMaterial({ color: '#343e38', metalness: .25, roughness: .55 });
      const glass = new T.MeshPhysicalMaterial({ color: '#d0b888', transparent: true, opacity: .34, metalness: .05, roughness: .12, side: T.DoubleSide });
      const filament = new T.MeshStandardMaterial({ color: '#e4bc70', emissive: '#ffad42', emissiveIntensity: .2 });
      const materials = [silver, brass, stone, glass, filament];
      const sculpture = new T.Group(); scene.add(sculpture);
      const mesh = (geometry, material, parent, x, y, z=0) => {
        const object = new T.Mesh(geometry, material); object.position.set(x,y,z); parent.add(object); return object;
      };
      const rod = (parent, a, b, radius=.012) => {
        const start=new T.Vector3(...a), end=new T.Vector3(...b), direction=end.clone().sub(start);
        const object=mesh(new T.CylinderGeometry(radius,radius,direction.length(),12),brass,parent,0,0);
        object.position.copy(start.add(end).multiplyScalar(.5)); object.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());
      };
      rod(sculpture,[0,2.5,0],[0,1.35,0],.008);
      const upper=new T.Group(); upper.position.y=1.35; sculpture.add(upper);
      rod(upper,[-1.35,.17,0],[1.12,-.14,0]);
      mesh(new T.SphereGeometry(.047,20,12),brass,upper,0,0);
      const discPivot = new T.Group(); discPivot.position.set(-1.35,.17,0); upper.add(discPivot);
      rod(discPivot,[0,0,0],[0,-.77,0],.007);
      const disc=mesh(new T.CylinderGeometry(.57,.57,.055,80),silver,discPivot,0,-1.34);
      disc.rotation.x=Math.PI/2;
      rod(upper,[1.12,-.14,0],[1.12,-.84,0],.007);
      const lower=new T.Group(); lower.position.set(1.12,-.84,0); upper.add(lower);
      rod(lower,[-.86,.10,0],[.62,-.1,0]);
      mesh(new T.SphereGeometry(.04,16,12),brass,lower,0,0);
      const bulbPivot = new T.Group(); bulbPivot.position.set(-.86,.1,0); lower.add(bulbPivot);
      rod(bulbPivot,[0,0,0],[0,-.55,0],.007);
      mesh(new T.CylinderGeometry(.13,.13,.22,32),brass,bulbPivot,0,-.64);
      for (let i=0;i<4;i++) mesh(new T.TorusGeometry(.132,.013,8,32),silver,bulbPivot,0,-.56-i*.047).rotation.x=Math.PI/2;
      const bulb = mesh(new T.SphereGeometry(.33,48,32),glass,bulbPivot,0,-1.02); bulb.scale.y=1.17;
      mesh(new T.CylinderGeometry(.10,.17,.22,24),glass,bulbPivot,0,-.79);
      const wire = new T.CatmullRomCurve3([new T.Vector3(-.08,-.86,0),new T.Vector3(-.1,-1.1,0),new T.Vector3(0,-1.0,0),new T.Vector3(.1,-1.1,0),new T.Vector3(.08,-.86,0)]);
      mesh(new T.TubeGeometry(wire,30,.012,6,false),filament,bulbPivot,0,0);
      const glow = new T.PointLight('#ffc77b',0,3); glow.position.y=-1; bulbPivot.add(glow);
      const arcPivot = new T.Group(); arcPivot.position.set(.62,-.1,0); lower.add(arcPivot);
      rod(arcPivot,[0,0,0],[0,-.55,0],.007);
      const arc=mesh(new T.TorusGeometry(.48,.09,20,72,Math.PI*1.35),brass,arcPivot,0,-.98);
      arc.rotation.z=.3;
      scene.add(new T.HemisphereLight('#fff9ef','#566457',2));
      const resize = () => {
        const { width, height } = root.getBoundingClientRect();
        renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const observer = new ResizeObserver(resize); observer.observe(root);
      let x = 0, y = 0, tx = 0, ty = 0, time = 0, last = 0, frame = 0;
      let visible = true;
      const media = matchMedia('(prefers-reduced-motion: reduce)');
      const pointer = (event) => {
        if (media.matches || event.pointerType === 'touch') return;
        const r = root.getBoundingClientRect();
        tx = (event.clientX - r.left) / r.width - .5; ty = (event.clientY - r.top) / r.height - .5;
      };
      const leave = () => { tx = 0; ty = 0; root.style.cursor = ''; };
      const pivots = [discPivot, bulbPivot, arcPivot];
      const swings = pivots.map(() => ({ angle: 0, velocity: 0 }));
      let lit = false;
      push.current = (index) => {
        if (!media.matches) swings[index].velocity = Math.min(swings[index].velocity + 2.2, 3.6);
        if (index === 1) { lit = !lit; filament.emissiveIntensity = lit ? 4 : .2; glow.intensity = lit ? 1.3 : 0; }
        root.dataset.lastActivated = ['disc','bulb','arc'][index];
        renderer.render(scene, camera);
      };
      const raycaster = new T.Raycaster();
      const hit = (event) => {
        const r = root.getBoundingClientRect();
        raycaster.setFromCamera(new T.Vector2((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1),camera);
        const result=raycaster.intersectObjects([disc,bulb,arc],false)[0];
        return result ? [disc,bulb,arc].indexOf(result.object) : -1;
      };
      const click = (event) => { if (event.target !== renderer.domElement) return; const index=hit(event); if(index>=0) push.current(index); };
      const hover = (event) => { if(event.target===renderer.domElement) root.style.cursor=hit(event)>=0?'pointer':''; }; 
      const draw = (now) => {
        const delta = Math.min((now - last) / 1000 || 0, .05); last = now;
        if (visible && !document.hidden && !media.matches) {
          swings.forEach((s, i) => { s.velocity += (-10*s.angle - 1.1*s.velocity)*delta; s.angle += s.velocity*delta; pivots[i].rotation.x = s.angle; });
          time += delta; x += (tx - x) * .035; y += (ty - y) * .035;
          sculpture.rotation.y = Math.sin(time * .17) * .25 + x * .32;
          upper.rotation.z = Math.sin(time * .48) * .045 + y * .055;
          lower.rotation.z = Math.sin(time * .48 + 1.7) * .075 - y * .08;
          lower.rotation.y = Math.sin(time * .3) * .3;
          disc.rotation.y = Math.sin(time * .35) * .4;
          arc.rotation.y = Math.sin(time * .3 + 1) * .4;
          renderer.render(scene, camera);
        }
        frame = requestAnimationFrame(draw);
      };
      const reduced = () => { if (media.matches) { swings.forEach((s,i) => { s.angle=0; s.velocity=0; pivots[i].rotation.x=0; }); sculpture.rotation.set(0, 0, 0); upper.rotation.set(0, 0, 0); lower.rotation.set(0, 0, 0); disc.rotation.y = 0; arc.rotation.y = 0; renderer.render(scene, camera); } };
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); intersection.observe(root);
      root.addEventListener('click', click); root.addEventListener('pointermove', hover);
      root.addEventListener('pointermove', pointer); root.addEventListener('pointerleave', leave);
      media.addEventListener('change', reduced);
      resize(); reduced(); root.dataset.ready = 'true'; frame = requestAnimationFrame(draw);
      const lost = (event) => { event.preventDefault(); root.dataset.ready = 'false'; cancelAnimationFrame(frame); };
      renderer.domElement.addEventListener('webglcontextlost', lost);
      dispose = () => {
        push.current = () => {}; root.removeEventListener('click',click); root.removeEventListener('pointermove',hover);
        cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
        root.removeEventListener('pointermove', pointer); root.removeEventListener('pointerleave', leave); media.removeEventListener('change', reduced);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
        sculpture.traverse((object) => { object.geometry?.dispose(); });
        materials.forEach((material) => material.dispose()); env.dispose(); renderer.dispose();
        renderer.domElement.remove(); delete root.dataset.ready;
      };
    }).catch(() => {});
    return () => { cancelled = true; dispose(); };
  }, []);
  return <div ref={host} className="chrome-ribbon" role="group" aria-label="Interactive kinetic sculpture. Activate the disc, bulb or arc to give it a gentle push.">
    <svg className="ribbon-fallback" viewBox="0 0 500 500" aria-hidden="true"><g fill="none" stroke="#a18c6e" strokeWidth="2"><path d="M250 20V130M110 115L365 151M110 115V228M365 151V240M282 231L422 254M282 231V321M422 254V345"/><circle cx="110" cy="282" r="54" fill="#b9c2c0"/><rect x="271" y="315" width="22" height="20" fill="#a18c6e"/><ellipse cx="282" cy="359" rx="29" ry="34" fill="#e8d6ac"/><path d="M448 361a40 40 0 1 1-62 0" strokeWidth="14"/></g></svg>
    <div className="mobile-controls">{['Disc','Bulb','Arc'].map((name,i) => <button key={name} type="button" onClick={() => push.current(i)} aria-label={i===1?'Push bulb and toggle light':`Push ${name.toLowerCase()}`}>{name}</button>)}</div>
  </div>;
}
