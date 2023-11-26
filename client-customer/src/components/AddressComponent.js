import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';

class Address extends Component {
    static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
        txtSonha: '',
        txtPhuong:'',
        txtQuan:'',
        txtThanhpho: '',
    };
  }
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">Địa chỉ nhận hàng</h2>
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
                  <td><input type="submit" value="Đặt Hàng" onClick={(e) => this.lnkCheckoutClick(e)}
  /></td>
                </tr>
              </tbody>
          </table>
        </form>
      </div>
    );
  }


  
  componentDidMount() {
    this.GetUserToken();
  
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
        this.context.setToken(token_user);
       this.context.setCustomer(result);
       if (this.context.customer) {
        this.setState({
        txtSonha: this.context.customer.address ? this.context.customer.address.sonha || '' : '',
        txtPhuong: this.context.customer.address ? this.context.customer.address.phuong || '' : '',
        txtQuan: this.context.customer.address ? this.context.customer.address.quan || '' : '',
        txtThanhpho: this.context.customer.address ? this.context.customer.address.thanhpho || '' : '',     
        });
    }
      }
    });
  }

  lnkCheckoutClick(e) {
    e.preventDefault();
        const customer = this.context.customer;
        const sonha =this.state.txtSonha;
        const phuong = this.state.txtPhuong;
        const quan = this.state.txtQuan;
        const thanhpho =this.state.txtThanhpho;
        if (window.confirm(
                "Địa chỉ nhận hàng:\n" +
                "Số nhà/Đường: "+sonha+'\n'+
                "Phường/Xã: "+phuong+'\n'+
                "Quận/Huyện "+quan+'\n'+
                "Thành Phố: "+thanhpho+'\n' +
                "Bạn đồng ý chứ...\nNếu không, Hãy cập nhập địa chỉ nhận hàng ở My Profile"
              )){

              }
            const addressnew={
                sonha:sonha,
                phuong:phuong,
                quan:quan,
                thanhpho:thanhpho
            };
            const customer_addressnew = {
                _id: customer._id,
                username: customer.username,
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: addressnew,
              }
       
            if (this.context.mycart.length > 0) { 
                const total = CartUtil.getTotal(this.context.mycart);
                const items = this.context.mycart;
              
                if (customer) {
                    this.apiCheckout(total, items, customer_addressnew);
                } else {
                        this.props.navigate('/login');
                }
                } else {
                      alert('Your cart is empty');
            } 
                    
      }

  apiCheckout(total, items, customer_addressnew) {
    const body = { total: total, items: items, customer: customer_addressnew };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.context.setMycart([]);
        this.props.navigate('/myorders');
      } else {
        alert('SORRY BABY!');
      }
    });
  }

}
export default withRouter(Address);