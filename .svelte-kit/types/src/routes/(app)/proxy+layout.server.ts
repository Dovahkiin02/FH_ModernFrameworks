// @ts-nocheck
import { requireUser } from '$lib/auth/guards';
import type { LayoutServerLoad } from './$types';

export const load = async ({ parent }: Parameters<LayoutServerLoad>[0]) => {
	const { user } = await parent();
	requireUser(user);

	return { user };
};
