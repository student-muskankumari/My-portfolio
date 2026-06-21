import {
  Github,
  Linkedin,
  Mail,
  FileText,
  Shield,
  LineChart,
  BarChart3,
  Sparkles,
  Phone,
} from 'lucide-react';

export const PROFILE = {
  name: 'Muskan Kumari',
  tagline: 'Generative AI Engineer · AI Agent Developer · Workflow Automation',
  location: 'Patna, Bihar · Open to Bengaluru',
  email: 'muskankumari14373@gmail.com',
  phone: '+91 74840 20355',
  github: 'https://github.com/student-muskankumari',
  linkedin: 'https://www.linkedin.com/in/mk-7ri',
  portfolio: 'https://meemuskan.vercel.app/',
  resume: '/Muskan_Kumari_Resume.pdf',
};

export const ABOUT = {
  eyebrow: 'About the builder',
  heading: 'I ship AI products that work in production.',
  paragraphs: [
    "Final-year Computer Science & Communication Engineering student building at the intersection of AI agents, LLM orchestration, and workflow automation. I don't ship demos — I ship systems that handle real calls, real users, and real edge cases.",
    "My focus sits in three places: designing AI agents that hold multi-turn context, orchestrating multi-LLM workflows that don't fall over when one provider does, and writing the unglamorous glue code that turns prototypes into products.",
    "Currently obsessed with agentic workflows, voice-first interfaces, and the quiet art of making AI systems reliable enough to leave running overnight.",
  ],
  stats: [
    { label: 'CGPA', value: '8.38', sub: '/ 10' },
    { label: 'AI products shipped', value: '3', sub: 'in production' },
    { label: 'Certified', value: 'AWS', sub: 'Cloud Architecting' },
    { label: 'Core stack', value: 'Python · n8n', sub: 'LLMs · AWS' },
  ],
};

export const SKILLS = [
  {
    category: 'Programming',
    items: [
      { name: 'Python', level: 92 },
      { name: 'SQL', level: 85 },
      { name: 'C', level: 75 },
      { name: 'JavaScript', level: 70 },
    ],
  },
  {
    category: 'Data & ML',
    items: [
      { name: 'Pandas · NumPy', level: 90 },
      { name: 'Scikit-learn', level: 82 },
      { name: 'PyTorch', level: 70 },
      { name: 'Power BI · EDA', level: 85 },
    ],
  },
  {
    category: 'AI Agents & Workflows',
    items: [
      { name: 'n8n · n8n Cloud', level: 82 },
      { name: 'Twilio · ElevenLabs', level: 75 },
      { name: 'OpenAI Whisper · GPT-4o', level: 82 },
      { name: 'LangChain · LangGraph', level: 65 },
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      { name: 'AWS (EC2, S3)', level: 78 },
      { name: 'Vercel · Streamlit Cloud', level: 85 },
      { name: 'Git · GitHub', level: 90 },
      { name: 'FastAPI · REST APIs', level: 72 },
    ],
  },
  {
    category: 'Applied AI',
    items: [
      { name: 'Multi-LLM orchestration', level: 85 },
      { name: 'Prompt engineering', level: 85 },
      { name: 'Agentic workflows', level: 78 },
      { name: 'Time-series forecasting', level: 78 },
    ],
  },
];

export const PROJECTS = [
  {
    id: 'voice-agent',
    title: 'AI Voice Appointment Agent',
    subtitle: 'Autonomous voice agent on telephony',
    blurb:
      "Autonomous voice agent that handles inbound and outbound appointment calls end-to-end. Whisper transcribes the caller, GPT-4o handles intent recognition and multi-turn dialog, an n8n workflow orchestrates Google Calendar bookings, and ElevenLabs returns natural speech through Twilio. Six services, one conversation, zero humans required.",
    impact:
      'End-to-end voice booking pipeline with multi-turn context retention across calls and structured prompt engineering for reliable intent handling.',
    stack: ['n8n', 'Twilio', 'Whisper', 'GPT-4o', 'ElevenLabs', 'Google Calendar'],
    github: null,
    live: null,
    icon: Phone,
    accent: 'cyan',
    highlight: true,
  },
  {
    id: 'kronos',
    title: 'KronoX',
    subtitle: 'Time-series forecasting platform',
    blurb:
      'End-to-end stock forecasting system built on a Kronos foundation model and gradient boosting ensemble. Pulls live OHLCV data from yfinance, runs walk-forward validation, and reports Sharpe ratio, max drawdown, and hit rate per strategy.',
    impact:
      'Trained on 180K+ candles across 20+ engineered features. Deployed to Streamlit Cloud with live inference.',
    stack: ['Python', 'PyTorch', 'Scikit-learn', 'yfinance', 'Streamlit'],
    github: 'https://github.com/student-muskankumari/KronoX',
    live: 'https://kronox.streamlit.app/',
    icon: LineChart,
    accent: 'violet',
    highlight: true,
  },
  {
    id: 'cuemath',
    title: 'Cuemath Social Studio',
    subtitle: 'LLM orchestration for content generation',
    blurb:
      'Production web app that turns a single prompt into a complete multi-slide social post — text, layout, and imagery — in under 30 seconds. Designed a fallback chain across Groq, Gemini, and Mistral so a single provider outage never blocks output.',
    impact:
      'Ships client-side PDF and ZIP export via the Canvas API with CORS-safe image fetch. Running in production.',
    stack: ['Next.js', 'Groq', 'Gemini', 'Mistral', 'FLUX'],
    github: 'https://github.com/student-muskankumari/cuemath-studio',
    live: 'https://cuemath-production-studio.vercel.app/',
    icon: Sparkles,
    accent: 'pink',
    highlight: true,
  },
  {
    id: 'sales-dashboard',
    title: 'Sales Performance Analysis',
    subtitle: 'Executive analytics dashboard',
    blurb:
      'Interactive Power BI dashboard analyzing 50K+ sales records with DAX measures tracking revenue trajectory, regional performance, and product-mix health. Built on cleaned, SQL-joined transactional data with drill-through narratives.',
    impact:
      'Surfaced Rs. 5M+ revenue under tracking with 15% YoY growth, identified top products driving ~60% of revenue, and exposed seasonal demand patterns before they hit weekly leadership review.',
    stack: ['Power BI', 'DAX', 'SQL', 'AWS', 'Vercel'],
    github: 'https://github.com/student-muskankumari',
    live: null,
    icon: BarChart3,
    accent: 'cyan',
  },
  {
    id: 'automap-cve',
    title: 'AutoMap-CVE',
    subtitle: 'Automated vulnerability intelligence',
    blurb:
      'Reconnaissance tool that ingests raw Nmap output, fingerprints services and versions, and correlates them against the public CVE corpus. Generates both machine-readable JSON and a human-readable HTML report for triage.',
    impact:
      'Collapses the scan-to-insight loop from hours of manual lookup to seconds of automated correlation.',
    stack: ['Python', 'Nmap', 'CVE API', 'Jinja2'],
    github: 'https://github.com/student-muskankumari/autoMap-CVE',
    live: null,
    icon: Shield,
    accent: 'violet',
  },
];

