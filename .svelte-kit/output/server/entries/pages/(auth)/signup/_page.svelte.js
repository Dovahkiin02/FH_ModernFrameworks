import { a as attr, e as escape_html } from "../../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { form, data } = $$props;
    $$renderer2.push(`<div class="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]"><section class="panel p-8"><p class="eyebrow">Protected Access</p> <h1 class="mt-2 text-5xl font-black text-slate-900">Create Account</h1> <p class="mt-4 max-w-xl text-lg leading-8 text-slate-600">Create an account to save presets and keep this device's finished runs grouped under your login.</p></section> <section class="panel-strong p-8">`);
    if (!data.supabaseConfigured) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mb-4 rounded-[18px] bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">Supabase is not configured yet. Create a \`.env\` file from \`.env.example\` and fill in your project values first.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form action="?/submit" autocomplete="on" class="space-y-4" data-1p-ignore="" data-lpignore="true" method="POST"><label class="block space-y-2"><span class="text-sm font-bold text-slate-700">Email</span> <input autocomplete="email" autocapitalize="none" class="field-input" id="signup-email" inputmode="email" name="email" required="" spellcheck="false" type="email"${attr("value", form?.email ?? "")}/></label> <label class="block space-y-2"><span class="text-sm font-bold text-slate-700">Password</span> <input autocomplete="new-password" class="field-input" id="signup-password" minlength="6" name="password" required="" type="password"/></label> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="rounded-[18px] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">${escape_html(form.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.success) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="rounded-[18px] bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">${escape_html(form.success)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="action-button w-full justify-center"${attr("disabled", !data.supabaseConfigured, true)} type="submit">Create Account</button></form> <p class="mt-4 text-sm text-slate-600">Already registered? <a class="font-bold text-amber-700" href="/login">Log in instead.</a></p></section></div>`);
  });
}
export {
  _page as default
};
