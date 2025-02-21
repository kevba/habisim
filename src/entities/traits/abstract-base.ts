import { Entity, TickContext, Coords } from '../models';
import { AdvancedTrait, Resource, Traits, WeightedAction } from './models';

export abstract class BaseTrait implements AdvancedTrait {
  abstract type: Traits;
  provides: Resource | null = null;
  needs: Resource[] = [];
  init(e: Entity): void {}
  onTick(e: Entity, ctx: TickContext): void {}
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
}

export const NullAction = {
  weight: 0,
  action: () => {},
};
