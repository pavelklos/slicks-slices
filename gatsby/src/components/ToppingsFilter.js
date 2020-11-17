import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    align-items: center;
    padding: 5px;
    background: var(--grey);
    border: 2px solid var(--red);
    border-radius: 5px;
    text-decoration: none;
    font-size: clamp(1.5rem, 1.4vw, 2.5rem);
    .count {
      background: white;
      padding: 2px 5px;
    }
    /* &.active {
      background: yellow;
    } */
    &[aria-current='page'] {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas) {
  // Return the Pizzas with counts
  const counts = pizzas
    .map((pizza) => pizza.toppings)
    .flat()
    .reduce((acc, topping) => {
      // Check if this is an existing Topping
      const existingTopping = acc[topping.id];
      if (existingTopping) {
        // if it is, increment by 1
        // acc[topping.id] += 1;
        existingTopping.count += 1;
      } else {
        // otherwise create a new entry in our acc and set it to one
        acc[topping.id] = {
          id: topping.id,
          name: topping.name,
          count: 1,
        };
      }
      return acc;
    }, {}); // {} = accumulator
  const sortedToppings = Object.values(counts).sort(
    (a, b) => b.count - a.count
  );
  return sortedToppings;
}

export default function ToppingsFilter({ activeTopping }) {
  // 1. Get a list of all the Toppings [data.toppings]
  // 2. Get a list of all the Pizzas with their Toppings [data.pizzas]
  const { toppings, pizzas } = useStaticQuery(graphql`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
          vegetarian
        }
      }
      pizzas: allSanityPizza {
        nodes {
          name
          toppings {
            name
            id
          }
        }
      }
    }
  `);
  // console.log(toppings.nodes);
  // console.log(pizzas.nodes);
  console.log({ toppings, pizzas });
  // 3. Count how many Pizzas are in each Toppings
  const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);
  console.clear();
  console.log('toppingsWithCounts:', toppingsWithCounts);
  // Loop over the list of Toppings and display the Topping and count of Pizzas in that Topping
  // Link it up...
  return (
    <ToppingsStyles>
      {/* <p>{activeTopping}</p> */}
      {/* <p>TOPPINGS</p> */}
      <Link to="/pizzas">
        <span className="name">All</span>
        <span className="count">{pizzas.nodes.length}</span>
      </Link>
      {toppingsWithCounts.map((topping) => (
        <Link
          key={topping.id}
          to={`/topping/${topping.name}`}
          className={topping.name === activeTopping ? 'active' : ''}
        >
          <span className="name">{topping.name}</span>
          <span className="count">{topping.count}</span>
        </Link>
      ))}
    </ToppingsStyles>
  );
}
