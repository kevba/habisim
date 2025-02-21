import { Coords, Entity, TickContext } from '../models';
import { BaseTrait } from './abstract-base';
import { LivingTrait } from './living';
import { Traits } from './models';

export class PhotosynthesisTrait extends BaseTrait {
  type = Traits.Photosynthesis;
  private living = new LivingTrait();

  override init(e: Entity) {
    const living = e.traits[Traits.Alive];
    if (living) this.living = living;
  }

  constructor(public energyGain: number = 10) {
    super();
  }

  override onTick(e: Entity, ctx: TickContext): void {
    this.living.add(this.energyGain);
  }
}
