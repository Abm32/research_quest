# ResearchQuest - Research Collaboration Platform

A modern platform for researchers to collaborate, share knowledge, and track their research progress. Built with React, TypeScript, and Firebase.

## Features

### 🔬 Research Journey
- Interactive research phases (Discovery, Design, Development, Evaluation)
- Task tracking and management
- Progress visualization
- Collaboration tools
- AI-powered Research Assistant for each phase

### 🤖 AI Research Assistant
- Context-aware AI assistance for each research phase
- Real-time chat interface
- Suggested prompts for common research queries
- Conversation history with copy and clear functionality
- Expandable floating chat window

### 👥 Communities
- Join research communities across multiple platforms (Discord, Slack, Reddit)
- Create custom communities
- Real-time chat
- Resource sharing
- AI-powered community search and recommendations

### 🏆 Gamification
- Points system
- Achievements and badges
- Research milestones
- Rewards store

### 📚 Resource Sharing
- Share research papers
- Dataset repository
- Educational materials
- Version tracking
- AI-powered resource recommendations

## Research Data APIs

The platform integrates with multiple research databases and APIs to provide comprehensive access to academic resources:

1. **CORE API**
   - Access to global research papers
   - Full-text research content
   - Metadata and abstracts
   - API Key Required: Yes
   - Documentation: https://core.ac.uk/services/api/

2. **DOAJ (Directory of Open Access Journals)**
   - Open access scientific and scholarly journals
   - Peer-reviewed content
   - API Key Required: Optional
   - Documentation: https://doaj.org/api/v2/docs

3. **arXiv API**
   - Pre-print research papers
   - Scientific articles
   - API Key Required: No
   - Documentation: https://arxiv.org/help/api

4. **Europe PMC**
   - Life science literature
   - Biomedical research papers
   - API Key Required: No
   - Documentation: https://europepmc.org/RestfulWebService

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Lucide Icons
  - Axios for API calls

- **Backend & Services:**
  - Firebase
    - Authentication
    - Firestore
    - Storage
    - Security Rules
  - Supabase
    - Database
    - Row Level Security
  - HuggingFace API
    - AI Research Assistant

- **Development:**
  - Vite
  - ESLint
  - PostCSS

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/research-quest.git
   cd research-quest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   VITE_HUGGINGFACE_API_KEY=your_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_DISCORD_CLIENT_ID=your_discord_client_id
   VITE_DISCORD_CLIENT_SECRET=your_discord_client_secret
   VITE_SLACK_BOT_TOKEN=your_slack_bot_token
   VITE_REDDIT_CLIENT_ID=your_reddit_client_id
   VITE_REDDIT_CLIENT_SECRET=your_reddit_client_secret
   VITE_CORE_API_KEY=your_core_api_key
   ```

4. Create a Firebase project and add your configuration to `src/config/firebase.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

5. Deploy Firebase security rules:
   - Copy the contents of `firebase.rules` to your Firebase Console
   - Deploy the rules through the Firebase Console or CLI

6. Create Firestore indexes:
   - Use `firestore.indexes.json` to set up the required indexes
   - Deploy through Firebase Console or CLI

7. Set up Supabase:
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations`
   - Update the environment variables with your Supabase credentials

8. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── api/                    # API integration for external platforms
├── components/            
│   ├── AIChat/            # AI Research Assistant components
│   ├── auth/              # Authentication components
│   ├── CollaborationTools/# Collaboration features
│   ├── Gamification/      # Gamification components
│   ├── InteractiveResearchJourney/  # Research phases
│   └── ResearchJourney/   # Research management
├── config/                # Configuration files
├── hooks/                 # Custom React hooks
├── services/             # Firebase & Supabase service layers
├── store/                # State management
└── types/                # TypeScript type definitions
```

## Key Components

### Research Journey
- `ResearchJourney.tsx`: Main research tracking interface
- `ProjectCreation.tsx`: New research project creation
- `TaskTracking.tsx`: Research task management

### AI Research Assistant
- `FloatingResearchAssistant.tsx`: Floating chat interface
- `ResearchAssistant.tsx`: Phase-specific AI assistance
- `EnhancedResearchAssistant.tsx`: Advanced AI features

### Communities
- `Communities.tsx`: Community discovery and joining
- `CommunityChat.tsx`: Real-time community chat
- `JoinedCommunities.tsx`: User's joined communities

### Gamification
- `PointsDisplay.tsx`: User points and progress
- `AchievementsShowcase.tsx`: User achievements
- `RewardsStore.tsx`: Rewards redemption

## Mobile Optimization

The platform is fully optimized for mobile devices with:
- Responsive layouts
- Touch-friendly interfaces
- Adaptive content display
- Mobile-first design approach
- Optimized performance

## Security

The platform uses comprehensive security rules across Firebase and Supabase:

- User authentication required for all operations
- Row-level security for user data
- Validation of data modifications
- Storage size and type restrictions
- API key protection
- Cross-platform security policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI animations by [Framer Motion](https://www.framer.com/motion/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- AI capabilities powered by [HuggingFace](https://huggingface.co/)
- Research data from CORE, DOAJ, arXiv, and Europe PMC