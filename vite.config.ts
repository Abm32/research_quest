import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env': {
      VITE_REDDIT_CLIENT_SECRET: JSON.stringify(process.env.VITE_REDDIT_CLIENT_SECRET),
      VITE_REDDIT_CLIENT_ID: JSON.stringify(process.env.VITE_REDDIT_CLIENT_ID),
      VITE_DISCORD_BOT_TOKEN: JSON.stringify(process.env.VITE_DISCORD_BOT_TOKEN),
      VITE_REDDIT_REFRESH_TOKEN: JSON.stringify(process.env.VITE_REDDIT_REFRESH_TOKEN),
      VITE_SLACK_BOT_TOKEN: JSON.stringify(process.env.VITE_SLACK_BOT_TOKEN),
      VITE_SUPABASE_URL: JSON.stringify(process.env.VITE_SUPABASE_URL),
      VITE_SUPABASE_ANON_KEY: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
    }
  }
});