import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import { ROUTES } from './routes';
import './Semantic-UI-CSS/semantic.min.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Home } from './Components/Home';


class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Switch>
            { ROUTES.map((route, index) => <Route key={index} { ...route } />) }
          </Switch>
        </Router>
        {/* <Main></Main> */}
      </>
    );
  }
}

export default App;