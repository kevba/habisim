import { AdverseTrait } from './adverse';
import { MovementUtils } from '../../algorithms/movement';
import {
  Entity,
  TickContext,
  Coords,
  Resource,
  Attribute,
  Weight,
} from '../models';
import { BaseTrait } from './abstract-base';
import { HabitatTrait } from './habitat';
import { Traits, WeightedAction } from './models';

export class LocomotionTrait extends BaseTrait {
  type = Traits.Locomotion;
  override provides = Attribute.Movement;

  constructor(public movement: number = 1) {
    super();
  }

  override act(
    e: Entity,
    ctx: TickContext,
    destination?: Coords
  ): WeightedAction {
    const newLocation = destination || ctx.coords;
    let weight = Weight.Neutral;

    const habitatModifier = this.bestAct(
      Attribute.Habitat,
      e,
      ctx,
      destination
    );

    if (habitatModifier) {
      weight = weight * habitatModifier.weight;
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

    const outOfRangeMod =
      this.movement / MovementUtils.distance(ctx.coords, newLocation);
    return {
      weight: weight * outOfRangeMod,
      action: (e, ctx) => {
        ctx.coords = newLocation;
      },
    };
  }
}
