import { Coords, Entity } from "./models";

export class DummyEntity implements Entity {
    zIndex: number = 0;
    name = 'dummy'

    render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void {
        context.fillStyle = `black`
        context.font = `${scale}px Arial`
        // text renders from bottom to top, so 0,0 must be rendered on the 0,1 line
        context.fillText('*', coords.x * scale, (coords.y+1) * scale)
    }
} 

export class AnimalEntity implements Entity {
    zIndex: number = 0;
    name = 'animal'
    emoji = '🦊'

    render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void {
        context.fillStyle = `black`
        context.font = `${scale}px Arial`
        // text renders from bottom to top, so 0,0 must be rendered on the 0,1 line
        context.fillText(this.emoji, coords.x * scale, (coords.y+1) * scale)
    }
} 

export class FoxEntity extends AnimalEntity {
    override name = 'fox'
    override emoji = '🦊'
}

export class RabbitEntity extends AnimalEntity {
    override name = 'rabbit'
    override emoji = '🐰'
}


export class TerrainEntity implements Entity {
    zIndex: number = -1;
    name = 'terrain_dummy'
    color = 'transparent'

    render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void {
        context.fillStyle = this.color
        context.fillRect(coords.x * scale, (coords.y) * scale, scale, scale)
    }
} 

export class GrassEntity extends TerrainEntity {
    override color = 'green'

}
export class WaterEntity extends TerrainEntity {
    override color = 'blue'
}
