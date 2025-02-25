import { MapState } from '../app/services/models';
import { MappedTraits } from './traits/traits';
import { Trait, Resource, Traits } from './traits/models';

export interface Entity {
  id: number;
  traits: { [T in Traits]?: MappedTraits[T] };

  resources: Record<Resource, number>;
  resourceCaps: Record<Resource, number>;
  resourceProviders: Record<Resource, Trait[]>;

  zIndex: number;
  name: string;

  init(): void;
  update(ctx: TickContext): Entity | null;
  onTick(ctx: TickContext): void;
  render(
    coords: Coords,
    scale: number,
    context: CanvasRenderingContext2D
  ): void;
}

export class Coords {
  constructor(public x: number, public y: number) {}

  static from(hash: string) {
    const c = hash.split('-');
    return new Coords(Number(c[0]), Number(c[1]));
  }

  hash(): string {
    return `${this.x}-${this.y}`;
  }
}

export type TickContext = {
  coords: Coords;
  state: MapState;
  updatedCoords?: Coords;
};
