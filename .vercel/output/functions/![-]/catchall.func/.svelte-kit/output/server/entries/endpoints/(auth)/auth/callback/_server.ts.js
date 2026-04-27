import { redirect } from "@sveltejs/kit";
const GET = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  if (code && locals.supabase) {
    await locals.supabase.auth.exchangeCodeForSession(code);
  }
  redirect(303, locals.supabase ? "/play" : "/login");
};
export {
  GET
};
