export interface PointerPosition {
	clientX: number;
	clientY: number;
}

export interface DragPointerState {
	x: number;
	y: number;
}

export interface PointerDragBindings {
	clearRejectedState: () => void;
	setDraggedCard: (card: number | null) => void;
	setDragPointer: (pointer: DragPointerState | null) => void;
	setHoveredStackId: (stackId: string | null) => void;
	findHoveredStackId: (clientX: number, clientY: number) => string | null;
	playDraggedCard: (stackId: string, card: number | null) => void;
}

export function beginPointerDrag(
	card: number,
	position: PointerPosition,
	bindings: PointerDragBindings
): void {
	bindings.clearRejectedState();
	bindings.setDraggedCard(card);
	bindings.setDragPointer({ x: position.clientX, y: position.clientY });
	bindings.setHoveredStackId(bindings.findHoveredStackId(position.clientX, position.clientY));
}

export function updatePointerDrag(position: PointerPosition, bindings: PointerDragBindings): void {
	bindings.setDragPointer({ x: position.clientX, y: position.clientY });
	bindings.setHoveredStackId(bindings.findHoveredStackId(position.clientX, position.clientY));
}

export function endPointerDrag(
	card: number | null,
	position: PointerPosition,
	bindings: PointerDragBindings
): void {
	const stackId = bindings.findHoveredStackId(position.clientX, position.clientY);

	if (stackId) {
		bindings.playDraggedCard(stackId, card);
	} else {
		bindings.setDraggedCard(null);
	}
}
