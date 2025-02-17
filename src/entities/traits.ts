import { Entity } from './models';

export interface Trait {
  type: Traits;
  onTick(x: number, y: number, e: Entity): void;
}

export enum Traits {
  Living = 'living',
  Reproducer = 'reproducer',
}

export type MappedTraits = {
  [Traits.Living]: LivingTrait;
  [Traits.Reproducer]: ReproducerTrait;
};

export class LivingTrait implements Trait {
  type = Traits.Living;

  constructor(public age: number = 0, public maxAge: number = 0) {}

  reproduce() {
    // Reproduce conditons per entity
  }

  onTick(x: number, y: number, e: Entity) {
    this.age++;
  }
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

  onTick(x: number, y: number, e: Entity) {}
}
