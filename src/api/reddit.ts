import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function fetchRedditPosts(subreddit: string) {
  const { data, error } = await supabase
    .from('reddit_posts')
    .select('*')
    .eq('subreddit', subreddit);

  if (error) throw error;
  return data;
}

export async function createRedditPost(subreddit: string, title: string, content: string) {
  const { data, error } = await supabase
    .from('reddit_posts')
    .insert([{ subreddit, title, content }]);

  if (error) throw error;
  return data;
}