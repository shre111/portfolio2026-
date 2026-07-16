// ===== TYPE DEFINITIONS =====

export type ProjectCategory = 'ai' | 'fullstack';
export type SectionId = 'hero' | 'about' | 'experience' | 'ai-projects' | 'fullstack-projects' | 'skills' | 'contact';

export interface Identity {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  links: {
    linkedin: string;
    github: string;
  };
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  current: boolean;
  description: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  metrics?: string[];
  link?: string;
  github?: string;
  category: ProjectCategory;
  featured?: boolean;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Content {
  identity: Identity;
  summary: string;
  experience: Experience[];
  aiProjects: Project[];
  fullStackProjects: Project[];
  skills: SkillGroup[];
  interests: string[];
}

export const content: Content = {
  identity: {
    name: 'Shreya Dantani',
    title: 'Senior Full Stack Engineer',
    tagline: 'AI/LLM Integration · RAG Pipelines · Multi-Agent Systems · Generative AI · MERN · Next.js',
    location: 'Ahmedabad, Gujarat, India',
    email: 'dantanishreya@gmail.com',
    phone: '+91-7861058989',
    links: {
      linkedin: 'linkedin.com/in/shreya-dantani',
      github: 'github.com/shre111',
    },
  },
  summary:
    'AI-focused Senior Full Stack Engineer, 5+ years building production web apps and end-to-end AI systems. Hands-on with LLM integration (GPT-4o, Gemini, Claude API), GPT fine-tuning, LangChain, multi-agent workflows (AGiXT), RAG pipelines, and generative AI. Sole architect of AI-driven page-generation engines and no-code agent builders at international SaaS companies (Germany, UK, US, Sweden). Full stack: React/Next.js, Node/NestJS, TypeScript, PostgreSQL, AWS.',
  experience: [
    {
      id: 'funnelcockpit',
      title: 'Senior Software Developer',
      company: 'FunnelCockpit GmbH',
      location: 'Germany, Remote',
      duration: '2025–Present',
      current: true,
      description: [
        'Architected an AI-powered Page Generation Engine from scratch: conversational chatbot that builds complete, fully-styled funnel pages from natural-language prompts, routing intelligently between GPT-4o and Gemini.',
        'Fine-tuned a custom GPT on domain-specific funnel data (tone, structure, quality gains).',
        'Built a No-Code AI Agent Builder — users create/configure/train their own agents with custom knowledge bases inside funnel pages.',
        'Built AI reporting with OpenAI + LangChain and RAG over client data with ChromaDB.',
        'Led monorepo migration: consolidated 7 repos (from Meteor.js) into one structured monorepo; improved CI/CD and code sharing.',
        'Shipped Stripe payments/subscription and backend-API improvements with cross-functional German/international teams.',
      ],
    },
    {
      id: 'compatible',
      title: 'Full Stack Developer',
      company: 'Compatible Solutions',
      location: 'Ahmedabad, India',
      duration: '2021–2024',
      current: false,
      description: [
        'Led 4+ international client projects as primary full-stack contributor.',
        'RESTful APIs in Node/Express integrating Stripe, Gmail API, AWS S3.',
        'React/Next.js/Tailwind frontends for UK, US, Sweden clients.',
        'Progressively adopted NestJS, Prisma, TypeScript, Socket.IO; mentored juniors, ran code reviews.',
      ],
    },
    {
      id: 'freelance',
      title: 'Freelance Web Developer',
      company: 'Self-employed',
      location: 'Remote',
      duration: '2020–2021',
      current: false,
      description: [
        'Delivered 2 end-to-end projects: frontend, REST integration, payment gateways.',
      ],
    },
  ],
  aiProjects: [
    {
      id: 'ai-trader',
      title: 'AI Trader',
      subtitle: 'NSE F&O Algorithmic Trading Research Platform',
      description:
        'End-to-end platform for NIFTY F&O intraday options: live tick ingestion → ML training → signal detection → risk mgmt → paper execution. Dual XGBoost (macro model on 80 indicators over 6+ months of 1-min candles; micro model on 5 tick features) with walk-forward validation. Q-Learning RL exit agent trained on 259,000+ episodes across 108 trajectories → 88%+ profitability on RL early exits. Composite scoring (ML prob + options flow PCR/OI + technicals), tiered lot sizing, ATR-scaled stops. Next.js terminal dashboard: live positions, SSE streaming, backtest runner, equity curve, P&L.',
      tags: [
        'Python',
        'XGBoost',
        'Q-Learning RL',
        'scikit-learn',
        'pandas',
        'Flask',
        'TimescaleDB',
        'Next.js',
        'TrueData WebSocket',
      ],
      metrics: [
        '49 trades',
        '71% win rate',
        '1.37 R:R',
        '+53,715 INR net',
        '96% profitability',
        '259,000+ RL episodes',
        '88%+ profitability on exits',
      ],
      github: 'github.com/shre111/Trader-Ai',
      category: 'ai',
      featured: true,
    },
    {
      id: 'ai-research-engine',
      title: 'Autonomous AI Research & Report Generation Engine',
      description:
        'Multi-agent AGiXT pipeline (ingestion → research → synthesis → report). Dynamic model routing GPT-4o/Claude; Pinecone RAG with sub-second retrieval over thousands of docs. FastAPI service + React dashboard; async jobs via Node/Bull/Redis.',
      tags: [
        'Python',
        'LangChain',
        'AGiXT',
        'GPT-4o',
        'Claude API',
        'Pinecone',
        'FastAPI',
        'React',
        'Node',
        'PostgreSQL',
        'AWS S3',
      ],
      category: 'ai',
    },
    {
      id: 'voice-cloning',
      title: 'Seed-VC Voice Cloning & Seed Dance Generative Video Pipeline',
      description:
        'Real-time voice cloning from short samples; choreographed avatar animation synced to audio. Node orchestration (upload → inference → assembly → S3 pre-signed delivery); FFmpeg normalization.',
      tags: [
        'Python',
        'Seed-VC',
        'Seed Dance',
        'Node',
        'React',
        'AWS S3',
        'FFmpeg',
      ],
      category: 'ai',
    },
    {
      id: 'xgboost-analytics',
      title: 'XGBoost Predictive Analytics Dashboard',
      description:
        'Churn classifier on real business data; FastAPI real-time serving; interactive Chart.js KPI dashboards.',
      tags: ['Python', 'XGBoost', 'scikit-learn', 'FastAPI', 'React', 'PostgreSQL', 'Chart.js'],
      category: 'ai',
    },
    {
      id: 'multi-agent',
      title: 'Multi-Agent Workflow Automation (AGiXT + Claude API)',
      description:
        'Researcher/writer/reviewer agent chains for document generation and extraction; Claude as reasoning backbone.',
      tags: ['AGiXT', 'Claude API', 'LangChain', 'Node', 'React', 'PostgreSQL'],
      category: 'ai',
    },
  ],
  fullStackProjects: [
    {
      id: 'giftlips',
      title: 'Giftlips',
      subtitle: 'Digital gift-card platform',
      description:
        'Stripe gift-card payments + real-time video sharing via Socket.IO; international team of 3.',
      tags: ['React', 'Node', 'MongoDB', 'Stripe', 'Socket.IO', 'Tailwind', 'AWS S3'],
      link: 'giftlips.com',
      category: 'fullstack',
    },
    {
      id: 'funnelcockpit-app',
      title: 'FunnelCockpit',
      subtitle: 'AI-powered funnel builder',
      description:
        'AI page-generation engine + no-code agent builder + RAG reporting. Conversational chatbot, fine-tuned GPT, multi-agent AGiXT, Stripe integration, monorepo architecture.',
      tags: [
        'Next.js',
        'NestJS',
        'GPT-4o',
        'Gemini',
        'GPT fine-tuning',
        'ChromaDB',
        'TypeScript',
        'PostgreSQL',
      ],
      link: 'funnelcockpit.com',
      category: 'fullstack',
    },
  ],
  skills: [
    {
      category: 'AI / LLM',
      skills: [
        'OpenAI GPT-4o',
        'GPT fine-tuning',
        'Gemini',
        'Claude API',
        'LangChain',
        'AGiXT',
        'RAG',
        'Prompt engineering',
        'Pinecone',
        'ChromaDB',
      ],
    },
    {
      category: 'AI / ML',
      skills: [
        'XGBoost',
        'scikit-learn',
        'Q-Learning (RL)',
        'Seed-VC',
        'Seed Dance',
        'Python',
        'FastAPI',
        'TimescaleDB',
        'Walk-forward validation',
      ],
    },
    {
      category: 'Frontend',
      skills: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript (ES6+)',
        'Redux',
        'Tailwind',
        'Daisy UI',
        'Material UI',
        'Ionic',
        'Recharts',
      ],
    },
    {
      category: 'Backend',
      skills: [
        'Node.js',
        'Express',
        'NestJS',
        'Flask',
        'REST',
        'GraphQL',
        'Socket.IO',
        'Payload CMS',
        'SSE',
      ],
    },
    {
      category: 'Databases',
      skills: [
        'MongoDB',
        'PostgreSQL',
        'TimescaleDB',
        'SQL',
        'Prisma',
        'SQLAlchemy',
        'Pinecone',
        'ChromaDB',
      ],
    },
    {
      category: 'Cloud / DevOps',
      skills: [
        'AWS (S3, EC2)',
        'Git/GitHub',
        'CI/CD',
        'Turborepo/monorepo',
        'Docker',
      ],
    },
    {
      category: 'Integrations',
      skills: [
        'Stripe',
        'Gmail API',
        'Google Maps API',
        'Twilio',
        'FFmpeg',
        'TrueData WebSocket',
      ],
    },
  ],
  interests: [
    'Drawing & Digital Art',
    'Emerging AI tech & libraries',
    'Travelling',
  ],
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get all projects, optionally filtered by category
 */
export function getAllProjects(category?: ProjectCategory): Project[] {
  if (category === 'ai') return content.aiProjects;
  if (category === 'fullstack') return content.fullStackProjects;
  return [...content.aiProjects, ...content.fullStackProjects];
}

/**
 * Get featured projects only
 */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter(p => p.featured !== false);
}

/**
 * Get all skills as flat array
 */
export function getAllSkills(): string[] {
  return content.skills.flatMap(group => group.skills);
}

/**
 * Get current position
 */
export function getCurrentPosition(): Experience | undefined {
  return content.experience.find(exp => exp.current);
}
