import { Coords, Entity, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { Traits } from './models';

export class HabitatTrait extends BaseTrait {
  override type = Traits.Habitat;
  constructor(public habitats: string[] = []) {
    super();
  }

  validHabitat(e: Entity, ctx: TickContext, coords: Coords): boolean {
    const entities = ctx.state.get(coords.hash()) || [];
    for (const e of entities) {
      if (this.habitats.includes(e.name)) {
        return true;
      }
    }
    return false;
  }
}
