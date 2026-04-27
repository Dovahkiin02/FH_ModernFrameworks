import { e as ensure_array_like, a as attr_class } from "../../../../chunks/renderer.js";
import { e as escape_html, a as attr } from "../../../../chunks/attributes.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { P as PRESETS } from "../../../../chunks/presets.js";
import { g as getGameSession } from "../../../../chunks/context2.js";
function ConfigPreview($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    $$renderer2.push(`<section class="panel p-5"><p class="eyebrow">Preview</p> <h2 class="mt-1 text-3xl font-black text-slate-900">Configuration Health</h2> <div class="mt-5 grid gap-4 md:grid-cols-3"><div class="rounded-[24px] bg-white p-4 shadow-sm"><p class="text-sm font-semibold text-slate-500">Deck Size</p> <p class="mt-1 text-3xl font-black text-slate-900">${escape_html(session.deckSize)}</p></div> <div class="rounded-[24px] bg-white p-4 shadow-sm"><p class="text-sm font-semibold text-slate-500">Opening Cards Dealt</p> <p class="mt-1 text-3xl font-black text-slate-900">${escape_html(session.openingCards)}</p></div> <div class="rounded-[24px] bg-white p-4 shadow-sm"><p class="text-sm font-semibold text-slate-500">Stacks</p> <p class="mt-1 text-3xl font-black text-slate-900">${escape_html(session.setup.config.stackTemplates.length)}</p></div></div> <div class="mt-5 rounded-[24px] border border-slate-200 bg-white p-4">`);
    if (session.validation.valid) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="font-black text-emerald-700">This ruleset is ready to start.</p> <p class="mt-2 text-sm text-slate-600">The deck and opening hands line up, and the board has both ascending and descending stacks.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="font-black text-rose-700">Fix these issues before starting a run.</p> <ul class="mt-3 space-y-2 text-sm text-slate-700"><!--[-->`);
      const each_array = ensure_array_like(session.validation.issues);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let issue = each_array[$$index];
        $$renderer2.push(`<li>• ${escape_html(issue)}</li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    }
    $$renderer2.push(`<!--]--></div></section>`);
  });
}
function PresetPicker($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    $$renderer2.push(`<section class="panel p-5"><p class="eyebrow">Preset Library</p> <h2 class="mt-1 text-3xl font-black text-slate-900">Starting Points</h2> <div class="mt-5 grid gap-4 lg:grid-cols-3"><!--[-->`);
    const each_array = ensure_array_like(PRESETS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let preset = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`rounded-[26px] border p-5 text-left transition ${session.setup.presetId === preset.id ? "border-amber-300 bg-amber-50 shadow-lg" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-lg"}`)} type="button"><p class="eyebrow">${escape_html(preset.id)}</p> <h3 class="mt-2 text-2xl font-black text-slate-900">${escape_html(preset.name)}</h3> <p class="mt-3 text-sm leading-6 text-slate-600">${escape_html(preset.description)}</p></button>`);
    }
    $$renderer2.push(`<!--]--></div></section>`);
  });
}
function RuleEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    $$renderer2.push(`<section class="panel p-5"><p class="eyebrow">Core Rules</p> <h2 class="mt-1 text-3xl font-black text-slate-900">Table Configuration</h2> <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5"><label class="space-y-2"><span class="text-sm font-bold text-slate-700">Players</span> <input class="field-input" min="2" type="number"${attr("value", session.setup.config.playerCount)}/></label> <label class="space-y-2"><span class="text-sm font-bold text-slate-700">Hand Size</span> <input class="field-input" min="1" type="number"${attr("value", session.setup.config.handSize)}/></label> <label class="space-y-2"><span class="text-sm font-bold text-slate-700">Minimum Plays</span> <input class="field-input" min="1" type="number"${attr("value", session.setup.config.minCardsPerTurn)}/></label> <label class="space-y-2"><span class="text-sm font-bold text-slate-700">Deck Minimum</span> <input class="field-input" type="number"${attr("value", session.setup.config.deckMin)}/></label> <label class="space-y-2"><span class="text-sm font-bold text-slate-700">Deck Maximum</span> <input class="field-input" type="number"${attr("value", session.setup.config.deckMax)}/></label></div> <div class="mt-5 grid gap-4 md:grid-cols-2"><label class="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-4"><div><p class="font-black text-slate-900">Conceal Hands Between Turns</p> <p class="mt-1 text-sm text-slate-600">Useful for hot-seat play on one shared device.</p></div> <input${attr("checked", session.setup.config.concealHandsBetweenTurns, true)} type="checkbox"/></label> <label class="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-4"><div><p class="font-black text-slate-900">Enable Hints</p> <p class="mt-1 text-sm text-slate-600">Show low-risk moves based on distance and reset opportunities.</p></div> <input${attr("checked", session.setup.config.hintsEnabled, true)} type="checkbox"/></label></div></section>`);
  });
}
function StackTemplateEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    function updateStackDirection(index, event) {
      const target = event.currentTarget;
      session.setup.config.stackTemplates[index].direction = target.value;
      session.syncSetup();
    }
    $$renderer2.push(`<section class="panel p-5"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p class="eyebrow">Middle Stacks</p> <h2 class="mt-1 text-3xl font-black text-slate-900">Stack Templates</h2></div> <div class="flex flex-wrap gap-3"><button class="subtle-button" type="button">Add Ascending</button> <button class="subtle-button" type="button">Add Descending</button></div></div> <div class="mt-5 space-y-4"><!--[-->`);
    const each_array = ensure_array_like(session.setup.config.stackTemplates);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let stack = each_array[index];
      $$renderer2.push(`<div class="rounded-[26px] border border-slate-200 bg-white p-4"><div class="grid gap-4 md:grid-cols-[1.3fr_0.9fr_0.8fr_1.2fr_auto]"><label class="space-y-2"><span class="text-sm font-bold text-slate-700">Label</span> <input class="field-input" type="text"${attr("value", stack.label)}/></label> <label class="space-y-2"><span class="text-sm font-bold text-slate-700">Direction</span> `);
      $$renderer2.select(
        {
          class: "field-input",
          value: stack.direction,
          onchange: (event) => updateStackDirection(index, event)
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "up" }, ($$renderer4) => {
            $$renderer4.push(`Ascending`);
          });
          $$renderer3.option({ value: "down" }, ($$renderer4) => {
            $$renderer4.push(`Descending`);
          });
        }
      );
      $$renderer2.push(`</label> <label class="space-y-2"><span class="text-sm font-bold text-slate-700">Start Value</span> <input class="field-input" type="number"${attr("value", stack.startValue)}/></label> <label class="space-y-2"><span class="text-sm font-bold text-slate-700">Reset Distances</span> <input class="field-input" placeholder="10, 20" type="text"${attr("value", stack.allowedResetDistances.join(", "))}/></label> <div class="flex items-end"><button class="subtle-button w-full" type="button">Remove</button></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></section>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const session = getGameSession();
    $$renderer2.push(`<section class="space-y-6"><div class="panel p-8"><p class="eyebrow">Rule Lab</p> <h1 class="mt-2 text-5xl font-black text-slate-900">Design The Table</h1> <p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600">This page edits the entire local ruleset: player names, deck size, stack geometry, and special reset rules.</p> `);
    if (session.state?.status === "playing") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-5 rounded-[18px] bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">A run is currently active. Starting from this page will replace the current game.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    PresetPicker($$renderer2, { session });
    $$renderer2.push(`<!----> `);
    RuleEditor($$renderer2, { session });
    $$renderer2.push(`<!----> <section class="panel p-5"><p class="eyebrow">Players</p> <h2 class="mt-1 text-3xl font-black text-slate-900">Seat Names</h2> <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
    const each_array = ensure_array_like(session.setup.playerNames);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let name = each_array[index];
      $$renderer2.push(`<label class="space-y-2"><span class="text-sm font-bold text-slate-700">Player ${escape_html(index + 1)}</span> <input class="field-input" type="text"${attr("value", name)}/></label>`);
    }
    $$renderer2.push(`<!--]--></div></section> `);
    StackTemplateEditor($$renderer2, { session });
    $$renderer2.push(`<!----> `);
    ConfigPreview($$renderer2, { session });
    $$renderer2.push(`<!----> <div class="flex flex-wrap gap-3"><button class="action-button"${attr("disabled", !session.validation.valid, true)} type="button">Start Run With These Rules</button> <a class="subtle-button inline-flex items-center justify-center" href="/play">Back To Play</a></div></section>`);
  });
}
export {
  _page as default
};
