import { describe, expect, it, vi } from 'vitest';
import {
	beginPointerDrag,
	endPointerDrag,
	updatePointerDrag,
	type DragPointerState,
	type PointerDragBindings
} from '../../src/lib/game/pointer-drag';

function createBindings(findHoveredStackId: (clientX: number, clientY: number) => string | null) {
	const state: {
		draggedCard: number | null;
		dragPointer: DragPointerState | null;
		hoveredStackId: string | null;
	} = {
		draggedCard: null,
		dragPointer: null,
		hoveredStackId: null
	};

	const playDraggedCard = vi.fn();
	const clearRejectedState = vi.fn();

	const bindings: PointerDragBindings = {
		clearRejectedState,
		setDraggedCard: (card) => {
			state.draggedCard = card;
		},
		setDragPointer: (pointer) => {
			state.dragPointer = pointer;
		},
		setHoveredStackId: (stackId) => {
			state.hoveredStackId = stackId;
		},
		findHoveredStackId,
		playDraggedCard
	};

	return { bindings, state, playDraggedCard, clearRejectedState };
}

describe('pointer drag controller', () => {
	it('plays the dragged card on pointer release when the pointer ends over a legal stack', () => {
		const { bindings, state, playDraggedCard, clearRejectedState } = createBindings((clientX) =>
			clientX >= 80 ? 'up-a' : null
		);

		beginPointerDrag(20, { clientX: 10, clientY: 10 }, bindings);
		updatePointerDrag({ clientX: 120, clientY: 40 }, bindings);
		endPointerDrag(state.draggedCard, { clientX: 120, clientY: 40 }, bindings);

		expect(clearRejectedState).toHaveBeenCalledTimes(1);
		expect(state.dragPointer).toEqual({ x: 120, y: 40 });
		expect(state.hoveredStackId).toBe('up-a');
		expect(playDraggedCard).toHaveBeenCalledTimes(1);
		expect(playDraggedCard).toHaveBeenCalledWith('up-a', 20);
	});

	it('clears the dragged card when the drop finishes outside a legal stack', () => {
		const { bindings, state, playDraggedCard } = createBindings(() => null);

		beginPointerDrag(20, { clientX: 10, clientY: 10 }, bindings);
		updatePointerDrag({ clientX: 40, clientY: 40 }, bindings);
		endPointerDrag(state.draggedCard, { clientX: 40, clientY: 40 }, bindings);

		expect(playDraggedCard).not.toHaveBeenCalled();
		expect(state.draggedCard).toBeNull();
		expect(state.dragPointer).toEqual({ x: 40, y: 40 });
		expect(state.hoveredStackId).toBeNull();
	});
});
