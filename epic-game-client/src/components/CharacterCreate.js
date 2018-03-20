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
                ProfilePicOption1: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
                ProfilePicOption2: "http://interactiveqa.com/wp-content/uploads/2015/07/female-icon-390x450.jpg"


            }
        this.handleChange = this.handleChange.bind(this)
        this.createCharacter = this.createCharacter.bind(this)
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
                
                console.log(data)
                this.props.history.push(`/roadBlock/${this.props.match.params.advId}!${data.id}`)
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


    render() {
        if (this.isUserLoggedIn()) {
            return (
                <div>
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
                    <img name="characterProfileImgUrl" src={this.state.ProfilePicOption1} id={this.state.ProfilePicOption1} width="150" onClick={this.handleChange} />
                    <img name="characterProfileImgUrl" src={this.state.ProfilePicOption2} id={this.state.ProfilePicOption2} width="150" onClick={this.handleChange} />
                    <br />
                    <button onClick = {this.createCharacter}>Create Character</button>
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