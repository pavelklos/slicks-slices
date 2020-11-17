import path, { resolve } from 'path';
import fetch from 'isomorphic-fetch';

// params = { graphql, actions }
async function turnPizzasIntoPages({ graphql, actions }) {
  console.log(`Turning the Pizzas into Pages!!!`);
  // 1. Get a template for this page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js'); // new template [Pizza.js]
  // 2. Query all Pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // console.log(data);
  // 3. Loop over each Pizza and create a page for that Pizza (createPage)
  data.pizzas.nodes.forEach((pizza) => {
    console.log('Creating a page for pizza:', pizza.name);
    actions.createPage({
      // What is the URL for this new page?
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

// params = { graphql, actions }
async function turnToppingsIntoPages({ graphql, actions }) {
  console.log(`Turning the Toppings into Pages!!!`);
  // 1. Get a template for this page
  const toppingTemplate = path.resolve('./src/pages/pizzas.js'); // existing page [pizzas.js]
  // 2. Query all Toppings
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);
  // console.log(data);
  // 3. Loop over each Topping and create a page for that Topping (createPage)
  data.toppings.nodes.forEach((topping) => {
    console.log('Creating a page for topping:', topping.name);
    actions.createPage({
      // What is the URL for this new page?
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        topping: topping.name,
        // TODO : Regex for Topping
        toppingRegex: `/${topping.name}/i`,
      },
    });
  });
  // 4. Pass Topping data to pizzas
}

// params = { actions, createNodeId, createContentDigest }
async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  console.log('Turn Beers into Nodes!');
  // 1. Fetch a list of beers
  const res = await fetch('https://sampleapis.com/beers/api/ale');
  const beers = await res.json();
  console.log(beers);
  // 2. Loop over each one
  beers.forEach((beer) => {
    // Create a node for each beer
    // const nodeContent = JSON.stringify(beer);
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
      },
    };
    // 3. Create a node for that beer
    actions.createNode({
      ...beer,
      ...nodeMeta,
    });
  });
}

async function turnSlicemastersIntoPages({ graphql, actions }) {
  // 1. Query all Slicemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // TODO: 2. Turn each Slicemaster into their own page
  data.slicemasters.nodes.forEach((slicemaster) => {
    actions.createPage({
      component: resolve('./src/templates/Slicemaster.js'),
      path: `/slicemaster/${slicemaster.slug.current}`,
      context: {
        name: slicemaster.person,
        slug: slicemaster.slug.current,
      },
    });
  });
  // 3. Figure out how many pages there are based on how many Slicemasters there are, and how many per page!
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);
  console.log(
    `There are ${data.slicemasters.totalCount} total people. And we have ${pageCount} pages with ${pageSize} per page`
  );
  // 4. Loop from 1 to n and create the pages
  Array.from({ length: pageCount }).forEach((_, i) => {
    console.log(`Creating page ${i}`);
    actions.createPage({
      path: `/slicemasters/${i + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),
      // This data 'context' is pass to the template when we create it
      context: {
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize,
      },
    });
  });
}

// Gatsby Nodes API : sourceNodes !!! BEFORE createPages
export async function sourceNodes(params) {
  // Fetch a list of beers ando source them into Gatsby API
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

// Gatsby Nodes API : createPages
export async function createPages(params) {
  // Create pages dynamically
  // Wait for all promises to be resolved before finishing this function
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
    turnSlicemastersIntoPages(params),
  ]);
  // 1. Pizzas
  // 2. Toppings
  // 3. Slicemasters
}
