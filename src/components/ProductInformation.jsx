import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Popover from '@mui/material/Popover';
import Cart from './Cart'; 
import '../App.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
      <AppBar position="static" color="default" style={{ width: '100%', marginTop: '20px'}}>
        <Toolbar>
          <div style={{ flexGrow: 1 }} /> 
          <Button color="inherit" onClick={handleCartClick}>
            My Cart ({cartTotal})
          </Button>
        </Toolbar>
      </AppBar>
  
      <Grid container direction="row" alignItems="flex-start" spacing={2}>
        <Grid item xs={12} sm={6}>
          <img src={productData.imageURL} alt={productData.title} style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div>
            <header style={{ color: '#222222' }}><b>{productData.title}</b></header>
            <p><b>${productData.price}</b></p>
            <p style={{ color: '#888888' }}>{productData.description}</p>
            <p style={{ color: '#888888' }}>SIZE<span style={{ color: '#C90000' }}>*</span>{selectedSize && `(${selectedSize})`}</p>
            {sizeError && <p style={{ color: '#C90000' }}>Please select a size before adding to cart.</p>}
            {productData.sizeOptions.map((sizeOption) => (
              <Button
                key={sizeOption.id}
                variant="outlined"
                style={{
                  width: '50px',
                  height: '50px',
                  margin: '5px',
                  color: '#222222',
                  borderColor: sizeOption.label === selectedSize ? '#222222' : '#CCCCCC',
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
        <div style={{ padding: '16px' }}>
        <Cart cartItems={cartItems} />
        </div>
        
      </Popover>
    </div>
  );
  
}