import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }
  render() {
    const prods = this.state.products.map((item) => {
   
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.category.name}</td>
          <td><img src={"data:image/jpg;base64," + item.image} width="100px" height="100px" alt="" /></td>
          <td>
        {item.imageChitiet && item.imageChitiet.length > 0 ? (
          item.imageChitiet.map((image, index) => (
            <img
              key={index}
              src={"data:image/jpg;base64,"+image}
              width="100px"
              height="100px"
              alt=""
            />
          ))
        ) : (
          <span>Không Có Hình Ảnh</span>
        )}
      </td>
        </tr>
      );
    });
    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      if ((index + 1) === this.state.curPage) {
        return (<span key={index}>| <b>{index + 1}</b> |</span>);
      } else {
        return (<span key={index} className="link" onClick={() => this.lnkPageClick(index + 1)}>| {index + 1} |</span>);
      }
    });
    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">Chi Tiết Sản Phẩm</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Tên Sản Phẩm</th>
                <th>Giá</th>
                <th>Ngày Tạo</th>
                <th>Danh Mục</th>
                <th>Ảnh Chính</th>
                <th>Ảnh Chi Tiết</th>
              </tr>
              {prods}
              <tr>
                <td colSpan="6">{pagination}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="inline" />
        <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
        <div className="float-clear" />
      </div>
    );
  }
  updateProducts = (products, noPages, curPage) => { // arrow-function
    this.setState({ products: products, noPages: noPages, curPage: curPage });
  }
  componentDidMount() {
    this.GetAdminToken();
    this.apiGetProducts(this.state.curPage);
  }

  GetAdminToken(){
    const token_admin = localStorage.getItem('token_admin');
    const config = { headers: { 'x-access-token': token_admin } };
    axios.get('/api/admin/getadmintoken/', config).then((res) => {
      const result = res.data;
      if (result && result.success === false) {
        this.context.setAdmin(null);
        this.context.setToken('');
      } else {
        this.context.setToken(token_admin);
       this.context.setAdmin(result);
      
      }
    });

  }
  // event-handlers
  lnkPageClick(index) {
    this.apiGetProducts(index);
  }
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
    });
  }
}
export default Product;