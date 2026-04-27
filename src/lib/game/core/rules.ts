import type { MoveKind, StackState } from './types';

export interface MoveEvaluation {
	valid: boolean;
	kind: MoveKind | null;
	distance: number;
}

export function evaluateMove(stack: StackState, card: number): MoveEvaluation {
	if (stack.direction === 'up') {
		if (card > stack.topCard) {
			return { valid: true, kind: 'normal', distance: card - stack.topCard };
		}

		const resetDistance = stack.topCard - card;
		if (stack.allowedResetDistances.includes(resetDistance)) {
			return { valid: true, kind: 'reset', distance: resetDistance };
		}
	}

	if (stack.direction === 'down') {
		if (card < stack.topCard) {
			return { valid: true, kind: 'normal', distance: stack.topCard - card };
		}

		const resetDistance = card - stack.topCard;
		if (stack.allowedResetDistances.includes(resetDistance)) {
			return { valid: true, kind: 'reset', distance: resetDistance };
		}
	}

	return { valid: false, kind: null, distance: 0 };
}
