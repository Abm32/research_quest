import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function fetchDiscordMessages(channelId: string) {
  const { data, error } = await supabase
    .from('discord_messages')
    .select('*')
    .eq('channel_id', channelId);

  if (error) throw error;
  return data;
}

export async function sendDiscordMessage(channelId: string, content: string) {
  const { data, error } = await supabase
    .from('discord_messages')
    .insert([{ channel_id: channelId, content }]);

  if (error) throw error;
  return data;
}