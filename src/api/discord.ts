// discord.ts
import { createClient } from '@supabase/supabase-js';

const DISCORD_API_BASE = 'http://localhost:5000/api/v1/discord';

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

export async function searchDiscordCommunities(query: string): Promise<DiscordCommunity[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(`${DISCORD_API_BASE}/search?query=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.guilds || !Array.isArray(data.guilds)) {
      return [];
    }

    return data.guilds
      .filter(guild => guild && typeof guild === 'object' && 'id' in guild)
      .map((guild: any) => ({
        id: guild.id,
        name: guild.name || 'Unnamed Server',
        description: guild.description || `A Discord community for ${guild.name}`,
        memberCount: guild.approximate_member_count || 0,
        isVerified: Boolean(guild.verified),
        iconUrl: guild.icon 
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` 
          : undefined,
        inviteCode: guild.vanity_url_code,
        platform: 'discord' as const
      }));
  } catch (error) {
    console.error('Error searching Discord communities:', error);
    throw error;
  }
}