import { Entity, EntityStateAction, TickContext } from '../models';
import { Traits, Trait } from './models';


export type MappedTraits = {
  [Traits.Living]: LivingTrait;
  [Traits.Reproducer]: ReproducerTrait;
  [Traits.Habitat]: HabitatTrait;
};

export class HabitatTrait implements Trait {
  type = Traits.Habitat;

  // TODO typing for different types of terrain
  constructor(public habitat: string) {}

  onTick(e: Entity, ctx: TickContext): EntityStateAction {
    const entities = ctx.state.get(ctx.coords.hash()) || []
    for (const e of entities) {
      if (e.name === this.habitat) {
        return EntityStateAction.Continue 
      }
    }
    return EntityStateAction.Remove
  }; 
}

export class LivingTrait implements Trait {
  type = Traits.Living;

  constructor(public maxAge: number, public age: number = 0) {}


  onTick(e: Entity, ctx: TickContext): EntityStateAction {
    this.age++
    if (this.age > this.maxAge) {
      return EntityStateAction.Remove
    }
    return EntityStateAction.Continue
  }; 

}

export class ReproducerTrait implements Trait {
  type = Traits.Reproducer;

  constructor(
    public offspringCount: number = 0,
    // there has to be a better word then cooldown
    public cooldown: number = 0,
    public minAge: number = 0
  ) {}
  
  reproduce(x: number, y: number, e: Entity) {
    if (!e.traits.living) {
      return;
    }
    // Find another entity nearby.
    // Reproduce conditons per entity
  }

  onTick(e: Entity, ctx: TickContext): EntityStateAction {
    return EntityStateAction.Continue
  }; 
}
