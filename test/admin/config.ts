import { devUser } from '../credentials';
import { buildConfig } from '../buildConfig';

export interface Post {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export default buildConfig({
  collections: [
    {
      slug: 'posts',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'publishedAt',
          type: 'date',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Ready for review', value: 'review' },
            { label: 'Ready to publish', value: 'publish' },
            { label: 'Published', value: 'published' },
          ],
        },
      ],
    },
    {
      slug: 'categories',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
  ],
  globals: [
    {
      slug: 'settings',
      label: 'Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
  ],
  onInit: async (payload) => {
    try {
      await payload.create({
        collection: 'users',
        data: {
          email: devUser.email,
          password: devUser.password,
        },
      });
    } catch (error) {
      // continue
    }
  },
});
