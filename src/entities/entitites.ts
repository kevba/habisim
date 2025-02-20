import { EntityAction, EntityActionTypes } from './actions';
import { Coords, Entity, TickContext } from './models';
import { HeterotrophTrait, LivingTrait } from './traits/advanced-traits';
import { AdvancedTrait, Resource, Traits } from './traits/models';

export abstract class BaseEntity implements Entity {
  resourceTree: Record<Resource, AdvancedTrait[]> = {
    [Resource.Energy]: [],
    [Resource.Movement]: []
  }
abstract name: string;
  abstract render(
    coords: Coords,
    scale: number,
    context: CanvasRenderingContext2D
  ): void;

  traits: Entity['traits'] = {};
  zIndex = 0;

  init(ctx: TickContext): void {    
    Object.values(this.traits).forEach((t) => {
      if (t.provides != null) {
        this.resourceTree[t.provides].push(t)
      }
    });
    Object.values(this.traits).forEach((t) => {
      t.init(this, ctx)
    });
  }

  onTick(ctx: TickContext) {
    Object.values(this.traits).forEach(t => {
      t.onTick(this, ctx)
    })
    // Determine what action should be taken
    Object.values(this.traits).map(t => 
      t.act(this, ctx)
    )
  }

  check(ctx: TickContext): boolean {
    return Object.values(this.traits).every((t) => t.check(this, ctx));
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
    // [Traits.Aging]: new AgingTrait(250),
    // [Traits.Locomotion]: new LocomotionTrait(),
    [Traits.Alive]: new LivingTrait(100, 20),
    // [Traits.Habitat]: new HabitatTrait('grass'),
    [Traits.Heterotroph]: new HeterotrophTrait(['rabbit']),
  };
}

export class RabbitEntity extends AnimalEntity {
  override name = 'rabbit';
  override emoji = '🐰';
  override traits = {
    // [Traits.Aging]: new AgingTrait(100),
    // [Traits.Locomotion]: new LocomotionTrait(1),
    [Traits.Alive]: new LivingTrait(100, 10),
    // [Traits.Habitat]: new HabitatTrait('grass'),
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
    // [Traits.Aging]: new AgingTrait(2),
    [Traits.Alive]: new LivingTrait(20, 0, 20),
    // [Traits.Photosynthesis]: new PhotosynthesisTrait(),
    // Would be fun if grass could turn into sand, but to keep this simple for, make it immortal
    // [Traits.Immortal]: new ImmortalTrait(),
  };

  override name = 'grass';
  override color = 'green';
}
export class WaterEntity extends TerrainEntity {
  override name = 'water';
  override color = 'blue';
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
