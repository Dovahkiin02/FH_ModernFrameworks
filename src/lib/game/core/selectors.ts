import { evaluateMove } from './rules';
import type { GameState, LegalMove, PlayerState, StackState } from './types';

export function getCurrentPlayer(state: GameState): PlayerState {
	return state.players[state.currentPlayerIndex];
}

export function getStackById(state: GameState, stackId: string): StackState | undefined {
	return state.stacks.find((stack) => stack.id === stackId);
}

export function getDeckSize(state: GameState): number {
	return state.config.deckMax - state.config.deckMin + 1;
}

export function getRemainingCards(state: GameState): number {
	return state.drawPile.length + state.players.reduce((sum, player) => sum + player.hand.length, 0);
}

export function getProgressPercent(state: GameState): number {
	const totalCards = getDeckSize(state);

	if (totalCards <= 0) return 0;

	return Math.round((state.history.length / totalCards) * 100);
}

export function getLegalMoves(
	state: GameState,
	playerIndex: number = state.currentPlayerIndex
): LegalMove[] {
	const player = state.players[playerIndex];
	if (!player) return [];

	const moves: LegalMove[] = [];

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

function getMoveScore(move: LegalMove): number {
	if (move.kind === 'reset') {
		return -1000 + move.distance;
	}

	return move.distance;
}

export function getSuggestedMoves(state: GameState, limit: number = 3): LegalMove[] {
	return getLegalMoves(state)
		.sort((left, right) => getMoveScore(left) - getMoveScore(right))
		.slice(0, limit);
}
