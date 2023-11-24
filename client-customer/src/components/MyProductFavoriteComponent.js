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

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); 
  }

  apiViewDetails(items) {
    this.props.navigate('/product/'+items);
  }

  apiDeleteProductFavorite(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
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

  CheckToken_Web() {
    const token_web = localStorage.getItem('token_web');
    console.log(token_web); // Add this line
    const config = { headers: { 'x-access-token': token_web } };
    axios.get('/api/customer/customers/' + token_web, config).then((res) => {
      const result = res.data;
      this.context.setCustomer(result);
      if (this.context.customer) {
        const cid = this.context.customer._id;
        this.apiGetProductFavoritesByCustID(cid);
      }
      
    });
  }
  


  componentDidMount() {
    this.CheckToken_Web();
    
  }

  apiGetProductFavoritesByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.customer.token_web} };
    axios.get(`/api/customer/productfavorites/customer/${cid}`, config).then((res) => {
      const result = res.data;
      this.updateProductFavorites(result);
    });
  }
}

export default withRouter(MyProductFavorite);
