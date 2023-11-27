
import React, { Component } from 'react';
import ContactInfo from './ContactInfoComponent';
import Gmap from './GmapComponent';
class Footer extends Component {
  
  render() {
    return (
        <footer style={{ backgroundColor: '#000000', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', color: '#FFFFFF' }}>

            <ContactInfo/>
            <Gmap/>
        </footer>
    )}
}
export default Footer;