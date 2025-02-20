import { MapState } from '../app/services/models';
import { MappedAdvancedTraits } from './traits/advanced-traits';
import { AdvancedTrait, Resource, Traits } from './traits/models';

export interface Entity {
    traits: {[T in Traits]?: MappedAdvancedTraits[T]};
    resourceTree: Record<Resource, AdvancedTrait[]>;
    zIndex: number
    name: string    
    init(ctx: TickContext): void
    check(ctx: TickContext): boolean
    onTick(ctx: TickContext): void;
    render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void
}

export class Coords {
    constructor(public x: number, public y: number) {}

    static from(hash: string) {
        const c = hash.split('-')
        return new Coords(Number(c[0]), Number(c[1]))
    }

    hash(): string {
        return `${this.x}-${this.y}`
    }
    
}



export type TickContext = {
    coords: Coords,
    state: MapState
}