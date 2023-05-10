import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './core/Home';
import Users from './user/Users';
import Signup from './user/Signup';
import Signin from './auth/Signin';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import NewShop from './shop/NewShop';
import Shops from './shop/Shops';
import MyShops from './shop/MyShops';
import Shop from './shop/Shop';
import EditShop from './shop/EditShop';
import NewProduct from './product/NewProduct';
import EditProduct from './product/EditProduct';
import Product from './product/Product';
import Cart from "./cart/Cart";
import StripeConnect from "./user/StripeConnect";
import Menu from './core/Menu';

const MainRouter = () => {
  return (
    <div>
      <Menu />

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/users' element={<Users />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route
          path='/user/edit/:userId'
          element={<PrivateRoute component={EditProfile} />}
        />

        <Route
          path='/seller/shop/new'
          element={<PrivateRoute component={NewShop} />}
        />
        <Route
          path='/seller/shops'
          element={<PrivateRoute component={MyShops} />}
        />
        <Route
          path='/seller/shop/edit/:shopId'
          element={<PrivateRoute component={EditShop} />}
        />
        <Route
          path='/seller/:shopId/products/new'
          element={<PrivateRoute component={NewProduct} />}
        />

        <Route path='/shops/:shopId' element={<Shop />} />
        <Route path='/shops/all' element={<Shops />} />
        <Route path='/user/:userId' element={<Profile />} />

        <Route path='/product/:productId' element={<Product />} />
        <Route
          path='/seller/:shopId/:productId/edit'
          element={<PrivateRoute component={EditProduct} />}
        />

        <Route path='/cart' element={<Cart />} />

        <Route path="/seller/stripe/connect" element={<StripeConnect/>}/>
      </Routes>
    </div>
  );
};

export default MainRouter;
