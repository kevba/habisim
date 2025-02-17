import { inject, Injectable } from '@angular/core';
import { SimStateService } from './sim-state.service';
import { Perlin } from '../../algorithms/perlin';
import {
  FoxEntity,
  GrassEntity,
  RabbitEntity,
  WaterEntity,
} from '../../entities/entitites';
import { Coords } from '../../entities/models';

@Injectable({
  providedIn: 'root',
})
export class GenerateService {
  private state = inject(SimStateService);

  constructor() {}

  foxesAndRabbits() {
    this.state.clear();
    this.basicTerrain();
    this.basicFoxesAndRabbits();
  }

  private basicTerrain() {
    const noise = new Perlin().noiseMap(
      this.state.size(),
      this.state.size(),
      0.05
    );

    this.state.getState().forEach((_, coordhash) => {
      const coords = Coords.from(coordhash);
      const noiseValue = noise[coords.y][coords.x];

    //   Gives riveresque water
      if (noiseValue > 0 && noiseValue < 0.2) {
        this.state.addAt(coords, new WaterEntity());
      } else {
        this.state.addAt(coords, new GrassEntity());
      }
    });
  }

  private basicFoxesAndRabbits() {
    const noise = new Perlin().noiseMap(this.state.size(), this.state.size());

    this.state.getState().forEach((_, coordhash) => {
      const coords = Coords.from(coordhash);
      const noiseValue = noise[coords.y][coords.x];
      if (noiseValue > -0.4 && noiseValue < -0.3) {
        this.state.addAt(coords, new FoxEntity());
      } else if (noiseValue > 0 && noiseValue < 0.1) {
        this.state.addAt(coords, new RabbitEntity());
      }
    });
  }
}
