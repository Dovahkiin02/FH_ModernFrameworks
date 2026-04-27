export function createDeck(deckMin: number, deckMax: number): number[] {
	return Array.from({ length: deckMax - deckMin + 1 }, (_, index) => deckMin + index);
}

function mulberry32(seed: number): () => number {
	let state = seed >>> 0;

	return () => {
		state += 0x6d2b79f5;
		let value = Math.imul(state ^ (state >>> 15), state | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

export function shuffleNumbers(numbers: number[], seed?: number | null): number[] {
	const random = seed === null || seed === undefined ? Math.random : mulberry32(seed);
	const shuffled = [...numbers];

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}

	return shuffled;
}
