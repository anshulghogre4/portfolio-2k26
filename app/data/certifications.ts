export interface Certification {
  id: string;
  code: string;
  title: string;
  fullName?: string;
  verifyUrl: string;
  description: string;
  color?: string;
  logo?: string;
  logoBg?: string;
  badge?: 'Associate' | 'Expert' | 'Fundamentals' | 'Specialty';
  credly?: string;
}

export const education: Certification[] = [
  {
    id: 'fde-academy',
    code: 'FDE Academy',
    title: 'PGP in FDE & Applied AI Solutions',
    fullName: 'Post Graduate Program in Forward Deployed Engineering and Applied AI Solutions',
    verifyUrl: 'https://fde.academy',
    logo: '/images/fde-logo.png',
    logoBg: '#111827',
    description: '8-month deployment-focused program built by real FDEs. Multi-agent orchestration, RAG pipelines, production AI systems, and client-facing engineering.',
  },
  {
    id: 'iit-roorkee',
    code: 'IIT Roorkee',
    title: 'PGC in Forward Deployed AI Engineering',
    fullName: 'IIT Roorkee Certification Add-On — Forward Deployed AI Engineering',
    verifyUrl: 'https://www.iitr.ac.in/',
    logo: '/images/IITR.png',
    logoBg: '#ffffff',
    description: 'Academic certification from IIT Roorkee covering applied machine learning, AI infrastructure, and production deployment methodologies.',
  },
  {
    id: 'cdac',
    code: 'CDAC Bengaluru',
    title: 'PGDCA — Advanced Computing',
    fullName: 'Post Graduate Diploma in Advanced Computing',
    verifyUrl: 'https://www.cdac.in',
    logo: '/images/cdac.png',
    logoBg: '#ffffff',
    description: 'Grade: A. 2022–2023. Intensive program focusing on advanced software engineering, data structures, and enterprise application development.',
  },
  {
    id: 'galgotias',
    code: 'Galgotias University',
    title: 'B.Tech Civil Engineering',
    fullName: 'Bachelor of Technology in Civil Engineering',
    verifyUrl: 'https://www.galgotiasuniversity.edu.in',
    logo: '/images/galgotias.png',
    logoBg: '#ffffff',
    description: 'Graduated with 89.60%. 2014–2018. Foundation in engineering mathematics, structural design, and analytical problem-solving.',
  }
];

export const certifications: Certification[] = [
  {
    id: 'ai-102',
    code: 'AI-102',
    title: 'Azure AI Engineer',
    fullName: 'Microsoft Certified: Azure AI Engineer Associate',
    verifyUrl: 'https://learn.microsoft.com/en-us/users/anshulghogre-1862/credentials/ab49a5447fa775c1',
    description: 'Design and implement AI solutions using Azure Cognitive Services, Azure AI Search, and Azure OpenAI. RAG, knowledge mining, multi-modal AI.',
    color: '#0078D4',
    badge: 'Associate',
  },
  {
    id: 'dp-100',
    code: 'DP-100',
    title: 'Azure Data Scientist',
    fullName: 'Microsoft Certified: Azure Data Scientist Associate',
    verifyUrl: 'https://learn.microsoft.com/en-us/users/anshulghogre-1862/credentials/c4142cf5dd978cbc',
    description: 'Design and train ML models using Azure Machine Learning. Feature engineering, experiment tracking, model deployment at scale.',
    color: '#0078D4',
    badge: 'Associate',
  },
  {
    id: 'az-305',
    code: 'AZ-305',
    title: 'Azure Solutions Architect',
    fullName: 'Microsoft Certified: Azure Solutions Architect Expert',
    verifyUrl: 'https://learn.microsoft.com/en-us/users/anshulghogre-1862/credentials/b8723f2d5b96ad59',
    description: 'Design scalable, secure Azure cloud infrastructure. Expert-level cloud architecture for enterprise AI system deployments.',
    color: '#0078D4',
    badge: 'Expert',
  },
  {
    id: 'az-104',
    code: 'AZ-104',
    title: 'Azure Administrator',
    fullName: 'Microsoft Certified: Azure Administrator Associate',
    verifyUrl: 'https://learn.microsoft.com/en-us/users/anshulghogre-1862/credentials/50f19e55e19cd2eb',
    description: 'Manage Azure subscriptions, infrastructure, networking, and storage. Operational excellence for deployed AI systems.',
    color: '#0078D4',
    badge: 'Associate',
  },
];
