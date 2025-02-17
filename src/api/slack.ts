// slack.ts
const SLACK_API_BASE = 'http://localhost:5000/api/v1/slack';

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

export async function searchSlackCommunities(query: string): Promise<SlackCommunity[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(`${SLACK_API_BASE}/search?query=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.channels || !Array.isArray(data.channels)) {
      return [];
    }

    return data.channels
      .filter(channel => channel && typeof channel === 'object' && 'id' in channel)
      .map((channel: any) => ({
        id: channel.id || '',
        name: channel.name || 'Unnamed Channel',
        description: channel.purpose?.value || channel.topic?.value || `A Slack channel for ${channel.name}`,
        memberCount: channel.num_members || 0,
        isPrivate: Boolean(channel.is_private),
        iconUrl: channel.icons?.image_original,
        platform: 'slack' as const
      }));
  } catch (error) {
    console.error('Error searching Slack communities:', error);
    throw error;
  }
}