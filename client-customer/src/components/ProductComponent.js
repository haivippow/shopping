import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import { toast } from 'react-toastify';

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }
  render() {
    const prods = this.state.products.map((item) => {
      return (
        <div key={item._id} className="inline">
          <figure>
          <Link to={'/product/' + item._id}><img src={"data:image/jpg;base64," + item.image} width="300px" height="300px" alt="" /></Link>
            <figcaption className="text-center">Tên Sản Phẩm: {item.name}<br />Giá: {(item.price).toLocaleString('vi-VN')} VNĐ</figcaption>
          </figure>
        </div>
      );
    });
    return (
      <div className="text-center">
        <h2 className="text-center">Danh Sách Sản Phẩm</h2>
        {prods}
      </div>
    );
  }
  componentDidMount() { // first: /product/...
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    }else if(params.keyword){
        this.apiGetProductsByKeyword(params.keyword);
    }
    this.getCart();
  }
  componentDidUpdate(prevProps) { // changed: /product/...
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    }else if(params.keyword && params.keyword !== prevProps.params.keyword){
        this.apiGetProductsByKeyword(params.keyword);

    }
  }
   // apis
   apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
        if (Array.isArray(result) && result.length > 0) {
          this.setState({ products: result });
          toast.success("Tìm Kiếm Sản Phẩm Thành Công");
        } else {
          // Handle the case where the array is empty or not an array
           toast.error("Không Tìm Thấy Sản Phẩm");
        }
        
      
    });
  }
  // apis
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }
}
export default withRouter(Product);