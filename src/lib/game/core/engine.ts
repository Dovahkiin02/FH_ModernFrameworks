import { evaluateMove } from './rules';
import { getCurrentPlayer, getLegalMoves, getRemainingCards } from './selectors';
import type { GameState, MoveRecord, PlayerState, StackState } from './types';

function sortHand(hand: number[]): number[] {
	return [...hand].sort((left, right) => left - right);
}

function replaceAt<T>(items: T[], index: number, value: T): T[] {
	return items.map((item, currentIndex) => (currentIndex === index ? value : item));
}

function removeCard(hand: number[], card: number): number[] {
	const index = hand.indexOf(card);
	if (index < 0) return [...hand];

	return [...hand.slice(0, index), ...hand.slice(index + 1)];
}

function finishGame(state: GameState, result: 'won' | 'lost', reason: string | null = null): GameState {
	return {
		...state,
		status: result,
		lossReason: result === 'lost' ? reason : null,
		completedAt: state.completedAt ?? Date.now()
	};
}

function findNextActivePlayerIndex(players: PlayerState[], startIndex: number): number {
	for (let offset = 1; offset <= players.length; offset += 1) {
		const index = (startIndex + offset) % players.length;
		if (players[index].hand.length > 0) {
			return index;
		}
	}

	return startIndex;
}

function settleState(state: GameState): GameState {
	if (getRemainingCards(state) === 0) {
		return finishGame(state, 'won');
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
			'lost',
			`${currentPlayer.name} has no legal move before meeting the turn minimum.`
		);
	}

	return state;
}

function drawUpToHandSize(player: PlayerState, drawPile: number[], handSize: number): {
	player: PlayerState;
	drawPile: number[];
} {
	const nextDrawPile = [...drawPile];
	const hand = [...player.hand];

	while (hand.length < handSize && nextDrawPile.length > 0) {
		const card = nextDrawPile.shift();
		if (card !== undefined) hand.push(card);
	}

	return {
		player: {
			...player,
			hand: sortHand(hand)
		},
		drawPile: nextDrawPile
	};
}

export function canEndTurn(state: GameState): boolean {
	return state.movesThisTurn >= state.config.minCardsPerTurn;
}

export function playCard(state: GameState, move: { stackId: string; card: number }): GameState {
	if (state.status !== 'playing') {
		throw new Error('Cannot play a card after the game has finished.');
	}

	const player = getCurrentPlayer(state);
	if (!player.hand.includes(move.card)) {
		throw new Error(`Card ${move.card} is not in the current player's hand.`);
	}

	const stackIndex = state.stacks.findIndex((stack) => stack.id === move.stackId);
	if (stackIndex < 0) {
		throw new Error(`Unknown stack: ${move.stackId}`);
	}

	const stack = state.stacks[stackIndex];
	const evaluation = evaluateMove(stack, move.card);

	if (!evaluation.valid || !evaluation.kind) {
		throw new Error(`Card ${move.card} cannot be played on stack ${stack.label}.`);
	}

	const updatedPlayer: PlayerState = {
		...player,
		hand: sortHand(removeCard(player.hand, move.card))
	};

	const updatedStack: StackState = {
		...stack,
		topCard: move.card,
		playedCards: [...stack.playedCards, move.card]
	};

	const record: MoveRecord = {
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

	const nextState: GameState = {
		...state,
		players: replaceAt(state.players, state.currentPlayerIndex, updatedPlayer),
		stacks: replaceAt(state.stacks, stackIndex, updatedStack),
		movesThisTurn: state.movesThisTurn + 1,
		history: [...state.history, record]
	};

	return settleState(nextState);
}

export function endTurn(state: GameState): GameState {
	if (state.status !== 'playing') {
		throw new Error('Cannot end the turn after the game has finished.');
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

	const nextState: GameState = {
		...state,
		players,
		drawPile,
		currentPlayerIndex: nextPlayerIndex,
		movesThisTurn: 0,
		turnNumber: state.turnNumber + 1
	};

	return settleState(nextState);
}
