import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import IconButton from 'material-ui/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './App.css';


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
    this.api = params.api;
    this.spec = params.spec;
    this.algo = params.algo;
    this.state = {
      params: {},
      response: null
    }
  }

  async fetch() {
    let response = await fetch(`${this.api}`, {
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
            key={param}
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
      <Form api={params.api} algo={params.data.name} spec={params.data.spec}/>
    </CardContent>
  </Card>;
}

class App extends Component {

  style = {
    title: {
      padding: 20
    }
  }

  envs = {
    local: "http://localhost:8000",
    development: "http://api-dev.userfeeds.io/ranking",
    staging: "http://api-staging.userfeeds.io/ranking",
    production: "http://api.userfeeds.io/ranking",
  }

  constructor() {
    super();
    this.state = {
      algorithms: {}
    };
  }

  async componentDidMount() {
    await this.getAlgortihms('production');
  }

  async getAlgortihms(env) {
    const api = this.envs[env];
    const response = await fetch(`${api}/experimental_algos`);
    const data = await response.json(); 
    this.setState({
      algorithms: data.items,
      api
    });
  }

  render() {
    return <Paper>
      <h2 style={this.style.title}>Algorithms available on Userfeeds Platform</h2>
      <Button variant="raised" color="primary" onClick={() => {this.getAlgortihms('local')}}>Local</Button>
      <Button variant="raised" color="primary" onClick={() => {this.getAlgortihms('development')}}>Development</Button>
      <Button variant="raised" color="primary" onClick={() => {this.getAlgortihms('staging')}}>Staging</Button>
      <Button variant="raised" color="primary" onClick={() => {this.getAlgortihms('production')}}>Production</Button>
      {Object.keys(this.state.algorithms).map(key => <Algo key={key} api={this.state.api} data={this.state.algorithms[key]}/>)}
    </Paper>
  }
}

export default App;
