import React, { Component } from 'react';
import Menu from './MenuComponent';
import Inform from './InformComponent';
import Home from './HomeComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Address from './AddressComponent';
import Myorders from './MyordersComponent';
import Gmap from './GmapComponent';
import TawkMessenger from './TawkMessengerComponent';
import ContactInfo from './ContactInfoComponent';
import ResetPW from './ResetPasswordComponent';
import MyProductFavorite from './MyProductFavoriteComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Main extends Component {
  render() {
    return (
        <div className="body-customer">
        <ToastContainer />
        <Inform />
        <Menu />
        <Routes>
          <Route path='/' element={<Navigate replace to='/home' />} />
          <Route path='/home' element={<Home />} />
          <Route path='/product/category/:cid' element={<Product />} />
          <Route path='/product/search/:keyword' element={<Product />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/active' element={<Active />} />
          <Route path='/login' element={<Login />} />
          <Route path='/myprofile' element={<Myprofile />} />
          <Route path='/mycart' element={<Mycart />} />
          <Route path='/address' element={<Address />} />
          <Route path='/myorders' element={<Myorders />} />
          <Route path='/gmap' element={<Gmap />} />
          <Route path='/contactinfo' element={<ContactInfo />} />
          <Route path='/reset-password' element={<ResetPW />} />
          <Route path='/myproductfavorite' element={<MyProductFavorite />} />
        
        </Routes>
        <TawkMessenger />
      </div>
      
      

    );
    
      
  }
}
export default Main;