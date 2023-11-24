import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';


class Login extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: 'admin',
      txtPassword: '123'
    };
  }
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">Đăng Nhập Thành Viên</h2>
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
                <td></td>
                <td>
                  <input type="submit" value="Đăng Nhập" onClick={(e) => this.btnLoginClick(e)} />
                  <span style={{ marginLeft: '10px' }}> {/* Adjust the margin as needed */}
                    <button type="button" onClick={(e) => this.btnResetPasswordClick(e)}>Quên Mật Khẩu</button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }



  btnResetPasswordClick(e) {
    e.preventDefault();
    // Add logic to handle the reset password action
    // You can navigate to the reset password page or show a modal, etc.
    // For example:
    this.props.navigate('/reset-password');
  }
  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }
  // apis
  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
       localStorage.setItem("token_web",result.token);
        this.context.setCustomer(result.customer);
        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }
}
export default withRouter(Login);