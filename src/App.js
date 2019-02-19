import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLink/ImageLink.js';
import Rank from './components/Rank/Rank.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecog/FaceRecognition.js';

const app = new Clarifai.App({
 apiKey: '669997d47f2f4c7f9e52e0a1ce9601b6'
});

const particleOptions = {
  particles: {
      number:{
         value:80,
         density: {
            enable:true,
            value_area:800
         }
      },
      shape: {
         type: "circle",
         stroke: {
            width: 0,
            color: "#000000"
         },
         polygon: {
            nb_sides: 5
         }
      },
      color: {
         value: "#ffffff"
      },
      opacity:{
         value: 1,
         random: false,
         anim: {
            enable: false,
            speed: 1,
            opacity_min: 1,
            sync: true
         }
      },
   },
   interactivity: {
      detect_on: "window",
      events: {
         onhover: {
            enable: true,
            mode: "grab"
         },
         onclick: {
            enable: true,
            mode: "repulse"
         },
         resize: true
      },
      modes: {
         grab: {
            distance: 800,
            line_linked: {
               opacity: 1
            }
         },
         bubble: {
            distance: 800,
            size: 80,
            duration: 2,
            opacity: 0.8,
            speed: 3
         },
         repulse: {
            distance: 400,
            duration: 0.4
         },
         push: {
            particles_nb: 4
         },
         remove: {
            particles_nb: 2
         }
      }
   }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      input:'',
      imageUrl:'',
    }
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
    function(response) {
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
    },
    function(err) {
      // there was an error
    }
  );
  }

  render() {
    return (
      <div className="App">
      <Particles className='particles'
        params={particleOptions} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onSubmit}/>
      <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
