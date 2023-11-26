import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

class ContactInfo extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">Contact Info</h2>
        {this.state.contacts.map((contact) => (
          <div key={contact._id.$oid}>
             <p><strong>{contact.name}:</strong> {contact.noidung}</p>

          </div>
        ))}
      </div>
    );
  }


  apiGetContacts = () => {
    axios.get('/api/customer/contacts').then((res) => {
      const result = res.data;
      this.setState({ contacts: result });
    });
  };

  componentDidMount(){
    this.apiGetContacts();
  }
}

export default ContactInfo;
