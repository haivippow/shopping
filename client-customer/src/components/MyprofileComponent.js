import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myprofile extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'customer',
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      txtSonha: '',
      txtPhuong:'',
      txtQuan:'',
      txtThanhpho: '',
    
    };
  }

  render() {


    if (this.context.customer ==="") return (<Navigate replace to='/login' />);
  
    return (
      <div className="align-center">
        <h2 className="text-center">Thông Tin Thành Viên</h2>
        <div>
          <button onClick={() => this.changeTab('customer')} className={this.state.activeTab === 'customer' ? 'active' : ''}>Thông Tin Khách Hàng</button>
          <span style={{ margin: '0 10px' }}></span>
          <button onClick={() => this.changeTab('address')} className={this.state.activeTab === 'address' ? 'active' : ''}>Địa Chỉ Nhận Hàng</button>
        </div>
        <span style={{ margin: '0 10px' }}></span>
        {this.state.activeTab === 'customer' ? (
          <form>
            <table className="align-center">
              <tbody>
                <tr>
                  <td>Tài Khoản</td>
                  <td><input type="text" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td>Mật Khẩu</td>
                  <td><input type="password" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td>Tên</td>
                  <td><input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td>Số Điện Thoại</td>
                  <td><input type="tel" value={this.state.txtPhone} onChange={(e) => { this.setState({ txtPhone: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td><input type="email" value={this.state.txtEmail} onChange={(e) => { this.setState({ txtEmail: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td></td>
                  <td><input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} /></td>
                </tr>
              </tbody>
            </table>
          </form>
        ) : (
          <form>
            <table className="align-center">
              <tbody>
                <tr>
                  <td>Số nhà/Đường</td>
                  <td><input type="text" value={this.state.txtSonha} onChange={(e) => { this.setState({ txtSonha: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td>Phường/Xã</td>
                  <td><input type="text" value={this.state.txtPhuong} onChange={(e) => { this.setState({ txtPhuong: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td>Quận/Huyện</td>
                  <td><input type="text" value={this.state.txtQuan} onChange={(e) => { this.setState({ txtQuan: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td>Thành Phố</td>
                  <td><input type="text" value={this.state.txtThanhpho} onChange={(e) => { this.setState({ txtThanhpho: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td></td>
                  <td><input type="submit" value="UPDATE ADDRESS" onClick={(e) => this.btnUpdateAddressClick(e)} /></td>
                </tr>
              </tbody>
            </table>
          </form>
        )}
      </div>
    );
  }


  CheckToken_Web() {
    const token_web = localStorage.getItem('token_web');
    const config = { headers: { 'x-access-token': token_web } };
    axios.get('/api/customer/customers/' + token_web, config).then((res) => {
      const result = res.data;
      this.context.setCustomer(result);
      if (this.context.customer) {
        this.setState({
          txtUsername: this.context.customer.username,
          txtPassword: this.context.customer.password,
          txtName: this.context.customer.name,
          txtPhone: this.context.customer.phone,
          txtEmail: this.context.customer.email,
          txtSonha: this.context.customer.address ? this.context.customer.address.sonha || '' : '',
          txtPhuong: this.context.customer.address ? this.context.customer.address.phuong || '' : '',
          txtQuan: this.context.customer.address ? this.context.customer.address.quan || '' : '',
          txtThanhpho: this.context.customer.address ? this.context.customer.address.thanhpho || '' : '',
          
          
        });
      }

      
    });
  }

  componentDidMount() {
    this.CheckToken_Web();
  
  }

  // event-handlers
  btnUpdateClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    if (username && password && name && phone && email) {
      const customer = { username, password, name, phone, email };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert('Please input all customer information fields');
    }
  }

  btnUpdateAddressClick(e) {
    e.preventDefault();
    const sonha = this.state.txtSonha;
    const phuong = this.state.txtPhuong;
    const quan = this.state.txtQuan;
    const thanhpho = this.state.txtThanhpho;
    if (sonha!=="" && phuong!=="" && quan!=="" && thanhpho!=="") {
      const address = { sonha, phuong, quan, thanhpho };
      this.apiPutAddress(this.context.customer._id, address);
    } else {
      alert('Please input Số nhà, Phường, Quận và Thành Phố');
    }


  }

  // apis
  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.customer.token_web} };
    axios.put('/api/customer/customers/' + id, customer, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Customer information updated successfully!');
        this.context.setCustomer(result);
      } else {
        alert('Failed to update customer information!');
      }
    });
  }

  apiPutAddress(id, address) {
    const config = { headers: { 'x-access-token': this.context.customer.token_web } };
    axios.put('/api/customer/address/' + id, address, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Address updated successfully!');
        this.context.setCustomer(result);

      } else {
        alert('Failed to update address!');
      }
    });
  }
  

  changeTab(tab) {
    this.setState({ activeTab: tab });
  }
}

export default Myprofile;
