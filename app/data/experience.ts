export interface Experience {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  period: string;
  location: string;
  type: 'fulltime' | 'contract' | 'freelance';
  description: string;
  highlights: string[];
  techStack: string[];
}

export const experiences: Experience[] = [
  {
    id: 'optalitix',
    company: 'Optalitix UK (Client)',
    companyLogo: '/images/optalitix.png',
    role: 'Software Engineer',
    period: 'Apr 2024 – Present',
    location: 'Remote',
    type: 'fulltime',
    description:
      'Working via AnAr Solutions on complex insurance workflows, focusing on performance, state management, and architecture.',
    highlights: [
      'Optimized Angular frontend using eTag-based caching, reducing load time by 30%.',
      'Owned frontend architecture for complex insurance workflows using Angular + NgRx.',
      'Practiced Test-Driven Development (TDD), improving code reliability and reducing regressions.',
      'Built Azure DevOps pipelines to automate build/version tracking, improving deployment transparency.',
    ],
    techStack: ['Angular', 'NgRx', 'Azure DevOps', 'TDD'],
  },
  {
    id: 'activex',
    company: 'ActiveX Australia (Client)',
    companyLogo: '/images/activex.png',
    role: 'Software Engineer',
    period: 'May 2023 – Apr 2024',
    location: 'Remote',
    type: 'fulltime',
    description:
      'Working via AnAr Solutions on a cross-platform healthcare application supporting thousands of active users.',
    highlights: [
      'Led end-to-end development of a cross-platform healthcare application using Angular + Ionic.',
      'Integrated Bluetooth-enabled IoT devices via vendor SDK for real-time data synchronization.',
      'Architected scalable frontend state management using NgRx, improving maintainability across tenants.',
      'Applied Azure expertise (leveraging certifications) to design secure identity flows and cloud deployments, reducing incident resolution time by 40%.',
    ],
    techStack: ['Angular', 'Ionic', 'NgRx', 'Azure', 'IoT'],
  },
  {
    id: 'anar',
    company: 'AnAr Solutions Inc.',
    companyLogo: '/images/anar.png',
    role: 'Software Engineer',
    period: 'May 2023 – Present',
    location: 'Pune, India (Remote)',
    type: 'fulltime',
    description:
      'Core engineering role delivering scalable, secure, and user-centric solutions across Healthcare and Insurance domains.',
    highlights: [
      'Collaborated closely with stakeholders to optimize workflows and improve overall digital experiences.',
      'Shipped production-grade AI-driven solutions and multi-tenant cloud-native systems.',
    ],
    techStack: ['C#', 'ASP.NET Core', 'Azure', 'TypeScript', 'Angular'],
  }
];
