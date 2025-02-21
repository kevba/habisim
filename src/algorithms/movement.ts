import { Coords } from '../entities/models';
import { shuffleArray } from './shuffle';

export class MovementUtils {
  static radius(base: Coords, radius: number): Coords[] {
    const radiusCoords: Coords[] = [];
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        radiusCoords.push(new Coords(base.x + x, base.y + y));
      }
    }

    shuffleArray(radiusCoords);
    return radiusCoords;
  }

  // Gives the manhattan distance for now, Cleary entities cannt move diagonally
  static distance(c1: Coords, c2: Coords): number {
    return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
  }
}
