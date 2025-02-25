import { Entity, Coords, TickContext } from '../models';
import { BaseTrait, NullAction } from './abstract-base';
import { Traits, Resource, WeightedAction } from './models';

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
      const options = e.resourceProviders[this.resource].map((trait) => {
        return trait.act(e, ctx);
      });
      const bestOption = options.sort((a, b) => b.weight - a.weight)[0];
      if (!bestOption) {
        return NullAction;
      }

      return {
        weight: percentage * options[0].weight,
        action: options[0].action,
      };
    }
  }
}
