/**
 * ParticleSphere — atmospheric 3D sphere that fills its parent section.
 *
 * Parallax behaviour:
 *  - GSAP ScrollTrigger on the #about section drives mesh.position.y
 *    so the sphere drifts upward as you scroll down (depth illusion).
 *  - Lenis scroll velocity drives a tilt on mesh.rotation.x so fast
 *    scrolling makes the sphere "lean" and spring back when you stop.
 *  - Slow auto-spin + subtle mouse parallax are preserved.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../lib/lenis';

gsap.registerPlugin(ScrollTrigger);

interface ParticleSphereProps {
  opacity?: number;
}

export function ParticleSphere({ opacity = 0.15 }: ParticleSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const mount = mountRef.current;

    // ── Renderer ──────────────────────────────────────────────────────────────
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

    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
    });
    camera.position.z = 9;

    // ── 2 000 particles on a sphere ───────────────────────────────────────────
    const COUNT  = 2000;
    const posArr = new Float32Array(COUNT * 3);
    const colArr = new Float32Array(COUNT * 3);
    const c1 = new THREE.Color('#3b82f6');
    const c2 = new THREE.Color('#a855f7');

    for (let i = 0; i < COUNT * 3; i += 3) {
      const radius = 4.5;
      const theta  = Math.random() * 2 * Math.PI;
      const phi    = Math.acos(Math.random() * 2 - 1);
      posArr[i]   = radius * Math.sin(phi) * Math.cos(theta);
      posArr[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      posArr[i+2] = radius * Math.cos(phi);
      const t = (posArr[i+1] + radius) / (radius * 2);
      const c = c1.clone().lerp(c2, t);
      colArr[i] = c.r; colArr[i+1] = c.g; colArr[i+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colArr, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.055, vertexColors: true,
      blending: THREE.AdditiveBlending, transparent: true,
      opacity: 0.9, depthWrite: false,
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    // ── Parallax state ────────────────────────────────────────────────────────
    // scrollY: 0 (section top) → 1 (section bottom)
    // Maps to mesh.position.y: +1.5 → -1.5  (drifts UP as page scrolls DOWN)
    const parallax = { progress: 0, velocityTilt: 0 };

    // ── GSAP ScrollTrigger — section parallax ─────────────────────────────────
    // Find the #about section (mount is inside it)
    const sectionEl = mount.closest('#about') || mount.parentElement;

    const st = ScrollTrigger.create({
      trigger: sectionEl,
      start:   'top bottom',   // starts when section top hits viewport bottom
      end:     'bottom top',   // ends when section bottom exits viewport top
      scrub:   true,           // ties progress directly to scroll position
      onUpdate: (self) => {
        parallax.progress = self.progress; // 0 → 1
      },
    });

    // ── Lenis velocity → tilt effect ─────────────────────────────────────────
    // We read Lenis velocity each tick (getLenis() is a singleton getter)
    // and let it drive a momentary x-rotation lean that springs back to 0.

    // ── Mouse parallax ────────────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - halfW) / halfW; // -1 → 1
      mouseY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Render loop ───────────────────────────────────────────────────────────
    const tick = () => {
      // 1. Slow auto-spin
      mesh.rotation.y += 0.0015;
      mesh.rotation.x += 0.0006;

      // 2. Mouse tilt (soft lerp, additive on top of spin)
      mesh.rotation.y += (mouseX * 0.08 - mesh.rotation.y) * 0.012;
      mesh.rotation.x += (mouseY * 0.05 - mesh.rotation.x) * 0.012;

      // 3. Scroll-driven vertical parallax
      //    progress 0 → 1 maps to Y: +1.8 → -1.8
      //    The sphere appears to float at a different depth than the content
      const targetY = 1.8 - parallax.progress * 3.6;
      mesh.position.y += (targetY - mesh.position.y) * 0.06;

      // 4. Lenis velocity → momentary lean on X axis
      const lenis = getLenis();
      if (lenis) {
        // velocity is in px/s (positive = scrolling down)
        const vel = (lenis as any).velocity ?? 0;
        // Map velocity to a small x-rotation lean, max ±0.18 rad
        const velTilt = Math.max(-0.18, Math.min(0.18, vel * 0.0004));
        parallax.velocityTilt += (velTilt - parallax.velocityTilt) * 0.10;
        mesh.rotation.x += parallax.velocityTilt;
      }

      // 5. Scroll-driven Z rotation drift — very subtle axis shift
      //    Creates the feeling the sphere is slowly tilting as you pass it
      const targetZ = (parallax.progress - 0.5) * 0.4;
      mesh.rotation.z += (targetZ - mesh.rotation.z) * 0.04;

      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    // ── Resize ────────────────────────────────────────────────────────────────
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
      st.kill();
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
        inset:         0,
        opacity,
        pointerEvents: 'none',
        zIndex:        0,
        mixBlendMode:  'screen',
      }}
    />
  );
}
