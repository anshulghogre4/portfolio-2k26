export interface Certification {
  id: string;
  code: string;
  title: string;
  fullName?: string;
  verifyUrl: string;
  description: string;
  color?: string;
}

export const certifications: Certification[] = [
  {
    id: 'fde-academy',
    code: 'FDE Academy',
    title: 'PGP in FDE & Applied AI Solutions',
    fullName: 'Post Graduate Program in Forward Deployed Engineering and Applied AI Solutions',
    verifyUrl: 'https://fde.academy',
    description: '8-month deployment-focused program built by real FDEs. Multi-agent orchestration, RAG pipelines, production AI systems, and client-facing engineering.',
  },
  {
    id: 'iit-roorkee',
    code: 'IIT Roorkee',
    title: 'Certification in Forward Deployed AI Engineering',
    fullName: 'IIT Roorkee Certification Add-On — Forward Deployed AI Engineering',
    verifyUrl: 'https://fde.academy',
    description: 'Academic certification from IIT Roorkee covering applied machine learning, AI infrastructure, and production deployment methodologies.',
  },
  {
    id: 'ai-102',
    code: 'AI-102',
    title: 'Azure AI Engineer',
    fullName: 'Microsoft Certified: Azure AI Engineer Associate',
    verifyUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/',
    description: 'Design and implement AI solutions using Azure Cognitive Services, Azure AI Search, and Azure OpenAI. RAG, knowledge mining, multi-modal AI.',
    color: '#0078D4',
  },
  {
    id: 'dp-100',
    code: 'DP-100',
    title: 'Azure Data Scientist',
    fullName: 'Microsoft Certified: Azure Data Scientist Associate',
    verifyUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/',
    description: 'Design and train ML models using Azure Machine Learning. Feature engineering, experiment tracking, model deployment at scale.',
    color: '#0078D4',
  },
  {
    id: 'az-305',
    code: 'AZ-305',
    title: 'Azure Solutions Architect',
    fullName: 'Microsoft Certified: Azure Solutions Architect Expert',
    verifyUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect-expert/',
    description: 'Design scalable, secure Azure cloud infrastructure. Expert-level cloud architecture for enterprise AI system deployments.',
    color: '#0078D4',
  },
  {
    id: 'az-104',
    code: 'AZ-104',
    title: 'Azure Administrator',
    fullName: 'Microsoft Certified: Azure Administrator Associate',
    verifyUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/',
    description: 'Manage Azure subscriptions, infrastructure, networking, and storage. Operational excellence for deployed AI systems.',
    color: '#0078D4',
  },
];
