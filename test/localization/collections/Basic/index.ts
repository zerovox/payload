import { CollectionConfig } from '../../../../src/collections/config/types';

export const basicCollectionSlug = 'basic-collection';

export const BasicCollection: CollectionConfig = {
  slug: basicCollectionSlug,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
};
