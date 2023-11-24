import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      showLinks: false,
      notificationBlink: false,
      showNotifications: false, // Add this line
    };
  }

  render() {
    return (
      <div className="border-bottom">
        
        <div className="logo-container">
          <Link to='/'>
            <img src="/logo192.png" alt="Home" className="logo-image" />
          </Link>
        </div>

        <div className="float-left" onMouseLeave={() => this.toggleLinks(false)} onMouseEnter={() => this.toggleLinks(true)}>
            {this.context.customer == null ? (
              <div>
                <Link to='/login' style={{ textDecoration: 'none' }}>Đăng Nhập</Link> | <Link to='/signup' style={{ textDecoration: 'none' }}>Đăng Ký</Link>
              </div>
            ) : (
              <div className="profile-container">
                <div className="profile-info">
                  Xin Chào <b>{this.context.customer.name} </b> |
                </div>
                {this.state.showLinks && (
                  <div className="profile-links">
                    <Link to='/myprofile'>Thông Tin Cá Nhân</Link>
                    <Link to='/myorders'>Đơn Hàng Đã Đặt</Link>
                    <Link to='/myproductfavorite'>Sản Phẩm Yêu Thích</Link>
                    <Link to='/home' onClick={() => this.lnkLogoutClick()}>Đăng Xuất</Link>
                  </div>
                )}
              </div>
            )}
        </div>
             
        <div className='float-left' style={{ marginLeft: '5px' }}>
        <Link to='/mycart' style={{ textDecoration: 'none' ,}}> Giỏ Hàng</Link> có <b>{this.context.mycart.length} </b> sản phẩm
        </div>
      
     
        <div className="float-right" style={{ marginLeft: '30px' }}>
        {this.state.notifications.length > 0 && (
                  <span className={`cart__num c-whi f-thin c-red${this.state.notificationBlink ? ' blink' : ''}`}>
                    Có {this.state.notifications.length}{' '}
                    <span className={`notification-icon${this.state.notifications.length > 0 ? ' with-notification' : ''}`} onClick={this.toggleNotifications}>
                      🛎️
                    </span>{' '}
                    Thông Báo
                  </span>
                )}
          {this.state.showNotifications && (
            <div className="notifications-container right-positioned">
              {this.state.notifications.map((item) => (
                <div key={item._id} className={'notification-item'}>
                  <span onClick={() => this.selectNotification(item)}>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        
        </div>
        <div className="float-right">
      <div style={{ display: "inline" }} class="form-switch">
        <input class="form-check-input" type="checkbox" onChange={(e) => this.ckbChangeMode(e)} />&nbsp; Light / Dark mode
      </div>
      </div>
        <div className="float-clear" />
      </div>
    );
  }


  ckbChangeMode(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }

  CheckToken_Web() {
    const token_web = localStorage.getItem('token_web');
    console.log("token_web:",token_web); 
    const config = { headers: { 'x-access-token': token_web } };
    axios.get('/api/customer/customers/' + token_web, config).then((res) => {
      const result = res.data;
      // if(result.success=="false"){
      //   this.context.customer=null;
      // }else{
      //   this.context.setCustomer(result);
      // }
      this.context.setCustomer(result);
    
    });
  }
  

  selectNotification = (notification) => {
    this.setState({ selectedNotification: notification });
    // Thực hiện các hành động khác khi một thông báo được chọn
  };

  componentDidMount() {
    this.CheckToken_Web();
    this.apiGetNotifications();
    // Bắt đầu nhấp nháy khi component được mount
    this.blinkInterval = setInterval(() => {
      this.setState((prevState) => ({
        notificationBlink: !prevState.notificationBlink,
      }));
    }, 1000); // 1 giây
  }

  componentWillUnmount() {
    // Hủy đăng ký interval khi component unmount
    clearInterval(this.blinkInterval);
  }

  apiGetNotifications = () => {
    axios.get('/api/customer/notifications').then((res) => {
      const result = res.data;
      this.setState({ notifications: result });
    });
  };

  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
    localStorage.removeItem('token_web');
  }

  toggleLinks(show) {
    this.setState({ showLinks: show });
  }

  toggleNotifications = () => {
    this.setState((prevState) => ({
      showNotifications: !prevState.showNotifications,
      notificationBlink: false, // Tắt nhấp nháy khi hiển thị thông báo
    }));
  };
}

export default Inform;
