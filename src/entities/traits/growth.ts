import { MovementUtils } from '../../algorithms/movement';
import { Coords, Entity, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { AdverseTrait } from './adverse';
import { Resource, Traits } from './models';

export class GrowthTrait extends BaseTrait {
  override type = Traits.Growth;
  private counter = 0;

  constructor(
    public resource: Resource,
    public max = 1,
    public radius: number = 0,
    public result: Entity | null = null
  ) {
    super();
    this.needs = [resource];
  }

  override onTick(e: Entity, ctx: TickContext): void {
    for (let coord of MovementUtils.radius(ctx.coords, this.radius)) {
      if (this.isGrowing(e, ctx, coord)) {
        if (this.counter < this.max) this.counter++;
      }
    }
  }

  override check(e: Entity, ctx: TickContext) {
    if (this.counter > this.max) {
      return this.result;
    }
    return e;
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
