import { browser } from '$app/environment';
import { endTurn, playCard } from './core/engine';
import { cloneConfig, createPlayerNames, createStackTemplate } from './core/config';
import { getDefaultPreset, getPresetById } from './core/presets';
import { getCurrentPlayer, getLegalMoves, getProgressPercent, getRemainingCards, getSuggestedMoves } from './core/selectors';
import { startGame } from './core/setup';
import { normalizeConfig, validateConfig } from './core/validation';
import type { GameConfig, GameSetup, GameState, GameSummary, LegalMove, StackDirection } from './core/types';
import {
	clearActiveGame,
	clearHistory as clearSavedHistory,
	loadActiveGame,
	loadHistory,
	loadSetup,
	saveActiveGame,
	saveHistory,
	saveSetup
} from './persistence';

function createDefaultSetup(): GameSetup {
	const preset = getDefaultPreset();

	return {
		presetId: preset.id,
		config: cloneConfig(preset.config),
		playerNames: createPlayerNames(preset.config.playerCount)
	};
}

function createSummary(state: GameState): GameSummary {
	return {
		id: `summary-${state.startedAt}`,
		startedAt: state.startedAt,
		completedAt: state.completedAt ?? Date.now(),
		result: state.status === 'won' ? 'won' : 'lost',
		playerNames: state.players.map((player) => player.name),
		turnCount: state.turnNumber,
		moveCount: state.history.length,
		remainingCards: getRemainingCards(state),
		lossReason: state.lossReason,
		config: cloneConfig(state.config)
	};
}

function ensurePlayerNames(config: GameConfig, names: string[]): string[] {
	const fallback = createPlayerNames(config.playerCount);

	return Array.from({ length: config.playerCount }, (_, index) => names[index]?.trim() || fallback[index]);
}

export class GameSession {
	userKey: string;
	setup = $state<GameSetup>(createDefaultSetup());
	state = $state<GameState | null>(null);
	history = $state<GameSummary[]>([]);
	handoffVisible = $state(false);
	nextPlayerName = $state('');
	hydrated = $state(false);

	constructor(userKey: string) {
		this.userKey = userKey;
	}

	get validation() {
		return validateConfig(this.setup.config);
	}

	get currentPlayer() {
		return this.state ? getCurrentPlayer(this.state) : null;
	}

	get legalMoves(): LegalMove[] {
		return this.state ? getLegalMoves(this.state) : [];
	}

	get suggestedMoves(): LegalMove[] {
		return this.state ? getSuggestedMoves(this.state, 3) : [];
	}

	get progressPercent(): number {
		return this.state ? getProgressPercent(this.state) : 0;
	}

	get remainingCards(): number {
		return this.state ? getRemainingCards(this.state) : 0;
	}

	get canEndTurn(): boolean {
		return this.state ? this.state.movesThisTurn >= this.state.config.minCardsPerTurn : false;
	}

	get deckSize(): number {
		return this.setup.config.deckMax - this.setup.config.deckMin + 1;
	}

	get openingCards(): number {
		return this.setup.config.playerCount * this.setup.config.handSize;
	}

	get hasFinishedGame(): boolean {
		return this.state?.status === 'won' || this.state?.status === 'lost';
	}

	hydrate(): void {
		if (!browser || this.hydrated) return;

		const savedSetup = loadSetup(this.userKey);
		if (savedSetup) {
			this.setup = savedSetup;
		}

		this.history = loadHistory(this.userKey);

		const activeSnapshot = loadActiveGame(this.userKey);
		if (activeSnapshot) {
			this.setup = activeSnapshot.setup;
			this.state = activeSnapshot.state;
			this.handoffVisible = activeSnapshot.handoffVisible;
			this.nextPlayerName = activeSnapshot.nextPlayerName;
		}

		this.syncSetup(false);
		this.hydrated = true;
	}

	syncSetup(shouldPersist: boolean = true): void {
		const config = normalizeConfig(this.setup.config);
		const playerNames = ensurePlayerNames(config, this.setup.playerNames);

		this.setup = {
			...this.setup,
			config,
			playerNames
		};

		if (shouldPersist) {
			saveSetup(this.userKey, this.setup);
		}
	}

	selectPreset(presetId: string): void {
		const preset = getPresetById(presetId);

		this.setup = {
			presetId: preset.id,
			config: cloneConfig(preset.config),
			playerNames: createPlayerNames(preset.config.playerCount)
		};

		this.syncSetup();
	}

	setPlayerName(index: number, name: string): void {
		this.setup.playerNames[index] = name;
		saveSetup(this.userKey, this.setup);
	}

	addStack(direction: StackDirection): void {
		const nextIndex =
			this.setup.config.stackTemplates.filter((stack) => stack.direction === direction).length + 1;

		this.setup.config.stackTemplates.push(createStackTemplate(direction, nextIndex));
		this.syncSetup();
	}

	removeStack(index: number): void {
		if (this.setup.config.stackTemplates.length <= 2) return;

		this.setup.config.stackTemplates.splice(index, 1);
		this.syncSetup();
	}

	play(stackId: string, card: number): void {
		if (!this.state) return;

		this.state = playCard(this.state, { stackId, card });
		this.captureFinishedGame();
		this.persistActiveState();
	}

	endCurrentTurn(): void {
		if (!this.state) return;

		this.state = endTurn(this.state);

		if (this.state.status === 'playing' && this.state.config.concealHandsBetweenTurns) {
			this.handoffVisible = true;
			this.nextPlayerName = this.state.players[this.state.currentPlayerIndex]?.name ?? '';
		} else {
			this.handoffVisible = false;
			this.nextPlayerName = '';
		}

		this.captureFinishedGame();
		this.persistActiveState();
	}

	revealNextHand(): void {
		this.handoffVisible = false;
		this.nextPlayerName = '';
		this.persistActiveState();
	}

	start(): boolean {
		const validation = this.validation;
		if (!validation.valid) return false;

		const config = normalizeConfig(this.setup.config);
		const playerNames = ensurePlayerNames(config, this.setup.playerNames);

		this.setup = {
			...this.setup,
			config,
			playerNames
		};

		this.state = startGame(config, playerNames);
		this.handoffVisible = false;
		this.nextPlayerName = '';

		if (this.legalMoves.length === 0 && this.state.status === 'playing') {
			this.state = {
				...this.state,
				status: 'lost',
				completedAt: Date.now(),
				lossReason: `${this.state.players[0]?.name ?? 'The first player'} begins with no legal move.`
			};
		}

		saveSetup(this.userKey, this.setup);
		this.captureFinishedGame();
		this.persistActiveState();

		return true;
	}

	abandonActiveGame(): void {
		this.state = null;
		this.handoffVisible = false;
		this.nextPlayerName = '';
		clearActiveGame(this.userKey);
	}

	clearHistory(): void {
		this.history = [];
		clearSavedHistory(this.userKey);
	}

	playableMovesForStack(stackId: string): LegalMove[] {
		return this.legalMoves
			.filter((move) => move.stackId === stackId)
			.sort((left, right) => {
				if (left.kind !== right.kind) {
					return left.kind === 'reset' ? -1 : 1;
				}

				return left.card - right.card;
			});
	}

	private captureFinishedGame(): void {
		if (!this.state || this.state.status === 'playing') return;

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

	private persistActiveState(): void {
		if (!this.state || this.state.status !== 'playing') {
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
