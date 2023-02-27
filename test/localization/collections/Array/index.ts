import type { CollectionConfig } from '../../../../src/collections/config/types';

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
          required: true,
        },
      ],
    },
    {
      name: 'drinks',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'text',
      type: 'text',
      localized: true,
    },
  ],
};
