import { Coords, Entity, TickContext } from './models';
import { HeterotrophTrait } from './traits/heterotroph';
import { LivingTrait } from './traits/living';
import { LocomotionTrait } from './traits/locomotion';
import { AdvancedTrait, Resource, Traits } from './traits/models';

let ID_COUNT = 1;

export abstract class BaseEntity implements Entity {
  id = ID_COUNT++;

  resourceTree: Record<Resource, AdvancedTrait[]> = {
    [Resource.Energy]: [],
    [Resource.Movement]: [],
  };
  abstract name: string;
  abstract render(
    coords: Coords,
    scale: number,
    context: CanvasRenderingContext2D
  ): void;

  traits: Entity['traits'] = {};
  zIndex = 0;

  init(): void {
    Object.values(this.traits).forEach((t) => {
      if (t.provides != null) {
        this.resourceTree[t.provides].push(t);
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
    const traits = Object.values(this.traits);
    if (!traits.length) {
      return this;
    }
    if (traits.every((t) => t.check(this, ctx))) {
      return this;
    }

    return null;
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
    [Traits.Alive]: new LivingTrait(100, 20),
    [Traits.Locomotion]: new LocomotionTrait(2),
    [Traits.Heterotroph]: new HeterotrophTrait(['rabbit']),
  };
}

export class RabbitEntity extends AnimalEntity {
  override name = 'rabbit';
  override emoji = '🐰';
  override traits = {
    [Traits.Locomotion]: new LocomotionTrait(1),
    [Traits.Alive]: new LivingTrait(100, 10),
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
    [Traits.Alive]: new LivingTrait(20, 0, 20),
  };

  override name = 'grass';
  override color = 'green';

  override update(ctx: TickContext): Entity | null {
    // TODO: lacking init
    return super.update(ctx) || new SandEntity();
  }
}

export class WaterEntity extends TerrainEntity {
  override name = 'water';
  override color = 'blue';
}

export class SandEntity extends TerrainEntity {
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
