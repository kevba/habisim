import { EntityAction, EntityActionTypes } from '../actions';
import { Coords, Entity, TickContext } from '../models';
import {
  Traits,
  Trait,
  AdvancedTrait,
  Resource,
  WeightedAction,
  TraitAction,
} from './models';

// TODO: right now all traits are ran once per tick using the onTick method.
// An issue can occur where one entity influences the other; e.g by eating it/removing its energy.
// What should happen is a two tiered system, one calculates actions,and one that does state based cleanup.

export type MappedAdvancedTraits = {
  [Traits.Alive]: LivingTrait;
  [Traits.Senses]: SensesTrait;
  [Traits.Heterotroph]: HeterotrophTrait;
};

export abstract class BaseTrait implements AdvancedTrait {
  abstract type: Traits;
  provides: Resource | null = null;
  needs: Resource[] = [];
  init(e: Entity, ctx: TickContext): void {}
  onTick(e: Entity, ctx: TickContext): void {}
  act(e: Entity, ctx: TickContext, destination?: Coords): WeightedAction {
    return {
      weight: -1,
      action: (e, ctx) => this.action(e, ctx),
    };
  }
  check(e: Entity, ctx: TickContext) {
    return true
  }
  action(e: Entity, ctx: TickContext) {}
}

export class SensesTrait extends BaseTrait {
  override type = Traits.Senses;
  constructor(public senseRadius = 0) {
    super();
  }
}

// TODO: splint in two traits, one for the values, one for actions.
export class LivingTrait extends BaseTrait {
  type = Traits.Alive;

  constructor(
    private _energy: number = 20,
    private energyPerTick = 10,
    private energyCap = 100
  ) {
    super();
  }

  override check(e: Entity, ctx: TickContext): boolean {
    return this.energy <= 0;
  }

  override onTick(e: Entity, ctx: TickContext) {
    this.add(-this.energyPerTick);
  }

  override needs = [Resource.Energy];

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords
  ): WeightedAction {
    // if desionWeight === 1; return weight, action
    // IF energy to low, try and execute a energy action
    //    execute every energyTick
    //    return highest weight
    // IF no mate nearby: find all mates and and forEach
    //    execute every  movementTick
    if (this.energy / this.energyCap > 0.5) {
      return {
        weight: -1,
        action: (e, ctx) => {},
      };
    } else {
      // Iterate hunting traits, use the one with highest weight
      return {
        weight: 1,
        action: (e, ctx) => this.action(e, ctx),
      };
    }
  }

  get energy() {
    return this._energy;
  }
  add(e: number) {
    this._energy += e;
    if (this._energy > this.energyCap) {
      this._energy = this.energyCap;
    }
  }
}

export class HeterotrophTrait extends BaseTrait {
  override provides = Resource.Energy;
  override needs = [Resource.Movement];

  type = Traits.Heterotroph;
  private senses = new SensesTrait(0);
  private living = new LivingTrait(0, 0, 0);

  constructor(public edibleEntities: string[]) {
    super();
  }

  override init(e: Entity, ctx: TickContext): void {
    const senses = e.traits[Traits.Senses];
    if (senses) this.senses = senses;

    const living = e.traits[Traits.Alive];
    if (living) this.living = living;
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords
  ): WeightedAction {
    if (this.foodAtCurrentLocation(e, ctx).length) {
      return {
        weight: 1,
        action: (e, ctx) => this.action(e, ctx),
      };
    } else {
      // iterate movement options
      return {
        weight: -1,
        action: (e, ctx) => {},
      };
    }
  }

  override action(entity: Entity, ctx: TickContext) {
    const entities = ctx.state.get(ctx.coords.hash()) || [];

    // check for sense range if 'food' can be found; e.g type of hunted entity, with an energy count
    // for now, we assume you can only sense your own tile
    const potentialFood = entities.filter(
      (e) => e.traits.alive && this.edibleEntities.includes(e.name)
    );

    if (!potentialFood.length) {
      return;
    }

    const bestTarget = potentialFood.sort(
      (a, b) => a.traits.alive!.energy - b.traits.alive!.energy
    )[0];

    const energyGain = bestTarget.traits.alive!.energy;
    bestTarget.traits.alive?.add(-energyGain);
    this.living.add(energyGain);
  }

  private foodAtCurrentLocation(e: Entity, ctx: TickContext): Entity[] {
    const entities = ctx.state.get(ctx.coords.hash()) || [];

    // check for sense range if 'food' can be found; e.g type of hunted entity, with an energy count
    // for now, we assume you can only sense your own tile
    const potentialFood = entities.filter(
      (e) => e.traits.alive && this.edibleEntities.includes(e.name)
    );

    return potentialFood;
  }
}
