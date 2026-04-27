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
  submit: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!locals.supabase) {
      return fail(503, { error: SUPABASE_CONFIG_ERROR, email });
    }
    let error;
    try {
      ({ error } = await locals.supabase.auth.signInWithPassword({ email, password }));
    } catch (error2) {
      return fail(500, { error: formatSupabaseRequestError(error2, "login"), email });
    }
    if (error) {
      return fail(400, { error: error.message, email });
    }
    redirect(303, "/play");
  }
};
export {
  actions,
  load
};
