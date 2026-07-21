/**
 * ParticleSphere — atmospheric 3D sphere that fills its parent section.
 * Canvas is 100% width/height, sphere radius is large so particles spread
 * across the whole area as a soft glowing cloud (opacity ~0.15).
 * Slow auto-spin + subtle mouse parallax.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface ParticleSphereProps {
  opacity?: number;
}

export function ParticleSphere({ opacity = 0.15 }: ParticleSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const mount = mountRef.current;

    // ── Renderer sized to fill the mount div (which is 100% of section) ──────
    const getSize = () => ({
      w: mount.offsetWidth  || window.innerWidth,
      h: mount.offsetHeight || window.innerHeight,
    });

    let { w, h } = getSize();

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // Force canvas to fill mount div — Three.js setSize sets pixel dimensions but
    // not CSS fill, so the canvas stays top-left unless we override.
    Object.assign(renderer.domElement.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    });

    camera.position.z = 9;


    // ── 2000 particles in a sphere distribution ───────────────────────────────
    const COUNT   = 2000;
    const posArr  = new Float32Array(COUNT * 3);
    const colArr  = new Float32Array(COUNT * 3);

    const c1 = new THREE.Color('#3b82f6'); // blue
    const c2 = new THREE.Color('#a855f7'); // purple

    for (let i = 0; i < COUNT * 3; i += 3) {
      const radius = 4.5;                          // larger radius → more spread
      const theta  = Math.random() * 2 * Math.PI;
      const phi    = Math.acos(Math.random() * 2 - 1);

      posArr[i]   = radius * Math.sin(phi) * Math.cos(theta);
      posArr[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      posArr[i+2] = radius * Math.cos(phi);

      const t = (posArr[i+1] + radius) / (radius * 2);
      const c = c1.clone().lerp(c2, t);
      colArr[i]   = c.r;
      colArr[i+1] = c.g;
      colArr[i+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colArr, 3));

    const mat = new THREE.PointsMaterial({
      size:         0.055,
      vertexColors: true,
      blending:     THREE.AdditiveBlending,
      transparent:  true,
      opacity:      0.9,          // per-particle opacity; mount div controls global
      depthWrite:   false,
    });

    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    // ── Mouse for parallax ────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const halfW = window.innerWidth  / 2;
    const halfH = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - halfW) / halfW;  // -1 → 1
      mouseY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── GSAP ticker render loop ───────────────────────────────────────────────
    const tick = () => {
      // Slow continuous spin
      mesh.rotation.y += 0.0015;
      mesh.rotation.x += 0.0006;

      // Subtle mouse parallax (soft lerp)
      mesh.rotation.y += (mouseX * 0.08 - mesh.rotation.y) * 0.015;
      mesh.rotation.x += (mouseY * 0.05 - mesh.rotation.x) * 0.015;

      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    // ── Resize handler ────────────────────────────────────────────────────────
    const onResize = () => {
      const s = getSize();
      w = s.w; h = s.h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(tick);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,            // fills the parent absolutely
        opacity,
        pointerEvents: 'none',
        zIndex:        0,
        mixBlendMode:  'screen',
      }}
    />
  );
}
