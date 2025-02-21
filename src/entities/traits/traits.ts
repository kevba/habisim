import { SensesTrait } from './abstract-base';
import { HeterotrophTrait } from './heterotroph';
import { LivingTrait } from './living';
import { LocomotionTrait } from './locomotion';
import { Traits } from './models';

// TODO: resource values such as energy,movement should be in seperate traits maybe?

export type MappedAdvancedTraits = {
  [Traits.Alive]: LivingTrait;
  [Traits.Senses]: SensesTrait;
  [Traits.Locomotion]: LocomotionTrait;
  [Traits.Heterotroph]: HeterotrophTrait;
};
