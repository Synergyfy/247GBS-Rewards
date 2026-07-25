import { FeatureCategory, PaidVersion } from './versions.enum';

export interface featutresAccess {
  feature: string;
  access: PaidVersion[];
  category?: FeatureCategory;
}
