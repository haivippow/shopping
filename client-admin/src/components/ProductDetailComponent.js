import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { toast } from 'react-toastify';

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      imgDetail: [],
    };
  }
  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (<option key={cate._id} value={cate._id} selected={cate._id === this.props.item.category._id}>{cate.name}</option>);
      } else {
        return (<option key={cate._id} value={cate._id}>{cate.name}</option>);
      }
    });
    return (
      <div className="float-right">
        <h2 className="text-center">Thêm Sản Phẩm</h2>
        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td><input type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} /></td>
              </tr>
              <tr>
                <td>Tên Sản Phẩm</td>
                <td><input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td>Giá</td>
                <td><input type="text" value={this.state.txtPrice} onChange={(e) => { this.setState({ txtPrice: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td>Ảnh Chính</td>
                <td><input type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImage(e)} /></td>
              </tr>
              <tr>
                <td>Ảnh Chi Tiết</td>
                <input type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImageChitiet(e)} multiple />
              </tr>
              <tr>
                <td>Danh Mục</td>
                <td><select onChange={(e) => { this.setState({ cmbCategory: e.target.value }) }}>{cates}</select></td>
              </tr>
              <tr>
                <td></td>
                <td>
                <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
                <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                </td>
              </tr>
              <td colSpan="2">
                {this.state.imgProduct && <img src={this.state.imgProduct} width="300px" height="300px" alt="" />}
              </td>
              <tr>
                <td colSpan="2">  
                  {this.state.imgDetail.map((image, index) => (
                    <img key={index}  src={image} width="150px" height="150px" alt="" />
                  ))}
                </td>
              </tr>

              <tr>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
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
  componentDidMount() {
    this.GetAdminToken();
    this.apiGetCategories();
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image,
        imgDetail: (this.props.item.imageDetail || []).map(image => 'data:image/jpg;base64,' + image),
      }, () => {
        console.log('Updated state:', this.state.imgDetail);
      });
  
      console.log('Prop value:', this.props.item.imgDetail);
    }
  }
  
  
  
  
   btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        toast.info("Vui Lòng Nhập ID");
      }
    }
  }
  // apis
  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Xoá Thành Công");
        this.apiGetProducts();
      } else {
        toast.error("Xoá Không Thành Công");
      }
    });
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    const imageDetail = this.state.imgDetail.map((img) => img.replace(/^data:image\/[a-z]+;base64,/, ''));
    if(imageDetail.length<5){
      if (id && name && price && category && image && imageDetail.length >0) {
        const prod = { name: name, price: price, category: category, image: image, imageDetail: imageDetail};
        this.apiPutProduct(id, prod);
      } else {
        toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
      }
    }
    else{
      toast.warn('Vui Lòng Chọn 4 Ảnh Chi Tiết');
    }
    
  }
  // apis
  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Cập Nhập Thành Công");
        this.apiGetProducts();
      } else {
        toast.error("Cập Nhập Không Thành Công");
      }
    });
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    const imageDetail = this.state.imgDetail.map((img) => img.replace(/^data:image\/[a-z]+;base64,/, ''));
    if(imageDetail.length<5){
      if (name && price && category && image && imageDetail.length > 0) {
        const prod = { name: name, price: price, category: category, image: image, imageDetail: imageDetail };
        this.apiPostProduct(prod);
      } else {
        toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
      }
    }
    else{
      toast.warn('Vui Lòng Chọn 4 Ảnh Chi Tiết');
    }
  }
  
  // apis
  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Thêm Thành Công");
        this.apiGetProducts();
      } else {
        toast.error("Thêm Không Thành Công");
      }
    });
  }
  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;   
  if (result.products.length !== 0) {
    this.props.updateProducts(result.products, result.noPages, result.curPage);
  } else {
    const curPage = this.props.curPage - 1;
    axios.get('/api/admin/products?page=' + curPage, config).then((res) => {
      const result = res.data;
      this.props.updateProducts(result.products, result.noPages, curPage);
    });
  }
  });
  }
  // event-handlers
  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      }
      reader.readAsDataURL(file);
    }
  }
  previewImageChitiet(e) {
    const files = e.target.files;
    const newImages = [];
  
    // Check if files exist
    if (files.length > 0) {
      // Use Promise.all to handle asynchronous file reading
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
  
          reader.onload = (evt) => {
            // Push each data URL to the newImages array
            newImages.push(evt.target.result);
            resolve();
          };
  
          // Read the current file
          reader.readAsDataURL(file);
        });
      });
  
      // After all files are read, update the state
      Promise.all(promises).then(() => {
        this.setState({ imgDetail: newImages }, () => {
  
        });
      });
    }
  }
  
  

  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default ProductDetail;