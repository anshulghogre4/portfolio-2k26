export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  location: string;
  roles: string[];
  tagline: string;
  heroStatement: string;
  fdePhilosophy: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  blog: string;
  openTo: string;
  currentBuild: string;

  pillars: {
    title: string;
    description: string;
  }[];
}

export const profile: Profile = {
  name: 'Anshul Ghogre',
  firstName: 'Anshul',
  lastName: 'Ghogre',
  location: 'Pune, India',
  roles: ['Applied AI Engineer', 'Software Engineer'],

  tagline: 'Building AI systems that survive contact with production.',

  heroStatement:
    "I build AI that works in the real world — not just in notebooks. " +
    "From RAG pipelines and multi-agent orchestration to knowledge graphs and ML models, " +
    "I take applied AI solutions from prototype to production with a Forward Deployed Engineer mindset.",

  fdePhilosophy:
    "I believe in the FDE approach: go into the client's codebase, understand their data, " +
    "respect their constraints, and ship working AI systems — not slide decks. " +
    "Every project I build reflects this: real deployment friction, real data, real users.",

  email: 'anshulghogre4@gmail.com',
  phone: '+91-8109303602',
  github: 'https://github.com/anshulghogre4',
  linkedin: 'https://www.linkedin.com/in/anshulg4/',
  twitter: 'https://twitter.com/anshulghogre4',
  blog: 'https://hashnode.com/@Mrghogre',

  openTo: 'Applied AI Engineer, FDE, and AI Solutions Engineer roles.',
  currentBuild: 'SliceMatic — agentic multi-service ordering platform with AI-driven demand forecasting.',

  pillars: [
    {
      title: 'Agentic AI & RAG',
      description:
        'Multi-agent orchestration, RAG pipelines, knowledge graphs, vector search. ' +
        'LLM inference with fallback-aware architecture. Taking models from notebook to production.',
    },
    {
      title: 'Forward Deployed Mindset',
      description:
        "Embedding with client stacks — .NET, Angular, Next.js, Spring Boot — " +
        "and wiring AI directly into existing systems. Not bolting on a chatbot.",
    },
    {
      title: 'MLOps & Data Engineering',
      description:
        'ML pipelines, model evaluation, feature engineering, and data validation ' +
        'that survives contact with real-world data at scale.',
    },
    {
      title: 'Full-Stack AI Infrastructure',
      description:
        'React/Next.js frontends, FastAPI/.NET backends, Postgres/Supabase, ' +
        'Docker-based self-hosted infra — giving AI a production home.',
    },
  ],
};
