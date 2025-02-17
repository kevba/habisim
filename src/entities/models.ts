import { MapState } from '../app/services/models';
import { SimStateService } from '../app/services/sim-state.service';
import { Traits } from './traits/models';
import { MappedTraits } from './traits/traits';

export interface Entity {
    traits: {[T in Traits]?: MappedTraits[T]};

    zIndex: number
    name: string

    render(coords: Coords, scale: number, context: CanvasRenderingContext2D): void
    onTick(e: Entity, ctx: TickContext): EntityStateAction;
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

// TODO: maybe use a mapped object type to enable more advaced responses
export enum EntityStateAction {
    Remove = 'remove',
    Continue = 'continue'
}

export type TickContext = {
    coords: Coords,
    state: MapState
}