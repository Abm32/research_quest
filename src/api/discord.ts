import { createClient } from '@supabase/supabase-js';

const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10';
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const BOT_TOKEN = import.meta.env.VITE_DISCORD_BOT_TOKEN;

// Only create the client if the environment variables are available
const supabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ? createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  : null;

export interface DiscordCommunity {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isVerified: boolean;
  iconUrl?: string;
  inviteCode?: string;
  platform: 'discord';
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${DISCORD_API_ENDPOINT}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Discord API error: ${response.statusText}`);
  }

  return response.json();
}

export async function searchDiscordCommunities(query: string): Promise<DiscordCommunity[]> {
  try {
    // Fetch guilds the bot is in
    const guilds = await fetchWithAuth('/users/@me/guilds');

    // Filter and transform guilds based on search query
    return guilds
      .filter((guild: any) => 
        guild.name.toLowerCase().includes(query.toLowerCase()) ||
        (guild.description && guild.description.toLowerCase().includes(query.toLowerCase()))
      )
      .map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        description: guild.description || `A Discord community for ${guild.name}`,
        memberCount: guild.approximate_member_count || 0,
        isVerified: guild.verified,
        iconUrl: guild.icon 
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` 
          : undefined,
        platform: 'discord' as const
      }));
  } catch (error) {
    console.error('Error searching Discord communities:', error);
    return [];
  }
}

export async function joinDiscordCommunity(communityId: string): Promise<boolean> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    // Store the membership in Supabase
    const { error } = await supabase
      .from('discord_memberships')
      .insert([{ community_id: communityId, user_id: 'current_user_id' }]);

    if (error) throw error;

    // Generate an invite link
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=0&scope=bot&guild_id=${communityId}`;
    window.open(inviteUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error joining Discord community:', error);
    return false;
  }
}