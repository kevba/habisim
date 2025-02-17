import { effect, Injectable, signal } from '@angular/core';
import { Perlin } from '../../algorithms/perlin';
import { Coords, Entity } from '../../entities/models';

@Injectable({
  providedIn: 'root',
})
export class SimStateService {
  size = signal(25);
  tick = signal(0);

  surface = signal<Entity[]>([]);
  biosphere = signal<Entity[]>([]);

  private stateMap: Map<string, Entity[]> = new Map();

  constructor() {
    effect(() => {
      this.stateMap = this.initMap(this.size());
    });
  }

  setAt(coords: Coords, e: Entity) {
    this.stateMap.set(coords.hash(), [e]);
    this.tick.update((tick) => ++tick);
  }
  
  addAt(coords: Coords, e: Entity) {
    const current = this.stateMap.get(coords.hash())!;
    this.stateMap.set(coords.hash(), [e, ...current]);
    this.tick.update((tick) => ++tick);
  }

  clear() {
    this.stateMap = this.initMap(this.size());
  }

  getState(): typeof this.stateMap {
    return this.stateMap;
  }

  private initMap(size: number) {
    const newStateMap: Map<string, Entity[]> = new Map();

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        newStateMap.set(new Coords(x, y).hash(), []);
      }
    }

    return newStateMap;
  }
}
