export const links = {
  email: 'gunagye.jain@gmail.com',
  github: 'https://github.com/GunagyeJain',
  linkedin: 'https://www.linkedin.com/in/gunagye-jain',
  resume: '/Gunagye-Jain-Resume.pdf',
}

export type VisualKind = 'hrms' | 'mockmate' | 'filo' | 'margin' | 'outline' | 'roadreport'

export type Work = {
  id: VisualKind
  name: string
  year: string
  line: string
  stack: string[]
  color: string
  href?: string
}

export const work: Work[] = [
  {
    id: 'hrms',
    name: 'HRMS',
    year: '2026',
    line: 'An HR platform 100+ employees use every day. I built the whole frontend.',
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'RTK Query'],
    color: '#1d3b2e',
  },
  {
    id: 'mockmate',
    name: 'MockMate',
    year: '2026',
    line: 'Mock interviews with an AI that listens, talks back and reads your face.',
    stack: ['Next.js', 'Claude API', 'Groq', 'MediaPipe', 'PostgreSQL'],
    color: '#2e1f45',
    href: 'https://github.com/gunagyejain/mock-mate',
  },
  {
    id: 'filo',
    name: 'Filo',
    year: '2026',
    line: 'A faster, smarter file explorer for Windows.',
    stack: ['Tauri', 'Rust', 'React', 'SQLite'],
    color: '#4a2413',
    href: 'https://github.com/GunagyeJain',
  },
  {
    id: 'margin',
    name: 'Margin',
    year: '2026',
    line: 'Notes, tasks and ideas, sorted by AI and synced everywhere.',
    stack: ['Next.js', 'Groq', 'Supabase'],
    color: '#14263f',
    href: 'https://github.com/GunagyeJain',
  },
  {
    id: 'outline',
    name: 'Outline',
    year: '2025',
    line: 'A full MERN store: carts, payments, media and auth.',
    stack: ['MongoDB', 'Express', 'React', 'Node.js'],
    color: '#45141f',
    href: 'https://github.com/GunagyeJain',
  },
  {
    id: 'roadreport',
    name: 'RoadReport',
    year: '2025',
    line: 'Report a pothole, see it on a live map.',
    stack: ['Flask', 'Leaflet.js', 'SQL'],
    color: '#2a2e19',
    href: 'https://github.com/GunagyeJain',
  },
]

export const more: { name: string; line: string; tag: string }[] = [
  { name: 'Founder Mode', line: 'English to Hindi research translation', tag: 'Winner' },
  { name: 'AI Call', line: 'A voice agent that takes real phone calls', tag: 'AI' },
  { name: 'Algorithm Visualizer', line: 'Algorithms, step by step, with a live editor', tag: 'Web' },
  { name: 'Claude Chat', line: 'Talk to Claude, out loud', tag: 'AI' },
  { name: 'TC Analyzer', line: 'Flags the risky parts of terms & conditions', tag: 'AI' },
  { name: 'Vintiq', line: 'A vintage film camera for your phone', tag: 'Mobile' },
  { name: 'Statement Analyser', line: 'Bank statements to Excel, in the browser', tag: 'Tool' },
  { name: 'Book Rental DBMS', line: 'Six tables, normalized to BCNF', tag: 'Data' },
]

export const toolbox: string[][] = [
  ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Redux Toolkit', 'Tailwind'],
  ['Node.js', 'Express', 'Python', 'Flask', 'PostgreSQL', 'MongoDB', 'Prisma', 'Supabase'],
  ['Claude API', 'Groq', 'MediaPipe', 'Scikit-learn', 'Git', 'Figma', 'Tauri', 'C++'],
]
