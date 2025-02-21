import { EntityAction } from '../actions';
import { Coords, Entity, TickContext } from '../models';

// Deprecated
export interface Trait {
  type: Traits;
  onTick(e: Entity, ctx: TickContext): EntityAction;
}

export interface AdvancedTrait {
  type: Traits;

  provides: Resource | null;
  needs: Resource[];

  // used to run initial setup for an entity. Mainly needed for interactions between traits
  init(e: Entity, ctx: TickContext): void;

  // called every tick. Used for increasing/decreasing values
  onTick(e: Entity, ctx: TickContext): void;

  // Not a fan of passing coords just for movement actions...
  act(e: Entity, ctx: TickContext, destination?: Coords): WeightedAction;

  // check the state of the entity after all onTicks have been executed.
  // this can be used to remove an entity if certain thresholds ahve been met after execution.
  check(e: Entity, ctx: TickContext): Entity | null;

  // Calculated value for this behavoir
  action: TraitAction;

  // some way to build the tree
  // root -> goal/need (eg aquire energy?, reproduce?)
  //    root does not have a need
  //    pick the root action with highest return
  //    can apply a bias/weight per entity to insentivice some behaviors
  // branch -> returns goal/need value | count of how much + an action to aquire if needed
  //    recursive
  //     normalised return value to make desitions
  // A trait needs to declare what resource the provice (plus a count)
  // a leaf does not require more resources
}

export type WeightedAction = {
  weight: number;
  action: TraitAction;
};

export enum Resource {
  Energy = 'energy',
  Movement = 'movement',
}

export class HunterTrait {
  provides = ['energy'];
  needs = ['movement'];

  action(e: Entity, ctx: TickContext) {
    // Destroy an entity; adds enery to this one
  }

  onTick() {
    // Check if entity is in range; if not check movement?
    // or do a MOVE action? why should the movement trait provide it? it only gives the ability to do so
    // Weight should be based on how close a foodsource is.
  }
}

export class MovementTrait {
  provides = ['movement'];
  needs = [''];

  action(e: Entity, ctx: TickContext) {
    // move to some defined location? how to pass info
  }

  desionWeight() {
    // Check if entity is in range; if not check movement?
    // Weight should be based on how close a foodsource is.
  }
}

export type TraitAction = (e: Entity, ctx: TickContext) => void;

export enum Traits {
  Alive = 'alive',
  Heterotroph = 'heterotroph',
  Senses = 'senses',
  Locomotion = 'locomotion',
  Habitat = 'Habitat',
  Adverse = 'Adverse',
  Photosynthesis = 'Photosynthesis',
  Unsuitable = 'Unsuitable',
}
