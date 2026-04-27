import { p as public_env } from "./shared-server.js";
const SUPABASE_CONFIG_ERROR = "Missing Supabase public environment variables. Define PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY (or PUBLIC_SUPABASE_ANON_KEY).";
function getSupabasePublicConfig() {
  const url = public_env.PUBLIC_SUPABASE_URL;
  const publishableKey = public_env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? public_env.PUBLIC_SUPABASE_ANON_KEY ?? public_env.PUBLIC_SUPABASE_KEY;
  if (!url || !publishableKey) {
    return null;
  }
  return { url, publishableKey };
}
export {
  SUPABASE_CONFIG_ERROR as S,
  getSupabasePublicConfig as g
};
