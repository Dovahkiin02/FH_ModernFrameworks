import { cloneConfig, createStackTemplate } from './config';
import type { GameConfig, StackTemplate, ValidationResult } from './types';

function toInteger(value: number, fallback: number, minimum?: number, maximum?: number): number {
	let normalized = Number.isFinite(value) ? Math.trunc(value) : fallback;

	if (minimum !== undefined) normalized = Math.max(normalized, minimum);
	if (maximum !== undefined) normalized = Math.min(normalized, maximum);

	return normalized;
}

function normalizeDistances(distances: number[]): number[] {
	return Array.from(
		new Set(
			distances
				.map((distance) => toInteger(distance, 0, 1))
				.filter((distance) => distance > 0)
				.sort((left, right) => left - right)
		)
	);
}

function normalizeStackTemplates(stackTemplates: StackTemplate[]): StackTemplate[] {
	const fallback =
		stackTemplates.length > 0
			? stackTemplates
			: [
					createStackTemplate('up', 1),
					createStackTemplate('up', 2),
					createStackTemplate('down', 1),
					createStackTemplate('down', 2)
				];

	const seenIds = new Set<string>();

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

export function normalizeConfig(input: GameConfig): GameConfig {
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

export function validateConfig(input: GameConfig): ValidationResult {
	const config = normalizeConfig(input);
	const issues: string[] = [];
	const deckSize = config.deckMax - config.deckMin + 1;

	if (config.deckMin >= config.deckMax) {
		issues.push('The deck range must contain at least two different card values.');
	}

	if (deckSize < config.playerCount * config.handSize) {
		issues.push('The deck is too small to deal the opening hands for all players.');
	}

	if (config.minCardsPerTurn > config.handSize) {
		issues.push('The minimum cards per turn cannot exceed the target hand size.');
	}

	if (config.stackTemplates.length < 2) {
		issues.push('Use at least two middle stacks so the board creates meaningful choices.');
	}

	const ascendingCount = config.stackTemplates.filter((stack) => stack.direction === 'up').length;
	const descendingCount = config.stackTemplates.length - ascendingCount;

	if (ascendingCount === 0 || descendingCount === 0) {
		issues.push('Use at least one ascending and one descending stack.');
	}

	const invalidDistances = config.stackTemplates.some((stack) =>
		stack.allowedResetDistances.some((distance) => distance <= 0)
	);

	if (invalidDistances) {
		issues.push('Reset distances must be positive integers.');
	}

	return {
		valid: issues.length === 0,
		issues
	};
}
