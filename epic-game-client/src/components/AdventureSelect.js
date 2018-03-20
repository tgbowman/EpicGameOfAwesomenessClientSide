import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";

class AdventureSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            adventures: [],
            token: localStorage.getItem("token")
        }
        this.getAdventures = this.getAdventures.bind(this)
        this.selectAdventure = this.selectAdventure.bind(this)
        this.isUserLoggedIn = this.isUserLoggedIn.bind(this)
    }
    //On load pull in the adventure data from the api
    getAdventures() {
        let targetUrl = "http://localhost:5000/api/adventure"
        fetch(targetUrl, {
            method: "GET",
            mode: "cors"
        }).then(r => r.json())
            .then(data => {
                this.setState({
                    adventures: data
                })
                console.log(this.state.adventures)
            })
    }

    componentDidMount() {
        this.getAdventures()
    }
    
    isUserLoggedIn() {
        return localStorage.getItem("token") !== null;
    }

    selectAdventure(e) {
        this.props.history.push(`/character/${e.target.id}`, this.state)
    }
    render() {
        if (this.isUserLoggedIn()) {
            return (
                <div>
                <nav>
                    <Logout/>
                </nav>
                    <h2>Select an Adventure to Embark Upon</h2>
                    <hr />
                    {this.state.adventures.map(a => {
                        return <div key={a.id} className="AdventureBox" id={a.id}>
                            <h4>{a.title}</h4>
                            <button id={a.id} onClick={this.selectAdventure}>Select</button>
                        </div>

                    })}
                </div>
            )
        }
        else {
            return (
                <div>
                    <h2>You must be logged in to select an adventure</h2>
                </div>
            )
        }
    }



}

export default AdventureSelect;