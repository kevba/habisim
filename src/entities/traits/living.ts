import { Entity, Coords, TickContext } from '../models';
import { BaseTrait, NullAction } from './abstract-base';
import { Traits, Resource, WeightedAction } from './models';

export class LivingTrait extends BaseTrait {
  type = Traits.Alive;

  constructor(
    private _energy: number = 20,
    private energyPerTick = 10,
    private energyCap = 100
  ) {
    super();
  }

  override check(e: Entity, ctx: TickContext) {
    return this.energy > 0 ? e : null;
  }

  override onTick(e: Entity, ctx: TickContext) {
    this.add(-this.energyPerTick);
  }

  override needs = [Resource.Energy];

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords
  ): WeightedAction {
    const energyPercent = this.energy / this.energyCap;

    if (energyPercent > 0.6) {
      return NullAction;
    } else {
      const options = e.resourceTree[Resource.Energy].map((trait) => {
        return trait.act(e, ctx);
      });
      const bestOption = options.sort((a, b) => b.weight - a.weight)[0];
      if (!bestOption) {
        return NullAction;
      }

      return {
        weight: energyPercent * options[0].weight,
        action: options[0].action,
      };
    }
  }

  get energy() {
    return this._energy;
  }
  add(e: number) {
    this._energy += e;
    if (this._energy > this.energyCap) {
      this._energy = this.energyCap;
    }
  }
}
