import { Coords, Entity, Resource, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { Traits } from './models';

// RegenerateTrait is a better name
export class GrowthTrait extends BaseTrait {
  override type = Traits.Growth;

  constructor(
    public resource: Resource,
    public max = 1,
    public result: { new (): Entity }
  ) {
    super();
  }

  override onTick(e: Entity, ctx: TickContext): void {
    const bestAct = this.bestAct(this.resource, e, ctx);
    bestAct?.action(e, ctx);
  }

  override check(e: Entity, ctx: TickContext) {
    if (e.resources[this.resource] > this.max) {
      return new this.result();
    }
    return e;
  }
}
