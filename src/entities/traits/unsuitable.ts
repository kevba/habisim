import { MovementUtils } from '../../algorithms/movement';
import { Attribute, Coords, Entity, Resource, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { AdverseTrait } from './adverse';
import { Traits, WeightedAction } from './models';

export class UnsuitableTrait extends BaseTrait {
  override type = Traits.Unsuitable;
  override provides: Resource | Attribute | null = Attribute.Habitat;
  // IF the tile is not unsuitable, the score is at least 0.3

  constructor(public unsuitable: string[] = []) {
    super();
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords | undefined
  ): WeightedAction {
    return {
      weight: this.isUnsuitable(e, ctx, destination || ctx.coords) ? 0 : 1,
      action: () => {},
    };
  }

  override check(e: Entity, ctx: TickContext) {
    if (this.isUnsuitable(e, ctx, ctx.coords)) {
      return null;
    }
    return e;
  }

  // Currently entities die close to whatever they are adverse to, seems a bit extreme
  isUnsuitable(e: Entity, ctx: TickContext, coords: Coords): boolean {
    const entities = ctx.state.get(coords.hash()) || [];
    for (const e of entities) {
      if (this.unsuitable.includes(e.name)) {
        return true;
      }
    }
    return false;
  }
}
