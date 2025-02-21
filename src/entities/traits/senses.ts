import { BaseTrait } from './abstract-base';
import { Traits } from './models';

export class SensesTrait extends BaseTrait {
  override type = Traits.Senses;
  constructor(public senseRadius = 1) {
    super();
  }
}
