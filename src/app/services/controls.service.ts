import { DummyEntity } from '../../entities/entitites';
import { Coords } from '../../entities/models';
import { SimStateService } from './sim-state.service';
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ControlService {
    state = inject(SimStateService)

    fillDummyEntities() {
        this.state.getState().forEach((_, coordhash) => {
            this.state.setAt(Coords.from(coordhash), new DummyEntity())
        })

    }
}