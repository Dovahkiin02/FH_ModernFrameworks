import { redirect } from "@sveltejs/kit";
const POST = async ({ locals }) => {
  if (locals.supabase) {
    await locals.supabase.auth.signOut();
  }
  redirect(303, "/");
};
export {
  POST
};
