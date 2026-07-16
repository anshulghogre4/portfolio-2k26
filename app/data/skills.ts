export interface Skill {
  name: string;
  category: 'ai-agents' | 'rag-knowledge' | 'mlops' | 'cloud' | 'fullstack' | 'tools';
  icon?: string; // SVG/PNG URL from devicons or simpleicons
}

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  accent: string;
  skills: Skill[];
}

// Using https://cdn.simpleicons.org/<slug> and https://cdn.jsdelivr.net/gh/devicons/devicon/icons/<name>/<name>-original.svg
export const skillCategories: SkillCategory[] = [
  {
    id: 'ai-agents',
    label: 'Agentic AI & LLMs',
    description: 'Multi-agent orchestration, LLM inference, fallback chains',
    accent: '#2dacf9',
    skills: [
      { name: 'LangChain', category: 'ai-agents', icon: 'https://cdn.simpleicons.org/langchain/1C3C3C' },
      { name: 'Semantic Kernel', category: 'ai-agents', icon: 'https://cdn.simpleicons.org/microsoftazure/0078D4' },
      { name: 'Azure OpenAI', category: 'ai-agents', icon: 'https://cdn.simpleicons.org/openai/412991' },
      { name: 'Azure AI Foundry', category: 'ai-agents', icon: 'https://cdn.simpleicons.org/microsoftazure/0078D4' },
      { name: 'Multi-Agent Orchestration', category: 'ai-agents' },
      { name: 'LLM Fallback Chains', category: 'ai-agents' },
      { name: 'Prompt Engineering', category: 'ai-agents' },
      { name: 'n8n', category: 'ai-agents', icon: 'https://cdn.simpleicons.org/n8n/EA4B71' },
    ],
  },
  {
    id: 'rag-knowledge',
    label: 'RAG & Knowledge Systems',
    description: 'RAG pipelines, vector search, knowledge graphs',
    accent: '#7ce95a',
    skills: [
      { name: 'RAG Pipelines', category: 'rag-knowledge' },
      { name: 'Vector Search (Qdrant)', category: 'rag-knowledge', icon: 'https://cdn.simpleicons.org/qdrant/DC244C' },
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
      { name: 'scikit-learn', category: 'mlops', icon: 'https://cdn.simpleicons.org/scikitlearn/F7931E' },
      { name: 'Python', category: 'mlops', icon: 'https://cdn.simpleicons.org/python/3776AB' },
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
      { name: 'Azure', category: 'cloud', icon: 'https://cdn.simpleicons.org/microsoftazure/0078D4' },
      { name: 'Docker', category: 'cloud', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
      { name: 'Supabase', category: 'cloud', icon: 'https://cdn.simpleicons.org/supabase/3ECF8E' },
      { name: 'Coolify', category: 'cloud' },
      { name: 'Vercel', category: 'cloud', icon: 'https://cdn.simpleicons.org/vercel/000000' },
      { name: 'PostgreSQL', category: 'cloud', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
      { name: 'Self-hosted Qdrant', category: 'cloud', icon: 'https://cdn.simpleicons.org/qdrant/DC244C' },
    ],
  },
  {
    id: 'fullstack',
    label: 'Full-Stack (AI needs a home)',
    description: 'Frontends, backends, APIs for AI-powered products',
    accent: '#00d9ff',
    skills: [
      { name: 'TypeScript', category: 'fullstack', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
      { name: 'React / Next.js', category: 'fullstack', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
      { name: 'Angular', category: 'fullstack', icon: 'https://cdn.simpleicons.org/angular/DD0031' },
      { name: 'React Router v7', category: 'fullstack', icon: 'https://cdn.simpleicons.org/reactrouter/CA4245' },
      { name: '.NET / C#', category: 'fullstack', icon: 'https://cdn.simpleicons.org/dotnet/512BD4' },
      { name: 'FastAPI', category: 'fullstack', icon: 'https://cdn.simpleicons.org/fastapi/009688' },
      { name: 'Node.js', category: 'fullstack', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
      { name: 'Spring Boot / Java', category: 'fullstack', icon: 'https://cdn.simpleicons.org/springboot/6DB33F' },
    ],
  },
];
