import { MovementUtils } from '../../algorithms/movement';
import { Coords, Entity, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { AdverseTrait } from './adverse';
import { Traits } from './models';

export class UnsuitableTrait extends BaseTrait {
  override type = Traits.Unsuitable;

  private adverse = new AdverseTrait();

  override init(e: Entity) {
    const adverse = e.traits[Traits.Adverse];
    if (adverse) this.adverse = adverse;

    this.adverse.adverseTo.push(...this.unsuitable);
  }

  constructor(public unsuitable: string[] = [], public radius = 0) {
    super();
  }

  override check(e: Entity, ctx: TickContext) {
    for (let coord of MovementUtils.radius(ctx.coords, this.radius)) {
      if (this.isUnsuitable(e, ctx, coord)) {
        return null;
      }
    }
    return e;
  }

  // Currently entities die close to whatever they are adverse to, seems a bit extreme
  isUnsuitable(e: Entity, ctx: TickContext, coords: Coords): boolean {
    const entities = ctx.state.get(coords.hash()) || [];
    for (const e of entities) {
      if (this.unsuitable.includes(e.name)) {
        return true;
      }
    }
    return false;
  }
}
