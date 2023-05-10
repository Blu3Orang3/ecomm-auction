import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import auth from './../auth/auth-helper';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { NoSsr } from '@mui/material';
import cart from './../cart/cart-helper';

const isActive = (location, path) => {
  if (location.pathname == path) return { color: '#ff4081' };
  else return { color: '#ffffff' };
};
const isPartActive = (location, path) => {
  if (location.pathname == path) {
    return { color: '#bef67a' };
  } else {
    return { color: '#ffffff' };
  }
};
export default function Menu() {
  let location = useLocation();
  let navigate = useNavigate();
  const [invisible, setInvisible] = React.useState(false);
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          MarketPlace
        </Typography>
        <div className=''>
          <Link to='/'>
            <IconButton aria-label='Home' style={isActive(location, '/')}>
              <HomeIcon />
            </IconButton>
          </Link>
          <Link to='/shops/all'>
            <Button style={isActive(location, '/shops/all')}>All Shops</Button>
          </Link>
          <Link to='/auctions/all'>
            <Button style={isActive(location, '/auctions/all')}>
              All Auctions
            </Button>
          </Link>
          <Link to='/cart'>
            <Button style={isActive(location, '/cart')}>
              Cart
              <NoSsr>
                <Badge
                  invisible={invisible}
                  color='secondary'
                  badgeContent={cart.itemTotal()}
                  style={{ marginLeft: '7px' }}
                >
                  <CartIcon />
                </Badge>
              </NoSsr>
            </Button>
          </Link>
        </div>
        <div style={{ position: 'absolute', right: '10px' }}>
          <span style={{ float: 'right' }}>
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
                {auth.isAuthenticated().user.seller && (
                  <Link to='/seller/shops'>
                    <Button style={isPartActive(location, '/seller/shops')}>
                      {' '}
                      My Shops
                    </Button>
                  </Link>
                )}
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
          </span>
        </div>
      </Toolbar>
    </AppBar>
  );
}
