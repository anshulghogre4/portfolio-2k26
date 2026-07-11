export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: 'agentic-ai' | 'applied-ai' | 'mlops' | 'fullstack';
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  stars?: number;
  whatItProves: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    slug: 'slicematic',
    title: 'SliceMatic',
    tagline: 'Agentic pizza ordering platform with AI-driven recommendations',
    description:
      'Full-stack collaborative pizza ordering platform built with Next.js and Supabase. Features AI-driven menu recommendations using LLM inference, scikit-learn demand forecasting, real-time order collaboration, and a full admin dashboard. Built with real deployment friction — branch previews, Row Level Security, environment configuration.',
    category: 'agentic-ai',
    techStack: ['Next.js', 'Supabase', 'TypeScript', 'scikit-learn', 'Python', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/anshulghogre4/Slicematic',
    featured: true,
    whatItProves:
      'Full-stack AI delivery into production — not a notebook demo. AI recommendations, demand forecasting, and real deployment constraints solved.',
    highlights: [
      'AI-driven menu recommendations via LLM inference',
      'scikit-learn demand forecasting pipeline',
      'Real-time collaborative ordering with Supabase Realtime',
      'Row Level Security (RLS) enforcement',
      'Admin dashboard with live order management',
    ],
  },
  {
    slug: 'insurance-ai-ops-hub',
    title: 'Insurance AI Ops Hub',
    tagline: 'Multi-agent AI hub wired into an enterprise .NET + Angular stack',
    description:
      'Multi-agent AI operations hub for the insurance industry. Covers sentiment analysis on customer communication, intelligent claims triage, and fraud detection. Built on .NET 10 + Angular 21 + Semantic Kernel with a 5-provider LLM fallback chain. This is the FDE playbook: agentic AI wired directly into an existing enterprise stack — not bolted on.',
    category: 'agentic-ai',
    techStack: ['.NET 10', 'Angular 21', 'C#', 'Semantic Kernel', 'LangChain', 'Azure OpenAI', 'Python'],
    githubUrl: 'https://github.com/anshulghogre4/insurance-ai-ops-hub',
    featured: true,
    whatItProves:
      'The FDE playbook — embedding agentic AI into enterprise stacks. 5-provider LLM fallback chain, multi-agent orchestration, production resilience.',
    highlights: [
      '5-provider LLM fallback chain (resilience-first inference)',
      'Semantic Kernel multi-agent orchestration',
      'Claims triage agent with intelligent routing',
      'Real-time fraud detection pipeline',
      'Customer sentiment analysis at scale',
    ],
  },
  {
    slug: 'spectraverse',
    title: 'Spectraverse',
    tagline: 'Multimodal AI agent: images ↔ audio ↔ spectrograms with cited reasoning',
    description:
      'Multimodal agent that transforms across images, audio, and spectrograms with cited reasoning. Built on Azure AI Foundry. Demonstrates applied AI beyond text — cross-modal reasoning, grounded generation, and the infrastructure to productionise multimodal pipelines.',
    category: 'applied-ai',
    techStack: ['Python', 'Azure AI Foundry', 'Azure OpenAI', 'LangChain', 'FastAPI'],
    githubUrl: 'https://github.com/anshulghogre4/Spectraverse',
    featured: true,
    whatItProves:
      'Applied AI beyond text. Cross-modal reasoning (image ↔ audio ↔ spectrogram) with grounded, cited outputs. Azure AI Foundry end-to-end.',
    highlights: [
      'Cross-modal transformation: image → audio → spectrogram',
      'Cited reasoning — agent explains every transformation step',
      'Built on Azure AI Foundry',
      'Multimodal RAG architecture',
      'Production-ready FastAPI inference layer',
    ],
  },
  {
    slug: 'online-banking-springboot-react',
    title: 'Online Banking System',
    tagline: 'Full-stack banking platform — Spring Boot + MySQL + React',
    description:
      'Full-stack banking system with secure account management, transaction history, and fund transfer flows. Built with Spring Boot, MySQL, and React. Demonstrates the solid full-stack fundamentals that sit beneath the AI-layer work.',
    category: 'fullstack',
    techStack: ['Spring Boot', 'Java', 'MySQL', 'React', 'TypeScript'],
    githubUrl: 'https://github.com/anshulghogre4/online-banking-springboot-react',
    featured: false,
    stars: 9,
    whatItProves: 'Full-stack fundamentals — the foundation the AI work sits on.',
    highlights: [
      'Secure JWT-based authentication',
      'Account management and transaction history',
      'Fund transfer with validation',
      'Spring Boot REST API with layered architecture',
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
