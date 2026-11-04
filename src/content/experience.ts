import type { ExpressionName } from '@/components/robot/expressions';

export interface Role {
  period: string;
  /** the ownership chip under the period */
  own?: string;
  title: string;
  company: string;
  bullets?: string[];
  chips?: string[];
  /** what the companion wears when it arrives at this row */
  expr: ExpressionName;
  /** the companion's annotation for this row */
  note: string;
  /** the education row is a minor entry — h3, no list */
  minor?: boolean;
}

const roles: Role[] = [
  {
    period: 'feb 2026 — present',
    own: 'owned the complete technology function',
    title: 'Engineering Manager · Band 2',
    company: 'Evaluationz India Pvt Ltd',
    bullets: [
      'Built AI agents automating background-verification workflows',
      'Real-time visa verification via document data extraction',
      'Led org restructuring for AI-driven BGV across a 14-member team',
      'Hired 4 engineers; managed 6 role transitions',
    ],
    chips: ['golang', 'ai-agents', 'document-ai', 'kubernetes'],
    expr: 'looking',
    note: 'ai agents · org restructuring',
  },
  {
    period: 'mar 2024 — feb 2026',
    own: 'EV charger platform modernization',
    title: 'Engineering Manager',
    company: 'Hero MotoCorp',
    bullets: [
      'Led migration from legacy EC2 to Amazon EKS microservices — 5M+ daily API requests at sub-second latency',
      'Designed WebSocket architecture for 3,000+ concurrent charger connections',
      'Spearheaded Build-vs-Buy for an in-house Charger Management System with a 5-year business case',
      'Observability via Grafana and Dynatrace — downtime −20%, diagnostic accuracy +30%',
    ],
    chips: ['golang', 'kafka', 'websockets', 'eks', 'grafana'],
    expr: 'focused',
    note: '5M+ req/day · 3,000 chargers',
  },
  {
    period: 'aug 2022 — mar 2024',
    own: 'product delivery · customer impact',
    title: 'Full Stack Lead',
    company: 'Spurtree Technologies',
    bullets: [
      'Real-time analytical dashboards — user engagement +40%, retention +25%',
      'Directed end-to-end delivery of loyalty platforms for major retail clients',
      'Fault-tolerant notification architecture on AWS SQS — zero data loss at peak traffic',
    ],
    chips: ['angular', 'node.js', 'aws-sqs'],
    expr: 'curious',
    note: 'dashboards · loyalty platforms',
  },
  {
    period: 'jun 2019 — aug 2022',
    own: 'requirement analysis · zero-to-one',
    title: 'Co-Founder & CTO',
    company: 'Likemindz Solutions',
    bullets: [
      'Founded and scaled a technology services firm — technical roadmap for 15+ SaaS and fintech projects',
      'Architected Shopper Space, a multi-mart delivery platform — checkout time −80%; reached the final interview stage at Y Combinator',
      'Standardized workflows across 15+ projects with OpenAPI specs and microservices patterns',
    ],
    chips: ['openapi', 'microservices', 'mvp-delivery'],
    expr: 'happy',
    note: 'founded it · y combinator',
  },
  {
    period: '2016 — 2021',
    title: 'B.E. Computer Science',
    company: 'Cambridge Institute of Technology',
    expr: 'content',
    note: 'where it started',
    minor: true,
  },
];

export const experience = { heading: 'Trajectory.', roles };
