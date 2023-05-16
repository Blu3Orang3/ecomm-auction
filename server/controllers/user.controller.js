import User from '../models/user.model';
import extend from 'lodash/extend';
import axios from 'axios';
import config from './../../config/config';
import stripe from 'stripe';
import errorHandler from './../helpers/dbErrorHandler';
const myStripe = stripe(config.stripe_test_secret_key);

const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: 'Successfully signed up!',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created');
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status('400').json({
        error: 'User not found',
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve user',
    });
  }
};

const read = (req, res) => {
  //removes sensitive information
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let user = req.profile;
    //extend and merge the changes that came in the request body
    user = extend(user, req.body);
    user.updated = Date.now();
    // await user.save();
    // Update the user using findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id }, // Query to find the user to update
      user, // Updated user data
      { new: true } // Return the updated user object
    );

    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;
    res.json(updatedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller;
  if (!isSeller) {
    return res.status('403').json({
      error: 'User is not a seller',
    });
  }
  next();
};

const stripe_auth = async (req, res, next) => {
  try {
    const response = await axios.post(
      'https://connect.stripe.com/oauth/token',
      {
        client_secret: config.stripe_test_secret_key,
        code: req.body.stripe,
        grant_type: 'authorization_code',
      }
    );
    if (response.data.error) {
      return res.status('400').json({
        error: response.data.error_description,
      });
    }
    req.body.stripe_seller = response.data;
    next();
  } catch (error) {
    return res.status('500').json({
      error: error.message,
    });
  }
};

const stripeCustomer = (req, res, next) => {
  console.info(req.body,"req--first")
  if (req.profile.stripe_customer) {
    //update stripe customer
    myStripe.customers.update(
      req.profile.stripe_customer,
      {
        source: req.body.token,
      },
      (err, customer) => {
        if (err) {
          return res.status(400).send({
            error: 'Could not update charge details',
          });
        }
        req.body.order.payment_id = customer.id;
        console.info('wrong reach')
        next();
      }
    );
  } else {
    console.info(req.body,"req-body")
    myStripe.customers
      .create({
        email: req.profile.email,
        source: req.body.token,
      })
      .then((customer) => {
        try {
          console.info('reached-costumer')
          User.updateOne(
            { _id: req.profile._id },
            { $set: { stripe_customer: customer.id } }
          );
          req.body.order.payment_id = customer.id;
          next();
        } catch (err) {
          console.info('notreached-costumer')
          return res.status(400).send({
            error: errorHandler.getErrorMessage(err),
          });
        }
      });
  }
};

const createCharge = (req, res, next) => {
  if (!req.profile.stripe_seller) {
    return res.status('400').json({
      error: 'Please connect your Stripe account',
    });
  }
  myStripe.tokens
    .create(
      {
        customer: req.order.payment_id,
      },
      {
        stripeAccount: req.profile.stripe_seller.stripe_user_id,
      }
    )
    .then((token) => {
      myStripe.charges
        .create(
          {
            amount: req.body.amount * 100, //amount in cents
            currency: 'usd',
            source: token.id,
          },
          {
            stripeAccount: req.profile.stripe_seller.stripe_user_id,
          }
        )
        .then((charge) => {
          next();
        });
    });
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  isSeller,
  stripe_auth,
  stripeCustomer,
  createCharge,
};
