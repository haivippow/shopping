import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import NotificationDetail from './NotificationDetailComponent';

class Notification extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.notifications.map((item) => {
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
          <h2 className="text-center">NOTIFICATION LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>
        <div className="inline" />
     <NotificationDetail item={this.state.itemSelected} updateNotifications={this.updateNotifications} />
        <div className="float-clear" />
      </div>
    );
  }

  updateNotifications = (notifications) => { // arrow-function
    this.setState({ notifications: notifications });
  }
  componentDidMount() {
    this.apiGetNotifications();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetNotifications() {
    const config = { headers: { 'x-access-token': this.context.admin.token_web_admin } };
    axios.get('/api/admin/notifications', config).then((res) => {
      const result = res.data;
      this.setState({ notifications: result });
    });
  }
}
export default Notification;