export type StackDirection = 'up' | 'down';
export type MoveKind = 'normal' | 'reset';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface StackTemplate {
	id: string;
	label: string;
	direction: StackDirection;
	startValue: number;
	allowedResetDistances: number[];
}

export interface GameConfig {
	playerCount: number;
	handSize: number;
	minCardsPerTurn: number;
	deckMin: number;
	deckMax: number;
	stackTemplates: StackTemplate[];
	concealHandsBetweenTurns: boolean;
	hintsEnabled: boolean;
	seed?: number | null;
}

export interface StackState extends StackTemplate {
	playedCards: number[];
	topCard: number;
}

export interface PlayerState {
	id: string;
	name: string;
	hand: number[];
}

export interface MoveRecord {
	id: string;
	playerId: string;
	playerName: string;
	stackId: string;
	stackLabel: string;
	card: number;
	kind: MoveKind;
	distance: number;
	previousTopCard: number;
	nextTopCard: number;
	turnNumber: number;
	createdAt: number;
}

export interface LegalMove {
	playerIndex: number;
	playerId: string;
	stackId: string;
	stackLabel: string;
	stackDirection: StackDirection;
	stackTopCard: number;
	card: number;
	kind: MoveKind;
	distance: number;
}

export interface GameState {
	config: GameConfig;
	players: PlayerState[];
	stacks: StackState[];
	drawPile: number[];
	currentPlayerIndex: number;
	movesThisTurn: number;
	turnNumber: number;
	status: GameStatus;
	history: MoveRecord[];
	startedAt: number;
	completedAt: number | null;
	lossReason: string | null;
}

export interface ValidationResult {
	valid: boolean;
	issues: string[];
}

export interface PresetDefinition {
	id: string;
	name: string;
	description: string;
	config: GameConfig;
}

export interface GameSetup {
	presetId: string;
	config: GameConfig;
	playerNames: string[];
}

export interface GameSummary {
	id: string;
	startedAt: number;
	completedAt: number;
	result: Extract<GameStatus, 'won' | 'lost'>;
	playerNames: string[];
	turnCount: number;
	moveCount: number;
	remainingCards: number;
	lossReason: string | null;
	config: GameConfig;
}

export interface SavedSessionSnapshot {
	setup: GameSetup;
	state: GameState | null;
	handoffVisible: boolean;
	nextPlayerName: string;
}
