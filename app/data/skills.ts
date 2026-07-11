export interface Skill {
  name: string;
  category: 'ai-agents' | 'rag-knowledge' | 'mlops' | 'cloud' | 'fullstack' | 'tools';
}

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  accent: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'ai-agents',
    label: 'Agentic AI & LLMs',
    description: 'Multi-agent orchestration, LLM inference, fallback chains',
    accent: '#2dacf9',
    skills: [
      { name: 'LangChain', category: 'ai-agents' },
      { name: 'Semantic Kernel', category: 'ai-agents' },
      { name: 'Azure OpenAI', category: 'ai-agents' },
      { name: 'Azure AI Foundry', category: 'ai-agents' },
      { name: 'Multi-Agent Orchestration', category: 'ai-agents' },
      { name: 'LLM Fallback Chains', category: 'ai-agents' },
      { name: 'Prompt Engineering', category: 'ai-agents' },
      { name: 'n8n', category: 'ai-agents' },
    ],
  },
  {
    id: 'rag-knowledge',
    label: 'RAG & Knowledge Systems',
    description: 'RAG pipelines, vector search, knowledge graphs',
    accent: '#7ce95a',
    skills: [
      { name: 'RAG Pipelines', category: 'rag-knowledge' },
      { name: 'Vector Search (Qdrant)', category: 'rag-knowledge' },
      { name: 'Knowledge Graphs', category: 'rag-knowledge' },
      { name: 'Embedding Models', category: 'rag-knowledge' },
      { name: 'Document Indexing', category: 'rag-knowledge' },
      { name: 'Semantic Search', category: 'rag-knowledge' },
      { name: 'Multimodal RAG', category: 'rag-knowledge' },
    ],
  },
  {
    id: 'mlops',
    label: 'MLOps & Data Engineering',
    description: 'ML pipelines, model evaluation, data validation',
    accent: '#fa73da',
    skills: [
      { name: 'scikit-learn', category: 'mlops' },
      { name: 'Python', category: 'mlops' },
      { name: 'ML Pipelines', category: 'mlops' },
      { name: 'Feature Engineering', category: 'mlops' },
      { name: 'Model Evaluation', category: 'mlops' },
      { name: 'Great Expectations', category: 'mlops' },
      { name: 'Regression / Classification', category: 'mlops' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & Infrastructure',
    description: 'Azure stack, self-hosted infra, Docker',
    accent: '#ffdf5f',
    skills: [
      { name: 'Azure (AI-102, DP-100, AZ-305, AZ-104)', category: 'cloud' },
      { name: 'Docker', category: 'cloud' },
      { name: 'Supabase', category: 'cloud' },
      { name: 'Coolify', category: 'cloud' },
      { name: 'Vercel', category: 'cloud' },
      { name: 'PostgreSQL', category: 'cloud' },
      { name: 'Self-hosted Qdrant', category: 'cloud' },
    ],
  },
  {
    id: 'fullstack',
    label: 'Full-Stack (AI needs a home)',
    description: 'Frontends, backends, APIs for AI-powered products',
    accent: '#00d9ff',
    skills: [
      { name: 'TypeScript', category: 'fullstack' },
      { name: 'React / Next.js', category: 'fullstack' },
      { name: 'Angular', category: 'fullstack' },
      { name: 'React Router v7', category: 'fullstack' },
      { name: '.NET / C#', category: 'fullstack' },
      { name: 'FastAPI', category: 'fullstack' },
      { name: 'Node.js', category: 'fullstack' },
      { name: 'Spring Boot / Java', category: 'fullstack' },
    ],
  },
];
