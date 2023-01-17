import type { CollectionConfig } from '../../../../src/collections/config/types';
import { basicCollectionSlug } from '../Basic';

export const arrayCollectionSlug = 'array-fields';

export const ArrayCollection: CollectionConfig = {
  slug: arrayCollectionSlug,
  fields: [
    {
      name: 'items',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'relatedItem',
          type: 'relationship',
          relationTo: basicCollectionSlug,
        },
      ],
    },
  ],
};
