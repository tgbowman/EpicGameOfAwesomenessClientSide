import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";

class CreateAdventure extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            previousPathOption: "",
            prevPathOptionId: null,
            adventureStart: false,
            roadBlockDesc: null,
            adventureEnd: false,
            pathOption1: null,
            pathOption2: null
        }
        this.handleChange = this.handleChange.bind(this)
    }

//Function that updates the state when input fields are changed.
    handleChange(e) {
        switch (e.target.name) {
            case "startAdv":
                this.setState({
                    adventureStart: e.target.value
                })
                break;
            case "roadBlockDesc":
                this.setState({
                    roadBlockDesc: e.target.value
                })
                break;
            case "endAdv":
                this.setState({
                    adventureEnd: e.target.value
                })
                break;
            case "pathOption1":
                this.setState({
                    pathOption1: e.target.value
                })
                break;
            case "pathOption2":
                this.setState({
                    pathOption2: e.target.value
                })
                break;
        }


//Function that will create the road block based on the user input.
        createRoadBlock()
        {

        }





    }
    render() {
        return (

            <div>
                <h2> Create a Road Block! </h2>
                <input name="startAdv" type="checkbox" id="startAdvBool" onChange={this.handleChange} />
                <label for="startAdvBool">First Road Block</label>

                <h3> Previous Path Option: </h3>
                <p id="prevOption"> {this.state.previousPathOption} </p>

                <input placeholder="Road Block Description" type="text" name="roadBlockDesc" onChange={this.handleChange}/>

                <input name="endAdv" type="checkbox" id="endAdvBool" onChange={this.handleChange}/>
                <label for="endAdvBool">End of Adventure</label>

                <input placeholder="Path Option 1" type="text" name="pathOption1" onChange={this.handleChange}/>

                <input placeholder="Path Option 2" type="text" name="pathOption2" onChange={this.handleChange}/>

                <button id="createRoadBlock">Create Road Block</button>



            </div>)
    }
}