import { effect, Injectable, signal } from '@angular/core';
import { Coords, Entity } from '../../entities/models';
import { MapState } from './models';
import { EntityActionTypes } from '../../entities/actions';

@Injectable({
  providedIn: 'root',
})
export class SimStateService {
  size = signal(100);
  simulationTick = signal(0);
  renderTick = signal(0);

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
    this.renderTick.set(0);
    this.simulationTick.set(0);
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
    const newMap: MapState = new Map();

    this.stateMap.forEach((entities, coordsText) => {
      entities.sort((k1, k2) => k1.zIndex - k2.zIndex);
      const updatedEntityList = newMap.get(coordsText) || [];
      entities.forEach((e) => {
        e.onTick({
          coords: Coords.from(coordsText),
          state: this.stateMap,
        });
      })
      entities.forEach((e) => {
        const invalid = e.check({
          coords: Coords.from(coordsText),
          state: this.stateMap,
        });
        if (!invalid) {
          updatedEntityList.push(e);
        }
      });

      newMap.set(coordsText, updatedEntityList);
    });
    this.stateMap = newMap
    this.renderTick.update((tick) => ++tick);
  }
}
