import { MovementUtils } from '../../algorithms/movement';
import { Entity, TickContext, Coords } from '../models';
import { BaseTrait, NullAction } from './abstract-base';
import { LivingTrait } from './living';
import { Resource, Traits, WeightedAction } from './models';
import { SensesTrait } from './senses';

export class HeterotrophTrait extends BaseTrait {
  override provides = Resource.Energy;
  override needs = [Resource.Speed];

  type = Traits.Heterotroph;
  private senses = new SensesTrait();

  constructor(public edibleEntities: string[]) {
    super();
  }

  override init(e: Entity): void {
    const senses = e.traits[Traits.Senses];
    if (senses) this.senses = senses;
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
      const options: WeightedAction[] = [];

      // iterate movement options, that are within sight
      MovementUtils.radius(ctx.coords, this.senses.senseRadius).forEach(
        (destination) => {
          const movementOption = e.resourceProviders[Resource.Speed].map(
            (trait) => {
              return trait.act(e, ctx, destination);
            }
          );
          options.push(...movementOption);
        }
      );

      const bestOption = options.sort((a, b) => b.weight - a.weight)[0];
      if (!bestOption) {
        return NullAction;
      }
      return {
        weight: options[0].weight,
        action: options[0].action,
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
      (a, b) => a.resources[Resource.Energy] - b.resources[Resource.Energy]
    )[0];

    const energyGain = bestTarget.resources[Resource.Energy];
    bestTarget.resources[Resource.Energy] -= energyGain;
    entity.resources[Resource.Energy] += energyGain;
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
