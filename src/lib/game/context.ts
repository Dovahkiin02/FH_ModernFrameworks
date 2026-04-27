import { createContext } from 'svelte';
import type { GameSession } from './session.svelte';

export const [getGameSession, setGameSession] = createContext<GameSession>();
