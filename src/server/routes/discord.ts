import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.VITE_DISCORD_BOT_TOKEN;

router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
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

    // Get detailed information for each guild
    const detailedGuilds = await Promise.all(
      guilds
        .filter((guild: any) => 
          guild.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(async (guild: any) => {
          try {
            const guildResponse = await fetch(`${DISCORD_API_ENDPOINT}/guilds/${guild.id}`, {
              headers: {
                'Authorization': `Bot ${BOT_TOKEN}`,
                'Content-Type': 'application/json',
              },
            });

            if (guildResponse.ok) {
              const guildDetails = await guildResponse.json();
              return {
                ...guildDetails,
                approximate_member_count: guildDetails.approximate_member_count || guild.approximate_member_count
              };
            }
            return guild;
          } catch (error) {
            console.warn(`Could not fetch details for guild ${guild.id}:`, error);
            return guild;
          }
        })
    );

    res.json({ guilds: detailedGuilds });
  } catch (error) {
    console.error('Discord API error:', error);
    res.status(500).json({ error: 'Failed to fetch Discord communities' });
  }
});

router.post('/join', async (req, res) => {
  const { communityId } = req.body;

  if (!communityId) {
    return res.status(400).json({ error: 'Community ID is required' });
  }

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
    res.json({ inviteUrl: `https://discord.gg/${invite.code}` });
  } catch (error) {
    console.error('Error creating Discord invite:', error);
    res.status(500).json({ error: 'Failed to create invite' });
  }
});

export default router;