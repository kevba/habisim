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

export class AdverseTrait extends BaseTrait {
  override provides: Resource | Attribute | null = Attribute.Habitat;

  override type = Traits.Adverse;
  constructor(public adverseTo: string[] = []) {
    super();
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords | undefined
  ): WeightedAction {
    return {
      weight: this.isAdverse(e, ctx, destination || ctx.coords)
        ? Weight.Bad
        : Weight.Neutral,
      action: () => {},
    };
  }

  // Currently entities die close to whatever they are adverse to, seems a bit extreme
  isAdverse(e: Entity, ctx: TickContext, coords: Coords): boolean {
    const entities = ctx.state.get(coords.hash()) || [];
    for (const e of entities) {
      if (this.adverseTo.includes(e.name)) {
        return true;
      }
    }
    return false;
  }
}
