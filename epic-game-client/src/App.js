import React from 'react';
import {Route, BrowserRouter as Router} from "react-router-dom";
import './App.css';
import Home from "../src/components/Home";
import Auth from "../src/components/Auth";
import AdventureSelect from "../src/components/AdventureSelect";
import CharacterSelect from "../src/components/CharacterSelect";
import CharacterCreate from "../src/components/CharacterCreate";
import RoadBlock from "../src/components/RoadBlock";
import Combat from "../src/components/Combat";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path='/' component = {Home}/>
            <Route path='/login' component = {Auth}/>
            <Route path='/adventure' component = {AdventureSelect}/>
            <Route path='/character/:advId' component = {CharacterSelect}/>
            <Route path='/characterCreate/:advId' component = {CharacterCreate}/>
            <Route path='/roadBlock/:data' component = {RoadBlock}/>
            <Route path='/combat/:combatOptionId' component = {Combat}/>
          </div>


        </Router>
      </div>
    );
  }
}

export default App;
