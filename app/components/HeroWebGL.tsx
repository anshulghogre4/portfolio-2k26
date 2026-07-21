import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/motionPrefs';

gsap.registerPlugin(ScrollTrigger);

// ─── Config ──────────────────────────────────────────────────────────────────
const NODE_COUNT       = 72;
const HUB_INDICES      = new Set([3, 18, 45, 63]);
const CONNECT_DIST     = 4.2;
const MAX_EDGE_VERTS   = (NODE_COUNT * (NODE_COUNT - 1)); // pairs × 2 verts

interface NodeData {
  baseX: number; baseY: number; baseZ: number;
  currentX: number; currentY: number; currentZ: number;
  phaseX: number; phaseY: number;
  speed: number; isHub: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function HeroWebGL() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    // Skip on touch — CSS orbs fallback handles mobile
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── Scene & Renderer ─────────────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 11;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Colors ───────────────────────────────────────────────────────────────
    const cBlue   = new THREE.Color('#3b82f6');
    const cPurple = new THREE.Color('#a855f7');
    const cGlow   = new THREE.Color('#c4b5fd'); // lavender for cursor glow

    // ── Node Data ────────────────────────────────────────────────────────────
    const nodeData: NodeData[] = [];
    const nodePos  = new Float32Array(NODE_COUNT * 3);
    const nodeCol  = new Float32Array(NODE_COUNT * 3);
    const nodeSize = new Float32Array(NODE_COUNT);

    for (let i = 0; i < NODE_COUNT; i++) {
      const isHub = HUB_INDICES.has(i);
      const bx = (Math.random() - 0.5) * 16;
      const by = (Math.random() - 0.5) * 9;
      const bz = (Math.random() - 0.5) * 4;

      nodeData.push({
        baseX: bx, baseY: by, baseZ: bz,
        currentX: (Math.random() - 0.5) * 40,  // start scattered
        currentY: (Math.random() - 0.5) * 30,
        currentZ: (Math.random() - 0.5) * 15,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speed:  0.25 + Math.random() * 0.35,
        isHub,
      });

      const t = (by + 4.5) / 9;
      const c = cBlue.clone().lerp(cPurple, t);
      nodeCol[i*3] = c.r; nodeCol[i*3+1] = c.g; nodeCol[i*3+2] = c.b;
      nodePos[i*3] = nodeData[i].currentX;
      nodePos[i*3+1] = nodeData[i].currentY;
      nodePos[i*3+2] = nodeData[i].currentZ;
      nodeSize[i] = isHub ? 0.28 : 0.10 + Math.random() * 0.10;
    }

    // ── Nodes: PointsMaterial with vertexColors (no custom shader needed) ────
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    nodesGeo.setAttribute('color',    new THREE.BufferAttribute(nodeCol, 3));

