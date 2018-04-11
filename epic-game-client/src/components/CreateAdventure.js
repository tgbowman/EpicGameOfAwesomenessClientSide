import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";
import CreateRoadBlock from "../components/CreateRoadBlock"

class CreateAdventure extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            adventureTitle: null,
            adventureDesc: null,
            targetUrl: "http://localhost:5000/api",
            token: localStorage.getItem("token"),
            adventureID: null

        }
    }

    createAdventure() {
        let adventureObj =
            {
                "Title": this.state.adventureTitle,
                "Description": this.state.adventureDesc
            }

        fetch(this.state.targetUrl + "adventure", {
            method: "POST",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + this.state.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adventureObj)
        })
            .then(r => r.json())
            .then(data => {
                this.setState({
                    adventureID: data.id
                })
            })
    }



    render() {
        if (this.state.adventureID === null) {
            return (
                <div>
                    <Logout />
                    <h2> Create New Adventure </h2>

                    <input type="text" name="adventureTitle" placeholder="Adventure Title" />

                    <input type="text" name="adventureDesc" placeholder="Adventure Description (Optional)" />

                    <button name="createAdventure" onClick={this.createAdventure}>Create Adventure </button>
                </div>
            )
        } else {
            return (
                <div>
                    <CreateRoadBlock adventureId={this.state.adventureID}/>
                </div>
            )
        }
    }
}