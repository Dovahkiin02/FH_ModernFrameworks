import { env } from '$env/dynamic/public';

export const SUPABASE_CONFIG_ERROR =
	'Missing Supabase public environment variables. Define PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY (or PUBLIC_SUPABASE_ANON_KEY).';

export function getSupabasePublicConfig() {
	const url = env.PUBLIC_SUPABASE_URL;
	const publishableKey =
		env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.PUBLIC_SUPABASE_ANON_KEY ?? env.PUBLIC_SUPABASE_KEY;

	if (!url || !publishableKey) {
		return null;
	}

	return { url, publishableKey };
}
