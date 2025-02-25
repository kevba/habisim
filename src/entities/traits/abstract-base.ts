import { Entity, TickContext, Coords, Resource, Attribute } from '../models';
import { Trait, Traits, WeightedAction } from './models';

export abstract class BaseTrait implements Trait {
  abstract type: Traits;
  provides: Resource | Attribute | null = null;
  needs: Resource[] = [];
  init(e: Entity): void {}
  onTick(e: Entity, ctx: TickContext) {}
  act(e: Entity, ctx: TickContext, destination?: Coords): WeightedAction {
    return {
      weight: -1,
      action: (e, ctx) => this.action(e, ctx),
    };
  }
  check(e: Entity, ctx: TickContext): Entity | null {
    return e;
  }
  action(e: Entity, ctx: TickContext) {}

  bestAct(
    provider: Attribute | Resource,
    e: Entity,
    ctx: TickContext,
    destination?: Coords
  ): WeightedAction | null {
    // This seems fairly generic, most traits want to check some other Attribute and get the best one
    return (
      e.providers[provider]
        .map((h) => h.act(e, ctx, destination))
        .sort((a, b) => b.weight - a.weight)[0] || null
    );
  }
}

export const NullAction = {
  weight: 0,
  action: () => {},
};
