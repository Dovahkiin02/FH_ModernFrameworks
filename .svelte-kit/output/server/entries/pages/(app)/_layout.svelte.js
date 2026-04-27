import "clsx";
import { s as setGameSession } from "../../../chunks/context2.js";
import { c as cloneConfig, a as createStackTemplate, b as createPlayerNames, g as getPresetById, d as getDefaultPreset } from "../../../chunks/presets.js";
function evaluateMove(stack, card) {
  if (stack.direction === "up") {
    if (card > stack.topCard) {
      return { valid: true, kind: "normal", distance: card - stack.topCard };
    }
    const resetDistance = stack.topCard - card;
    if (stack.allowedResetDistances.includes(resetDistance)) {
      return { valid: true, kind: "reset", distance: resetDistance };
    }
  }
  if (stack.direction === "down") {
    if (card < stack.topCard) {
      return { valid: true, kind: "normal", distance: stack.topCard - card };
    }
    const resetDistance = card - stack.topCard;
    if (stack.allowedResetDistances.includes(resetDistance)) {
      return { valid: true, kind: "reset", distance: resetDistance };
    }
  }
  return { valid: false, kind: null, distance: 0 };
}
function getCurrentPlayer(state) {
  return state.players[state.currentPlayerIndex];
}
function getDeckSize(state) {
  return state.config.deckMax - state.config.deckMin + 1;
}
function getRemainingCards(state) {
  return state.drawPile.length + state.players.reduce((sum, player) => sum + player.hand.length, 0);
}
function getProgressPercent(state) {
  const totalCards = getDeckSize(state);
  if (totalCards <= 0) return 0;
  return Math.round(state.history.length / totalCards * 100);
}
function getLegalMoves(state, playerIndex = state.currentPlayerIndex) {
  const player = state.players[playerIndex];
  if (!player) return [];
  const moves = [];
  for (const card of player.hand) {
    for (const stack of state.stacks) {
      const evaluation = evaluateMove(stack, card);
      if (!evaluation.valid || !evaluation.kind) continue;
      moves.push({
        playerIndex,
        playerId: player.id,
        stackId: stack.id,
        stackLabel: stack.label,
        stackDirection: stack.direction,
        stackTopCard: stack.topCard,
        card,
        kind: evaluation.kind,
        distance: evaluation.distance
      });
    }
  }
  return moves;
}
function getMoveScore(move) {
  if (move.kind === "reset") {
    return -1e3 + move.distance;
  }
  return move.distance;
}
function getSuggestedMoves(state, limit = 3) {
  return getLegalMoves(state).sort((left, right) => getMoveScore(left) - getMoveScore(right)).slice(0, limit);
}
function sortHand$1(hand) {
  return [...hand].sort((left, right) => left - right);
}
function replaceAt(items, index, value) {
  return items.map((item, currentIndex) => currentIndex === index ? value : item);
}
function removeCard(hand, card) {
  const index = hand.indexOf(card);
  if (index < 0) return [...hand];
  return [...hand.slice(0, index), ...hand.slice(index + 1)];
}
function finishGame(state, result, reason = null) {
  return {
    ...state,
    status: result,
    lossReason: result === "lost" ? reason : null,
    completedAt: state.completedAt ?? Date.now()
  };
}
function findNextActivePlayerIndex(players, startIndex) {
  for (let offset = 1; offset <= players.length; offset += 1) {
    const index = (startIndex + offset) % players.length;
    if (players[index].hand.length > 0) {
      return index;
    }
  }
  return startIndex;
}
function settleState(state) {
  if (getRemainingCards(state) === 0) {
    return finishGame(state, "won");
  }
  if (state.players[state.currentPlayerIndex]?.hand.length === 0) {
    const nextPlayerIndex = findNextActivePlayerIndex(state.players, state.currentPlayerIndex);
    if (nextPlayerIndex !== state.currentPlayerIndex) {
      return settleState({
        ...state,
        currentPlayerIndex: nextPlayerIndex
      });
    }
  }
  const legalMoves = getLegalMoves(state, state.currentPlayerIndex);
  if (legalMoves.length === 0 && state.movesThisTurn < state.config.minCardsPerTurn) {
    const currentPlayer = getCurrentPlayer(state);
    return finishGame(
      state,
      "lost",
      `${currentPlayer.name} has no legal move before meeting the turn minimum.`
    );
  }
  return state;
}
function drawUpToHandSize(player, drawPile, handSize) {
  const nextDrawPile = [...drawPile];
  const hand = [...player.hand];
  while (hand.length < handSize && nextDrawPile.length > 0) {
    const card = nextDrawPile.shift();
    if (card !== void 0) hand.push(card);
  }
  return {
    player: {
      ...player,
      hand: sortHand$1(hand)
    },
    drawPile: nextDrawPile
  };
}
function canEndTurn(state) {
  return state.movesThisTurn >= state.config.minCardsPerTurn;
}
function playCard(state, move) {
  if (state.status !== "playing") {
    throw new Error("Cannot play a card after the game has finished.");
  }
  const player = getCurrentPlayer(state);
  if (!player.hand.includes(move.card)) {
    throw new Error(`Card ${move.card} is not in the current player's hand.`);
  }
  const stackIndex = state.stacks.findIndex((stack2) => stack2.id === move.stackId);
  if (stackIndex < 0) {
    throw new Error(`Unknown stack: ${move.stackId}`);
  }
  const stack = state.stacks[stackIndex];
  const evaluation = evaluateMove(stack, move.card);
  if (!evaluation.valid || !evaluation.kind) {
    throw new Error(`Card ${move.card} cannot be played on stack ${stack.label}.`);
  }
  const updatedPlayer = {
    ...player,
    hand: sortHand$1(removeCard(player.hand, move.card))
  };
  const updatedStack = {
    ...stack,
    topCard: move.card,
    playedCards: [...stack.playedCards, move.card]
  };
  const record = {
    id: `move-${state.history.length + 1}`,
    playerId: player.id,
    playerName: player.name,
    stackId: stack.id,
    stackLabel: stack.label,
    card: move.card,
    kind: evaluation.kind,
    distance: evaluation.distance,
    previousTopCard: stack.topCard,
    nextTopCard: move.card,
    turnNumber: state.turnNumber,
    createdAt: Date.now()
  };
  const nextState = {
    ...state,
    players: replaceAt(state.players, state.currentPlayerIndex, updatedPlayer),
    stacks: replaceAt(state.stacks, stackIndex, updatedStack),
    movesThisTurn: state.movesThisTurn + 1,
    history: [...state.history, record]
  };
  return settleState(nextState);
}
function endTurn(state) {
  if (state.status !== "playing") {
    throw new Error("Cannot end the turn after the game has finished.");
  }
  if (!canEndTurn(state)) {
    throw new Error(`You must play at least ${state.config.minCardsPerTurn} card(s) before ending the turn.`);
  }
  const { player: refilledPlayer, drawPile } = drawUpToHandSize(
    state.players[state.currentPlayerIndex],
    state.drawPile,
    state.config.handSize
  );
  const players = replaceAt(state.players, state.currentPlayerIndex, refilledPlayer);
  const nextPlayerIndex = findNextActivePlayerIndex(players, state.currentPlayerIndex);
  const nextState = {
    ...state,
    players,
    drawPile,
    currentPlayerIndex: nextPlayerIndex,
    movesThisTurn: 0,
    turnNumber: state.turnNumber + 1
  };
  return settleState(nextState);
}
function createDeck(deckMin, deckMax) {
  return Array.from({ length: deckMax - deckMin + 1 }, (_, index) => deckMin + index);
}
function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 1831565813;
    let value = Math.imul(state ^ state >>> 15, state | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}
