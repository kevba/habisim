import { MovementUtils } from '../../algorithms/movement';
import { Entity, TickContext, Coords } from '../models';
import { BaseTrait } from './abstract-base';
import { Traits, Resource, WeightedAction } from './models';

export class LocomotionTrait extends BaseTrait {
  type = Traits.Locomotion;
  override provides = Resource.Movement;

  constructor(public movement: number = 0) {
    super();
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords
  ): WeightedAction {
    const newLocation = destination || ctx.coords;
    const distance = MovementUtils.distance(ctx.coords, newLocation);
    if (distance <= this.movement) {
      return {
        weight: 1,
        action: (e, ctx) => {
          ctx.coords = newLocation;
        },
      };
    }

    return {
      weight: this.movement / MovementUtils.distance(ctx.coords, newLocation),
      action: (e, ctx) => {
        ctx.coords = newLocation;
      },
    };
  }
}
