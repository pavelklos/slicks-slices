import { useEffect, useState } from 'react';

const gql = String.raw;
// const gql = (parts, ...pieces) =>
//   parts.map((part, i) => `${part}${pieces[i] || ''}`).join('');
const deets = gql`
    name
    _id
    image {
      asset {
        url
        metadata {
          lqip
        }
      }
    }
`;

// GET FROM SANITY > sanity graphql list
//     !!! ERROR : Unauthorized - Session not found. For more information, see https://docs.sanity.io/help/cli-errors.
// GET FROM SANITY > sanity graphql deploy production
//     ERROR : Error: Request returned HTTP 401
// [.env]
// GATSBY_GRAPHQL_ENDPOINTS="https://0jfvvkkd.api.sanity.io/v1/graphql/production/default"
const gatsbyGraphqlEndpoints =
  // 'https://0jfvvkkd.api.sanity.io/v1/graphql/production/default'; // Sanity Playground
  'https://wvp1z093.api.sanity.io/v1/graphql/production/default'; // Sanity Playground
// !!! We are querying Sanity directly

export default function useLatestData() {
  // Hot Slices
  const [hotSlices, setHotSlices] = useState();
  // Slicemasters
  const [slicemasters, setSlicemasters] = useState();
  // Use a side effect to fetch the data from the graphql endpoint
  useEffect(function () {
    console.log('FETCHING DATA');
    // When the component loads, fetch the data
    // fetch(process.env.GATSBY_GRAPHQL_ENDPOINTS)
    fetch(gatsbyGraphqlEndpoints, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: gql`
        query {
        StoreSettings(id: "downtown") {
            name
            slicemaster {
              ${deets}
            }
            hotSlices {
              ${deets}
            }
        }
        }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // TODO: Check for errors
        // Set the data to state
        console.log('[Custom Hook - useLatestData() - fetch()]', res.data);
        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemaster);
      })
      .catch((err) => {
        console.log('fetch(gatsbyGraphqlEndpoints, {...})');
        console.log(err);
      });
  }, []);
  return {
    hotSlices,
    slicemasters,
  };
}
