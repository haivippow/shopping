import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import { toast } from 'react-toastify';

class ProductDetail extends Component {
    static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      selectedSize: '',
      sizes:[],
      selectedImage:null
    };
  }
  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (  
        <div className="align-center">
          <h2 className="text-center">Chi Tiết Sản Phẩm</h2>
          <figure className="caption-right">
          {this.state.selectedImage ? (
              <img
                src={"data:image/jpg;base64," + this.state.selectedImage}
                width="400px"
                height="400px"
                alt=""
              />
            ) : (
              <img src={"data:image/jpg;base64," + prod.image} width="400px" height="400px" alt="" />
            )}
            <figcaption>
              <form>
                <table>
                  <tbody>
                    {/* <tr>
                      <td align="right">ID:</td>
                      <td>{prod._id}</td>
                    </tr> */}
                    <tr>
                      <td align="right">Tên Sản Phẩm:</td>
                      <td>{prod.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Giá:</td>
                      <td>{(prod.price).toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                    <tr>
                      <td align="right">Danh Mục:</td>
                      <td>{prod.category.name}</td>
                    </tr>
                    {prod.category.size==='1' && (
                  <tr>
                  <td align="right">Chọn Size:</td>
                  <td>
                    <select value={this.state.selectedSize} onChange={(e) => this.handleSizeChange(e)}>
                    {this.state.sizes.map((sizes) => (
                      <option key={sizes._id} value={sizes.name}>
                        {sizes.name}
                      </option>
                    ))}

                    </select>
                  </td>
                </tr>
                  )}

                    <tr>
          <td align="right">Số Lượng:</td>
          <td><input type="number" min="1" max="99" value={this.state.txtQuantity} onChange={(e) => { this.setState({ txtQuantity: e.target.value }) }} /></td>
        </tr>
        <tr>
          <td></td>
          <td><input type="submit" value="Thêm vào Giỏ Hàng" onClick={(e) => this.btnAdd2CartClick(e)} /></td>
        </tr>
        <tr>
          <td></td>
          <td><input type="submit" value="Yêu Thích" onClick={(e) => this.btnAddFavoriteClick(e)} /></td>
        </tr>
                  </tbody>
                </table>
              </form>
       
            </figcaption>
            
          </figure>
          {prod.imageDetail.length > 0 && (
            <div className="image-container">
              {prod.imageDetail.slice(0, 4).map((image, index) => (
                 <img key={index} src={"data:image/jpg;base64," + image} width="100px" height="100px" alt="" 
                 style={{ marginRight: '10px',cursor:'pointer', border: this.state.selectedImage === image ? '2px solid red' : 'none' }}
                  onClick={() => this.handleThumbnailClick(image)}/>))}
            </div>
              )}

        </div>
      );
    }
    return (<div />);
  }

  handleThumbnailClick(selectedImage) {
    this.setState({ selectedImage });
  }
  handleSizeChange = (e) => {
    this.setState({ selectedSize: e.target.value });
  };

  btnAddFavoriteClick(e) {
    e.preventDefault();
    const product =this.state.product;
    const customer = this.context.customer;
        if (customer) {
          this.apiFavorites(product, customer);
        } else {
          this.props.navigate('/login');
        }
  }
  // apis
  apiFavorites( product, customer) {
    const body = {  product: product, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/productfavorites', body, config).then((res) => {
      const result = res.data;
      console.log(result);
      if(result && result.success ===false){
        this.context.setCustomer(null);
        this.props.navigate('/login');
      }
      // alert(result.message);
      toast.success(result.message);
    });
  }

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

  btnAdd2CartClick = (e) => {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
  
    if (product.category.size === '1') {
      if(this.state.selectedSize){
        if (quantity) {
          const mycart = this.context.mycart;
          const index = mycart.findIndex(
            (x) => x.product._id === product._id && x.size === this.state.selectedSize
          );
    
          if (index === -1) {
            const newItem = { product: product, quantity: quantity, size: this.state.selectedSize };
            mycart.push(newItem);
          } else {
            mycart[index].quantity += quantity;
          }
    
          this.context.setMycart(mycart);
    
          // Lưu giỏ hàng vào localStorage
          localStorage.setItem('mycart', JSON.stringify(mycart));
          
          // alert('Thêm Vào Giỏ Thành Công');
          toast.success('Thêm Vào Giỏ Thành Công');
        } else {
          alert('Vui Lòng Nhập Số Lượng');
          toast.info('Vui Lòng Nhập Số Lượng');
        }
      }
      else{
        toast.warn('Vui Lòng Chọn Size');
        // alert('Vui Lòng Chọn Size');
      }
    } else {
      // Tương tự cho trường hợp khi size không phải '1'
      if (quantity) {
        const mycart = this.context.mycart;
        const index = mycart.findIndex(
          (x) => x.product._id === product._id && x.size === '0'
        );
  
        if (index === -1) {
          const newItem = { product: product, quantity: quantity, size: '0' };
          mycart.push(newItem);
        } else {
          mycart[index].quantity += quantity;
        }
  
        this.context.setMycart(mycart);
  
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('mycart', JSON.stringify(mycart));
  
        toast.success('Thêm Vào Giỏ Thành Công');
      } else {
        toast.info('Vui Lòng Nhập Số Lượng');
      }
    }
  };
  
  componentDidMount() {
    this.GetUserToken();
    const params = this.props.params;
    this.apiGetProduct(params.id);
    this.apiGetSizes();
  }
  // apis
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }
  apiGetSizes = () => {
    axios.get('/api/customer/sizes').then((res) => {
      const result = res.data;
      this.setState({ sizes: result });
      console.log(result);
    });
    
  };
}
export default withRouter(ProductDetail);