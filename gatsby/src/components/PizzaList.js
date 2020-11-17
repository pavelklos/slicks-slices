import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import styled from 'styled-components';

const PizzaGridStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 4rem;
  grid-auto-rows: auto auto 500px;
`;
const PizzaStyles = styled.div`
  display: grid;
  /* Take your row sizing not from 'PizzaStyles' div, but from 'PizzaGridStyle' grid */
  /* CHROME - NOT SUPPORTED */
  @supports not (grid-template-rows: subgrid) {
    --rows: auto auto 1fr;
    /* grid-template-rows: auto auto 1fr; */
  }
  /* OTHER BROWSERS - SUPPORTED */
  /* grid-template-rows: subgrid; */
  grid-template-rows: var(--rows, subgrid);
  grid-row: span 3;
  grid-gap: 1rem;
  h2,
  p {
    margin: 0;
  }
`;

function SinglePizza({ pizza }) {
  return (
    <PizzaStyles>
      <Link to={`/pizza/${pizza.slug.current}`}>
        <h2>
          <span className="mark">{pizza.name}</span>
        </h2>
      </Link>
      <p>{pizza.toppings.map((topping) => topping.name).join(', ')}</p>
      <Img fluid={pizza.image.asset.fluid} alt={pizza.name} />
      {/* <Img fixed={pizza.image.asset.fixed} alt={pizza.name} /> */}
    </PizzaStyles>
  );
}

export default function PizzaList({ pizzas }) {
  //   return <p>There are {pizzas.length} pizzas!</p>;
  return (
    <PizzaGridStyle>
      {pizzas.map((pizza) => (
        // <p key={pizza.id}>{pizza.name}</p>
        <SinglePizza key={pizza.id} pizza={pizza} />
      ))}
    </PizzaGridStyle>
  );
}
