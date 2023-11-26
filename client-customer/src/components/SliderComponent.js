
import React, { Component } from 'react';
import SlickSlider from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import withRouter from '../utils/withRouter';
import Slider1 from '../assets/images/1.jpg';
import Slider2 from '../assets/images/2.jpg';
import Slider3 from '../assets/images/3.jpg';

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrImages: [Slider1, Slider2, Slider3],
    };
  }

  render() {
    const { arrImages } = this.state;
    const settings = {
      dots: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    };
    return (
      <SlickSlider {...settings}>
        {arrImages.map((image, index) => (
          <img key={index} src={image} alt={`Slider-${index}`} preview={false} height="350px" />
        ))}
      </SlickSlider>
    );
  }

  componentDidMount() {
    const images = [Slider1, Slider2, Slider3];
    this.setState({ arrImages: images });
  }
}

export default withRouter(Slider);