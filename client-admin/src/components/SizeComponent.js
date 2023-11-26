import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import SizeDetail from './SizeDetailComponent';

class Size extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
        sizes: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.sizes.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
        </tr>
      );
    });
    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">DANH SÁCH SIZE</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name Size</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>
        <div className="inline" />
     <SizeDetail item={this.state.itemSelected} updateSizes={this.updateSizes} />
        <div className="float-clear" />
      </div>
    );
  }

  updateSizes = (sizes) => { // arrow-function
    this.setState({ sizes: sizes });
  }
  componentDidMount() {
    this.apiGetSizes();
    this.GetAdminToken();
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
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetSizes() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/sizes', config).then((res) => {
      const result = res.data;
      this.setState({ sizes: result });
    });
  }
}
export default Size;