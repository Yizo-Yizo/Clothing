// Cart.jsx
import React from 'react';

export default function Cart({ cartItems }) {
  return (
    <div>
      <h2>Cart Items:</h2>
      {cartItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img src={item.imageURL} alt={item.title} style={{ width: '100px', marginRight: '10px' }} />
          <div>
            <h3>{item.title}</h3>
            <p>
              {item.quantity} x ${item.price} = ${item.quantity * item.price}
            </p>
            <p>Size: {item.selectedSize}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
