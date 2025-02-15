import { Coords, Entity } from "./models";

export class DummyEntity implements Entity {
    zIndex: number = 0;
    name = 'dummy'

    render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void {
        console.log(coords)
        context.fillStyle = `black`
        context.font = `${scale}px Arial`
        // text renders from bottom to top, so 0,0 must be rendered on the 0,1 line
        context.fillText('E', coords.x * scale, (coords.y+1) * scale)
    }
} 