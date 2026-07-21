import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export function initLenis() {
  if (typeof window === "undefined") return null; // SSR guard
  if (lenis) return lenis;

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  // Let ScrollTrigger recalc on Lenis scroll
  lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis from GSAP's ticker instead of its own rAF loop
  // this is what keeps ScrollTrigger and Lenis perfectly in sync
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}
