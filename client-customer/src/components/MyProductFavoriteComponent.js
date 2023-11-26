import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class MyProductFavorite extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      productfavorites: [],
    };
  }

  render() {
    if (this.context.customer === '') return <Navigate replace to="/login" />;

    const productfavorites = this.state.productfavorites.map((items, index) => (
      <React.Fragment key={items._id}>
        <tr className="datatable">
          <td>{index + 1}</td>
          <td>{items.product._id}</td>
    
          <td>{this.formatDate(items.product.cdate)}</td>
          <td>{items.product.name}</td>
          <td>{items.product.price}</td>
          <td>
            <img src={`data:image/jpg;base64,${items.product.image}`} width="150px" height="150px" alt="" />
          </td>
          <td>
            <button onClick={() => this.apiViewDetails(items.product._id)}>Xem chi tiết</button>
            <button onClick={() => this.apiDeleteProductFavorite(items._id)}>Xoá</button>
         
          </td>
        </tr>
      </React.Fragment>
    ));

    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">Sản Phẩm Yêu Thích</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>STT</th>
                <th>ID</th>
                <th>Ngày Thêm</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Ảnh</th>
                <th>Chức năng</th>
              </tr>
              {productfavorites}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  
  componentDidMount() {
    this.GetUserToken();
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetProductFavoritesByCustID(cid);
    }
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); 
  }

  apiViewDetails(items) {
    this.props.navigate('/product/'+items);
  }

  apiDeleteProductFavorite(id) {
    const config = { headers: { 'x-access-token': this.context.token} };
    axios.delete('/api/customer/productfavorites/'+id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProductFavorites();
      } else {
        alert('SORRY BABY!');
      }
    });
  }


  apiGetProductFavorites() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/productfavorites', config).then((res) => {
      const result = res.data;
      this.updateProductFavorites(result);
    });
  }
  updateProductFavorites = (productfavorites) => {
    this.setState({ productfavorites });
  };


  GetUserToken(){
    const token_user = localStorage.getItem('token_user');
    const config = { headers: { 'x-access-token': token_user } };
    axios.get('/api/customer/getusertoken/', config).then((res) => {
      const result = res.data;
      if(result && result.success===false){
         this.context.setCustomer(null);
         this.context.setToken('');
      }
      else{
        this.context.setToken(token_user);
        this.context.setCustomer(result);
      }
          
    });
  }
  


  apiGetProductFavoritesByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token} };
    axios.get(`/api/customer/productfavorites/customer/${cid}`, config).then((res) => {
      const result = res.data;
      this.updateProductFavorites(result);
    });
  }
}

export default withRouter(MyProductFavorite);
