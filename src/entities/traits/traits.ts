import { AdverseTrait } from './adverse';
import { GrowthTrait } from './growth';
import { HabitatTrait } from './habitat';
import { HeterotrophTrait } from './heterotroph';
import { HydrateTrait } from './hydrate';
import { LivingTrait } from './living';
import { LocomotionTrait } from './locomotion';
import { Traits } from './models';
import { PhotosynthesisTrait } from './photosynthesis';
import { SensesTrait } from './senses';
import { UnsuitableTrait } from './unsuitable';
import { WitherTrait } from './wither';

// TODO: resource values such as energy,movement should be in seperate traits maybe?

export type MappedTraits = {
  [Traits.Alive]: LivingTrait;
  [Traits.Senses]: SensesTrait;
  [Traits.Habitat]: HabitatTrait;
  [Traits.Adverse]: AdverseTrait;
  [Traits.Locomotion]: LocomotionTrait;
  [Traits.Heterotroph]: HeterotrophTrait;
  [Traits.Photosynthesis]: PhotosynthesisTrait;
  [Traits.Unsuitable]: UnsuitableTrait;
  [Traits.Growth]: GrowthTrait;
  [Traits.Wither]: WitherTrait;
  [Traits.Hydrate]: HydrateTrait;
};
