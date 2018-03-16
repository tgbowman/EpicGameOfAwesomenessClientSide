import React from 'react';
import {Route, BrowserRouter as Router} from "react-router-dom";
import './App.css';
import Home from "../src/components/Home";
import Login from "../src/components/Login";
import AdventureSelect from "../src/components/AdventureSelect";
import CharacterSelect from "../src/components/CharacterSelect";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path='/' component = {Home}/>
            <Route path='/login' component = {Login}/>
            <Route path='/adventure' component = {AdventureSelect}/>
            <Route path='/character/:advId' component = {CharacterSelect}/>
          </div>


        </Router>
      </div>
    );
  }
}

export default App;
