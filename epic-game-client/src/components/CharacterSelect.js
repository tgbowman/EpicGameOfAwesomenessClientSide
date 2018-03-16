import React from "react";
import { Link, Redirect } from "react-router-dom";

class CharacterSelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            adventureId: this.props.match.params.advId,
            UserCharacters: [],
            token: localStorage.getItem("token")
        }
        this.getUserCharacters = this.getUserCharacters.bind(this)
    }

    getUserCharacters() {
        let userName = "";

        let targetUrl = "http://localhost:5000/api"
        fetch(targetUrl + '/token', {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(r => r.json())
            .then(data => {
                userName = data.username;
                console.log(userName)
            })

        fetch(targetUrl + '/character', {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(r => r.json())
            .then(char => {
                console.log(char)
                let characters = []
                char.forEach(ch => {
                    if (ch.user.userName == userName) 
                    {
                        characters.push(ch)
                    }
                })
                console.log(characters)
                this.setState({
                    UserCharacters: characters
                })
            })



    }

    componentDidMount() {
        this.getUserCharacters()
    }
    render() {
        return (
            <div>
                <h2>Select a Character</h2>
                {this.state.UserCharacters.map(ch => {
                     
                    return <div key = {ch.id} className="CharacterSelectBox">
                        <img src={ch.profileImgUrl} width="150"/>
                        <h3>{ch.name}</h3>
                        <h4>Class: {ch.unitClass.name}</h4>
                        <button id = {ch.id}>Select {ch.name}</button>
                        
                    </div>
                })}

                <button id="CreateNewCharacter">Create a New Character</button>

                
            </div>
        )
    }

}

export default CharacterSelect;