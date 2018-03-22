//************** CHARACTER CREATE COMPONENT ************************//
//This component renders the Character Create screen//
//This component handles all functionality for allowing users to create a new character//


import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";

class CharacterCreate extends React.Component {
    constructor(props) {
        super(props),
            this.state = {
                token: localStorage.getItem("token"),
                characterName: "",
                characterClassObject: {},
                characterAbility1: "",
                characterAbility1Desc: "",
                characterAbility2: "",
                characterAbility2Desc: "",
                characterProfileImgUrl: "http://laoblogger.com/images/default-profile-picture-5.jpg",
                characterClassArray: [],
                targetUrl: "http://localhost:5000/api",
                characterProfileImgArray: [
                    { "Warrior": ["https://i.pinimg.com/736x/f2/43/f1/f243f1c584c3c0c25b58e01b2101e447--character-concept-character-design.jpg", "https://i.pinimg.com/originals/31/aa/5f/31aa5f4592d1f3ad923f2a190b1e49ed.jpg"] },
                    { "Rogue": ["https://i.pinimg.com/originals/47/24/c7/4724c740792c361894b07029e5572e6d.jpg", "https://cdnb.artstation.com/p/assets/images/images/001/577/821/large/si-woo-kim-thief-girl.jpg?1448906257"] },
                    { "Mage": ["https://i.pinimg.com/originals/38/e4/8d/38e48d81f213cc2ed24e431d2fc508f0.jpg", "https://i.pinimg.com/originals/53/24/93/532493b498212754985246b06969783d.jpg"] },
                    { "Monk": ["https://i.pinimg.com/originals/b1/04/a8/b104a8422b45a28db783cd751a431ed9.jpg", "http://img11.deviantart.net/a0d7/i/2013/266/c/1/fe_by_cpucore-d6nily4.jpg"] }
                ],
                ProfilePicOption1: "https://t3.ftcdn.net/jpg/01/40/46/18/240_F_140461899_dvRngd7xvZtqCUHLiIyRjgflq2EmwnVP.jpg",
                ProfilePicOption2: "https://t4.ftcdn.net/jpg/01/40/46/19/240_F_140461947_tWo9D0W8QQnrhzhCXJbDHIXblMV9BTZv.jpg"


            }
        this.handleChange = this.handleChange.bind(this)
        this.createCharacter = this.createCharacter.bind(this)
        this.selected = this.selected.bind(this)
    }
    //Invoke to determine if there is a logged in user.
    isUserLoggedIn() {
        return localStorage.getItem("token") !== null;
    }
    //Get the array of available character classes when the component mounts
    componentDidMount() {
        fetch(this.state.targetUrl + "/unitClass", {
            method: "GET",
            mode: "cors"
        })
            .then(r => r.json())
            .then(data => {
                this.setState({
                    characterClassArray: data,
                })
            })
    }

    createCharacter() {
        let characterObj = {
            "name": this.state.characterName,
            "HP": 100,
            "profileImgUrl": this.state.characterProfileImgUrl,
            "unitClassId": this.state.characterClassObject.id
        }
        fetch(this.state.targetUrl + "/character", {
            method: "POST",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + this.state.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(characterObj)
        })
            .then(r => r.json())
            .then(data=> {
                localStorage.setItem("characterId", data.id)
                console.log(data)
                this.props.history.push(`/roadBlock/0`)
            })
    }

    handleChange(e) {
        switch (e.target.name) {
            case "characterName":
                this.setState({
                    characterName: e.target.value
                })
                break;
            case "characterClass":
                if (e.target.value !== "---") {
                    let selectedClass = this.state.characterClassArray.filter(c => c.name === e.target.value)[0]
                    let classTitle = selectedClass.name
                    let classImgs = this.state.characterProfileImgArray.filter(p => p[classTitle])[0][classTitle]
                    this.setState({
                        characterClassObject: selectedClass,
                        ProfilePicOption1: classImgs[0],
                        ProfilePicOption2: classImgs[1],
                        characterAbility1: selectedClass.abilityOneName,
                        characterAbility1Desc: selectedClass.abilityOneDescription,
                        characterAbility2: selectedClass.abilityTwoName,
                        characterAbility2Desc: selectedClass.abilityTwoDescription
                    })
                }
                break;

            case "characterProfileImgUrl":
                this.setState({
                    characterProfileImgUrl: e.target.id
                })
                break;

        }

    }

selected(e){
    let images = Array.from(document.getElementsByClassName("profileImg"))
    
    images.forEach(i=> {
        if(i.classList.contains("border-light")){
            i.classList.remove("border-light")
            i.classList.remove("border")
        }
    })
    e.target.classList.add("border")
    e.target.classList.add("border-light")
    this.setState({
        characterProfileImgUrl: e.target.id
    })
}
    render() {
        if (this.isUserLoggedIn()) {
            return (
                <div className="text-light text-center">
                    <nav>
                        <Logout />
                    </nav>
                    <h2> Character Creator </h2>
                    <input placeholder="Character Name" type="text" name="characterName" onChange={this.handleChange} />
                    <br />
                    <h4>Class:</h4>
                    <select name="characterClass" onChange={this.handleChange}>
                        <option name="---">---</option>
                        {this.state.characterClassArray.map(c => {
                            return <option key={c.id} id={c.id}>{c.name}</option>
                        })}
                    </select>
                
                    <h4>Class Abilities</h4>
                    <ul>
                        <li>{this.state.characterAbility1}: {this.state.characterAbility1Desc}</li>
                        <li>{this.state.characterAbility2}: {this.state.characterAbility2Desc}</li>
                    </ul>
                    <h4>Profile Image</h4>
                    <p>(Click a profile picture to select it)</p>
                    <img className="clickable profileImg" name="characterProfileImgUrl" src={this.state.ProfilePicOption1} id={this.state.ProfilePicOption1} width="150" height="279" onClick={this.selected} />
                    <img className="clickable profileImg" name="characterProfileImgUrl" src={this.state.ProfilePicOption2} id={this.state.ProfilePicOption2} width="150" height="279"onClick={this.selected} />
                    <br />
                    <button id="characterCreateBtn" onClick = {this.createCharacter}>Create Character</button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h2>You must login to create a character</h2>


                </div>
            )
        }
    }
}

export default CharacterCreate;