function shuffleNumbers(numbers, seed) {
  const random = seed === null || seed === void 0 ? Math.random : mulberry32(seed);
  const shuffled = [...numbers];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}
function toInteger(value, fallback, minimum, maximum) {
  let normalized = Number.isFinite(value) ? Math.trunc(value) : fallback;
  if (minimum !== void 0) normalized = Math.max(normalized, minimum);
  if (maximum !== void 0) normalized = Math.min(normalized, maximum);
  return normalized;
}
function normalizeDistances(distances) {
  return Array.from(
    new Set(
      distances.map((distance) => toInteger(distance, 0, 1)).filter((distance) => distance > 0).sort((left, right) => left - right)
    )
  );
}
function normalizeStackTemplates(stackTemplates) {
  const fallback = stackTemplates.length > 0 ? stackTemplates : [
    createStackTemplate("up", 1),
    createStackTemplate("up", 2),
    createStackTemplate("down", 1),
    createStackTemplate("down", 2)
  ];
  const seenIds = /* @__PURE__ */ new Set();
  return fallback.map((stack, index) => {
    const fallbackStack = createStackTemplate(stack.direction, index + 1);
    const rawId = stack.id?.trim() || fallbackStack.id;
    let nextId = rawId;
    let suffix = 2;
    while (seenIds.has(nextId)) {
      nextId = `${rawId}-${suffix++}`;
    }
    seenIds.add(nextId);
    return {
      id: nextId,
      label: stack.label?.trim() || fallbackStack.label,
      direction: stack.direction,
      startValue: toInteger(stack.startValue, fallbackStack.startValue),
      allowedResetDistances: normalizeDistances(stack.allowedResetDistances ?? [])
    };
  });
}
function normalizeConfig(input) {
  const config = cloneConfig(input);
  return {
    ...config,
    playerCount: toInteger(config.playerCount, 4, 2, 8),
    handSize: toInteger(config.handSize, 5, 1, 12),
    minCardsPerTurn: toInteger(config.minCardsPerTurn, 1, 1, 12),
    deckMin: toInteger(config.deckMin, 1),
    deckMax: toInteger(config.deckMax, 99),
    concealHandsBetweenTurns: Boolean(config.concealHandsBetweenTurns),
    hintsEnabled: Boolean(config.hintsEnabled),
    seed: config.seed ?? null,
    stackTemplates: normalizeStackTemplates(config.stackTemplates ?? [])
  };
}
function validateConfig(input) {
  const config = normalizeConfig(input);
  const issues = [];
  const deckSize = config.deckMax - config.deckMin + 1;
  if (config.deckMin >= config.deckMax) {
    issues.push("The deck range must contain at least two different card values.");
  }
  if (deckSize < config.playerCount * config.handSize) {
    issues.push("The deck is too small to deal the opening hands for all players.");
  }
  if (config.minCardsPerTurn > config.handSize) {
    issues.push("The minimum cards per turn cannot exceed the target hand size.");
  }
  if (config.stackTemplates.length < 2) {
    issues.push("Use at least two middle stacks so the board creates meaningful choices.");
  }
  const ascendingCount = config.stackTemplates.filter((stack) => stack.direction === "up").length;
  const descendingCount = config.stackTemplates.length - ascendingCount;
  if (ascendingCount === 0 || descendingCount === 0) {
    issues.push("Use at least one ascending and one descending stack.");
  }
  const invalidDistances = config.stackTemplates.some(
    (stack) => stack.allowedResetDistances.some((distance) => distance <= 0)
  );
  if (invalidDistances) {
    issues.push("Reset distances must be positive integers.");
  }
  return {
    valid: issues.length === 0,
    issues
  };
}
function sortHand(hand) {
  return [...hand].sort((left, right) => left - right);
}
function drawInitialHand(drawPile, handSize) {
  const nextDrawPile = [...drawPile];
  const hand = [];
  while (hand.length < handSize && nextDrawPile.length > 0) {
    const card = nextDrawPile.shift();
    if (card !== void 0) hand.push(card);
  }
  return { hand: sortHand(hand), drawPile: nextDrawPile };
}
function createPlayers(config, providedNames, drawPile) {
  const fallbackNames = createPlayerNames(config.playerCount);
  const names = Array.from({ length: config.playerCount }, (_, index) => {
    const value = providedNames[index]?.trim();
    return value || fallbackNames[index];
  });
  let nextDrawPile = [...drawPile];
  const players = names.map((name, index) => {
    const { hand, drawPile: rest } = drawInitialHand(nextDrawPile, config.handSize);
    nextDrawPile = rest;
    return {
      id: `player-${index + 1}`,
      name,
      hand
    };
  });
  return { players, drawPile: nextDrawPile };
}
function createStacks(config) {
  return config.stackTemplates.map((stack) => ({
    ...stack,
    playedCards: [stack.startValue],
    topCard: stack.startValue
  }));
}
function startGame(inputConfig, providedNames = []) {
  const config = normalizeConfig(inputConfig);
  const validation = validateConfig(config);
  if (!validation.valid) {
    throw new Error(validation.issues.join(" "));
  }
  const shuffledDeck = shuffleNumbers(createDeck(config.deckMin, config.deckMax), config.seed);
  const { players, drawPile } = createPlayers(config, providedNames, shuffledDeck);
  const now = Date.now();
  return {
    config,
    players,
    stacks: createStacks(config),
    drawPile,
    currentPlayerIndex: 0,
    movesThisTurn: 0,
    turnNumber: 1,
    status: "playing",
    history: [],
    startedAt: now,
    completedAt: null,
    lossReason: null
  };
}
const STORAGE_NAMESPACE = "the-game";
const HISTORY_LIMIT = 12;
function buildKey(userKey, suffix) {
  return `${STORAGE_NAMESPACE}:${userKey}:${suffix}`;
}
function writeJson(key, value) {
  return;
}
function saveSetup(userKey, setup) {
}
function saveHistory(userKey, history) {
  writeJson(buildKey(userKey, "history"), history.slice(0, HISTORY_LIMIT));
}
function clearHistory(userKey) {
}
function saveActiveGame(userKey, snapshot) {
}
function clearActiveGame(userKey) {
}
function createDefaultSetup() {
  const preset = getDefaultPreset();
  return {
    presetId: preset.id,
    config: cloneConfig(preset.config),
    playerNames: createPlayerNames(preset.config.playerCount)
  };
}
function createSummary(state) {
  return {
    id: `summary-${state.startedAt}`,
    startedAt: state.startedAt,
    completedAt: state.completedAt ?? Date.now(),
    result: state.status === "won" ? "won" : "lost",
    playerNames: state.players.map((player) => player.name),
    turnCount: state.turnNumber,
    moveCount: state.history.length,
    remainingCards: getRemainingCards(state),
    lossReason: state.lossReason,
    config: cloneConfig(state.config)
  };
}
function ensurePlayerNames(config, names) {
  const fallback = createPlayerNames(config.playerCount);
  return Array.from({ length: config.playerCount }, (_, index) => names[index]?.trim() || fallback[index]);
}
class GameSession {
  userKey;
  setup = createDefaultSetup();
  state = null;
  history = [];
  handoffVisible = false;
  nextPlayerName = "";
  hydrated = false;
  constructor(userKey) {
    this.userKey = userKey;
  }
  get validation() {
    return validateConfig(this.setup.config);
  }
  get currentPlayer() {
    return this.state ? getCurrentPlayer(this.state) : null;
  }
  get legalMoves() {
    return this.state ? getLegalMoves(this.state) : [];
  }
  get suggestedMoves() {
    return this.state ? getSuggestedMoves(this.state, 3) : [];
  }
  get progressPercent() {
    return this.state ? getProgressPercent(this.state) : 0;
  }
  get remainingCards() {
    return this.state ? getRemainingCards(this.state) : 0;
  }
  get canEndTurn() {
    return this.state ? this.state.movesThisTurn >= this.state.config.minCardsPerTurn : false;
  }
  get deckSize() {
    return this.setup.config.deckMax - this.setup.config.deckMin + 1;
  }
  get openingCards() {
    return this.setup.config.playerCount * this.setup.config.handSize;
  }
  get hasFinishedGame() {
    return this.state?.status === "won" || this.state?.status === "lost";
  }
  hydrate() {
    return;
  }
  syncSetup(shouldPersist = true) {
    const config = normalizeConfig(this.setup.config);
    const playerNames = ensurePlayerNames(config, this.setup.playerNames);
    this.setup = { ...this.setup, config, playerNames };
    if (shouldPersist) {
      saveSetup(this.userKey, this.setup);
    }
  }
  selectPreset(presetId) {
    const preset = getPresetById(presetId);
    this.setup = {
      presetId: preset.id,
      config: cloneConfig(preset.config),
      playerNames: createPlayerNames(preset.config.playerCount)
    };
    this.syncSetup();
  }
  setPlayerName(index, name) {
    this.setup.playerNames[index] = name;
    saveSetup(this.userKey, this.setup);
  }
  addStack(direction) {
    const nextIndex = this.setup.config.stackTemplates.filter((stack) => stack.direction === direction).length + 1;
    this.setup.config.stackTemplates.push(createStackTemplate(direction, nextIndex));
    this.syncSetup();
  }
  removeStack(index) {
    if (this.setup.config.stackTemplates.length <= 2) return;
    this.setup.config.stackTemplates.splice(index, 1);
    this.syncSetup();
  }
  play(stackId, card) {
    if (!this.state) return;
    this.state = playCard(this.state, { stackId, card });
    this.captureFinishedGame();
    this.persistActiveState();
  }
  endCurrentTurn() {
    if (!this.state) return;
    this.state = endTurn(this.state);
    if (this.state.status === "playing" && this.state.config.concealHandsBetweenTurns) {
      this.handoffVisible = true;
      this.nextPlayerName = this.state.players[this.state.currentPlayerIndex]?.name ?? "";
    } else {
      this.handoffVisible = false;
      this.nextPlayerName = "";
    }
    this.captureFinishedGame();
    this.persistActiveState();
  }
  revealNextHand() {
    this.handoffVisible = false;
    this.nextPlayerName = "";
    this.persistActiveState();
  }
  start() {
    const validation = this.validation;
    if (!validation.valid) return false;
    const config = normalizeConfig(this.setup.config);
    const playerNames = ensurePlayerNames(config, this.setup.playerNames);
    this.setup = { ...this.setup, config, playerNames };
    this.state = startGame(config, playerNames);
    this.handoffVisible = false;
    this.nextPlayerName = "";
    if (this.legalMoves.length === 0 && this.state.status === "playing") {
      this.state = {
        ...this.state,
        status: "lost",
        completedAt: Date.now(),
        lossReason: `${this.state.players[0]?.name ?? "The first player"} begins with no legal move.`
      };
    }
    saveSetup(this.userKey, this.setup);
    this.captureFinishedGame();
    this.persistActiveState();
    return true;
  }
  abandonActiveGame() {
    this.state = null;
    this.handoffVisible = false;
    this.nextPlayerName = "";
    clearActiveGame(this.userKey);
  }
  clearHistory() {
    this.history = [];
    clearHistory(this.userKey);
  }
  playableMovesForStack(stackId) {
    return this.legalMoves.filter((move) => move.stackId === stackId).sort((left, right) => {
      if (left.kind !== right.kind) {
        return left.kind === "reset" ? -1 : 1;
      }
      return left.card - right.card;
    });
  }
  captureFinishedGame() {
    if (!this.state || this.state.status === "playing") return;
    const summary = createSummary(this.state);
    const existing = this.history.findIndex((entry) => entry.id === summary.id);
    if (existing >= 0) {
      this.history[existing] = summary;
    } else {
      this.history = [summary, ...this.history];
    }
    saveHistory(this.userKey, this.history);
    clearActiveGame(this.userKey);
  }
  persistActiveState() {
    if (!this.state || this.state.status !== "playing") {
      clearActiveGame(this.userKey);
      return;
    }
    saveActiveGame(this.userKey, {
      setup: this.setup,
      state: this.state,
      handoffVisible: this.handoffVisible,
      nextPlayerName: this.nextPlayerName
    });
  }
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children, data } = $$props;
    const session = new GameSession("guest");
    setGameSession(session);
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