export const EXPERIENCE = [
  {
    role: 'McKinsey Forward Program Participant',
    org: 'McKinsey & Company',
    period: '2026',
    bullets: [
      'Selected participant in McKinsey\'s global early-career leadership program — structured problem solving, adaptability, and communication frameworks.',
      'Applied McKinsey-style hypothesis-driven analysis to real business cases through the program curriculum.',
    ],
  },
  {
    role: 'Open-source Contributor',
    org: 'GSSoC 2026 · SSOC 2024',
    period: '2024 — Present',
    bullets: [
      'Active contributor across GSSoC 2026 (GirlScript Summer of Code) and SSOC 2024 — issue tracking, pull requests, and code reviews on real-world OSS projects.',
    ],
  },
  {
    role: 'Python Full-Stack Intern',
    org: 'AICTE × Eduskills (Virtual)',
    period: '2024 — 2025',
    bullets: [
      'Completed a virtual internship spanning data analytics, Python, cloud, and ML.',
      'Built capstone deliverables against industry briefs with real-world tooling workflows.',
      'Earned exposure to end-to-end project structure from requirement to deployment.',
    ],
  },
  {
    role: 'Graphic Design Lead',
    org: 'Kalakaar Society',
    period: 'Sep 2024 — 2026',
    bullets: [
      'Led a multi-member design team delivering 50+ creatives across society events, campaigns, and recurring activations.',
      'Built a repeatable visual system — posters, banners, certificates, merchandise — that established the society\'s identity.',
      'Reviewed work, unblocked deadlines, and ran design crits that lifted the team\'s baseline output quality.',
    ],
  },
  {
    role: 'Organizing Committee Member',
    org: 'KIITFEST 7.0 & 8.0',
    period: '2023 — 2025',
    bullets: [
      'Two consecutive years coordinating logistics and execution for one of the region\'s largest college fests.',
      'Led a 6-person team on an Indian adaptation of the Nagish app (accessibility for deaf and mute users).',
      'Shipped prototypes and content alongside the placement cell to promote student opportunities.',
    ],
  },
];

// Certificates
// - logo: drop a square image/SVG in /public/logos/ (file missing = letter-badge fallback)
// - url:  drop a PDF in /public/certs/ and point to it (null = non-clickable)
export const CERTIFICATES = [
  {
    name: 'AWS Academy — Cloud Architecting',
    issuer: 'AWS',
    logo: '/logos/aws.svg',
    url: '/certs/aws-cloud-architecting.pdf',
  },
  {
    name: 'Google Data Analytics Professional Certificate',
    issuer: 'Coursera',
    logo: '/logos/coursera.svg',
    url: '/certs/google-data-analytics.pdf',
  },
  {
    name: 'Forward Program 2026',
    issuer: 'McKinsey & Company',
    logo: null,
    url: null,
  },
  {
    name: 'SQL (Basic)',
    issuer: 'HackerRank',
    logo: '/logos/hackerrank.svg',
    url: '/certs/hackerrank-sql.pdf',
  },
  {
    name: 'Exploratory Data Analysis for Machine Learning',
    issuer: 'IBM',
    logo: '/logos/ibm.svg',
    url: '/certs/ibm-eda-ml.pdf',
  },
  {
    name: 'Flipkart GRID 6.0 — Robotics Challenge Qualifier',
    issuer: 'Flipkart',
    logo: '/logos/flipkart.svg',
    url: '/certs/flipkart-grid.pdf',
  },
  {
    name: 'Python Full Stack (Virtual Internship)',
    issuer: 'AICTE / Eduskills',
    logo: '/logos/aicte.svg',
    url: '/certs/aicte-python-fullstack.pdf',
  },
];

export const CONTACTS = [
  { label: 'Email', value: 'muskankumari14373@gmail.com', href: 'mailto:muskankumari14373@gmail.com', icon: Mail },
  { label: 'LinkedIn', value: '/in/mk-7ri', href: 'https://www.linkedin.com/in/mk-7ri', icon: Linkedin },
  { label: 'GitHub', value: '/student-muskankumari', href: 'https://github.com/student-muskankumari', icon: Github },
  { label: 'Resume', value: 'Download PDF', href: '/Muskan_Kumari_Resume.pdf', icon: FileText, download: true },
];

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];
