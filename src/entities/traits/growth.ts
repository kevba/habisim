import { MovementUtils } from '../../algorithms/movement';
import { Coords, Entity, Resource, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { Traits } from './models';

export class GrowthTrait extends BaseTrait {
  override type = Traits.Growth;
  private counter = 0;

  constructor(
    public resource: Resource,
    public max = 1,
    public increase = 1,
    public result: Entity | null = null
  ) {
    super();
    this.needs = [resource];
  }

  override onTick(e: Entity, ctx: TickContext): void {
    const habitatModifier = this.bestAct(this.resource, e, ctx);
    this.counter += this.increase * (habitatModifier?.weight || 0);
  }

  override check(e: Entity, ctx: TickContext) {
    if (this.counter > this.max) {
      return this.result;
    }
    return e;
  }
}
