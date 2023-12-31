import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import Category from './CategoryComponent';
import Notification from './NotificationComponent';
import Product from './ProductComponent';
import Order from './OrderComponent'; 
import Customer from './CustomerComponent';
import Size from './SizeComponent';
import Contact from './ContactComponent';
import Slider from './SliderComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Satistics from './StatisticsComponent';


class Main extends Component {
  static contextType = MyContext; // using this.context to access global state
  render() {
    if (this.context.admin !== null) {
      return (
        <div className="body-admin">
          <ToastContainer />
        <Menu />
        <Routes>
          <Route path='/admin' element={<Navigate replace to='/admin/home' />} />
          <Route path='/admin/home' element={<Home />} />
          <Route path='/admin/category' element={<Category />} />
          <Route path='/admin/notification' element={<Notification />} />
          <Route path='/admin/product' element={<Product />} />
          <Route path='/admin/order' element={<Order />} />
          <Route path='/admin/customer' element={<Customer />} />
          <Route path='/admin/size' element={<Size />} />
          <Route path='/admin/contact' element={<Contact />} />
          <Route path='/admin/slider' element={<Slider />} />
          <Route path='/admin/thongke' element={<Satistics />} />


        </Routes>
      </div>
      );
    }
    return (<div />);
  }
}
export default Main;