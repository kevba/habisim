import { DummyEntity } from '../../entities/entitites';
import { Coords } from '../../entities/models';
import { GenerateService } from './generate.service';
import { SimStateService } from './sim-state.service';
import { effect, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ControlService {
  state = inject(SimStateService);
  generate = inject(GenerateService);

  isLooping = signal(false);
  timeout?: NodeJS.Timeout;

  loop = effect(() => {
    this.state.simulationTick();
    if (this.isLooping()) {
      this.timeout = setTimeout(() => {
        this.state.doTick();
      }, 500);
    } else {
      clearTimeout(this.timeout);
    }
  });

  fillDummyEntities() {
    this.state.clear();

    this.state.getState().forEach((_, coordhash) => {
      this.state.setAt(Coords.from(coordhash), new DummyEntity());
    });
  }

  generateBasic() {
    this.generate.foxesAndRabbits();
  }

  nextTick() {
    this.state.doTick();
  }

  toggleLoop() {
    this.isLooping.update((l) => !l);
  }
}
