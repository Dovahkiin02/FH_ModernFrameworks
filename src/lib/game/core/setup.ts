import { createPlayerNames } from './config';
import { createDeck, shuffleNumbers } from './random';
import { validateConfig, normalizeConfig } from './validation';
import type { GameConfig, GameState, PlayerState, StackState } from './types';

function sortHand(hand: number[]): number[] {
	return [...hand].sort((left, right) => left - right);
}

function drawInitialHand(drawPile: number[], handSize: number): { hand: number[]; drawPile: number[] } {
	const nextDrawPile = [...drawPile];
	const hand: number[] = [];

	while (hand.length < handSize && nextDrawPile.length > 0) {
		const card = nextDrawPile.shift();
		if (card !== undefined) hand.push(card);
	}

	return { hand: sortHand(hand), drawPile: nextDrawPile };
}

function createPlayers(config: GameConfig, providedNames: string[], drawPile: number[]): {
	players: PlayerState[];
	drawPile: number[];
} {
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

function createStacks(config: GameConfig): StackState[] {
	return config.stackTemplates.map((stack) => ({
		...stack,
		playedCards: [stack.startValue],
		topCard: stack.startValue
	}));
}

export function startGame(inputConfig: GameConfig, providedNames: string[] = []): GameState {
	const config = normalizeConfig(inputConfig);
	const validation = validateConfig(config);

	if (!validation.valid) {
		throw new Error(validation.issues.join(' '));
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
		status: 'playing',
		history: [],
		startedAt: now,
		completedAt: null,
		lossReason: null
	};
}
