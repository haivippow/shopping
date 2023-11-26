import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ContactDetail from './ContactDetailComponent';


class Contact extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
        contacts: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.contacts.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{item.noidung}</td>
        </tr>
      );
    });
    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">DANH SÁCH LIÊN HỆ</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Title</th>
                <th>Nội Dung</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>
        <div className="inline" />
     <ContactDetail item={this.state.itemSelected} updateContacts={this.updateContacts} />
        <div className="float-clear" />
      </div>
    );
  }

  updateContacts = (contacts) => { // arrow-function
    this.setState({ contacts: contacts });
  }
  componentDidMount() {
    this.apiGetContacts();
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
  apiGetContacts() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/contacts', config).then((res) => {
      const result = res.data;
      this.setState({ contacts: result });
    });
  }
}
export default Contact;