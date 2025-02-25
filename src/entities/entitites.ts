import { Attribute, Coords, Entity, Resource, TickContext } from './models';
import { AdverseTrait } from './traits/adverse';
import { GrowthTrait } from './traits/growth';
import { HabitatTrait } from './traits/habitat';
import { HeterotrophTrait } from './traits/heterotroph';
import { HydrateTrait } from './traits/hydrate';
import { LivingTrait } from './traits/living';
import { LocomotionTrait } from './traits/locomotion';
import { Trait, Traits } from './traits/models';
import { PhotosynthesisTrait } from './traits/photosynthesis';
import { UnsuitableTrait } from './traits/unsuitable';

let ID_COUNT = 1;

export abstract class BaseEntity implements Entity {
  id = ID_COUNT++;

  resources: Record<Resource, number> = {
    [Resource.Energy]: 0,
    [Resource.Water]: 0,
  };

  resourceCaps: Record<Resource, number> = {
    [Resource.Energy]: 0,
    [Resource.Water]: 0,
  };

  providers: Record<Resource | Attribute, Trait[]> = {
    [Resource.Energy]: [],
    [Resource.Water]: [],
    [Attribute.Movement]: [],
    [Attribute.Habitat]: [],
    [Attribute.Adverse]: [],
    [Attribute.Unsuitable]: [],
  };

  abstract name: string;
  abstract render(
    coords: Coords,
    scale: number,
    context: CanvasRenderingContext2D
  ): void;

  traits: Entity['traits'] = {};
  zIndex = 0;

  constructor() {
    this.init();
  }

  init(): void {
    Object.values(this.traits).forEach((t) => {
      if (t.provides != null) {
        this.providers[t.provides].push(t);
      }
    });
    Object.values(this.traits).forEach((t) => {
      t.init(this);
    });
  }

  onTick(ctx: TickContext) {
    const traits = Object.values(this.traits);
    traits.forEach((t) => {
      t.onTick(this, ctx);
    });

    const rootTraits = traits.filter((t) => !t.provides?.length);
    const weightedActions = rootTraits.map((t) => t.act(this, ctx));
    const bestAction = weightedActions.sort(
      (a1, a2) => a2.weight - a1.weight
    )[0];
    if (bestAction) {
      bestAction.action(this, ctx);
    }
  }

  update(ctx: TickContext): Entity | null {
    const updated = this.updatePerTrait(ctx);

    const destroyed = Object.values(updated).some((u) => u === null);
    if (destroyed) {
      return null;
    }

    const changed = Object.values(updated).filter((u) => u !== this);
    if (changed.length) {
      return changed[0];
    }

    return this;
  }

  private updatePerTrait(ctx: TickContext): {
    [key in Traits]?: Entity | null;
  } {
    const traits = Object.values(this.traits);
    if (!traits.length) {
      return {};
    }

    const traitResults: {
      [key in Traits]?: Entity | null;
    } = {};
    for (let t of traits) {
      traitResults[t.type] = t.check(this, ctx);
    }

    return traitResults;
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
  constructor() {
    super();
    this.resources[Resource.Energy] = 200;
    this.resourceCaps[Resource.Energy] = 200;
  }

  override name = 'fox';
  override emoji = '🦊';
  override traits = {
    [Traits.Alive]: new LivingTrait(Resource.Energy, 20),
    [Traits.Habitat]: new HabitatTrait(['grass']),
    [Traits.Unsuitable]: new UnsuitableTrait(['water']),
    [Traits.Locomotion]: new LocomotionTrait(2),
    [Traits.Heterotroph]: new HeterotrophTrait(['rabbit']),
  };
}

export class RabbitEntity extends AnimalEntity {
  constructor() {
    super();
    this.resources[Resource.Energy] = 100;
    this.resourceCaps[Resource.Energy] = 100;
  }

  override name = 'rabbit';
  override emoji = '🐰';
  override traits = {
    [Traits.Locomotion]: new LocomotionTrait(1),
    [Traits.Habitat]: new HabitatTrait(['grass']),
    [Traits.Adverse]: new AdverseTrait(['fox']),
    [Traits.Unsuitable]: new UnsuitableTrait(['water']),
    [Traits.Alive]: new LivingTrait(Resource.Energy, 10),
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
    [Traits.Alive]: new LivingTrait(Resource.Energy, 0),
    [Traits.Photosynthesis]: new PhotosynthesisTrait(20),
  };

  override name = 'grass';
  override color = 'green';

  override update(ctx: TickContext): Entity | null {
    const updated = super.update(ctx);
    if (updated === null) {
      const sand = new SandEntity();
      return sand;
    }
    return updated;
  }
}

export class WaterEntity extends TerrainEntity {
  override name = 'water';
  override color = 'blue';
}

export class SandEntity extends TerrainEntity {
  override traits = {
    [Traits.Growth]: new GrowthTrait(Resource.Water, 20),
    [Traits.Hydrate]: new HydrateTrait(3),
  };

  override name = 'sand';
  override color = 'yellow';
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
