import { Entity, Resource, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { Traits } from './models';

export class WitherTrait extends BaseTrait {
  override type = Traits.Wither;

  constructor(
    public resource: Resource,
    public min = 1,
    public decrease = 1,
    public result: { new (): Entity }
  ) {
    super();
    this.needs = [resource];
  }

  override onTick(e: Entity, ctx: TickContext): void {
    e.resources[this.resource] -= this.decrease;
  }

  override check(e: Entity, ctx: TickContext) {
    if (e.resources[this.resource] < this.min) {
      return new this.result();
    }
    return e;
  }
}