    // We use a single size from PointsMaterial — hub nodes get a separate mesh
    const nodesMat = new THREE.PointsMaterial({
      size:         0.14,
      vertexColors: true,
      blending:     THREE.AdditiveBlending,
      transparent:  true,
      opacity:      0.95,
      depthWrite:   false,
      sizeAttenuation: true,
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    scene.add(nodesMesh);

    // Hub nodes (bigger, brighter)
    const hubPos = new Float32Array(HUB_INDICES.size * 3);
    const hubCol = new Float32Array(HUB_INDICES.size * 3);
    let hi = 0;
    HUB_INDICES.forEach(idx => {
      hubPos[hi*3]   = nodePos[idx*3];
      hubPos[hi*3+1] = nodePos[idx*3+1];
      hubPos[hi*3+2] = nodePos[idx*3+2];
      hubCol[hi*3]   = cGlow.r; hubCol[hi*3+1] = cGlow.g; hubCol[hi*3+2] = cGlow.b;
      hi++;
    });
    const hubGeo = new THREE.BufferGeometry();
    hubGeo.setAttribute('position', new THREE.BufferAttribute(hubPos, 3));
    hubGeo.setAttribute('color',    new THREE.BufferAttribute(hubCol, 3));
    const hubMat = new THREE.PointsMaterial({
      size: 0.34, vertexColors: true,
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9,
      depthWrite: false, sizeAttenuation: true,
    });
    const hubMesh = new THREE.Points(hubGeo, hubMat);
    scene.add(hubMesh);

    // ── Edges ─────────────────────────────────────────────────────────────────
    const edgePositions = new Float32Array(MAX_EDGE_VERTS * 3);
    const edgeColors    = new Float32Array(MAX_EDGE_VERTS * 3);
    const edgesGeo  = new THREE.BufferGeometry();
    const edgePosAttr = new THREE.BufferAttribute(edgePositions, 3);
    const edgeColAttr = new THREE.BufferAttribute(edgeColors, 3);
    edgePosAttr.setUsage(THREE.DynamicDrawUsage);
    edgeColAttr.setUsage(THREE.DynamicDrawUsage);
    edgesGeo.setAttribute('position', edgePosAttr);
    edgesGeo.setAttribute('color',    edgeColAttr);
    const edgesMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    scene.add(edgesMesh);

    // ── Boot-up scatter → assemble animation ─────────────────────────────────
    if (!prefersReducedMotion()) {
      nodeData.forEach((nd, i) => {
        gsap.to(nd, {
          currentX: nd.baseX, currentY: nd.baseY, currentZ: nd.baseZ,
          duration: 1.8, delay: 0.3 + (i / NODE_COUNT) * 1.0,
          ease: 'power3.out',
        });
      });
    } else {
      nodeData.forEach(nd => {
        nd.currentX = nd.baseX; nd.currentY = nd.baseY; nd.currentZ = nd.baseZ;
      });
    }

    // ── Mouse ────────────────────────────────────────────────────────────────
    let mouseNDCX = 0; let mouseNDCY = 0;
    let mouseScreenX = W / 2; let mouseScreenY = H / 2;
    const tempVec = new THREE.Vector3();

    const onMouseMove = (e: MouseEvent) => {
      mouseNDCX = (e.clientX / W) * 2 - 1;
      mouseNDCY = -(e.clientY / H) * 2 + 1;
      mouseScreenX = e.clientX; mouseScreenY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Scroll fade-out ───────────────────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger: mount.parentElement || mount,
      start: 'top top', end: '+=70%',
      onUpdate: (self) => {
        const p = self.progress;
        edgesMat.opacity = 0.5 * (1 - p * 1.3);
        nodesMat.opacity = 0.95 * (1 - p * 1.3);
        if (mount) mount.style.opacity = String(Math.max(0, 1 - p * 1.6));
      },
    });

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Render Loop ──────────────────────────────────────────────────────────
    const renderTick = (gsapTime: number) => {
      // Update node positions (base + gentle float drift)
      for (let i = 0; i < NODE_COUNT; i++) {
        const nd = nodeData[i];
        const wx = nd.currentX + Math.sin(gsapTime * nd.speed + nd.phaseX) * 0.28;
        const wy = nd.currentY + Math.cos(gsapTime * nd.speed * 0.65 + nd.phaseY) * 0.18;
        const wz = nd.currentZ;

        nodePos[i*3] = wx; nodePos[i*3+1] = wy; nodePos[i*3+2] = wz;

        // Cursor proximity glow
        tempVec.set(wx, wy, wz).project(camera);
        const sx = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (tempVec.y * -0.5 + 0.5) * window.innerHeight;
        const dist = Math.hypot(mouseScreenX - sx, mouseScreenY - sy);
        const glow = Math.max(0, 1 - dist / 160);

        const t = (nd.baseY + 4.5) / 9;
        const base = cBlue.clone().lerp(cPurple, t);
        const glowed = base.lerp(cGlow, glow * 0.8);
        nodeCol[i*3] = glowed.r; nodeCol[i*3+1] = glowed.g; nodeCol[i*3+2] = glowed.b;
      }

      nodesGeo.attributes.position.needsUpdate = true;
      nodesGeo.attributes.color.needsUpdate    = true;

      // Update hub positions
      hi = 0;
      HUB_INDICES.forEach(idx => {
        hubPos[hi*3]   = nodePos[idx*3];
        hubPos[hi*3+1] = nodePos[idx*3+1];
        hubPos[hi*3+2] = nodePos[idx*3+2];
        hi++;
      });
      hubGeo.attributes.position.needsUpdate = true;

      // Rebuild edges (proximity-based)
      let ev = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodePos[i*3]   - nodePos[j*3];
          const dy = nodePos[i*3+1] - nodePos[j*3+1];
          const dz = nodePos[i*3+2] - nodePos[j*3+2];
          if (Math.sqrt(dx*dx + dy*dy + dz*dz) < CONNECT_DIST) {
            const alpha = (1 - Math.sqrt(dx*dx+dy*dy+dz*dz) / CONNECT_DIST) * 0.6;
            edgePositions[ev*3] = nodePos[i*3]; edgePositions[ev*3+1] = nodePos[i*3+1]; edgePositions[ev*3+2] = nodePos[i*3+2];
            edgeColors[ev*3] = nodeCol[i*3]*alpha; edgeColors[ev*3+1] = nodeCol[i*3+1]*alpha; edgeColors[ev*3+2] = nodeCol[i*3+2]*alpha;
            ev++;
            edgePositions[ev*3] = nodePos[j*3]; edgePositions[ev*3+1] = nodePos[j*3+1]; edgePositions[ev*3+2] = nodePos[j*3+2];
            edgeColors[ev*3] = nodeCol[j*3]*alpha; edgeColors[ev*3+1] = nodeCol[j*3+1]*alpha; edgeColors[ev*3+2] = nodeCol[j*3+2]*alpha;
            ev++;
            if (ev >= MAX_EDGE_VERTS - 2) break;
          }
        }
        if (ev >= MAX_EDGE_VERTS - 2) break;
      }

      edgesGeo.setDrawRange(0, ev);
      edgePosAttr.needsUpdate = true;
      edgeColAttr.needsUpdate = true;

      // Camera parallax
      camera.position.x += (mouseNDCX * 0.8 - camera.position.x) * 0.025;
      camera.position.y += (mouseNDCY * 0.5 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    gsap.ticker.add(renderTick);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(renderTick);
      st.kill();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      nodesGeo.dispose(); nodesMat.dispose();
      hubGeo.dispose();   hubMat.dispose();
      edgesGeo.dispose(); edgesMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'auto',
        touchAction: 'none',
      }}
    />
  );
}
