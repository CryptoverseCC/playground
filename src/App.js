import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const API = "http://localhost:8000"


class Form extends Component {

  constructor(params) {
    super()
    this.spec = params.spec;
    this.algo = params.algo;
    this.state = {
      params: {},
      response: null
    }
  }

  async fetch() {
    let response = await fetch(`${API}`, {
      body: JSON.stringify({
        flow: [
          {
            algorithm: this.algo,
            params: this.state.params
          }
        ]
      }), // must match 'Content-Type' header
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
    })
    let data = await response.json();
    this.setState({response: data});
  }

  onChange(param) {
    return (event) => {
      let params = this.state.params;
      params[param] = event.target.value;
      this.setState({params});
    }
  }

  render() {
    if (this.spec.params) {
      return <div>
        <h3>Params:</h3>
        {
          Object.keys(this.spec.params).map(param => <div key={param}>
            {param} (required: {this.spec.params[param] ? "True": "False"})
            <input type="text" onChange={this.onChange(param)} value={this.state.params[param]}/>
            </div>)}
        <button onClick={this.fetch.bind(this)}>Run</button>
        <br/>
        Response: {JSON.stringify(this.state.response)}
      </div>
    }

    return <div>Missing specification</div>;
  }
}


const Algo = function Algo (params) {
  

  

  return <div>
    <h2>{params.data.name}</h2>
    <pre>{params.data.docs}</pre>
    <Form algo={params.data.name} spec={params.data.spec}/>
  </div>;
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      algorithms: {}
    };
  }

  async componentDidMount() {
    const algorithms = await this.getAlgortihms();
    this.setState({
      algorithms: algorithms.items
    })
  }

  async getAlgortihms() {
    const response = await fetch(`${API}/algos`);
    return await response.json(); 
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Userfeeds Playground</h1>
        </header>
        <ul>
        {Object.keys(this.state.algorithms).map(key => <li key={key}><Algo data={this.state.algorithms[key]}/></li>)}
        </ul>
      </div>
    );
  }
}

export default App;
