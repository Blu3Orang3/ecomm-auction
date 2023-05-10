import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import CartItems from './CartItems';
import Checkout from './Checkout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import config from '../../config/config';


const stripePromise = loadStripe(config.stripe_test_api_key);


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
}));

export default function Cart() {
  const classes = useStyles();
  const [checkout, setCheckout] = useState(false);

  const showCheckout = (val) => {
    setCheckout(val);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
          <CartItems checkout={checkout} setCheckout={showCheckout} />
        </Grid>
        {checkout && (
          <Grid item xs={6} sm={6}>
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
