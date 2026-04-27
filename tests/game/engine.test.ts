import { describe, expect, it } from 'vitest';
import { endTurn, playCard } from '../../src/lib/game/core/engine';
import { getLegalMoves } from '../../src/lib/game/core/selectors';
import { validateConfig } from '../../src/lib/game/core/validation';
import type { GameConfig, GameState, StackState } from '../../src/lib/game/core/types';

function buildStack(
	id: string,
	direction: 'up' | 'down',
	topCard: number,
	startValue: number,
	allowedResetDistances: number[] = [10]
): StackState {
	return {
		id,
		label: id,
		direction,
		startValue,
		allowedResetDistances,
		playedCards: [startValue, topCard],
		topCard
	};
}

function buildConfig(overrides: Partial<GameConfig> = {}): GameConfig {
	return {
		playerCount: 2,
		handSize: 2,
		minCardsPerTurn: 1,
		deckMin: 1,
		deckMax: 20,
		stackTemplates: [
			{ id: 'up-a', label: 'Up A', direction: 'up', startValue: 0, allowedResetDistances: [10] },
			{
				id: 'down-a',
				label: 'Down A',
				direction: 'down',
				startValue: 21,
				allowedResetDistances: [10]
			}
		],
		concealHandsBetweenTurns: true,
		hintsEnabled: true,
		seed: null,
		...overrides
	};
}

function buildState(overrides: Partial<GameState> = {}): GameState {
	const config = overrides.config ?? buildConfig();

	return {
		config,
		players: overrides.players ?? [
			{ id: 'player-1', name: 'Ada', hand: [12, 18] },
			{ id: 'player-2', name: 'Lin', hand: [9, 14] }
		],
		stacks: overrides.stacks ?? [
			buildStack('up-a', 'up', 22, 0),
			buildStack('down-a', 'down', 19, 21)
		],
		drawPile: overrides.drawPile ?? [],
		currentPlayerIndex: overrides.currentPlayerIndex ?? 0,
		movesThisTurn: overrides.movesThisTurn ?? 0,
		turnNumber: overrides.turnNumber ?? 1,
		status: overrides.status ?? 'playing',
		history: overrides.history ?? [],
		startedAt: overrides.startedAt ?? 1,
		completedAt: overrides.completedAt ?? null,
		lossReason: overrides.lossReason ?? null
	};
}

describe('theGame engine', () => {
	it('exposes reset moves when the distance matches the configured rule', () => {
		const state = buildState({
			players: [
				{ id: 'player-1', name: 'Ada', hand: [12] },
				{ id: 'player-2', name: 'Lin', hand: [14] }
			],
			stacks: [buildStack('up-a', 'up', 22, 0)]
		});

		const moves = getLegalMoves(state);

		expect(moves).toHaveLength(1);
		expect(moves[0]).toMatchObject({
			card: 12,
			kind: 'reset',
			distance: 10,
			stackId: 'up-a'
		});
	});

	it('wins immediately when the final remaining card is played', () => {
		const state = buildState({
			players: [
				{ id: 'player-1', name: 'Ada', hand: [12] },
				{ id: 'player-2', name: 'Lin', hand: [] }
			],
			stacks: [buildStack('up-a', 'up', 22, 0)],
			drawPile: []
		});

		const nextState = playCard(state, { stackId: 'up-a', card: 12 });

		expect(nextState.status).toBe('won');
		expect(nextState.players[0].hand).toEqual([]);
		expect(nextState.history.at(-1)).toMatchObject({
			card: 12,
			kind: 'reset',
			previousTopCard: 22,
			nextTopCard: 12
		});
	});

	it('refills the current player hand and rotates to the next player at end of turn', () => {
		const state = buildState({
			players: [
				{ id: 'player-1', name: 'Ada', hand: [5] },
				{ id: 'player-2', name: 'Lin', hand: [95] }
			],
			stacks: [buildStack('up-a', 'up', 90, 0), buildStack('down-a', 'down', 100, 110)],
			drawPile: [6, 7],
			movesThisTurn: 1
		});

		const nextState = endTurn(state);

		expect(nextState.status).toBe('playing');
		expect(nextState.currentPlayerIndex).toBe(1);
		expect(nextState.players[0].hand).toEqual([5, 6]);
		expect(nextState.drawPile).toEqual([7]);
		expect(nextState.turnNumber).toBe(2);
	});

	it('loses after ending the turn if the next player has no legal move', () => {
		const state = buildState({
			players: [
				{ id: 'player-1', name: 'Ada', hand: [5] },
				{ id: 'player-2', name: 'Lin', hand: [50] }
			],
			stacks: [buildStack('up-a', 'up', 90, 0), buildStack('down-a', 'down', 10, 110)],
			drawPile: [6],
			movesThisTurn: 1
		});

		const nextState = endTurn(state);

		expect(nextState.status).toBe('lost');
		expect(nextState.currentPlayerIndex).toBe(1);
		expect(nextState.lossReason).toContain('Lin');
	});

	it('skips players with empty hands when rotating the turn', () => {
		const state = buildState({
			players: [
				{ id: 'player-1', name: 'Ada', hand: [5] },
				{ id: 'player-2', name: 'Lin', hand: [] },
				{ id: 'player-3', name: 'Mo', hand: [95] }
			],
			config: buildConfig({ playerCount: 3 }),
			stacks: [buildStack('up-a', 'up', 90, 0), buildStack('down-a', 'down', 100, 110)],
			drawPile: [],
			movesThisTurn: 1
		});

		const nextState = endTurn(state);

		expect(nextState.status).toBe('playing');
		expect(nextState.currentPlayerIndex).toBe(2);
		expect(nextState.players[1].hand).toEqual([]);
	});

	it('rejects invalid configurations before a run starts', () => {
		const validation = validateConfig(
			buildConfig({
				deckMin: 10,
				deckMax: 11,
				playerCount: 3,
				handSize: 2,
				stackTemplates: [{ id: 'only-up', label: 'Only Up', direction: 'up', startValue: 0, allowedResetDistances: [10] }]
			})
		);

		expect(validation.valid).toBe(false);
		expect(validation.issues).toContain('The deck is too small to deal the opening hands for all players.');
		expect(validation.issues).toContain('Use at least one ascending and one descending stack.');
	});
});
