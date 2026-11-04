/* Site-wide content: who, how to reach them, and the nav. */

export const site = {
  title: 'Channakeshava Gowda (CG) — Engineering Manager',
  description:
    'Engineering manager who builds the distributed systems and the teams that run them. Golang, Kafka, EKS, real-time systems at scale.',
};

export const profile = {
  firstName: 'Channakeshava',
  lastName: 'Gowda',
  role: 'engineering manager · bengaluru',
  /** the hero lead, split around the ONE orange punchline word */
  lead: {
    before: 'Engineering manager who builds the distributed systems ',
    mark: 'and the teams',
    after: ' that run them.',
  },
  meta: ['5+ yrs', '12-person team', '5M+ req/day', '3,000+ connections'],
  email: 'work@cg6.tech',
  /** TODO: point at the real résumé file — the prototype shipped "#" */
  resumeHref: '#',
};

export const nav = [
  { href: '#about', label: 'about' },
  { href: '#experience', label: 'experience' },
  { href: '#impact', label: 'impact' },
  { href: '#contact', label: 'contact' },
] as const;

export const contact = {
  pitch: "Let's talk about the hard problem you're trying to solve.",
  body: 'Open to senior engineering management roles. The fastest way to reach me is email.',
  channels: [
    { k: 'email', label: 'work@cg6.tech', href: 'mailto:work@cg6.tech' },
    { k: 'phone', label: '+91 96868 89681', href: 'tel:+919686889681' },
    { k: 'site', label: 'cg6.tech', href: 'https://cg6.tech' },
    { k: 'github', label: 'CG6-Tech', href: 'https://github.com/CG6-Tech' },
    { k: 'linkedin', label: 'CG6-Tech', href: 'https://linkedin.com/in/CG6-Tech' },
  ],
  signoff: 'Built by CG · Geist + Geist Mono · 2026',
};
