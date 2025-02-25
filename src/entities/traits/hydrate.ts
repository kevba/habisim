import { MovementUtils } from '../../algorithms/movement';
import {
  Attribute,
  Coords,
  Entity,
  Resource,
  TickContext,
  Weight,
} from '../models';
import { BaseTrait } from './abstract-base';
import { Traits, WeightedAction } from './models';

export class HydrateTrait extends BaseTrait {
  override type = Traits.Hydrate;
  override provides: Resource | Attribute | null = Resource.Water;

  constructor(public radius: number = 0) {
    super();
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords | undefined
  ): WeightedAction {
    const waterTiles: Entity[] = [];

    for (let coord of MovementUtils.radius(ctx.coords, this.radius)) {
      const tiles = ctx.state.get(coord.hash()) || [];
      waterTiles.push(...tiles.filter((t) => e.name === 'water'));
    }
    if (waterTiles.length > 0) {
      return {
        weight: Weight.Great,
        action: () => {},
      };
    }

    return {
      weight: Weight.Neutral,
      action: () => {},
    };
  }

  // Currently entities die close to whatever they are adverse to, seems a bit extreme
  isGrowing(e: Entity, ctx: TickContext, coords: Coords): boolean {
    for (let coord of MovementUtils.radius(ctx.coords, this.radius)) {
      if (this.isGrowing(e, ctx, coord)) {
        return true;
      }
    }
    return false;
  }
}
