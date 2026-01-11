# Duolingo Clone 2026

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-5.0-brown?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

A futuristic language learning platform built with the 2026 tech stack.

## 🚀 Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **UI**: React 19 + Tailwind CSS
- **State**: Zustand 5 (persist + immer middleware)
- **Database**: Supabase + Drizzle ORM
- **Auth**: Supabase Auth (Google OAuth)
- **AI**: OpenAI (o1, Whisper, TTS)
- **Language**: TypeScript 5.7 (strict mode)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── ai/           # AI endpoints (chat, transcribe, speech)
│   ├── auth/             # Auth pages
│   └── learn/            # Learning pages
├── components/
│   ├── layout/           # Navbar, Sidebar, etc.
│   ├── learning/         # ExerciseScreen, LearningPath, etc.
│   └── ui/               # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── db/               # Drizzle schemas and client
│   ├── supabase/         # Supabase clients (browser, server)
│   └── utils.ts          # Utilities (cn, etc.)
├── stores/                # Zustand stores
└── types/                 # TypeScript types and const types
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/danielheroiaagen/duolingo-clone-2026.git
cd duolingo-clone-2026

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and OpenAI credentials

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## 📜 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run db:push   # Push Drizzle schema to database
npm run db:studio # Open Drizzle Studio
```

## 🌿 Git Workflow

We use **Git Flow**:

- `main` - Production (deploy target)
- `develop` - Integration branch
- `feature/*` - New features
- `hotfix/*` - Urgent fixes

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request to `develop`

## 📝 License

This project is licensed under the MIT License.
