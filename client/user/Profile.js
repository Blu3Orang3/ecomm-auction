import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Edit from '@mui/icons-material/Edit';
import Person from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import DeleteUser from './DeleteUser';
import auth from './../auth/auth-helper';
import { read } from './api-user.js';
import { Navigate, Link, useParams } from 'react-router-dom';
import config from './../../config/config';
import stripeButton from './../assets/images/stripeButton.png';
// import MyOrders from './../order/MyOrders';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
}));

export default function Profile() {
  const classes = useStyles();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  if (redirectToSignin) {
    return <Navigate to='/signin' />;
  }
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant='h6' className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />{' '}
          {auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id == user._id && (
              <ListItemSecondaryAction>
                {user.seller &&
                  (user.stripe_seller ? (
                    <Button
                      variant='contained'
                      disabled
                      className={classes.stripe_connected}
                    >
                      Stripe connected
                    </Button>
                  ) : (
                    <a
                      href={
                        'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=' +
                        config.stripe_connect_test_client_id +
                        '&scope=read_write'
                      }
                      className={classes.stripe_connect}
                    >
                      <img src={stripeButton} />
                    </a>
                  ))}

                <Link to={'/user/edit/' + user._id}>
                  <IconButton aria-label='Edit' color='primary'>
                    <Edit />
                  </IconButton>
                </Link>
                <DeleteUser userId={user._id} />
              </ListItemSecondaryAction>
            )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={'Joined: ' + new Date(user.created).toDateString()}
          />
        </ListItem>
      </List>
      {/* <MyOrders /> */}
    </Paper>
  );
}
