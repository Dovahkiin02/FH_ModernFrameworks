import "clsx";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<section><div class="panel overflow-hidden p-8 sm:p-10"><p class="eyebrow">Shared Device Co-op</p> <h1 class="mt-2 max-w-3xl text-6xl font-black leading-none text-slate-900">A quiet card game that turns into a table-wide panic.</h1> <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600"><span class="font-black text-slate-900">theGame</span> is a cooperative card challenge for one shared
			screen. Players take turns, read the table together, and try to place every card before a single dead
			hand ends the run for everyone.</p> <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600">Two stacks climb upward. Two stacks push downward. The only relief comes from exact jump-back moves that
			reopen space when the board starts to choke.</p> <div class="mt-8 flex flex-wrap gap-3">`);
    if (data.user) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a class="action-button inline-flex items-center justify-center" href="/play">Continue Playing</a> <a class="subtle-button inline-flex items-center justify-center" href="/lab">Tweak The Rules</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<a class="action-button inline-flex items-center justify-center" href="/login">Log In To Play</a> <a class="subtle-button inline-flex items-center justify-center" href="/signup">Create Account</a>`);
    }
    $$renderer2.push(`<!--]--> <a class="subtle-button inline-flex items-center justify-center" href="/how-to-play">Read The Rules</a></div> <div class="mt-8 grid gap-4 sm:grid-cols-3"><div class="rounded-[24px] bg-amber-50 p-4"><p class="eyebrow">One Team</p> <p class="mt-2 text-3xl font-black text-slate-900">All Win Or Lose</p> <p class="mt-2 text-sm leading-6 text-slate-600">Every turn belongs to one player, but the result belongs to the whole table. One trapped hand ends the run.</p></div> <div class="rounded-[24px] bg-white p-4 shadow-sm"><p class="eyebrow">Jump Back</p> <p class="mt-2 text-3xl font-black text-slate-900">Exact Relief</p> <p class="mt-2 text-sm leading-6 text-slate-600">Exact reverse jumps create breathing room. Spot them early or the board becomes brutally tight.</p></div> <div class="rounded-[24px] bg-white p-4 shadow-sm"><p class="eyebrow">Rule Lab</p> <p class="mt-2 text-3xl font-black text-slate-900">House Rules Welcome</p> <p class="mt-2 text-sm leading-6 text-slate-600">Change player count, deck size, stack setup, and reset distances to build a sharper or stranger table.</p></div></div></div></section>`);
  });
}
export {
  _page as default
};
