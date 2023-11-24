import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class NotificationDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }
  render() {
    return (
      <div className="float-right">
        <h2 className="text-center">NOTIFICATION LIST</h2>
        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td><input type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} /></td>
              </tr>
              <tr>
                <td>Name</td>
                <td><input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td></td>
                <td>
                <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />

                <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />

                <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />

                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
   // event-handlers
   btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutNotification(id, cate);
    } else {
      alert('Please input id and name');
    }
  }
  // apis
  apiPutNotification(id, cate) {
    const config = { headers: { 'x-access-token': this.context.admin.token_web_admin } };
    axios.put('/api/admin/notifications/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetNotifications();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
   // event-handlers
   btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteNotification(id);
      } else {
        alert('Please input id');
      }
    }
  }
  // apis
  apiDeleteNotification(id) {
    const config = { headers: { 'x-access-token': this.context.admin.token_web_admin } };
    axios.delete('/api/admin/notifications/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetNotifications();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostNotification(cate);
    } else {
      alert('Please input name');
    }
  }
  // apis
  apiPostNotification(cate) {
    const config = { headers: { 'x-access-token': this.context.admin.token_web_admin } };
    axios.post('/api/admin/notifications', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetNotifications();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  apiGetNotifications() {
    const config = { headers: { 'x-access-token': this.context.admin.token_web_admin } };
    axios.get('/api/admin/notifications', config).then((res) => {
      const result = res.data;
      this.props.updateNotifications(result);
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }
}
export default NotificationDetail;