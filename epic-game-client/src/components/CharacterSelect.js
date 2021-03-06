//************** CHARACTER SELECT COMPONENT ************************//
//This component renders the character select screen//
//From here the user can select one of their previously created characters, or create a new character//


import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";

class CharacterSelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            adventureId: this.props.match.params.advId,
            UserCharacters: [],
            token: localStorage.getItem("token")
        }
        this.getUserCharacters = this.getUserCharacters.bind(this)
        this.goToCharacterCreate = this.goToCharacterCreate.bind(this)
        this.startGame = this.startGame.bind(this)

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

    goToCharacterCreate() {
        this.props.history.push(`/characterCreate/${this.state.adventureId}`)
    }

    startGame(e) {
        localStorage.setItem("characterId", e.target.id)
        fetch(`http://localhost:5000/api/adventureChoice/${e.target.id}/${this.state.adventureId}`,{
            method: "DELETE",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + this.state.token,
                "Content-Type": "application/json"
            }
        })
        .then(r => {
            this.props.history.push(`/roadBlock/0`)
        })
    }

    componentDidMount() {
        this.getUserCharacters()
    }
    render() {
        return (
            <div className="text-light text-center">
                <nav>
                    <Logout/>
                </nav>
                <h2>Select a Character</h2>
                {this.state.UserCharacters.map(ch => {
                     
                    return <div key = {ch.id} className="CharacterSelectBox border border-light">
                        <img src={ch.profileImgUrl} width="150"/>
                        <h3>{ch.name}</h3>
                        <h4>Class: {ch.unitClass.name}</h4>
                        <button id = {ch.id} onClick = {this.startGame}>Select {ch.name}</button>
                        
                    </div>
                })}

                <button id="CreateNewCharacter" onClick = {this.goToCharacterCreate}>Create a New Character</button>

                
            </div>
        )
    }

}

export default CharacterSelect;