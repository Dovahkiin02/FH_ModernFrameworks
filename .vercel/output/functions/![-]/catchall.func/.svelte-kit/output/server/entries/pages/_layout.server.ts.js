const load = async ({ locals }) => {
  const { user } = await locals.safeGetSession();
  return {
    user: user ? { id: user.id, email: user.email ?? "" } : null,
    supabaseConfigured: locals.supabaseConfigured
  };
};
export {
  load
};
