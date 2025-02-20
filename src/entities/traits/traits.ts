// import { EntityAction, EntityActionTypes } from '../actions';
// import { Coords, Entity, TickContext } from '../models';
// import { LivingTrait, SensesTrait } from './advanced-traits';
// import { Traits, Trait } from './models';

// // TODO: right now all traits are ran once per tick using the onTick method.
// // An issue can occur where one entity influences the other; e.g by eating it/removing its energy.
// // What should happen is a two tiered system, one calculates actions,and one that does state based cleanup.

// export type MappedTraits = {
//   [Traits.Alive]: LivingTrait;
//   [Traits.Aging]: AgingTrait;
//   [Traits.Reproducer]: ReproducerTrait;
//   [Traits.Habitat]: HabitatTrait;
//   [Traits.Heterotroph]: HeterotrophTrait;
//   [Traits.Photosynthesis]: PhotosynthesisTrait;
//   [Traits.Immortal]: ImmortalTrait;
//   [Traits.Locomotion]: LocomotionTrait;
//   [Traits.Senses]: SensesTrait;
// };

// export class AliveTrait implements Trait {
//   type = Traits.Alive;

  
//   constructor(private _energy: number = 20, private energyPerTick = 10, private energyCap = 100) {}

//   onTick(e: Entity, ctx: TickContext): EntityAction {
//     this.add(-this.energyPerTick);

//     if (this.energy <= 0) {
//       return { type: EntityActionTypes.Remove, priority: 100 };
//     }
//     return { type: EntityActionTypes.Continue, priority: 0 };
//   }

//   get energy() {
//     return this._energy
//   } 

//   add(e: number) {
//     this._energy += e
//     if (this._energy > this.energyCap) {
//       this._energy = this.energyCap
//     }
//   }
// }

// export class ImmortalTrait implements Trait {
//   type = Traits.Immortal;
//   onTick(e: Entity, ctx: TickContext): EntityAction {
//     // A weird side effect is that an immortal entity will not move :/
//     return { type: EntityActionTypes.Continue, priority: 999 };
//   }
// }

// export class HabitatTrait implements Trait {
//   type = Traits.Habitat;

//   // TODO typing for different types of terrain
//   constructor(public habitat: string) {}

//   onTick(e: Entity, ctx: TickContext): EntityAction {
//     const entities = ctx.state.get(ctx.coords.hash()) || [];
//     for (const e of entities) {
//       if (e.name === this.habitat) {
//         return { type: EntityActionTypes.Continue, priority: 0 };
//       }
//     }
//     return { type: EntityActionTypes.Remove, priority: 100 };
//   }
// }

// export class AgingTrait implements Trait {
//   type = Traits.Aging;

//   constructor(public maxAge: number, public age: number = 0) {}

//   onTick(e: Entity, ctx: TickContext): EntityAction {
//     this.age++;
//     if (this.age > this.maxAge) {
//       return { type: EntityActionTypes.Remove, priority: 100 };
//     }
//     return { type: EntityActionTypes.Continue, priority: 0 };
//   }
// }



// export class HeterotrophTrait implements Trait {
//   type = Traits.Heterotroph;

//   constructor(public edibleEntities: string[]) {}

//   onTick(entity: Entity, ctx: TickContext): EntityAction {
//     const entities = ctx.state.get(ctx.coords.hash()) || [];

//     // check for sense range if 'food' can be found; e.g type of hunted entity, with an energy count
//     // for now, we assume you can only sense your own tile
//     const potentialFood = entities.filter(
//       (e) => e.traits.energy && this.edibleEntities.includes(e.name)
//     );

//     if (!potentialFood.length) {
//       return { type: EntityActionTypes.Continue, priority: 0 };
//     }

//     const bestTarget = potentialFood.sort(
//       (a, b) => a.traits.energy!.energy - b.traits.energy!.energy
//     )[0];

//     const energyGain = bestTarget.traits.energy!.energy;
//     bestTarget.traits.energy?.add(-energyGain);

//     if (entity.traits.energy) {
//       entity.traits.energy.add(energyGain);
//     }
//     return { type: EntityActionTypes.Continue, priority: 0 };
//   }
// }

// export class PhotosynthesisTrait implements Trait {
//   type = Traits.Photosynthesis;

//   constructor(public energyPerTick: number = 10) {}

//   onTick(entity: Entity, ctx: TickContext): EntityAction {
//     if (entity.traits.energy) {
//       entity.traits.energy.add(this.energyPerTick);
//     }
//     return { type: EntityActionTypes.Continue, priority: 0 };
//   }
// }

// export class LocomotionTrait implements Trait {
//   type = Traits.Locomotion;

//   constructor(
//     public speed: number = 2,
//   ) {}

//   onTick(e: Entity, ctx: TickContext): EntityAction {
//     return this.wander(ctx.coords)
//   }

//   private wander(start: Coords) {
//     // a low prio 'wandering', to ensure entities do not get stuck
//     const newCoord = new Coords(start.x, start.y)

//     for (let i = 0; i< this.speed; i++) {
//       if (Math.random() > 0.5) {
//         newCoord.x +=  Math.random() > 0.5 ? 1 : -1
//       } else {
//         newCoord.y +=  Math.random() > 0.5 ? 1 : -1
//       }
//     }

//     return { type: EntityActionTypes.Move, priority: 1, coords: newCoord };

//   }
// }

// export class ReproducerTrait implements Trait {
//   type = Traits.Reproducer;

//   constructor(
//     public offspringCount: number = 0,
//     // there has to be a better word then cooldown
//     public cooldown: number = 0,
//     public minAge: number = 0
//   ) {}

//   reproduce(x: number, y: number, e: Entity) {
//     if (!e.traits.living) {
//       return;
//     }
//     // Find another entity nearby.
//     // Reproduce conditons per entity
//   }

//   onTick(e: Entity, ctx: TickContext): EntityAction {
//     return { type: EntityActionTypes.Continue, priority: 0 };
//   }
// }
