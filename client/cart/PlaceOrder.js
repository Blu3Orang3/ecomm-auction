import React, { useState,useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import auth from './../auth/auth-helper';
import cart from './cart-helper.js';
import { CardElement, useStripe} from '@stripe/react-stripe-js';
import { create } from './../order/api-order.js';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  subheading: {
    color: 'rgba(88, 114, 128, 0.87)',
    marginTop: '20px',
  },
  checkout: {
    float: 'right',
    margin: '20px 30px',
  },
  error: {
    display: 'inline',
    padding: '0px 10px',
  },
  errorIcon: {
    verticalAlign: 'middle',
  },
  StripeElement: {
    display: 'block',
    margin: '24px 0 10px 10px',
    maxWidth: '408px',
    padding: '10px 14px',
    boxShadow:
      'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
    borderRadius: '4px',
    background: 'white',
  },
}));

const PlaceOrder = (props) => {
  const classes = useStyles();
  const stripe = useStripe();
  console.log('stripe', stripe, ' propsStripe--', props);
  console.log(<CardElement />);
  const [values, setValues] = useState({
    order: {},
    error: '',
    redirect: false,
    orderId: '',
  });


  const placeOrder = (props) => {
    stripe.createToken().then((payload) => {
      if (payload.error) {
        setValues({ ...values, error: payload.error.message });
      } else {
        const jwt = auth.isAuthenticated();
        create(
          { userId: jwt.user._id },
          {
            t: jwt.token,
          },
          props.checkoutDetails,
          payload.token.id
        ).then((data) => {
          if (data.error) {
            setValues({ ...values, error: data.error });
          } else {
            cart.emptyCart(() => {
              setValues({ ...values, orderId: data._id, redirect: true });
            });
          }
        });
      }
    });
  };

  if (values.redirect) {
    return <Navigate to={'/order/' + values.orderId} />;
  }
  return (
    <span>
      <Typography
        type='subheading'
        component='h3'
        className={classes.subheading}
      >
        Card details
      </Typography>
      <CardElement className={classes.StripeElement} />
      <div className={classes.checkout}>
        {values.error && (
          <Typography component='span' color='error' className={classes.error}>
            <Icon color='error' className={classes.errorIcon}>
              error
            </Icon>
            {values.error}
          </Typography>
        )}
        <Button
          color='secondary'
          variant='contained'
          onClick={placeOrder}
          disabled={!stripe}
        >
          Place Order
        </Button>
      </div>
    </span>
  );
};
PlaceOrder.propTypes = {
  checkoutDetails: PropTypes.object.isRequired,
};

export default PlaceOrder;
