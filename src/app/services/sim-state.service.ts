import { effect, Injectable, signal } from '@angular/core';
import { Perlin } from '../../algorithms/perlin';
import { Coords, Entity } from '../../entities/models';

@Injectable({
  providedIn: 'root',
})
export class SimStateService {
  size = signal(10);
  tick = signal(0);

  surface = signal<Entity[]>([]);
  biosphere = signal<Entity[]>([]);

  private stateMap: Map<string, Entity[]> = new Map();

  constructor() {
    effect(() => {
      const newStateMap: Map<string, Entity[]> = new Map();

      this.stateMap = this.generateEmptyMap(this.size());
    });
  }

  setAt(coords: Coords, e: Entity) {
    this.stateMap.set(coords.hash(), [e]);
    this.tick.update((tick) => ++tick);
  }

  getState(): typeof this.stateMap {
    return this.stateMap;
  }

  generateEmptyMap(size: number) {
    const newStateMap: Map<string, Entity[]> = new Map();

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        newStateMap.set(new Coords(x, y).hash(), []);
      }
    }

    return newStateMap;
  }
}
