import { e as ensure_array_like, a as attr_class } from "../../../../chunks/renderer.js";
import { g as getGameSession } from "../../../../chunks/context2.js";
import { e as escape_html } from "../../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const session = getGameSession();
    $$renderer2.push(`<section class="space-y-6"><div class="panel p-8"><p class="eyebrow">Local Records</p> <h1 class="mt-2 text-5xl font-black text-slate-900">Recent Runs</h1> <p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600">History is stored locally in the browser and grouped under your authenticated account key.</p></div> `);
    if (session.history.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="panel p-8"><p class="text-lg font-semibold text-slate-700">No completed runs yet.</p> <p class="mt-3 text-base leading-7 text-slate-600">Finish a game and it will appear here with turns, moves, remaining cards, and the ruleset snapshot.</p></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid gap-4"><!--[-->`);
      const each_array = ensure_array_like(session.history);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let entry = each_array[$$index];
        $$renderer2.push(`<article class="panel-strong p-6"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div${attr_class(`inline-flex rounded-full px-4 py-2 text-sm font-black ${entry.result === "won" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`)}>${escape_html(entry.result === "won" ? "Win" : "Loss")}</div> <h2 class="mt-1 text-3xl font-black text-slate-900">${escape_html(entry.playerNames.join(", "))}</h2> <p class="mt-3 text-sm text-slate-600">Completed ${escape_html(new Date(entry.completedAt).toLocaleString())}</p></div> <div class="grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-4"><div class="rounded-[20px] bg-amber-50 px-4 py-3"><p class="text-slate-500">Turns</p> <p class="mt-1 text-2xl font-black text-slate-900">${escape_html(entry.turnCount)}</p></div> <div class="rounded-[20px] bg-white px-4 py-3"><p class="text-slate-500">Moves</p> <p class="mt-1 text-2xl font-black text-slate-900">${escape_html(entry.moveCount)}</p></div> <div class="rounded-[20px] bg-white px-4 py-3"><p class="text-slate-500">Remaining</p> <p class="mt-1 text-2xl font-black text-slate-900">${escape_html(entry.remainingCards)}</p></div> <div class="rounded-[20px] bg-white px-4 py-3"><p class="text-slate-500">Stacks</p> <p class="mt-1 text-2xl font-black text-slate-900">${escape_html(entry.config.stackTemplates.length)}</p></div></div></div> `);
        if (entry.lossReason) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="mt-4 text-sm font-semibold text-rose-700">${escape_html(entry.lossReason)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></article>`);
      }
      $$renderer2.push(`<!--]--></div> <button class="subtle-button" type="button">Clear History</button>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};
