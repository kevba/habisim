import { AdverseTrait } from './adverse';
import { MovementUtils } from '../../algorithms/movement';
import { Entity, TickContext, Coords } from '../models';
import { BaseTrait, NullAction } from './abstract-base';
import { HabitatTrait } from './habitat';
import { Traits, Resource, WeightedAction } from './models';

export class LocomotionTrait extends BaseTrait {
  type = Traits.Locomotion;
  override provides = Resource.Speed;
  private habitat = new HabitatTrait();
  private adverse = new AdverseTrait();

  constructor(public movement: number = 0) {
    super();
  }

  override init(e: Entity) {
    e.resources[Resource.Speed] += this.movement;
    const habitat = e.traits[Traits.Habitat];
    if (habitat) this.habitat = habitat;

    const adverse = e.traits[Traits.Adverse];
    if (adverse) this.adverse = adverse;
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords
  ): WeightedAction {
    const newLocation = destination || ctx.coords;
    let weight = 1;
    if (!this.habitat.validHabitat(e, ctx, newLocation)) {
      weight = weight * 0.5;
    }
    if (this.adverse.isAdverse(e, ctx, newLocation)) {
      weight = weight * 0.5;
    }

    const distance = MovementUtils.distance(ctx.coords, newLocation);
    if (distance <= this.movement) {
      return {
        weight: 1 * weight,
        action: (e, ctx) => {
          ctx.coords = newLocation;
        },
      };
    }

    return {
      weight:
        (this.movement / MovementUtils.distance(ctx.coords, newLocation)) *
        weight,
      action: (e, ctx) => {
        ctx.coords = newLocation;
      },
    };
  }
}
