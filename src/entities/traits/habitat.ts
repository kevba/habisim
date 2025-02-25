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

// Habitat averse and unsuitable are the same trait except the weight.
export class HabitatTrait extends BaseTrait {
  override provides: Resource | Attribute | null = Attribute.Habitat;

  override type = Traits.Habitat;
  constructor(public habitat: string[] = []) {
    super();
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords | undefined
  ): WeightedAction {
    if (this.validHabitat(e, ctx, destination || ctx.coords)) {
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

  validHabitat(e: Entity, ctx: TickContext, coords: Coords): boolean {
    const entities = ctx.state.get(coords.hash()) || [];
    for (const e of entities) {
      if (this.habitat.includes(e.name)) {
        return true;
      }
    }
    return false;
  }
}
