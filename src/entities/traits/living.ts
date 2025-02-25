import { Entity, Coords, TickContext, Resource } from '../models';
import { BaseTrait, NullAction } from './abstract-base';
import { Traits, WeightedAction } from './models';

export class LivingTrait extends BaseTrait {
  type = Traits.Alive;

  constructor(
    private resource: Resource = Resource.Energy,
    private consumed = 10
  ) {
    super();
    this.needs = [resource];
  }

  override check(e: Entity, ctx: TickContext) {
    return e.resources[this.resource] > 0 ? e : null;
  }

  override onTick(e: Entity, ctx: TickContext) {
    e.resources[this.resource] -= this.consumed;
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords
  ): WeightedAction {
    const percentage =
      e.resources[this.resource] / e.resourceCaps[this.resource];

    if (percentage > 0.6) {
      return NullAction;
    } else {
      const bestOption = this.bestAct(this.resource, e, ctx);
      if (!bestOption) {
        return NullAction;
      }

      return {
        weight: Math.abs(1.6 - percentage) * bestOption.weight,
        action: bestOption.action,
      };
    }
  }
}
