import { createServerClient } from "@supabase/ssr";
import { g as getSupabasePublicConfig } from "../chunks/config.js";
function hasSupabaseAuthCookie(event) {
  return event.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("auth-token"));
}
const handle = async ({ event, resolve }) => {
  const config = getSupabasePublicConfig();
  event.locals.supabaseConfigured = Boolean(config);
  event.locals.supabase = null;
  if (config) {
    event.locals.supabase = createServerClient(config.url, config.publishableKey, {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(
            ({ name, value, options }) => event.cookies.set(name, value, { ...options, path: "/" })
          );
        }
      }
    });
  }
  event.locals.safeGetSession = async () => {
    if (!event.locals.supabase || !hasSupabaseAuthCookie(event)) {
      return { session: null, user: null };
    }
    const {
      data: { user },
      error
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      return { session: null, user: null };
    }
    return { session: null, user };
  };
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    }
  });
};
export {
  handle
};
