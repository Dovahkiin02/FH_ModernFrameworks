import { a as attr_class, G as derived, e as ensure_array_like } from "../../../../chunks/renderer.js";
import "clsx";
import { a as ssr_context } from "../../../../chunks/context.js";
import { a as attr, e as escape_html } from "../../../../chunks/attributes.js";
import { g as getGameSession } from "../../../../chunks/context2.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function StackPile($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      stack,
      draggedCard,
      draggedMove,
      isHovered,
      isRejected,
      onHover,
      onLeave
    } = $$props;
    const isAscending = derived(() => stack.direction === "up");
    const hasDraggedCard = derived(() => draggedCard !== null);
    const isLegalTarget = derived(() => Boolean(draggedMove));
    $$renderer2.push(`<section${attr("aria-label", `${stack.label} stack`)}${attr_class(`rounded-[28px] border p-4 text-white shadow-xl backdrop-blur-sm transition duration-150 ${isAscending() ? "border-emerald-300/30 bg-[linear-gradient(135deg,rgba(18,97,89,0.86),rgba(14,67,78,0.92))]" : "border-amber-300/28 bg-[linear-gradient(135deg,rgba(91,88,45,0.84),rgba(52,75,63,0.9))]"} ${hasDraggedCard() && !isLegalTarget() ? "opacity-85 saturate-[0.78]" : ""} ${isHovered && isLegalTarget() ? "ring-4 ring-emerald-300/60 scale-[1.01]" : ""} ${isHovered && hasDraggedCard() && !isLegalTarget() ? "bg-slate-700/45 ring-4 ring-slate-300/35" : ""} ${isRejected ? "shake-drop ring-4 ring-rose-300/55" : ""}`)}${attr("data-stack-id", stack.id)}${attr("data-testid", `stack-${stack.id}`)} role="group"><div class="flex items-start justify-between gap-4"><div class="flex items-center gap-3"><div${attr_class(`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-black ${isAscending() ? "bg-emerald-300/20 text-emerald-100" : "bg-amber-300/20 text-amber-100"}`)}>${escape_html(isAscending() ? "↑" : "↓")}</div> <div><h3 class="text-2xl font-black">${escape_html(stack.label)}</h3></div></div> <div class="rounded-[22px] bg-white/90 px-4 py-3 text-right text-slate-900 shadow-lg"><p class="text-3xl font-black">${escape_html(stack.topCard)}</p></div></div></section>`);
  });
}
function Board($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      session,
      draggedCard,
      hoveredStackId,
      rejectedStackId,
      getDraggedMove,
      setHoveredStack
    } = $$props;
    function stackOrderValue(label) {
      const match = label.match(/(\d+)\s*$/);
      return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
    }
    function compareStacks(left, right) {
      const leftOrder = stackOrderValue(left.label);
      const rightOrder = stackOrderValue(right.label);
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }
      return left.label.localeCompare(right.label) || left.id.localeCompare(right.id);
    }
    const ascendingStacks = derived(() => session.state ? [...session.state.stacks].filter((stack) => stack.direction === "up").sort(compareStacks) : []);
    const descendingStacks = derived(() => session.state ? [...session.state.stacks].filter((stack) => stack.direction === "down").sort(compareStacks) : []);
    if (session.state) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="table-surface rounded-[34px] p-5 text-white sm:p-6"><div class="mb-5 flex items-center justify-between gap-4"><div><p class="eyebrow text-white/60">Middle Table</p> <h2 class="text-3xl font-black">Shared Stacks</h2></div> <div class="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">${escape_html(session.state.history.length)} cards placed</div></div> <div class="grid gap-4 lg:grid-cols-2 lg:items-start"><div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(ascendingStacks());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let stack = each_array[$$index];
        StackPile($$renderer2, {
          stack,
          draggedCard,
          draggedMove: getDraggedMove(stack.id),
          isHovered: hoveredStackId === stack.id,
          isRejected: rejectedStackId === stack.id,
          onHover: () => setHoveredStack(stack.id),
          onLeave: () => setHoveredStack(null)
        });
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-4"><!--[-->`);
      const each_array_1 = ensure_array_like(descendingStacks());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let stack = each_array_1[$$index_1];
        StackPile($$renderer2, {
          stack,
          draggedCard,
          draggedMove: getDraggedMove(stack.id),
          isHovered: hoveredStackId === stack.id,
          isRejected: rejectedStackId === stack.id,
          onHover: () => setHoveredStack(stack.id),
          onLeave: () => setHoveredStack(null)
        });
      }
      $$renderer2.push(`<!--]--></div></div></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function HintPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    $$renderer2.push(`<section class="panel-strong p-5"><p class="eyebrow">Hints</p> <h2 class="mt-1 text-2xl font-black">Best Next Moves</h2> `);
    if (!session.state || !session.state.config.hintsEnabled) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-4 text-sm text-slate-600">Hints are disabled in this ruleset.</p>`);
    } else if (session.suggestedMoves.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<p class="mt-4 text-sm text-slate-600">No legal move is currently available.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="mt-4 space-y-3"><!--[-->`);
      const each_array = ensure_array_like(session.suggestedMoves);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let move = each_array[$$index];
        $$renderer2.push(`<div class="rounded-[20px] border border-slate-200 bg-white px-4 py-3"><p class="text-sm font-black text-slate-900">Play ${escape_html(move.card)} on ${escape_html(move.stackLabel)}</p> <p class="mt-1 text-sm text-slate-600">${escape_html(move.kind === "reset" ? `Jump back by ${move.distance} on the ${move.stackDirection} stack.` : `A normal ${move.distance}-step ${move.stackDirection === "up" ? "increase" : "decrease"}.`)}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
function InterTurnOverlay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    if (session.handoffVisible) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"><div class="panel max-w-lg p-8 text-center"><p class="eyebrow">Hot-Seat Handoff</p> <h2 class="mt-2 text-4xl font-black text-slate-900">Pass The Device</h2> <p class="mt-4 text-base text-slate-600">The next turn belongs to <span class="font-black text-slate-900">${escape_html(session.nextPlayerName)}</span>.
				Let everyone else look away before revealing the next hand.</p> <button class="action-button mt-6" type="button">Reveal Next Hand</button></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function MoveLog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    const recentMoves = derived(() => session.state ? [...session.state.history].slice(-8).reverse() : []);
    $$renderer2.push(`<section class="panel-strong p-5"><p class="eyebrow">Move Log</p> <h2 class="mt-1 text-2xl font-black">Latest Plays</h2> `);
    if (recentMoves().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-4 text-sm text-slate-600">No cards have been played yet.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="mt-4 space-y-3"><!--[-->`);
      const each_array = ensure_array_like(recentMoves());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let move = each_array[$$index];
        $$renderer2.push(`<div class="rounded-[20px] border border-slate-200 bg-white px-4 py-3"><p class="text-sm font-black text-slate-900">${escape_html(move.playerName)} played ${escape_html(move.card)} on ${escape_html(move.stackLabel)}</p> <p class="mt-1 text-sm text-slate-600">${escape_html(move.kind === "reset" ? `Reset by ${move.distance}.` : `Moved by ${move.distance}.`)}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
function PlayerHand($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session, draggedCard } = $$props;
    const playableCards = derived(() => new Set(session.legalMoves.map((move) => move.card)));
    if (session.currentPlayer) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="panel-strong p-5"><div class="flex items-center justify-between gap-4"><div><p class="eyebrow">Current Hand</p> <h2 class="text-2xl font-black">${escape_html(session.currentPlayer.name)}</h2></div> <div class="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">${escape_html(session.currentPlayer.hand.length)} cards</div></div> <div class="mt-5 flex flex-wrap gap-3"><!--[-->`);
      const each_array = ensure_array_like(session.currentPlayer.hand);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let card = each_array[$$index];
        $$renderer2.push(`<div${attr("aria-disabled", !playableCards().has(card))}${attr_class(`rounded-[22px] border px-4 py-3 text-center shadow-sm transition ${playableCards().has(card) ? "cursor-grab border-emerald-300 bg-emerald-50 text-emerald-900 hover:-translate-y-0.5 hover:shadow-md" : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 grayscale"} ${draggedCard === card ? "scale-[0.97] opacity-55 shadow-none" : ""}`)}${attr("data-card-value", card)}${attr("data-testid", `card-${card}`)} role="button"${attr("tabindex", playableCards().has(card) ? 0 : -1)}><p class="text-2xl font-black">${escape_html(card)}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function ResultModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    if (session.state && session.state.status !== "playing") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"><div${attr_class(`panel max-w-xl p-8 ${session.state.status === "won" ? "border-amber-200/80 bg-[radial-gradient(circle_at_top,_rgba(255,244,196,0.92),_transparent_34%),linear-gradient(180deg,_rgba(255,252,244,0.98),_rgba(255,247,232,0.94))] shadow-[0_26px_80px_rgba(180,83,9,0.22)]" : ""}`)}>`);
      if (session.state.status === "won") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="mb-5 flex items-center justify-between gap-4"><div><p class="eyebrow text-amber-800">Victory</p> <p class="mt-2 text-sm font-semibold text-amber-900/80">The table cleared the full deck.</p></div> <div class="flex h-18 w-18 items-center justify-center rounded-full border border-amber-200 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.95),_rgba(255,233,163,0.98)_45%,_rgba(245,158,11,0.96)_100%)] text-3xl shadow-[0_12px_28px_rgba(245,158,11,0.28)]" aria-hidden="true">✦</div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p class="eyebrow">Run Ended</p>`);
      }
      $$renderer2.push(`<!--]--> <h2 class="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">${escape_html(session.state.status === "won" ? "All Cards Cleared." : "No Legal Move Left.")}</h2> <p class="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">${escape_html(session.state.status === "won" ? "Every card reached the middle stacks. The table won together." : session.state.lossReason)}</p> <div${attr_class(`mt-7 flex items-center justify-between gap-4 rounded-[28px] px-5 py-5 text-sm font-semibold text-slate-700 sm:px-6 ${session.state.status === "won" ? "bg-[linear-gradient(135deg,_rgba(255,248,222,0.95),_rgba(255,239,194,0.92))] ring-1 ring-amber-200/70" : "bg-slate-100/85 ring-1 ring-slate-200"}`)}><div><p class="text-slate-500">${escape_html(session.state.status === "won" ? "Winning Run" : "Run Length")}</p> <p class="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">${escape_html(session.state.turnNumber)} turns</p></div> `);
      if (session.state.status === "won") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="rounded-full bg-white/65 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-800 shadow-sm">Full Deck Complete</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="mt-7 flex flex-wrap gap-3"><button class="action-button min-w-40" type="button">Play Again</button> <a class="subtle-button inline-flex min-w-40 items-center justify-center" href="/history">Open History</a> <a class="subtle-button inline-flex min-w-40 items-center justify-center" href="/lab">Adjust Rules</a></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function TurnPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    if (session.state && session.currentPlayer) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="panel-strong p-5"><p class="eyebrow">Turn Status</p> <h2 class="mt-1 text-2xl font-black">Turn ${escape_html(session.state.turnNumber)}</h2> <div class="mt-4 space-y-3 text-sm text-slate-700"><div class="flex items-center justify-between gap-4"><span class="font-semibold">Player</span> <span class="font-black">${escape_html(session.currentPlayer.name)}</span></div> <div class="flex items-center justify-between gap-4"><span class="font-semibold">Moves this turn</span> <span class="font-black">${escape_html(session.state.movesThisTurn)} / ${escape_html(session.state.config.minCardsPerTurn)}</span></div> <div class="flex items-center justify-between gap-4"><span class="font-semibold">Draw pile</span> <span class="font-black">${escape_html(session.state.drawPile.length)}</span></div> <div class="flex items-center justify-between gap-4"><span class="font-semibold">Progress</span> <span class="font-black">${escape_html(session.progressPercent)}%</span></div></div> <div class="mt-5 flex flex-wrap gap-3"><button class="action-button"${attr("disabled", !session.canEndTurn, true)} type="button">End Turn</button> <button class="subtle-button" type="button">Abandon Run</button></div></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function GameScreen($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { session } = $$props;
    let draggedCard = null;
    let hoveredStackId = null;
    let rejectedStackId = null;
    let detachPointerListeners = null;
    function getDraggedMove(stackId) {
      return null;
    }
    function setHoveredStack(stackId) {
      hoveredStackId = stackId;
    }
    function stopPointerTracking() {
      detachPointerListeners?.();
      detachPointerListeners = null;
    }
    onDestroy(() => {
      stopPointerTracking();
    });
    $$renderer2.push(`<div class="grid gap-6 xl:grid-cols-[1.65fr_0.9fr]"><div class="space-y-6">`);
    Board($$renderer2, {
      session,
      draggedCard,
      hoveredStackId,
      rejectedStackId,
      getDraggedMove,
      setHoveredStack
    });
    $$renderer2.push(`<!----> `);
    PlayerHand($$renderer2, { session, draggedCard });
    $$renderer2.push(`<!----></div> <div class="space-y-6">`);
    TurnPanel($$renderer2, { session });
    $$renderer2.push(`<!----> `);
    HintPanel($$renderer2, { session });
    $$renderer2.push(`<!----> `);
    MoveLog($$renderer2, { session });
    $$renderer2.push(`<!----></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    InterTurnOverlay($$renderer2, { session });
    $$renderer2.push(`<!----> `);
    ResultModal($$renderer2, { session });
    $$renderer2.push(`<!---->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const session = getGameSession();
    if (session.state) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="mb-6 panel p-5"><p class="eyebrow">Active Run</p> <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 class="mt-1 text-4xl font-black text-slate-900">Play Area</h1> <p class="mt-3 text-base text-slate-600">Use the middle stacks to choose a destination, then play one of the currently legal cards from the active hand.</p></div> <div${attr_class(`inline-flex rounded-full px-4 py-2 text-sm font-black ${session.state.status === "won" ? "bg-emerald-100 text-emerald-800" : session.state.status === "lost" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-900"}`)}>${escape_html(session.state.status === "won" ? "Win" : session.state.status === "lost" ? "Loss" : `Turn ${session.state.turnNumber}`)}</div></div></section> `);
      GameScreen($$renderer2, { session });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<section class="panel p-8"><p class="eyebrow">No Active Run</p> <h1 class="mt-2 text-5xl font-black text-slate-900">Start A New Game</h1> <p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Your current setup uses ${escape_html(session.setup.config.playerCount)} players, ${escape_html(session.setup.config.handSize)} cards per
			hand, and ${escape_html(session.setup.config.stackTemplates.length)} middle stacks.</p> <div class="mt-8 flex flex-wrap gap-3"><button class="action-button" type="button">Start With Current Rules</button> <a class="subtle-button inline-flex items-center justify-center" href="/lab">Open Rule Lab</a></div></section>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
