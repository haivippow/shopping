import axios from 'axios';
import React, { Component } from 'react';

class ResetPW extends Component {

  constructor(props) {
    super(props);
    this.state = {
      txtEmail: '',
      txtPassword: '',
      txtToken: '',

    };
  }
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">Khôi Phục Mật Khẩu</h2>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Email</td>
                <td><input type="email" value={this.state.txtEmail} onChange={(e) => { this.setState({ txtEmail: e.target.value }) }} /></td>
                <td><input type="submit" value="SEND-TOKEN" onClick={(e) => this.btnSendTokenClick(e)} /></td>
              </tr>
              <tr>
                <td>TOKEN</td>
                <td><input type="text" value={this.state.txtToken} onChange={(e) => { this.setState({ txtToken: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td>Mật Khẩu Mới </td>
                <td><input type="password" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} /></td>
              </tr>
                  
             
              <tr>
                <td></td>
                <td><input type="submit" value="XÁC NHẬN" onClick={(e) => this.btnConfirmClick(e)} /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
  // event-handlers

  btnSendTokenClick(e) {
    e.preventDefault();
    const email = this.state.txtEmail;
    if (email) {
      const account = {email: email };
      this.apiSendToken(account);
    } else {
      alert('Please input email');
    }
  }
  apiSendToken(account){
    axios.post('/api/customer/reset-password', account).then((res) => {
        const result = res.data;
        alert(result.message);
    
      });
  }


  btnConfirmClick(e) {
    e.preventDefault();
    const email = this.state.txtEmail;
    const resetToken = this.state.txtToken;
    const password = this.state.txtPassword;
    if (email && resetToken && password) {
      const account = { email: email, resetToken: resetToken, password: password };
      this.apiConfirm(account);
    } else {
      alert('Please input email and token and password');
    }
  }
  // apis

  apiConfirm(account) {
    axios.post('/api/customer/comfirm', account).then((res) => {
      const result = res.data;
      alert(result.message);
    
    });
  }
}
export default ResetPW;
