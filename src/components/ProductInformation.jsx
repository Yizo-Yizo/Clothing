import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Popover from '@mui/material/Popover';
import Cart from './Cart'; 
import '../App.css';

export default function ProductDetails() {
  const [productData, setProductData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          'https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product'
        );
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartTotal(totalQuantity);

  }, [cartItems]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  const Grid = styled(MuiGrid)(({ theme }) => ({
    padding: theme.spacing(4),
    ...theme.typography.body2,
    '& [role="separator"]': {
      margin: theme.spacing(0, 2),
    },
  }));
 
  const addToCart = (productData, selectedSize) => {
    if (selectedSize) {
      const existingItem = cartItems.find(
        (item) => item.title === productData.title && item.selectedSize === selectedSize
      );

      if (existingItem) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.title === productData.title && item.selectedSize === selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        const newItem = { ...productData, selectedSize, quantity: 1 };
        setCartItems((prevItems) => [...prevItems, newItem]);
      }
      setSizeError(false); 
    } else {
      setSizeError(true);
    }
  };

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setAnchorEl(null);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize((prevSize) => (prevSize === size ? null : size));
  };

  const open = Boolean(anchorEl);
  const id = open ? 'cart-popover' : undefined;

  return (
    <div>
      <AppBar position="static" color="default" style={{ width: '100%', marginTop: '20px' }}>
        <Toolbar>
          <div style={{ flexGrow: 1 }} /> 
          <Button color="inherit" onClick={handleCartClick}>
            My Cart ({cartTotal})
          </Button>
        </Toolbar>
      </AppBar>
  
      <Grid container>
        <Grid item xs>
          <img src={productData.imageURL} alt={productData.title} style={{ width: '100%' }} />
        </Grid>
        <Grid item xs>
          <div>
            <h2>{productData.title}</h2>
            <p>${productData.price}</p>
            <p style={{ color: 'grey' }}>{productData.description}</p>
            <p style={{ color: 'grey' }}>SIZE</p>
            {sizeError && <p style={{ color: 'red' }}>Please select a size before adding to cart.</p>}
            {productData.sizeOptions.map((sizeOption) => (
              <Button
                key={sizeOption.id}
                variant="outlined"
                style={{
                  width: '30px',
                  height: '30px',
                  margin: '5px',
                  color: 'grey',
                  borderColor: sizeOption.label === selectedSize ? 'black' : 'grey',
                  borderWidth: sizeOption.label === selectedSize ? '3px' : '1px',
                }}
                onClick={() => handleSizeSelect(sizeOption.label)}
              >
                {sizeOption.label}
              </Button>
            ))}
          </div>
          <div>
            <Button className="addToCartButton" variant="outlined" onClick={() => addToCart(productData, selectedSize)}>ADD TO CART</Button>
          </div>
        </Grid>
      </Grid>
  
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCartClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Cart cartItems={cartItems} />
      </Popover>
    </div>
  );
  
}