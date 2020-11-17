import React from 'react';
import { navigate } from 'gatsby';

function goToSlicemasters() {
  // 1. Wait for 2 seconds
  setTimeout(() => {
    console.log('Go to slicers!!!!');
    // 2. Change the page
    navigate('/slicemasters', { replace: true });
  }, 2000);
}

export default function Footer() {
  return (
    <footer>
      <hr />
      <p className='center'>
        &copy; Slick's Slices {new Date().getFullYear()} :&nbsp;
        <span style={{ color: 'blue' }}>{new Date().toLocaleString()}</span>
      </p>
      <hr />
      <p className='center'>
        <button type="button" onClick={goToSlicemasters}>
          Click me to see slicemasters after 2 seconds
        </button>
      </p>
    </footer>
  );
}
