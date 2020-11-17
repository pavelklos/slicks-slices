import { useContext, useState } from 'react';
import OrderContext from '../components/OrderContext';
import attachNamesAndPrices from './attachNamesAndPrices';
import calculateOrderTotal from './calculateOrderTotal';
import formatMoney from './formatMoney';

export default function usePizza({ pizzas, values }) {
  // 1. Create some state to hold our order
  // We got rid of this line because we moved useState up to the provider
  // const [order, setOrder] = useState([]);
  // !!! After added 'OrderContext.js'
  // 1. Now we access both our state and our updater function (setOrder) via context
  const [order, setOrder] = useContext(OrderContext);
  // console.log(order, setOrder);
  // [FOR SEND ORDER BY EMAIL]
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 2. Make a function add things to order
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }

  // 3. Make function remove things from order
  function removeFromOrder(index) {
    setOrder([
      // everything before the item we want to remove
      ...order.slice(0, index),
      // everything after the item we want to remove
      ...order.slice(index + 1),
    ]);
  }

  // [FOR SEND ORDER BY EMAIL]
  // This is the function that is run when someone submits the form
  async function submitOrder(e) {
    e.preventDefault();
    // console.log(e);
    setLoading(true);
    setError(null);
    // setMessage('Go eat!');

    // Gather all the data
    const body = {
      order: attachNamesAndPrices(order, pizzas),
      total: formatMoney(calculateOrderTotal(order, pizzas)),
      name: values.name,
      email: values.email,
      mapleSyrup: values.mapleSyrup,
    };
    console.log('[█ BODY:]', body);

    // 4. Send this data to serverless function when they check out
    // http://localhost:8888/.netlify/functions/placeOrder
    const res = await fetch(
      // `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`, // ISSUE process.env = undefined
      'http://localhost:8888/.netlify/functions/placeOrder',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },

        body: JSON.stringify(body),
      }
    );
    console.log('[█ RESPONSE:]', res);
    const text = JSON.parse(await res.text());
    // const text = JSON.parse(await res.text()); !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHECK
    console.log('[█ res.text:]', text);

    // Check if everything worked
    if (res.status >= 400 && res.status < 600) {
      setLoading(false); // Turn off loading
      setError(text.message);
      // setError(text.message); !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHECK
    } else {
      // It worked!
      setLoading(false); // Turn off loading
      setMessage('Success! Come on down for your pizza');
    }
  }

  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  };
}

// // [ORIGINAL]
// // this is the function that is run when someone submits the form
// async function submitOrder(e) {
//   e.preventDefault();
//   setLoading(true);
//   setError(null);
//   // setMessage('Go eat!');

//   // gather all the data
//   const body = {
//     order: attachNamesAndPrices(order, pizzas),
//     total: formatMoney(calculateOrderTotal(order, pizzas)),
//     name: values.name,
//     email: values.email,
//     mapleSyrup: values.mapleSyrup,
//   };
//   // 4. Send this data the a serevrless function when they check out
//   const res = await fetch(
//     `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     }
//   );
//   const text = JSON.parse(await res.text());

//   // check if everything worked
//   if (res.status >= 400 && res.status < 600) {
//     setLoading(false); // turn off loading
//     setError(text.message);
//   } else {
//     // it worked!
//     setLoading(false);
//     setMessage('Success! Come on down for your pizza');
//   }
// }
