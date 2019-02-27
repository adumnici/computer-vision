import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLink/ImageLink.js';
import Rank from './components/Rank/Rank.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecog/FaceRecognition.js';
import SignIn from './components/SignIn/SignIn'
import Register from './components/Registration/Registration'



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
      box: {},
      route: 'SignIn',
      isSignedIn: false,
      user: {
         id: '',
         name:'',
         email:'',
         entries: 0,
         joined: ''
      }
    }
  }

  loadUser = (data) => {
     this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined}})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
}

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
         if(response){
            fetch('http://localhost:3001/image',{
               method:'put',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                  id: this.state.user.id,
			         })
            })
            .then(response => response.json())
            .then(count => {
               this.setState(Object.assign(this.state.user, {entries: count}))
            })
         }
         this.displayFaceBox(this.calculateFaceLocation(response))})
      .catch(err => console.log(err))
    }

   onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route==='home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route: route})
    }

  render() {
    return (
      <div className="App">
      <Particles className='particles'
        params={particleOptions} />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home' ?
        <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm 
             onInputChange={this.onInputChange} 
             onButtonSubmit={this.onSubmit}/>
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        : (
          this.state.route === 'SignIn' ?
        <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
    }
      </div>
    );
  }
}

export default App;
