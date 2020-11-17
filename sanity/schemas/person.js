import { MdPerson as icon } from 'react-icons/md'; // MD = Material Design

export default {
  // Computer name
  name: 'person',
  // Visible title
  title: 'Slicemasters',
  type: 'document',
  // icon: () => '🍕',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      //   description: 'Name of the person',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Tell us a bit about this person',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};
