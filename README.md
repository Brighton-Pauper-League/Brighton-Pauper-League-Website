# Brighton Pauper League Website

Official website for the Brighton Pauper League - Magic: The Gathering Pauper format events, standings, and community.

## 📁 Project Structure

This is a monorepo containing two applications:

```
brighton-pauper-league/
├── studio/              # Sanity CMS Studio (standalone)
│   ├── schemaTypes/     # Content schemas
│   └── sanity.config.ts # Studio configuration
└── web/                 # Next.js frontend
    └── src/
        ├── app/         # Next.js App Router
        └── sanity/      # Sanity client configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account (contact@brightonpauperleague.com)

### Development Setup

1. **Install dependencies:**
   ```bash
   # Install Studio dependencies
   cd studio && npm install
   
   # Install Next.js dependencies
   cd ../web && npm install
   ```

2. **Set up environment variables:**
   
   Copy `web/.env.example` to `web/.env.local` and add your Sanity API tokens:
   ```bash
   cd web
   cp .env.example .env.local
   ```
   
   Get your API token from: https://www.sanity.io/manage
   - Create a token with "Viewer" role for read access
   - Add the token to both `SANITY_API_READ_TOKEN` and `NEXT_PUBLIC_SANITY_API_READ_TOKEN`

3. **Run both applications:**
   
   Open two terminal windows:
   
   **Terminal 1 - Sanity Studio:**
   ```bash
   cd studio
   npm run dev
   # Opens at http://localhost:3333
   ```
   
   **Terminal 2 - Next.js App:**
   ```bash
   cd web
   npm run dev
   # Opens at http://localhost:3000
   ```

## 🏗️ Tech Stack

- **CMS**: Sanity.io (Project ID: `sdzciglo`)
- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel (free tier)

## 📋 Implementation Phases

### ✅ Phase 0: Account Setup
- [x] Sanity account with league email
- [x] GitHub repository initialized
- [ ] Vercel account setup
- [ ] Domain configuration

### ✅ Phase 1: Foundation (COMPLETED)
- [x] Sanity Studio created
- [x] Next.js app scaffolded
- [x] Sanity client configured
- [x] Live Content API set up
- [x] CORS configured for localhost

### 🔄 Phase 2: Content Schemas (NEXT)
Define content models:
- Events
- Blog Posts
- Seasons
- Players
- Matches
- Player Season Stats
- General Settings

### 📍 Phase 3: Frontend Pages
- Homepage
- Events page
- Blog listing & detail
- League standings
- Contact page

### 🔧 Phase 4: Admin Features
- Player management
- Match recording
- Stats calculation (OMW%, GW%, OGW%)

### 🚀 Phase 5: Deployment
- Vercel deployment
- Production environment variables
- CORS for production domain

## 🎯 Key Features

### League Standings
- **Scoring**: 3 points for win, 1 for draw, 0 for loss
- **Tiebreakers**: Points → OMW% → GW% → OGW%
- **Seasons**: Track multiple seasons with start/end dates
- **Active Season**: Auto-detected by current date

### MTG Integration
- Manual entry of tiebreaker stats from MTG Companion app
- Match history stored for future-proofing
- Player stats per season

## 🔐 Environment Variables

### Next.js App (`web/.env.local`)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=sdzciglo
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
SANITY_API_READ_TOKEN=your-token-here
NEXT_PUBLIC_SANITY_API_READ_TOKEN=your-token-here
```

## 🎨 Design
- Figma design exists for landing page
- Will extract colors, fonts, spacing, layout in Phase 3

## 📖 Documentation

- [Project Plan](.github/prompts/plan-brightonPauperLeague.prompt.md)
- [Sanity Best Practices](.agents/skills/sanity-best-practices)

## 🤝 Contributing

This project is maintained by the Brighton Pauper League team using contact@brightonpauperleague.com.

## 📝 License

All rights reserved - Brighton Pauper League
