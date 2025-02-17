import { Entity, EntityStateAction, TickContext } from '../models';
import { HabitatTrait, LivingTrait, ReproducerTrait } from './traits';

export interface Trait {
  type: Traits;
  onTick(e: Entity, ctx: TickContext): EntityStateAction;
}

export enum Traits {
  Living = 'living',
  Habitat = 'habitat',
  Reproducer = 'reproducer',
}
