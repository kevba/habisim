import { EntityAction } from '../actions';
import { Entity, TickContext } from '../models';

export interface Trait {
  type: Traits;
  onTick(e: Entity, ctx: TickContext): EntityAction;
}

export enum Traits {
  Living = 'living',
  Habitat = 'habitat',
  Reproducer = 'reproducer',
  Heterotroph = 'heterotroph',
  Energy = "energy",
  Immortal = "immortal",
  Photosynthesis = "photosynthesis",
  Locomotion = "locomotion",
}
