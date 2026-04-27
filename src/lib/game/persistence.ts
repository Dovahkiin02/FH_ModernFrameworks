import { browser } from '$app/environment';
import type { GameSetup, GameSummary, SavedSessionSnapshot } from './core/types';

const STORAGE_NAMESPACE = 'the-game';
const HISTORY_LIMIT = 12;

function buildKey(userKey: string, suffix: string): string {
	return `${STORAGE_NAMESPACE}:${userKey}:${suffix}`;
}

function readJson<T>(key: string, fallback: T): T {
	if (!browser) return fallback;

	try {
		const value = localStorage.getItem(key);
		return value ? (JSON.parse(value) as T) : fallback;
	} catch {
		return fallback;
	}
}

function writeJson(key: string, value: unknown): void {
	if (!browser) return;

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Ignore storage failures so gameplay remains functional.
	}
}

function removeValue(key: string): void {
	if (!browser) return;

	try {
		localStorage.removeItem(key);
	} catch {
		// Ignore storage failures so gameplay remains functional.
	}
}

export function loadSetup(userKey: string): GameSetup | null {
	return readJson<GameSetup | null>(buildKey(userKey, 'setup'), null);
}

export function saveSetup(userKey: string, setup: GameSetup): void {
	writeJson(buildKey(userKey, 'setup'), setup);
}

export function loadHistory(userKey: string): GameSummary[] {
	return readJson<GameSummary[]>(buildKey(userKey, 'history'), []);
}

export function saveHistory(userKey: string, history: GameSummary[]): void {
	writeJson(buildKey(userKey, 'history'), history.slice(0, HISTORY_LIMIT));
}

export function clearHistory(userKey: string): void {
	removeValue(buildKey(userKey, 'history'));
}

export function loadActiveGame(userKey: string): SavedSessionSnapshot | null {
	return readJson<SavedSessionSnapshot | null>(buildKey(userKey, 'active'), null);
}

export function saveActiveGame(userKey: string, snapshot: SavedSessionSnapshot): void {
	writeJson(buildKey(userKey, 'active'), snapshot);
}

export function clearActiveGame(userKey: string): void {
	removeValue(buildKey(userKey, 'active'));
}
