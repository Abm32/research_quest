import { createClient } from '@supabase/supabase-js';

const REDDIT_API_ENDPOINT = 'https://oauth.reddit.com';
const CLIENT_ID = import.meta.env.VITE_REDDIT_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_REDDIT_CLIENT_SECRET;
const REFRESH_TOKEN = import.meta.env.VITE_REDDIT_REFRESH_TOKEN;

// Only create the client if the environment variables are available
const supabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ? createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  : null;

export interface RedditCommunity {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isNSFW: boolean;
  iconUrl?: string;
  bannerUrl?: string;
  url: string;
  platform: 'reddit';
}

async function getAccessToken(): Promise<string> {
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
  });

  if (!response.ok) {
    throw new Error('Failed to get Reddit access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const accessToken = await getAccessToken();
  
  const response = await fetch(`${REDDIT_API_ENDPOINT}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.statusText}`);
  }

  return response.json();
}

export async function searchRedditCommunities(query: string): Promise<RedditCommunity[]> {
  try {
    const response = await fetchWithAuth(`/subreddits/search?q=${encodeURIComponent(query)}&limit=25`);
    
    return response.data.children.map((child: any) => {
      const subreddit = child.data;
      return {
        id: subreddit.name,
        name: subreddit.display_name_prefixed,
        description: subreddit.public_description || subreddit.description,
        memberCount: subreddit.subscribers,
        isNSFW: subreddit.over18,
        iconUrl: subreddit.icon_img || subreddit.community_icon,
        bannerUrl: subreddit.banner_img,
        url: `https://reddit.com${subreddit.url}`,
        platform: 'reddit' as const
      };
    });
  } catch (error) {
    console.error('Error searching Reddit communities:', error);
    return [];
  }
}

export async function joinRedditCommunity(communityId: string): Promise<boolean> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    const { error } = await supabase
      .from('reddit_memberships')
      .insert([{ community_id: communityId, user_id: 'current_user_id' }]);

    if (error) throw error;

    // Subscribe to the subreddit
    await fetchWithAuth(`/api/subscribe?sr=${communityId}`, {
      method: 'POST'
    });

    return true;
  } catch (error) {
    console.error('Error joining Reddit community:', error);
    return false;
  }
}