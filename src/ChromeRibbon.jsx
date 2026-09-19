import { useEffect, useRef } from 'react';

/** A twisted, closed satin-chrome band. Studio cards are reflection sources,
 * not visible page elements. Loaded only after mount; all GPU resources disposed. */
export default function ChromeRibbon() {
  const host = useRef(null);
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
      // Closed ribbon with a full twist, swept along a three-dimensional loop.
      const n = 320, cross = 20;
      const vertices = [], indices = [];
      const center = (t) => new T.Vector3(1.43 * Math.cos(t), 1.64 * Math.sin(t), .52 * Math.sin(2 * t));
      for (let i = 0; i <= n; i++) {
        const t = i / n * Math.PI * 2;
        const c = center(t);
        const tangent = center(t + .001).sub(center(t - .001)).normalize();
        const normal = new T.Vector3(Math.cos(t), Math.sin(t), 0);
        normal.addScaledVector(tangent, -normal.dot(tangent)).normalize();
        const binormal = new T.Vector3().crossVectors(tangent, normal).normalize();
        const twist = t + .45 * Math.sin(2 * t);
        const across = normal.clone().multiplyScalar(Math.cos(twist)).addScaledVector(binormal, Math.sin(twist));
        const thickness = new T.Vector3().crossVectors(tangent, across).normalize();
        for (let j = 0; j <= cross; j++) {
          const a = j / cross * Math.PI * 2;
          const p = c.clone().addScaledVector(across, .49 * Math.cos(a)).addScaledVector(thickness, .055 * Math.sin(a));
          vertices.push(p.x, p.y, p.z);
          if (i < n && j < cross) {
            const k = i * (cross + 1) + j;
            indices.push(k, k + cross + 1, k + 1, k + 1, k + cross + 1, k + cross + 2);
          }
        }
      }
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices); geometry.computeVertexNormals();
      const material = new T.MeshPhysicalMaterial({ color: '#e0e2e3', metalness: 1, roughness: .16, envMapIntensity: 1.2, clearcoat: 1, clearcoatRoughness: .13, side: T.DoubleSide });
      const sculpture = new T.Mesh(geometry, material);
      sculpture.rotation.set(.24, -.3, -.42);
      scene.add(sculpture);
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
      const leave = () => { tx = 0; ty = 0; };
      const draw = (now) => {
        const delta = Math.min((now - last) / 1000 || 0, .05); last = now;
        if (visible && !document.hidden && !media.matches) {
          time += delta; x += (tx - x) * .035; y += (ty - y) * .035;
          sculpture.rotation.set(.24 + Math.sin(time * .21) * .13 + y * .22, -.3 + Math.sin(time * .17) * .5 + x * .4, -.42 + Math.sin(time * .14) * .14);
          sculpture.position.y = Math.sin(time * .4) * .065;
          renderer.render(scene, camera);
        }
        frame = requestAnimationFrame(draw);
      };
      const reduced = () => { if (media.matches) { sculpture.rotation.set(.24, -.3, -.42); sculpture.position.y = 0; renderer.render(scene, camera); } };
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); intersection.observe(root);
      root.addEventListener('pointermove', pointer); root.addEventListener('pointerleave', leave);
      media.addEventListener('change', reduced);
      resize(); reduced(); root.dataset.ready = 'true'; frame = requestAnimationFrame(draw);
      const lost = (event) => { event.preventDefault(); root.dataset.ready = 'false'; cancelAnimationFrame(frame); };
      renderer.domElement.addEventListener('webglcontextlost', lost);
      dispose = () => {
        cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
        root.removeEventListener('pointermove', pointer); root.removeEventListener('pointerleave', leave); media.removeEventListener('change', reduced);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
        geometry.dispose(); material.dispose(); env.dispose(); renderer.dispose();
        renderer.domElement.remove(); delete root.dataset.ready;
      };
    }).catch(() => {});
    return () => { cancelled = true; dispose(); };
  }, []);
  return <div ref={host} className="chrome-ribbon" role="img" aria-label="A sculptural silver ribbon with warm metallic reflections, slowly folding through light.">
    <svg className="ribbon-fallback" viewBox="0 0 500 500" aria-hidden="true"><defs><linearGradient id="ribbon-silver" x1="0" x2="1" y1="0" y2=".6"><stop stopColor="#fafafa"/><stop offset=".22" stopColor="#626c74"/><stop offset=".43" stopColor="#edf0ed"/><stop offset=".6" stopColor="#9d968a"/><stop offset=".78" stopColor="#fff7e7"/><stop offset="1" stopColor="#434c56"/></linearGradient></defs><path d="M150 340C40 200 195 50 305 117C424 190 252 258 177 164C103 70 389 157 375 301C359 456 244 460 150 340Z" fill="none" stroke="url(#ribbon-silver)" strokeWidth="48"/></svg>
  </div>;
}
