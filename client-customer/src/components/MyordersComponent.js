import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    if (this.context.customer === "") return (<Navigate replace to='/login' />);
    const orders = this.state.orders.map((item,index) => {
      let Straddress = item.customer.address.sonha + ' ' + item.customer.address.phuong+' '+item.customer.address.quan+' '+item.customer.address.thanhpho;
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
           <td>{index + 1}</td>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{Straddress}</td>
          <td>{(item.total).toLocaleString('vi-VN')} VNĐ</td>
          <td>{item.status}</td>
        </tr>
      );
    });
    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            {/* <td>{item.product._id}</td> */}
            <td>{item.product.name}</td>
            <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
            <td>{(item.product.price).toLocaleString('vi-VN')} VNĐ</td>
            <td>{item.size}</td>
            <td>{item.quantity}</td>
            <td>{(item.product.price * item.quantity).toLocaleString('vi-VN')} VNĐ</td>
          </tr>
        );
      });
    }
    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
              <th>STT</th>
                <th>ID</th>
                <th>Ngày Đặt</th>
                <th>Tên Khách Hàng</th>
                <th>Số điện thoại</th>
                <th>Địa Chỉ</th>
                <th>Tổng</th>
                <th>Trạng Thái</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>
        {this.state.order ?
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>STT</th>
                  {/* <th>ID SP	</th> */}
                  <th>Tên SP</th>
                  <th>Hình Ảnh</th>
                  <th>Giá</th>
                  <th>Size</th>
                  <th>Số Lượng</th>
                  <th>Tổng Giá</th>
                </tr>
                {items}
               
              </tbody>
            </table>
          </div>
          : <div />}
      </div>
    );
  }


  GetUserToken(){
    const token_user = localStorage.getItem('token_user');
    const config = { headers: { 'x-access-token': token_user } };
    axios.get('/api/customer/getusertoken/', config).then((res) => {
      const result = res.data;
      if (result && result.success === false) {
        this.context.setCustomer(null);
        this.context.setToken('');
      } else {
       this.context.setCustomer(result);
        if (this.context.customer) {
          const cid = this.context.customer._id;
          this.apiGetOrdersByCustID(cid);
        }
      }
    });
  }
  
  componentDidMount() {
    this.GetUserToken();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
      console.log(result);
    });
  }
}
export default Myorders;