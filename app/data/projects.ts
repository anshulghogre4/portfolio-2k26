export interface Project {
  slug: string;
  title: string;
  problem: string;
  approach: string;
  result: string;
  category: 'agentic-ai' | 'applied-ai' | 'mlops' | 'fullstack';
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  stars?: number;
}

export const projects: Project[] = [
  {
    slug: 'slicematic',
    title: 'SliceMatic (Capstone)',
    problem: 'Pizza chains struggle with inaccurate demand forecasting and rigid online ordering systems that cannot adapt dynamically to context or customer preference.',
    approach: 'Built a full-stack Next.js + Supabase platform integrating scikit-learn for demand forecasting and an LLM inference layer for dynamic menu recommendations.',
    result: 'Deployed a production-ready system with real-time collaborative ordering and environment-based configuration, proving full-stack AI deployment skills under production constraints.',
    category: 'agentic-ai',
    techStack: ['Next.js', 'Supabase', 'TypeScript', 'scikit-learn', 'Python', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/anshulghogre4/Slicematic',
    featured: true,
  },
  {
    slug: 'insurance-ai-ops-hub',
    title: 'Insurance AI Ops Hub',
    problem: 'Insurance enterprises rely on slow, manual workflows for claims triage, fraud detection, and sentiment analysis, leading to severe operational bottlenecks.',
    approach: 'Designed a 9-agent AI system using Semantic Kernel on .NET 10, orchestrated with a 5-provider LLM fallback chain to ensure resilient, enterprise-grade inference.',
    result: 'Delivered a full-stack platform wired directly into enterprise workflows, successfully translating ambiguous business requirements into a structured, production-hardened technical spec.',
    category: 'agentic-ai',
    techStack: ['.NET 10', 'Angular 21', 'C#', 'Semantic Kernel', 'LangChain', 'Azure OpenAI', 'Python'],
    githubUrl: 'https://github.com/anshulghogre4/insurance-ai-ops-hub',
    featured: true,
  },
  {
    slug: 'spectraverse',
    title: 'Spectraverse',
    problem: 'Most AI agents are restricted to text-only interactions, failing to leverage complex multimodal data like images, audio, and spectrograms in unified workflows.',
    approach: 'Implemented a cross-modal RAG architecture using Azure AI Foundry, building an agent that transforms data across modalities and provides grounded, cited reasoning.',
    result: 'Served cross-modal reasoning via a production-ready FastAPI layer, demonstrating advanced applied AI capabilities far beyond standard text-based LLM wrappers.',
    category: 'applied-ai',
    techStack: ['Python', 'Azure AI Foundry', 'Azure OpenAI', 'LangChain', 'FastAPI'],
    githubUrl: 'https://github.com/anshulghogre4/Spectraverse',
    featured: true,
  },
  {
    slug: 'online-banking-springboot-react',
    title: 'Online Banking System',
    problem: 'Modern AI applications require robust, secure, and scalable backend infrastructure to reliably manage state, authentication, and sensitive transactions.',
    approach: 'Developed a comprehensive full-stack banking platform using Spring Boot and React, implementing secure JWT-based authentication and transaction validation.',
    result: 'Established strong, proven full-stack fundamentals and layered architecture design — the critical foundation required to reliably deploy and scale AI-native applications.',
    category: 'fullstack',
    techStack: ['Spring Boot', 'Java', 'MySQL', 'React', 'TypeScript'],
    githubUrl: 'https://github.com/anshulghogre4/online-banking-springboot-react',
    featured: false,
    stars: 9,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
