import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const SLACK_API_ENDPOINT = 'https://slack.com/api';
const USER_TOKEN = process.env.VITE_SLACK_USER_TOKEN;

router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    const response = await fetch(`${SLACK_API_ENDPOINT}/conversations.list`, {
      headers: {
        'Authorization': `Bearer ${USER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error || 'Slack API error');
    }

    // Filter channels based on query
    const filteredChannels = data.channels.filter((channel: any) =>
      channel.name.toLowerCase().includes(query?.toString().toLowerCase() || '') ||
      (channel.purpose?.value || '').toLowerCase().includes(query?.toString().toLowerCase() || '') ||
      (channel.topic?.value || '').toLowerCase().includes(query?.toString().toLowerCase() || '')
    );

    res.json({ channels: filteredChannels });
  } catch (error) {
    console.error('Slack API error:', error);
    res.status(500).json({ error: 'Failed to fetch Slack communities' });
  }
});

export default router;