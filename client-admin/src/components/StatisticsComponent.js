// Satistics.jsx
import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Satistics extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      thongke: {},
      itemSelected: null,
    };
  }

  render() {
    const { thongke } = this.state;

    const cates = (
      <tr>
        <td>{thongke.customersCount}</td>
        <td>{thongke.categoriesCount}</td>
        <td>{thongke.notiCount}</td>
        <td>{thongke.sizeCount}</td>
        <td>{thongke.sliderCount}</td>
        <td>{thongke.orderCountPENDING}</td>
        <td>{thongke.orderCountAPPROVED}</td>
        <td>{thongke.orderCountCANCELED}</td>
        <td>{thongke.productCount}</td>
        <td>{thongke.doanhthu ? thongke.doanhthu.toLocaleString('vi-VN'):''} VNĐ </td>
     
        {/* Add other fields as needed */}
      </tr>
    );

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">THỐNG KÊ SỐ LƯỢNG</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>Khách Hàng</th>
                <th>Danh Mục</th>
                <th>Thông Báo</th>
                <th>Size</th>
                <th>Slider</th>
                <th>ORDER PENNING</th>
                <th>ORDER APPROVED</th>
                <th>ORDER CANCELED</th>
                <th>SẢN PHẨM</th>
                <th>DOANH THU</th>
                {/* Add other headers as needed */}
              </tr>
              {cates}
            </tbody>
          </table>
        </div>

        <div className="float-clear" />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetSatistics();
    this.GetAdminToken();
  }

  GetAdminToken() {
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
        this.context.setUsername(result.username);
      }
    });
  }

  // apis
  apiGetSatistics() {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.get('/api/admin/thongke', config).then((res) => {
      const result = res.data;
      this.setState({ thongke: result });
    });
  }
}

export default Satistics;
