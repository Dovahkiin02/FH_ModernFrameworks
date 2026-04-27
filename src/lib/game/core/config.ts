import type { GameConfig, StackDirection, StackTemplate } from './types';

export const DEFAULT_RESET_DISTANCE = 10;

export function createStackTemplate(
	direction: StackDirection,
	index: number,
	overrides: Partial<StackTemplate> = {}
): StackTemplate {
	const isAscending = direction === 'up';

	return {
		id: overrides.id ?? `${direction}-${index}`,
		label: overrides.label ?? `${isAscending ? 'Ascent' : 'Descent'} ${index}`,
		direction,
		startValue: overrides.startValue ?? (isAscending ? 0 : 100),
		allowedResetDistances: overrides.allowedResetDistances ?? [DEFAULT_RESET_DISTANCE]
	};
}

export function cloneConfig(config: GameConfig): GameConfig {
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

export function createPlayerNames(count: number): string[] {
	return Array.from({ length: count }, (_, index) => `Player ${index + 1}`);
}
