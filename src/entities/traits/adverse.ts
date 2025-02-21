import { MovementUtils } from '../../algorithms/movement';
import { Coords, Entity, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { Traits } from './models';

export class AdverseTrait extends BaseTrait {
  override type = Traits.Adverse;
  constructor(public adverseTo: string[] = [], public radius = 0) {
    super();
  }

  override check(e: Entity, ctx: TickContext) {
    for (let coord of MovementUtils.radius(ctx.coords, this.radius)) {
      if (this.isAdverse(e, ctx, ctx.coords)) {
        return null;
      }
    }
    return e;
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
