import { redirect } from '@sveltejs/kit';
import type { AuthUser } from '$lib/supabase/types';

export function requireUser(user: AuthUser | null): AuthUser {
	if (!user) {
		redirect(303, '/login');
	}

	return user;
}
