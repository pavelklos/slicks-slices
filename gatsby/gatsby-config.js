import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// console.log(process.env.SANITY_TOKEN);

// module.exports = {
export default {
  // pathPrefix: '/pizza', // Hosting the Gatsby Website on your own server
  siteMetadata: {
    title: `Slicks Slices`,
    siteUrl: 'https://gatsby.pizza/',
    description: 'The best pizza place in Hamilton',
    twitter: '@slickSlices',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      // this is the name of the plugin you are adding
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'wvp1z093',
        dataset: 'production',
        watchMode: true,
        token: process.env.SANITY_TOKEN,
      },
    },
  ],
};
// skNa8Iu9wTkZK8wjqYf6oIjJBdnVEk5j19lHeekqhtDwAyH6Fyfhg88cgTKkcejG7ob3jQPWMuh5NyjAZQPLa1lUzKCdfTPFq8eTRpE1rIzweGceZSlEyPCByUxJEUGXrmqgEEyerI9tuLrqayvfX2IketwXb2n46J29TBQp5xLGIcuEuZIc
