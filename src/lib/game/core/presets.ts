import { cloneConfig, createStackTemplate } from './config';
import type { PresetDefinition } from './types';

export const PRESETS: PresetDefinition[] = [
	{
		id: 'classic',
		name: 'Classic Table',
		description: 'Four central stacks, one-card turn minimum, and the standard 10-card jump back rule.',
		config: {
			playerCount: 4,
			handSize: 5,
			minCardsPerTurn: 1,
			deckMin: 1,
			deckMax: 99,
			stackTemplates: [
				createStackTemplate('up', 1, { startValue: 0 }),
				createStackTemplate('up', 2, { startValue: 0 }),
				createStackTemplate('down', 1, { startValue: 100 }),
				createStackTemplate('down', 2, { startValue: 100 })
			],
			concealHandsBetweenTurns: true,
			hintsEnabled: true,
			seed: null
		}
	},
	{
		id: 'double-jump',
		name: 'Double Jump',
		description: 'Adds a 20-card reset to create more comeback routes without changing the basic board.',
		config: {
			playerCount: 4,
			handSize: 5,
			minCardsPerTurn: 1,
			deckMin: 1,
			deckMax: 99,
			stackTemplates: [
				createStackTemplate('up', 1, { startValue: 0, allowedResetDistances: [10, 20] }),
				createStackTemplate('up', 2, { startValue: 0, allowedResetDistances: [10, 20] }),
				createStackTemplate('down', 1, { startValue: 100, allowedResetDistances: [10, 20] }),
				createStackTemplate('down', 2, { startValue: 100, allowedResetDistances: [10, 20] })
			],
			concealHandsBetweenTurns: true,
			hintsEnabled: true,
			seed: null
		}
	},
	{
		id: 'long-table',
		name: 'Long Table',
		description: 'Six players and six stacks for larger groups that still want quick, local sessions.',
		config: {
			playerCount: 6,
			handSize: 5,
			minCardsPerTurn: 1,
			deckMin: 1,
			deckMax: 120,
			stackTemplates: [
				createStackTemplate('up', 1, { startValue: 0 }),
				createStackTemplate('up', 2, { startValue: 0 }),
				createStackTemplate('up', 3, { startValue: 0 }),
				createStackTemplate('down', 1, { startValue: 121 }),
				createStackTemplate('down', 2, { startValue: 121 }),
				createStackTemplate('down', 3, { startValue: 121 })
			],
			concealHandsBetweenTurns: true,
			hintsEnabled: true,
			seed: null
		}
	}
];

export function getDefaultPreset(): PresetDefinition {
	return PRESETS[0];
}

export function getPresetById(presetId: string): PresetDefinition {
	return PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0];
}

export function clonePresetConfig(presetId: string) {
	return cloneConfig(getPresetById(presetId).config);
}
