import { Coords, Entity, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { LivingTrait } from './living';
import { Resource, Traits } from './models';

export class PhotosynthesisTrait extends BaseTrait {
  type = Traits.Photosynthesis;

  constructor(public energyGain: number = 10) {
    super();
  }

  override onTick(e: Entity, ctx: TickContext): void {
    e.resources[Resource.Energy] += this.energyGain;
  }
}
