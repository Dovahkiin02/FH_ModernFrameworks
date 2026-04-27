import { fail, redirect } from "@sveltejs/kit";
import { S as SUPABASE_CONFIG_ERROR } from "../../../../chunks/config.js";
import { f as formatSupabaseRequestError } from "../../../../chunks/errors2.js";
const load = async ({ parent }) => {
  const { user } = await parent();
  if (user) {
    redirect(303, "/play");
  }
};
const actions = {
  submit: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!locals.supabase) {
      return fail(503, { error: SUPABASE_CONFIG_ERROR, email });
    }
    let data;
    let error;
    try {
      ({ data, error } = await locals.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${url.origin}/auth/callback`
        }
      }));
    } catch (error2) {
      return fail(500, { error: formatSupabaseRequestError(error2, "signup"), email });
    }
    if (error) {
      return fail(400, { error: error.message, email });
    }
    if (data.session) {
      redirect(303, "/play");
    }
    return {
      success: "Account created. If email confirmation is enabled in Supabase, check your inbox next.",
      email
    };
  }
};
export {
  actions,
  load
};
