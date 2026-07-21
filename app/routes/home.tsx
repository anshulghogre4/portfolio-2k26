import type { Route } from "./+types/home";
import { HeroSection } from "../components/Hero";
import { AboutSection } from "../components/About";
import { SkillsSection } from "../components/Skills";
import { WorkSection } from "../components/Work";
import { ProjectsSection } from "../components/Projects";
import { ContactSection } from "../components/Contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Anshul Ghogre | Applied AI Engineer" },
    { name: "description", content: "Applied AI Engineer with an FDE mindset. RAG, Agentic Systems, Knowledge Graphs, MLOps." },
    { property: "og:title", content: "Anshul Ghogre — Applied AI Engineer" },
    { property: "og:description", content: "Building AI systems that survive contact with production." },
  ];
}

/* ─────────────────────────────────
   FULL SINGLE-PAGE PORTFOLIO
   Hero → About → Skills → Work → Projects → Contact
   ───────────────────────────────── */
export default function Home() {
  return (
    <div style={{ paddingTop: '64px' }}>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}
