import { graphql } from 'gatsby';
import React from 'react';
import Img from 'gatsby-image';
// import styled from 'styled-components';
import SEO from '../components/SEO';

export default function SlicemasterPage({ data: { person } }) {
  console.log(person);
  return (
    <>
      <SEO title={`${person.name}`} image={person.image?.asset?.fluid?.src} />
      <div className="center">
        <h2>
          <span className="mark">{person.name}</span>
        </h2>
        <Img fluid={person.image.asset.fluid} />
        <p>{person.description}</p>
      </div>
    </>
  );
}

export const query = graphql`
  query($slug: String!) {
    person: sanityPerson(slug: { current: { eq: $slug } }) {
      name
      id
      description
      image {
        asset {
          fluid(maxWidth: 1000, maxHeight: 750) {
            ...GatsbySanityImageFluid
          }
        }
      }
    }
  }
`;
