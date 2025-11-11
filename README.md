# PeerSurf

[![Live Demo](https://img.shields.io/badge/Live%20Demo-peersurf.pages.dev-blue?style=for-the-badge&logo=vercel)](https://peersurf.pages.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

> **A unified coordination layer for the Blockchain ecosystem** - Streamlining bounty discovery, contributor reputation, and payment workflows for Special Purpose Entities (SPEs) and contributors.

## 🚀 Overview

PeerSurf addresses the critical coordination problem in the Blockchain ecosystem by providing a centralized platform that consolidates:

- **Bounty Discovery** - Unified feed aggregating opportunities from GitHub, Discord, and forums
- **Contributor Reputation** - On-chain attestation system with multi-signal scoring
- **Application Management** - Streamlined workflow from discovery to delivery
- **Payment Processing** - SAFE multisig integration for automated payments
- **SPE Dashboards** - Tools for opportunity posting and contributor management
- **Seasonal Leaderboards** - Competition cycles that reset to encourage new contributors and create social awareness
- **AI Integration** - Smart chatbot for opportunity discovery and Blockchain documentation assistance
- **Persona-Based Experience** - User categorization for personalized content and targeted newsletters

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Blockchain**: Arbitrum (EAS attestations, SAFE multisig)
- **Deployment**: Cloudflare Pages
- **State Management**: React Context API

### Project Structure

```
src/
├── components/           # React components
│   ├── pages/           # Page components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts (User, Theme, Notifications)
├── lib/                 # Utility functions and API clients
├── routes/              # React Router configuration
└── types/               # TypeScript type definitions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/catalyst-lab/peersurf.git
   cd peersurf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   ```bash
   # Run the Supabase schema setup
   psql -h your_db_host -U your_user -d your_db -f supabase_schema.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📋 Features

### Current MVP Features

- ✅ **Wallet Authentication** - Seamless login with Supabase Auth
- ✅ **Opportunity Discovery** - Browse bounties, grants, and RFPs
- ✅ **User Profiles** - Contributor and SPE profile management
- ✅ **Application System** - Submit and manage applications
- ✅ **SPE Dashboard** - Post opportunities and manage applications
- ✅ **Responsive Design** - Mobile-first UI with Tailwind CSS

### Planned Features (Roadmap)

#### Milestone 1: MVP Platform Launch
- [ ] Unified bounty feed with auto-sync from multiple sources
- [ ] Single-click application workflow
- [ ] Public contributor leaderboard
- [ ] Foundation oversight dashboard
- [ ] 25+ live bounties across SPEs

#### Milestone 2: Reputation & Competition
- [ ] EAS-compatible on-chain attestations
- [ ] Multi-signal reputation scoring algorithm
- [ ] Seasonal leaderboards with reset cycles
- [ ] Anti-Sybil infrastructure
- [ ] Achievement badges and verification

#### Milestone 3: AI & Personalization
- [ ] AI chatbot for opportunity discovery
- [ ] Blockchain documentation integration
- [ ] User persona survey system
- [ ] Personalized content delivery
- [ ] Targeted newsletter customization

#### Milestone 4: Builder Studio
- [ ] Incubation track application system
- [ ] Three-tier funding pipeline
- [ ] Portfolio showcase
- [ ] Team formation tools
- [ ] VC introduction network

#### Milestone 5: Governance & Sustainability
- [ ] Community-driven bounty sourcing
- [ ] Public analytics dashboard
- [ ] Snapshot integration
- [ ] Complete platform handover

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

### Database Schema

The application uses Supabase with the following key tables:

- `profiles` - User profiles and reputation data
- `opportunities` - Bounties, grants, and RFPs
- `applications` - User applications to opportunities
- `stakes` - Blockchain orchestrator staking data
- `earnings` - Contributor earnings tracking

## 🌐 Deployment

### Cloudflare Pages

The application is deployed on Cloudflare Pages with automatic deployments from the main branch.

**Environment Variables Required:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Supabase Functions

Edge functions for payment processing and webhooks:

- `log_funding` - Track funding events
- `paystack_webhook` - Handle payment webhooks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Metrics & Success Criteria

### Current Traction
- ✅ MVP deployed at [peersurf.pages.dev](https://peersurf.pages.dev/)
- ✅ 20+ community survey responses validating demand
- ✅ SPE commitments for platform adoption
- ✅ 10+ alpha contributors registered

### Target Metrics (12 months)
- **500** active contributors
- **600** completed bounties
- **$100K-$200K** distributed to contributors
- **$75K-$100K** annual SPE labor savings
- **8** prototype grants awarded
- **2** startups raising external capital

## 🔒 Security

- **Smart Contract Audits** - Required for Milestone 2
- **Bug Bounty Program** - Launches with production release
- **Rate Limiting** - API endpoints protected
- **Input Validation** - All user inputs sanitized
- **Authentication** - Supabase Auth with RLS policies

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Catalyst Lab** - Building coordination infrastructure for the Blockchain ecosystem

- **Ibrahim** ([@devarogundade](https://github.com/devarogundade)) - Software Engineer
- **Pratik** ([@pratikdholani](https://github.com/pratikdholani)) - Software Engineer  
- **Sampato** ([@ologwusamuel](https://twitter.com/ologwusamuel)) - Product Designer
- **Atreay** ([@AtreayKukanur](https://twitter.com/AtreayKukanur)) - Blockchain Contributor
- **Wisdom** ([@nwakaku](https://github.com/nwakaku)) - Lead Developer

## 📞 Contact

- **Discord**: #wisdom_christson
- **Demo**: [peersurf.pages.dev](https://peersurf.pages.dev/)
- **Video Walkthrough**: [YouTube Demo](https://youtu.be/5oKNS0mAvT8)
- **Proposal Doc**: [Google Doc](https://docs.google.com/document/d/1cspYncxFehDZOFfZqDVCGSp_o5el8pgWdm2ZfqNx8e0/edit?usp=sharing)

## 🙏 Acknowledgments

Inspired by successful coordination platforms:
- **Solana Superteam** (15,000+ contributors)
- **NEAR Nearn.io** ($2M+ distributed)
- **Lisk** (23 startups incubated)

---

**Built with ❤️ for the Blockchain ecosystem**