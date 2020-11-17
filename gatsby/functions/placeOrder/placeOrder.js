// AWS Lambda function handler in Node.js
const nodemailer = require('nodemailer');

function generateOrderEmail({ order, total }) {
  return `<div>
    <h2>Your Recent Order for ${total}</h2>
    <p>Please start walking over, we will have your order ready in the next 20 mins.</p>
    <ul>
      ${order
        .map(
          (item) => `<li>
        <img src="${item.thumbnail}" alt="${item.name}"/>
        ${item.size} ${item.name} - ${item.price}
      </li>`
        )
        .join('')}
    </ul>
    <p>Your total is <strong>${total}</strong> due at pickup</p>
    <style>
        ul {
          list-style: none;
        }
    </style>
  </div>`;
}

function generateFakeEventBody() {
  return {
    name: 'FAKE NAME',
    email: 'FAKE@EMAIL.COM',
    total: '$99.99',
    order: [
      {
        id: '-0c86f18e-7e0c-5842-9f54-89e0424ab188',
        name: 'THE FAKE PIZZA',
        price: '$99.99',
        size: 'XXL',
        thumbnail:
          'https://cdn.sanity.io/images/wvp1z093/production/65fa2d78cf5837fdab395d3bd69b696b49dda894-1024x1024.jpg?w=100&h=100&fit=crop',
      },
    ],
  };
}

// Create a transport for nodemailer
// by [Ethereal Email] https://ethereal.email/
// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//     user: 'deon95@ethereal.email',
//     pass: 'spUy1H3n6kTJRC1hTu',
//   },
// });
// !!! PUT DATA TO FILE [.env] !!!
// MAIL_HOST="smtp.ethereal.email"
// MAIL_USER="deon95@ethereal.email"
// MAIL_PASS="spUy1H3n6kTJRC1hTu"
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// [credentials.csv] from [Ethereal Email] https://ethereal.email/
// Service,"Name","Username","Password","Hostname","Port","Security"
// SMTP,"Deon Dach","deon95@ethereal.email","spUy1H3n6kTJRC1hTu","smtp.ethereal.email",587,"STARTTLS"
// IMAP,"Deon Dach","deon95@ethereal.email","spUy1H3n6kTJRC1hTu","imap.ethereal.email",993,"TLS"
// POP3,"Deon Dach","deon95@ethereal.email","spUy1H3n6kTJRC1hTu","pop3.ethereal.email",995,"TLS"

// Test send an Email
// transporter.sendMail({
//   from: "Slick's Slices <slick@exmaple.com>",
//   // to: 'pavelkloscz@gmail.com',
//   to: 'orders@example.com',
//   subject: 'New order!',
//   html: `<p>Your new pizza ordrer is here!</p>`,
// });

function wait(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

exports.handler = async (event, context, callback) => {
  // WAIT
  // await wait(5000);

  // Can’t get body message after sending POST request to Netlify Function
  // https://community.netlify.com/t/cant-get-body-message-after-sending-post-request-to-netlify-function/17056/1
  // https://community.netlify.com/t/netlify-function-has-empty-request-body/12503
  // CHECK event.body AND CREATE FAKE event.body *******************************
  console.log('[█ CONTEXT:]', context);
  console.log('[█ EVENT:]', event);
  console.log('[█ BODY:]', event.body);
  const body = event.body ? JSON.parse(event.body) : generateFakeEventBody();
  console.log('[█ BODY:]', body);
  // CHECK event.body AND CREATE FAKE event.body *******************************

  // [Honey Pot] Check if they have filled out the honeypot
  if (body.mapleSyrup) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Boop beep bop zzzzstt good bye',
      }),
    };
  }
  if (body) {
    // 1. Validate the data coming in is correct *********************************
    const requiredFields = ['email', 'name', 'order'];
    for (const field of requiredFields) {
      console.log(`[█ Checking that ${field} is good]`);
      if (!body[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: `Ooops! You are missing the '${field}' field`,
          }),
        };
      }
    }
    // Make sure they actually have items in that order
    if (!body.order.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Why would you ordernothing?!`,
        }),
      };
    }
  }

  // 2. Send the Email *********************************************************
  const info = await transporter.sendMail({
    from: "Slick's Slices <slick@exmaple.com>",
    to: `${body.name} <${body.email}>, orders@example.com`,
    subject: `New order on(at) date(time) '${new Date().toLocaleString()}'!`,
    html: generateOrderEmail({ order: body.order, total: body.total }),
  });
  console.log('[█ INFO FROM nodemailer:transporter.sendMail():]', info);
  return {
    statusCode: 200,
    body: JSON.stringify(info),
    // body: JSON.stringify({ message: 'Success' }),
  };

  // 3. Send the success or error message **************************************

  // // CHECK TEMP *************************************************************
  // const info = await transporter.sendMail({
  //   from: "Slick's Slices <slick@exmaple.com>",
  //   // to: 'pavelkloscz@gmail.com',
  //   // to: 'orders@example.com',
  //   to: `${body.name} <${body.email}>, orders@example.com`,
  //   subject: 'New order!',
  //   // html: `<p>Your new pizza ordrer is here!</p>`,
  //   html: generateOrderEmail({ order: body.order, total: body.total }),
  // });
  // console.log('[█ INFO FROM nodemailer:transporter.sendMail():]', info);
  // return {
  //   statusCode: 200,
  //   // body: JSON.stringify(info),
  //   body: JSON.stringify({ message: 'Success' }),

  // };
  // // CHECK TEMP *************************************************************
};
