import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import { toast } from 'react-toastify';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      notifications: [],
      txtKeyword: '',
      showNotifications: false,
      selectedNotification: null,
      notificationBlink: false,
    };
    this.blinkInterval = null;
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <li key={item._id} className="menu">
        <Link to={'/product/category/' + item._id}>{item.name}</Link>
      </li>
    ));
    return (
      <div className="border-bottom">
        <div className="float-left">
          <ul className="menu">
            <li className="menu">
             <span>Danh Mục Sản Phẩm</span>
            </li >
           <li className="menu" >
           {cates}
           </li>
           
          </ul>
        </div>
        <div className="float-right">
          <ul className="menu">
          <li className="menu" >
              <input type="search" placeholder="Từ khóa Sản Phẩm" className="keyword" value={this.state.txtKeyword} onChange={(e) => { this.setState({ txtKeyword: e.target.value }) }} />
              <span style={{ margin: '0 10px' }}></span>
              <input type="submit" value="Tìm Kiếm" onClick={(e) => this.btnSearchClick(e)} />
            </li>
          </ul>
          
        </div>
      
        <div className="float-clear" />
      </div>
    );
  }

  btnSearchClick = (e) => {
    e.preventDefault();
    if(this.state.txtKeyword){
      this.props.navigate('/product/search/' + this.state.txtKeyword);
    }
    else{
      toast.info("Vui Lòng Nhập Thông Tin Tìm Kiếm");

    }
    
  };

  componentDidMount() {
    this.apiGetCategories();
    
  }



  apiGetCategories = () => {
    axios.get('/api/customer/categories').then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  };


}

export default withRouter(Menu);
