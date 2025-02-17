import {
  DummyEntity,
} from '../../entities/entitites';
import { Coords } from '../../entities/models';
import { GenerateService } from './generate.service';
import { SimStateService } from './sim-state.service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ControlService {
  state = inject(SimStateService);
  generate = inject(GenerateService);

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
}
