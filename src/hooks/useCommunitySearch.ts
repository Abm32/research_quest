import { useState, useEffect } from 'react';
import { searchDiscordCommunities, DiscordCommunity } from '../api/discord';
import { searchSlackCommunities, SlackCommunity } from '../api/slack';
import { searchRedditCommunities, RedditCommunity } from '../api/reddit';

export type Platform = 'discord' | 'slack' | 'reddit';
export type Community = DiscordCommunity | SlackCommunity | RedditCommunity;

export function useCommunitySearch(query: string, platforms: Platform[] = ['discord', 'slack', 'reddit']) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function searchCommunities() {
      if (!query) {
        setCommunities([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled(
          platforms.map(async (platform) => {
            try {
              switch (platform) {
                case 'discord':
                  return await searchDiscordCommunities(query);
                case 'slack':
                  return await searchSlackCommunities(query);
                case 'reddit':
                  return await searchRedditCommunities(query);
                default:
                  return [];
              }
            } catch (err) {
              console.error(`Error searching ${platform} communities:`, err);
              return [];
            }
          })
        );

        if (isMounted) {
          const validResults = results
            .filter((result): result is PromiseFulfilledResult<Community[]> => 
              result.status === 'fulfilled'
            )
            .map(result => result.value);

          setCommunities(validResults.flat());
        }
      } catch (err) {
        if (isMounted) {
          setError('Error searching communities');
          console.error('Error searching communities:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    const debounceTimeout = setTimeout(searchCommunities, 300);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimeout);
    };
  }, [query, platforms.join(',')]);

  return { communities, loading, error };
}