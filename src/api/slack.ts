import { createClient } from '@supabase/supabase-js';

const SLACK_API_ENDPOINT = 'https://slack.com/api';
const USER_TOKEN = import.meta.env.VITE_SLACK_USER_TOKEN; // Change to User OAuth Token

// Only create the client if the environment variables are available
const supabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ? createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  : null;

export interface SlackCommunity {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  iconUrl?: string;
  joinUrl?: string;
  platform: 'slack';
}

async function fetchSlackApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${SLACK_API_ENDPOINT}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${USER_TOKEN}`, // Use User Token
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error}`);
  }

  return data;
}

export async function searchSlackCommunities(query: string): Promise<SlackCommunity[]> {
  try {
    // Get list of public and private channels (User Token required for private)
    const response = await fetchSlackApi('/conversations.list?types=public_channel,private_channel');

    return response.channels
      .filter((channel: any) => 
        channel.name.toLowerCase().includes(query.toLowerCase()) ||
        (channel.purpose?.value && channel.purpose.value.toLowerCase().includes(query.toLowerCase())) ||
        (channel.topic?.value && channel.topic.value.toLowerCase().includes(query.toLowerCase()))
      )
      .map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        description: channel.purpose?.value || channel.topic?.value || `A Slack channel for ${channel.name}`,
        memberCount: channel.num_members,
        isPrivate: channel.is_private,
        iconUrl: channel.icons?.image_original,
        platform: 'slack' as const
      }));
  } catch (error) {
    console.error('Error searching Slack communities:', error);
    return [];
  }
}

export async function joinSlackCommunity(communityId: string): Promise<boolean> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    const { error } = await supabase
      .from('slack_memberships')
      .insert([{ community_id: communityId, user_id: 'current_user_id' }]);

    if (error) throw error;

    // Check if the user has permission to join
    const userResponse = await fetchSlackApi('/users.identity');
    if (!userResponse.ok) {
      console.error('User not authorized for Slack actions');
      return false;
    }

    // Request user to join the channel manually if needed
    await fetchSlackApi('/conversations.join', {
      method: 'POST',
      body: JSON.stringify({ channel: communityId })
    });

    return true;
  } catch (error) {
    console.error('Error joining Slack community:', error);
    return false;
  }
}
