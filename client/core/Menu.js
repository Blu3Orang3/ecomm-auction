import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import auth from './../auth/auth-helper';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const isActive = (location, path) => {
  if (location.pathname == path) return { color: '#ff4081' };
  else return { color: '#ffffff' };
};
export default function Menu() {
  let location = useLocation();
  let navigate = useNavigate();
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          MERN Skeleton
        </Typography>
        <Link to='/'>
          <IconButton aria-label='Home' style={isActive(location, '/')}>
            <HomeIcon />
          </IconButton>
        </Link>
        <Link to='/users'>
          <Button style={isActive(location, '/users')}>Users</Button>
        </Link>
        {!auth.isAuthenticated() && (
          <span>
            <Link to='/signup'>
              <Button style={isActive(location, '/signup')}>Sign up</Button>
            </Link>
            <Link to='/signin'>
              <Button style={isActive(location, '/signin')}>Sign In</Button>
            </Link>
          </span>
        )}
        {auth.isAuthenticated() && (
          <span>
            <Link to={'/user/' + auth.isAuthenticated().user._id}>
              <Button
                style={isActive(
                  location,
                  '/user/' + auth.isAuthenticated().user._id
                )}
              >
                My Profile
              </Button>
            </Link>
            <Button
              color='inherit'
              onClick={() => {
                auth.clearJWT(() => navigate('/'));
              }}
            >
              Sign out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
}
