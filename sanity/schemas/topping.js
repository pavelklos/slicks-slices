import { FaPepperHot as icon } from 'react-icons/fa'; // FA = FONT AWESOME

export default {
  // Computer name
  name: 'topping',
  // Visible title
  title: 'Toppings',
  type: 'document',
  // icon: () => '🍕',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Topping Name',
      type: 'string',
      description: 'What is the name of the topping?',
    },
    {
      name: 'vegetarian',
      title: 'Vegetarian',
      type: 'boolean',
      // description: '...',
      options: {
        layout: 'checkbox',
      },
    },
  ],
  preview: {
    select: {
      name: 'name',
      vegetarian: 'vegetarian',
    },
    prepare: (fields) => ({
      title: `${fields.name} ${fields.vegetarian ? '🍀' : ''}`,
    }),
  },
};
