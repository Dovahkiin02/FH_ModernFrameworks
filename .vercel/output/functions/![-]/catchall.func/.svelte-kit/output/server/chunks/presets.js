const DEFAULT_RESET_DISTANCE = 10;
function createStackTemplate(direction, index, overrides = {}) {
  const isAscending = direction === "up";
  return {
    id: overrides.id ?? `${direction}-${index}`,
    label: overrides.label ?? `${isAscending ? "Ascent" : "Descent"} ${index}`,
    direction,
    startValue: overrides.startValue ?? (isAscending ? 0 : 100),
    allowedResetDistances: overrides.allowedResetDistances ?? [DEFAULT_RESET_DISTANCE]
  };
}
function cloneConfig(config) {
  return {
    playerCount: config.playerCount,
    handSize: config.handSize,
    minCardsPerTurn: config.minCardsPerTurn,
    deckMin: config.deckMin,
    deckMax: config.deckMax,
    concealHandsBetweenTurns: config.concealHandsBetweenTurns,
    hintsEnabled: config.hintsEnabled,
    seed: config.seed ?? null,
    stackTemplates: config.stackTemplates.map((stack) => ({
      id: stack.id,
      label: stack.label,
      direction: stack.direction,
      startValue: stack.startValue,
      allowedResetDistances: [...stack.allowedResetDistances]
    }))
  };
}
function createPlayerNames(count) {
  return Array.from({ length: count }, (_, index) => `Player ${index + 1}`);
}
const PRESETS = [
  {
    id: "classic",
    name: "Classic Table",
    description: "Four central stacks, one-card turn minimum, and the standard 10-card jump back rule.",
    config: {
      playerCount: 4,
      handSize: 5,
      minCardsPerTurn: 1,
      deckMin: 1,
      deckMax: 99,
      stackTemplates: [
        createStackTemplate("up", 1, { startValue: 0 }),
        createStackTemplate("up", 2, { startValue: 0 }),
        createStackTemplate("down", 1, { startValue: 100 }),
        createStackTemplate("down", 2, { startValue: 100 })
      ],
      concealHandsBetweenTurns: true,
      hintsEnabled: true,
      seed: null
    }
  },
  {
    id: "double-jump",
    name: "Double Jump",
    description: "Adds a 20-card reset to create more comeback routes without changing the basic board.",
    config: {
      playerCount: 4,
      handSize: 5,
      minCardsPerTurn: 1,
      deckMin: 1,
      deckMax: 99,
      stackTemplates: [
        createStackTemplate("up", 1, { startValue: 0, allowedResetDistances: [10, 20] }),
        createStackTemplate("up", 2, { startValue: 0, allowedResetDistances: [10, 20] }),
        createStackTemplate("down", 1, { startValue: 100, allowedResetDistances: [10, 20] }),
        createStackTemplate("down", 2, { startValue: 100, allowedResetDistances: [10, 20] })
      ],
      concealHandsBetweenTurns: true,
      hintsEnabled: true,
      seed: null
    }
  },
  {
    id: "long-table",
    name: "Long Table",
    description: "Six players and six stacks for larger groups that still want quick, local sessions.",
    config: {
      playerCount: 6,
      handSize: 5,
      minCardsPerTurn: 1,
      deckMin: 1,
      deckMax: 120,
      stackTemplates: [
        createStackTemplate("up", 1, { startValue: 0 }),
        createStackTemplate("up", 2, { startValue: 0 }),
        createStackTemplate("up", 3, { startValue: 0 }),
        createStackTemplate("down", 1, { startValue: 121 }),
        createStackTemplate("down", 2, { startValue: 121 }),
        createStackTemplate("down", 3, { startValue: 121 })
      ],
      concealHandsBetweenTurns: true,
      hintsEnabled: true,
      seed: null
    }
  }
];
function getDefaultPreset() {
  return PRESETS[0];
}
function getPresetById(presetId) {
  return PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0];
}
export {
  PRESETS as P,
  createStackTemplate as a,
  createPlayerNames as b,
  cloneConfig as c,
  getDefaultPreset as d,
  getPresetById as g
};
