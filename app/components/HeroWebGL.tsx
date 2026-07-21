import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/motionPrefs';

gsap.registerPlugin(ScrollTrigger);

// ─── Config ──────────────────────────────────────────────────────────────────
const NODE_COUNT         = 72;
const HUB_INDICES        = new Set([3, 18, 45, 63]);
const CONNECT_DIST       = 4.2;   // node-to-node edge threshold (world units)
const CURSOR_REACH_DIST  = 3.2;   // how close a node must be to draw cursor arc
const ARC_SEGMENTS       = 4;     // lightning arc segments per connection
const MAX_CURSOR_NODES   = 6;     // max nodes that can arc to cursor simultaneously
const ARC_VERTS_PER_NODE = ARC_SEGMENTS * 2; // LineSegments needs pairs
const MAX_ARC_VERTS      = MAX_CURSOR_NODES * ARC_VERTS_PER_NODE;
const MAX_EDGE_VERTS     = NODE_COUNT * (NODE_COUNT - 1);

interface NodeData {
  baseX: number; baseY: number; baseZ: number;
  currentX: number; currentY: number; currentZ: number;
  phaseX: number; phaseY: number;
  speed: number; isHub: boolean;
  arcIntensity: number; // 0-1 animated, for glow pulse when reaching
}

// ─── Component ───────────────────────────────────────────────────────────────
export function HeroWebGL() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;
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
    const cBlue       = new THREE.Color('#3b82f6');
    const cPurple     = new THREE.Color('#a855f7');
    const cGlow       = new THREE.Color('#c4b5fd');
    const cElectric   = new THREE.Color('#7dd3fc'); // electric arc color (sky blue)
    const cElecHot    = new THREE.Color('#ffffff'); // arc center flash

    // ── Node Data ────────────────────────────────────────────────────────────
    const nodeData: NodeData[] = [];
    const nodePos  = new Float32Array(NODE_COUNT * 3);
    const nodeCol  = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      const isHub = HUB_INDICES.has(i);
      const bx = (Math.random() - 0.5) * 16;
      const by = (Math.random() - 0.5) * 9;
      const bz = (Math.random() - 0.5) * 4;

      nodeData.push({
        baseX: bx, baseY: by, baseZ: bz,
        currentX: (Math.random() - 0.5) * 40,
        currentY: (Math.random() - 0.5) * 30,
        currentZ: (Math.random() - 0.5) * 15,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.35,
        isHub,
        arcIntensity: 0,
      });

      const t = (by + 4.5) / 9;
      const c = cBlue.clone().lerp(cPurple, t);
      nodeCol[i*3] = c.r; nodeCol[i*3+1] = c.g; nodeCol[i*3+2] = c.b;
      nodePos[i*3] = nodeData[i].currentX;
      nodePos[i*3+1] = nodeData[i].currentY;
      nodePos[i*3+2] = nodeData[i].currentZ;
    }

    // ── Nodes Mesh ───────────────────────────────────────────────────────────
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    nodesGeo.setAttribute('color',    new THREE.BufferAttribute(nodeCol, 3));
    const nodesMat = new THREE.PointsMaterial({
      size: 0.14, vertexColors: true,
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.95,
      depthWrite: false, sizeAttenuation: true,
    });
    scene.add(new THREE.Points(nodesGeo, nodesMat));

    // Hub nodes (bigger)
    const hubArr = Array.from(HUB_INDICES);
    const hubPos = new Float32Array(hubArr.length * 3);
    const hubCol = new Float32Array(hubArr.length * 3);
    hubArr.forEach((idx, hi) => {
      hubPos[hi*3] = nodePos[idx*3]; hubPos[hi*3+1] = nodePos[idx*3+1]; hubPos[hi*3+2] = nodePos[idx*3+2];
      hubCol[hi*3] = cGlow.r; hubCol[hi*3+1] = cGlow.g; hubCol[hi*3+2] = cGlow.b;
    });
    const hubGeo = new THREE.BufferGeometry();
    hubGeo.setAttribute('position', new THREE.BufferAttribute(hubPos, 3));
    hubGeo.setAttribute('color',    new THREE.BufferAttribute(hubCol, 3));
    const hubMat = new THREE.PointsMaterial({
      size: 0.32, vertexColors: true,
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9,
      depthWrite: false, sizeAttenuation: true,
    });
    scene.add(new THREE.Points(hubGeo, hubMat));

    // ── Proximity Edges ───────────────────────────────────────────────────────
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
    scene.add(new THREE.LineSegments(edgesGeo, edgesMat));

    // ── ⚡ Cursor Lightning Arcs ──────────────────────────────────────────────
    const arcPositions = new Float32Array(MAX_ARC_VERTS * 3);
    const arcColors    = new Float32Array(MAX_ARC_VERTS * 3);
    const arcGeo = new THREE.BufferGeometry();
    const arcPosAttr = new THREE.BufferAttribute(arcPositions, 3);
    const arcColAttr = new THREE.BufferAttribute(arcColors, 3);
    arcPosAttr.setUsage(THREE.DynamicDrawUsage);
    arcColAttr.setUsage(THREE.DynamicDrawUsage);
    arcGeo.setAttribute('position', arcPosAttr);
    arcGeo.setAttribute('color',    arcColAttr);
    const arcMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false, linewidth: 1,
    });
    const arcMesh = new THREE.LineSegments(arcGeo, arcMat);
    scene.add(arcMesh);

    // A small glowing point AT the cursor position
    const cursorDotGeo = new THREE.BufferGeometry();
    cursorDotGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    cursorDotGeo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array([1,1,1]), 3));
    const cursorDotMat = new THREE.PointsMaterial({
      size: 0.06, vertexColors: true,
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0,
      depthWrite: false, sizeAttenuation: true,
    });
    scene.add(new THREE.Points(cursorDotGeo, cursorDotMat));

    // ── Boot-up assembly animation ────────────────────────────────────────────
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

    // ── Mouse tracking ────────────────────────────────────────────────────────
    let mouseNDCX = 0; let mouseNDCY = 0;
    let mouseScreenX = -9999; let mouseScreenY = -9999; // off-screen default
    let cursorWorld = new THREE.Vector3(99, 99, 0); // starts far away
    const tempVec = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const planeNormal = new THREE.Vector3(0, 0, 1);
    const plane = new THREE.Plane(planeNormal, 0); // z=0 plane
    let cursorActive = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseNDCX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDCY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseScreenX = e.clientX; mouseScreenY = e.clientY;
      cursorActive = true;

      // Unproject cursor to world space on z=0 plane
      raycaster.setFromCamera(new THREE.Vector2(mouseNDCX, mouseNDCY), camera);
      raycaster.ray.intersectPlane(plane, cursorWorld);
    };
    const onMouseLeave = () => {
      cursorActive = false;
      cursorWorld.set(99, 99, 0); // push cursor far away
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // ── Scroll fade-out ───────────────────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger: mount.parentElement || mount,
      start: 'top top', end: '+=70%',
      onUpdate: (self) => {
        const p = self.progress;
        edgesMat.opacity = 0.5 * (1 - p * 1.3);
        nodesMat.opacity = 0.95 * (1 - p * 1.3);
        arcMat.opacity   = 1.0  * (1 - p * 1.3);
        if (mount) mount.style.opacity = String(Math.max(0, 1 - p * 1.6));
      },
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Helpers ───────────────────────────────────────────────────────────────
    // Build a jittered lightning segment between two 3D points
    // Returns an array of [v0, v1, v1, v2, ...] pairs (LineSegments format)
    const buildArc = (
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
      intensity: number, // 0-1
      jitterScale: number,
      outPos: Float32Array, outCol: Float32Array, offset: number
    ) => {
      const steps = ARC_SEGMENTS;
      const dx = bx - ax; const dy = by - ay; const dz = bz - az;
      // Perpendicular direction (rough, fine for 2D-ish network)
      const perpX = -dy; const perpY = dx;
      const len = Math.sqrt(perpX*perpX + perpY*perpY) || 1;
      const nx = perpX / len; const ny = perpY / len;

      // Build intermediate points with random jitter
      const pts: number[][] = [[ax, ay, az]];
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const mx = ax + dx * t;
        const my = ay + dy * t;
        const mz = az + dz * t;
        // Jitter amplitude peaks at midpoint, fades at ends
        const jAmp = jitterScale * Math.sin(Math.PI * t) * (0.5 + Math.random() * 0.5);
        const jitter = (Math.random() - 0.5) * 2 * jAmp;
        pts.push([mx + nx * jitter, my + ny * jitter, mz]);
      }
      pts.push([bx, by, bz]);

      // Write as pairs for LineSegments
      let vi = offset;
      for (let s = 0; s < steps; s++) {
        const p0 = pts[s];
        const p1 = pts[s + 1];

        // Color: electric at edges, hot-white near middle
        const t = s / steps;
        const heat = 1 - Math.abs(t - 0.5) * 2; // 0→1→0 from start to end
        const col = cElectric.clone().lerp(cElecHot, heat * intensity);

        // v0
        outPos[vi*3]   = p0[0]; outPos[vi*3+1] = p0[1]; outPos[vi*3+2] = p0[2];
        outCol[vi*3]   = col.r; outCol[vi*3+1] = col.g; outCol[vi*3+2] = col.b;
        vi++;
        // v1
        outPos[vi*3]   = p1[0]; outPos[vi*3+1] = p1[1]; outPos[vi*3+2] = p1[2];
        outCol[vi*3]   = col.r; outCol[vi*3+1] = col.g; outCol[vi*3+2] = col.b;
        vi++;
      }
      return vi;
    };

    // ── Render Loop ──────────────────────────────────────────────────────────
    const renderTick = (gsapTime: number) => {
      // 1. Update node positions + colors
      for (let i = 0; i < NODE_COUNT; i++) {
        const nd = nodeData[i];
        const wx = nd.currentX + Math.sin(gsapTime * nd.speed + nd.phaseX) * 0.28;
        const wy = nd.currentY + Math.cos(gsapTime * nd.speed * 0.65 + nd.phaseY) * 0.18;
        const wz = nd.currentZ;

        nodePos[i*3] = wx; nodePos[i*3+1] = wy; nodePos[i*3+2] = wz;

        // Screen proximity glow (original behavior)
        tempVec.set(wx, wy, wz).project(camera);
        const sx = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (tempVec.y * -0.5 + 0.5) * window.innerHeight;
        const screenDist = Math.hypot(mouseScreenX - sx, mouseScreenY - sy);
        const screenGlow = Math.max(0, 1 - screenDist / 160);

        // World proximity to cursor (for arc intensity)
        const cwx = cursorWorld.x; const cwy = cursorWorld.y;
        const worldDist = Math.hypot(wx - cwx, wy - cwy);
        const cursorGlow = cursorActive ? Math.max(0, 1 - worldDist / CURSOR_REACH_DIST) : 0;

        // Animate arcIntensity (smooth approach/release)
        nd.arcIntensity += (cursorGlow - nd.arcIntensity) * 0.12;

        // Node color: base + screen glow + cursor electric tint
        const t = (nd.baseY + 4.5) / 9;
        const base = cBlue.clone().lerp(cPurple, t);
        let final = base.lerp(cGlow, screenGlow * 0.8);
        if (nd.arcIntensity > 0.05) {
          final = final.lerp(cElectric, nd.arcIntensity * 0.25);
        }
        nodeCol[i*3] = final.r; nodeCol[i*3+1] = final.g; nodeCol[i*3+2] = final.b;
      }
      nodesGeo.attributes.position.needsUpdate = true;
      nodesGeo.attributes.color.needsUpdate    = true;

      // Update hub positions
      hubArr.forEach((idx, hi) => {
        hubPos[hi*3]   = nodePos[idx*3];
        hubPos[hi*3+1] = nodePos[idx*3+1];
        hubPos[hi*3+2] = nodePos[idx*3+2];
      });
      hubGeo.attributes.position.needsUpdate = true;

      // 2. Rebuild proximity edges
      let ev = 0;
      outer: for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodePos[i*3] - nodePos[j*3];
          const dy = nodePos[i*3+1] - nodePos[j*3+1];
          const dz = nodePos[i*3+2] - nodePos[j*3+2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.6;
            edgePositions[ev*3] = nodePos[i*3]; edgePositions[ev*3+1] = nodePos[i*3+1]; edgePositions[ev*3+2] = nodePos[i*3+2];
            edgeColors[ev*3] = nodeCol[i*3]*alpha; edgeColors[ev*3+1] = nodeCol[i*3+1]*alpha; edgeColors[ev*3+2] = nodeCol[i*3+2]*alpha;
            ev++;
            edgePositions[ev*3] = nodePos[j*3]; edgePositions[ev*3+1] = nodePos[j*3+1]; edgePositions[ev*3+2] = nodePos[j*3+2];
            edgeColors[ev*3] = nodeCol[j*3]*alpha; edgeColors[ev*3+1] = nodeCol[j*3+1]*alpha; edgeColors[ev*3+2] = nodeCol[j*3+2]*alpha;
            ev++;
            if (ev >= MAX_EDGE_VERTS - 2) break outer;
          }
        }
      }
      edgesGeo.setDrawRange(0, ev);
      edgePosAttr.needsUpdate = true;
      edgeColAttr.needsUpdate = true;

      // 3. ⚡ Build cursor lightning arcs (every frame = flickering)
      let av = 0;
      let arcCount = 0;

      if (cursorActive) {
        // Sort nodes by distance to cursor, closest first
        const cx = cursorWorld.x; const cy = cursorWorld.y; const cz = cursorWorld.z;

        const candidates: Array<{ idx: number; dist: number; intensity: number }> = [];
        for (let i = 0; i < NODE_COUNT; i++) {
          const dx = nodePos[i*3] - cx;
          const dy = nodePos[i*3+1] - cy;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < CURSOR_REACH_DIST && nodeData[i].arcIntensity > 0.05) {
            candidates.push({ idx: i, dist, intensity: nodeData[i].arcIntensity });
          }
        }
        candidates.sort((a, b) => a.dist - b.dist);

        for (const { idx, dist, intensity } of candidates) {
          if (arcCount >= MAX_CURSOR_NODES) break;
          if (av + ARC_VERTS_PER_NODE > MAX_ARC_VERTS) break;

          const jitterScale = 0.05 + (dist / CURSOR_REACH_DIST) * 0.18; // wider arc when farther
          av = buildArc(
            nodePos[idx*3], nodePos[idx*3+1], nodePos[idx*3+2],
            cx, cy, cz,
            intensity,
            jitterScale,
            arcPositions, arcColors, av
          );
          arcCount++;
        }

        // Cursor dot glow
        const cursorDotPos = cursorDotGeo.attributes.position as THREE.BufferAttribute;
        cursorDotPos.setXYZ(0, cx, cy, cz);
        cursorDotPos.needsUpdate = true;
        cursorDotMat.opacity = Math.min(arcCount / 4, 0.45);
        cursorDotMat.size = 0.04 + (arcCount / MAX_CURSOR_NODES) * 0.04;
      } else {
        cursorDotMat.opacity = 0;
      }

      arcGeo.setDrawRange(0, av);
      arcPosAttr.needsUpdate = true;
      arcColAttr.needsUpdate = true;

      // 4. Camera parallax
      camera.position.x += (mouseNDCX * 0.8 - camera.position.x) * 0.025;
      camera.position.y += (mouseNDCY * 0.5 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    gsap.ticker.add(renderTick);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(renderTick);
      st.kill();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      nodesGeo.dispose(); nodesMat.dispose();
      hubGeo.dispose();   hubMat.dispose();
      edgesGeo.dispose(); edgesMat.dispose();
      arcGeo.dispose();   arcMat.dispose();
      cursorDotGeo.dispose(); cursorDotMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute', inset: 0, zIndex: 0,
        pointerEvents: 'auto', touchAction: 'none',
      }}
    />
  );
}
