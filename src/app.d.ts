import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface PageData {
			user: { id: string; email: string } | null;
			supabaseConfigured: boolean;
		}

		interface Locals {
			supabase: SupabaseClient | null;
			supabaseConfigured: boolean;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
		}
	}
}

export {};
