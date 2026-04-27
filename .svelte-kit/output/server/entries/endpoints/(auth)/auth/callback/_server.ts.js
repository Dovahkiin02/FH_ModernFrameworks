import { redirect } from "@sveltejs/kit";
const GET = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  if (code && locals.supabase) {
    try {
      await locals.supabase.auth.exchangeCodeForSession(code);
    } catch {
      redirect(303, "/login");
    }
  }
  redirect(303, locals.supabase ? "/play" : "/login");
};
export {
  GET
};
