# ResearchQuest - Research Collaboration Platform

A modern platform for researchers to collaborate, share knowledge, and track their research progress. Built with React, TypeScript, and Firebase.

## Features

### 🔬 Research Journey
- Interactive research phases (Discovery, Design, Development, Evaluation)
- Task tracking and management
- Progress visualization
- Collaboration tools

### 👥 Communities
- Join research communities across multiple platforms (Discord, Slack, Reddit)
- Create custom communities
- Real-time chat
- Resource sharing

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

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Lucide Icons

- **Backend:**
  - Firebase
    - Authentication
    - Firestore
    - Storage
    - Security Rules

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

3. Create a Firebase project and add your configuration to `src/config/firebase.ts`:
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

4. Deploy Firebase security rules:
   - Copy the contents of `firebase.rules` to your Firebase Console
   - Deploy the rules through the Firebase Console or CLI

5. Create Firestore indexes:
   - Use `firestore.indexes.json` to set up the required indexes
   - Deploy through Firebase Console or CLI

6. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── api/                    # API integration for external platforms
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── CollaborationTools/# Collaboration features
│   ├── Gamification/      # Gamification components
│   ├── InteractiveResearchJourney/  # Research phases
│   └── ResearchJourney/   # Research management
├── config/                # Configuration files
├── hooks/                 # Custom React hooks
├── services/             # Firebase service layers
├── store/                # State management
└── types/                # TypeScript type definitions
```

## Key Components

### Research Journey
- `ResearchJourney.tsx`: Main research tracking interface
- `ProjectCreation.tsx`: New research project creation
- `TaskTracking.tsx`: Research task management

### Communities
- `Communities.tsx`: Community discovery and joining
- `CommunityChat.tsx`: Real-time community chat
- `JoinedCommunities.tsx`: User's joined communities

### Gamification
- `PointsDisplay.tsx`: User points and progress
- `AchievementsShowcase.tsx`: User achievements
- `RewardsStore.tsx`: Rewards redemption

## Firebase Security

The platform uses comprehensive security rules to ensure data protection:

- User authentication required for all operations
- Row-level security for user data
- Validation of data modifications
- Storage size and type restrictions

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