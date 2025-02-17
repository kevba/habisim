import { Coords, Entity } from "./models";
import { LivingTrait, ReproducerTrait, Traits } from "./traits";

export abstract class BaseEntity implements Entity {
    abstract name: string;
    abstract render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void

    traits: Entity['traits'] = {};
    zIndex = 0;

    onTick(x: number, y: number, e: Entity): void {
        Object.values(this.traits).forEach(trait => {
            trait.onTick(x,y,e)
        });    
    }

}

export class DummyEntity extends BaseEntity {
    override traits = {  };
    override zIndex: number = 0;
    name = 'dummy'

    render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void {
        context.fillStyle = `black`
        context.font = `${scale}px Arial`
        // text renders from bottom to top, so 0,0 must be rendered on the 0,1 line
        context.fillText('*', coords.x * scale, (coords.y+1) * scale)
    }
} 

export class AnimalEntity extends BaseEntity {
    override zIndex: number = 0;
    name = 'animal'
    emoji = '\U1F610'

    render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void {
        context.fillStyle = `black`
        context.font = `${scale/1.5}px Arial`
        // text renders from bottom to top, so 0,0 must be rendered on the 0,1 line
        context.fillText(this.emoji, coords.x * scale, (coords.y+1) * scale)
    }
} 

export class FoxEntity extends AnimalEntity {
    override name = 'fox'
    override emoji = '🦊'
    override traits = { [Traits.Living]: new LivingTrait() };    
}

export class RabbitEntity extends AnimalEntity {
    override name = 'rabbit'
    override emoji = '🐰'
}


export class TerrainEntity extends BaseEntity {
    override zIndex: number = -1;
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
