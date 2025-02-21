import { db } from '../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10';
const BOT_TOKEN = import.meta.env.VITE_DISCORD_BOT_TOKEN;

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
  if (!query || query.length < 2 || !BOT_TOKEN) {
    return [];
  }

  try {
    // First get the guilds where the bot is a member
    const guildsResponse = await fetch(`${DISCORD_API_ENDPOINT}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!guildsResponse.ok) {
      throw new Error(`Discord API error: ${guildsResponse.statusText}`);
    }

    const guilds = await guildsResponse.json();

    // Filter guilds based on search query
    const filteredGuilds = guilds.filter((guild: any) => 
      guild.name.toLowerCase().includes(query.toLowerCase())
    );

    // Get detailed information for each filtered guild
    const detailedGuilds = await Promise.all(
      filteredGuilds.map(async (guild: any) => {
        try {
          const guildResponse = await fetch(`${DISCORD_API_ENDPOINT}/guilds/${guild.id}`, {
            headers: {
              'Authorization': `Bot ${BOT_TOKEN}`,
              'Content-Type': 'application/json',
            },
          });

          if (!guildResponse.ok) {
            return null;
          }

          const guildDetails = await guildResponse.json();
          
          return {
            id: guild.id,
            name: guild.name,
            description: guildDetails.description || `A Discord community for ${guild.name}`,
            memberCount: guildDetails.approximate_member_count || 0,
            isVerified: Boolean(guild.verified),
            iconUrl: guild.icon 
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` 
              : undefined,
            inviteCode: guild.vanity_url_code,
            platform: 'discord' as const
          };
        } catch (error) {
          console.error(`Error fetching details for guild ${guild.id}:`, error);
          return null;
        }
      })
    );

    return detailedGuilds.filter((guild): guild is DiscordCommunity => guild !== null);
  } catch (error) {
    // Log error but don't throw
    console.error('Error searching Discord communities:', error);
    return [];
  }
}

export async function joinDiscordCommunity(communityId: string): Promise<string | null> {
  if (!BOT_TOKEN) return null;

  try {
    const response = await fetch(`${DISCORD_API_ENDPOINT}/guilds/${communityId}/invites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_age: 86400, // 24 hours
        max_uses: 1,
        unique: true
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create invite');
    }

    const invite = await response.json();
    
    // Store the join record in Firebase
    const joinRef = doc(collection(db, 'discord_joins'));
    await setDoc(joinRef, {
      communityId,
      inviteCode: invite.code,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000) // 24 hours from now
    });

    return `https://discord.gg/${invite.code}`;
  } catch (error) {
    // Log error but don't throw
    console.error('Error creating Discord invite:', error);
    return null;
  }
}