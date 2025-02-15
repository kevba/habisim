import { Perlin } from '../../algorithms/perlin';
import { DummyEntity, GrassEntity, WaterEntity } from '../../entities/entitites';
import { Coords } from '../../entities/models';
import { SimStateService } from './sim-state.service';
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ControlService {
    state = inject(SimStateService)

    fillDummyEntities() {
        this.state.clear()
        
        this.state.getState().forEach((_, coordhash) => {
            this.state.setAt(Coords.from(coordhash), new DummyEntity())
        })
        this.addTerrain()
    }

    addTerrain() {
        const noise = new Perlin().noiseMap(this.state.size(), this.state.size(), 0.05)

        this.state.getState().forEach((_, coordhash) => {
            const coords = Coords.from(coordhash)
            const noiseValue = noise[coords.y][coords.x]

            if (noiseValue > -0.1) {
                this.state.addAt(coords, new GrassEntity())
            } else {
                this.state.addAt(coords, new WaterEntity())
            }
        })

    }
}