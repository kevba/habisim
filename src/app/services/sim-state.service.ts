import { effect, Injectable, signal } from '@angular/core';
import { Perlin } from '../../algorithms/perlin';
import { Coords, Entity, EntityStateAction } from '../../entities/models';
import { MapState } from './models';

@Injectable({
  providedIn: 'root',
})
export class SimStateService {
  size = signal(25);
  simulationTick = signal(0);
  renderTick = signal(0);

  surface = signal<Entity[]>([]);
  biosphere = signal<Entity[]>([]);

  private stateMap: MapState = new Map();

  constructor() {
    effect(() => {
      this.stateMap = this.initMap(this.size());
    });
    effect(() => {
      this.simulationTick();
      this.runSimulation();
    });
  }

  doTick() {
    this.simulationTick.update((tick) => ++tick);
  }

  setAt(coords: Coords, e: Entity) {
    this.stateMap.set(coords.hash(), [e]);
    this.renderTick.update((tick) => ++tick);
  }

  addAt(coords: Coords, e: Entity) {
    const current = this.stateMap.get(coords.hash())!;
    this.stateMap.set(coords.hash(), [e, ...current]);
    this.renderTick.update((tick) => ++tick);
  }

  clear() {
    this.stateMap = this.initMap(this.size());
  }

  getState(): typeof this.stateMap {
    return this.stateMap;
  }

  private initMap(size: number) {
    const newStateMap: MapState = new Map();

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        newStateMap.set(new Coords(x, y).hash(), []);
      }
    }

    return newStateMap;
  }

  private runSimulation() {
    this.stateMap.forEach((entities, coordsText) => {
      entities.sort((k1, k2) => k1.zIndex - k2.zIndex);
      const updatedEntityList: Entity[] = [];
      entities.forEach((e) => {
        const action = e.onTick(e, {
          coords: Coords.from(coordsText),
          state: this.stateMap,
        });

        if (action === EntityStateAction.Remove) {
          return;
        }

        updatedEntityList.push(e);
      });

      this.stateMap.set(coordsText, updatedEntityList);
    });
    this.renderTick.update((tick) => ++tick);
  }
}
