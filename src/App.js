import React,{ Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
import Clarifai from 'clarifai';
import Logo from './Components/Logo/Logo.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js'
import Rank from './Components/Rank/Rank.js';
import Particles from "react-tsparticles";
import SignIn from './Components/SignIn/SignIn.js'
import Register from './Components/Register/Register'

const app = new Clarifai.App({
  apiKey: "dc1655e8f817409194c6e4f9f93b0f22",
 });

const particlesInit = (main) => {
  console.log(main);

  // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
};

const particlesLoaded = (container) => {
  console.log(container);
};


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'SignIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''

  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
            id:data.id,
            name: data.name,
            email:data.email,
            entries: data.entries,
            joined: data.joined
    }})
  }
// //Signin Page 
//   componentDidMount() {
//     fetch('http://localhost:3000/')
//     .then(response => response.json())
//     .then(console.log)
//   }

calculateFaceLocation=(data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  console.log(width, height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  console.log(box);
  this.setState({box:box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
 app.models
.predict(
Clarifai.FACE_DETECT_MODEL,
// THE JPG
this.state.input)
.then(response => {
  if (response) {
    fetch('http://localhost:3000/image', {
      method:'put',
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify({
                id:this.state.user.id
            })
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, { entries: count }))
      })
    .catch(console.log)
  }
    this.displayFaceBox(this.calculateFaceLocation(response));
  })  
  .catch(err => console.log(err));
}

  onRouteChange = (route) => {
    if(route === 'signout') {
    route = 'SignIn';
    this.setState(initialState);
    }
    else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
    <div className="App">
    <Particles className= 'particles'
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 20,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 3,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 1,
          },
        },
        detectRetina: true,
      }}
    />
     <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
     {route === 'home' 
      ? <div>
      <Logo/> 
     <Rank 
        name={this.state.user.name}
        entries={this.state.user.entries}
     />
     <ImageLinkForm 
     onInputChange={this.onInputChange} 
    onButtonSubmit={this.onButtonSubmit}/>
     
     <FaceRecognition box={box} imageUrl={imageUrl} />
     </div>
        : (
          route === 'SignIn'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
     }
    </div>
    );
  }
  
}

export default App;
