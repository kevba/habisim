import { EntityAction, EntityActionTypes } from './actions';
import { Coords, Entity, TickContext } from './models';
import { Traits } from './traits/models';
import { EnergyTrait, HabitatTrait, HeterotrophTrait, ImmortalTrait, LivingTrait, PhotosynthesisTrait } from './traits/traits';

export abstract class BaseEntity implements Entity {
  abstract name: string;
  abstract render(
    coords: Coords,
    scale: number,
    context: CanvasRenderingContext2D
  ): void;

  traits: Entity['traits'] = {};
  zIndex = 0;

  onTick(e: Entity, ctx: TickContext): EntityAction {
    const actions: EntityAction[] = [{
      type: EntityActionTypes.Continue,
      priority: 0
    }]

    for (const trait of Object.values(this.traits)) {
      const stateAction = trait.onTick(e, ctx);
      actions.push(stateAction)
    }
    const actionsByPriority = actions.sort((a,b) => b.priority - a.priority)[0];
    return actionsByPriority 
  }
}

export class DummyEntity extends BaseEntity {
  override traits = {};
  override zIndex: number = 0;
  name = 'dummy';

  render(
    coords: Coords,
    scale: number,
    context: CanvasRenderingContext2D
  ): void {
    context.fillStyle = `black`;
    context.font = `${scale}px Arial`;
    // text renders from bottom to top, so 0,0 must be rendered on the 0,1 line
    context.fillText('*', coords.x * scale, (coords.y + 1) * scale);
  }
}

export class AnimalEntity extends BaseEntity {
  override zIndex: number = 0;
  name = 'animal';
  emoji = 'U1F610';

  render(
    coords: Coords,
    scale: number,
    context: CanvasRenderingContext2D
  ): void {
    context.fillStyle = `black`;
    context.font = `${scale / 1.5}px Arial`;

    // text renders from bottom to top, so 0,0 must be rendered on the 0,1 line
    context.fillText(this.emoji, coords.x * scale, (coords.y + 1) * scale);
  }
}

export class FoxEntity extends AnimalEntity {
  override name = 'fox';
  override emoji = '🦊';
  override traits = {
    [Traits.Living]: new LivingTrait(250),
    [Traits.Energy]: new EnergyTrait(100, 10),
    [Traits.Habitat]: new HabitatTrait('grass'),
    [Traits.Heterotroph]: new HeterotrophTrait(['rabbit']),
  };
}

export class RabbitEntity extends AnimalEntity {
  override name = 'rabbit';
  override emoji = '🐰';
  override traits = {
    [Traits.Living]: new LivingTrait(100),
    [Traits.Energy]: new EnergyTrait(100, 10),
    [Traits.Habitat]: new HabitatTrait('grass'),
    [Traits.Heterotroph]: new HeterotrophTrait(['grass']),
  };
}

export abstract class TerrainEntity extends BaseEntity {
  override zIndex: number = -1;
  abstract color: string;

  render(
    coords: Coords,
    scale: number,
    context: CanvasRenderingContext2D
  ): void {
    context.fillStyle = this.color;
    context.fillRect(coords.x * scale, coords.y * scale, scale, scale);
  }
}

export class GrassEntity extends TerrainEntity {
  override traits = {
    [Traits.Living]: new LivingTrait(2),
    [Traits.Energy]: new EnergyTrait(20, 0),
    [Traits.Photosynthesis]: new PhotosynthesisTrait(),
    // Would be fun if grass could turn into sand, but to keep this simple for, make it immortal
    [Traits.Immortal]: new ImmortalTrait(),
  };

  override name = 'grass';
  override color = 'green';
}
export class WaterEntity extends TerrainEntity {
  override name = 'water';
  override color = 'blue';
}
