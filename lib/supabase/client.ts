import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isDev = !supabaseUrl || !supabaseAnonKey;

export function createClient() {
  if (isDev) return null as never;
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
