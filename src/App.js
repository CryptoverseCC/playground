import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import IconButton from 'material-ui/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './App.css';

const API = "http://localhost:8000"


class Form extends Component {

  style = {
      container: {
        padding: 20
      },
      response: {
        padding: 20,
        marginTop: 20
      },
      input: {
        display: 'block'
      }
  }

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
    return <Paper style={this.style.container}>
      <strong>Playground</strong>
      <form noValidate autoComplete="off"> 
        {Object.keys(this.spec.params || {}).map(param =>
          <TextField
            style={this.style.input}
            required={this.spec.params[param]}
            id={param}
            label={param}
            value={this.state.params[param]}
            onChange={this.onChange(param)}
            margin="normal"
          />)}
      </form>
      <Button variant="raised" color="primary" onClick={this.fetch.bind(this)}>Run</Button>
      <Paper style={this.style.response}>
        <pre>{JSON.stringify(this.state.response, null, 2)}</pre>
      </Paper>
    </Paper>    
  }
}


const Algo = function Algo (params) {
   return <Card>
    <CardHeader
      title={`${params.data.name}`}
    />
    <CardContent>
      <pre>{params.data.docs}</pre>
      <Form algo={params.data.name} spec={params.data.spec}/>
    </CardContent>
  </Card>;
}

class App extends Component {

  style = {
    title: {
      padding: 20
    }
  }

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
    const response = await fetch(`${API}/experimental_algos`);
    return await response.json(); 
  }

  render() {
    console.log(this.state);
    return <Paper>
      <h2 style={this.style.title}>Algorithms available on Userfeeds Platform</h2>
      {Object.keys(this.state.algorithms).map(key => <Algo data={this.state.algorithms[key]}/>)}
    </Paper>
  }
}

export default App;
