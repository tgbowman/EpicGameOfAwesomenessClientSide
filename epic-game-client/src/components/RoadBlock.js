//********************* ROADBLOCK COMPONENT **************************//
//This component is used to load, and display the adventure story.  Each step in the adventure is called a "Road Block".  This component gets the roadblock data from the database and renders it in the browser.//

import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";
import Combat from "../components/Combat";
import PlayerHud from "../components/PlayerHud";
import ForestAmbient from "../Sound/ForestAmbient.mp3";
import IntroMusic from "../Sound/IntroMusic.mp3";

class RoadBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            token: localStorage.getItem("token"),
            adventureId: localStorage.getItem("adventureId"),
            characterId: localStorage.getItem("characterId"),
            previousChoiceId: props.match.params.prevOptId,
            roadBlock: null,
            pathOptions: null,
            gameOver: false,
            characterInfo: {}
        }
        this.changeRoadBlock = this.changeRoadBlock.bind(this)
    }

    //pre-load all audio files
    componentWillMount() {
        this.ForestAmbient = new Audio(ForestAmbient)
        this.IntroMusic = new Audio(IntroMusic)
    }
    //once the component mounts, get the adventure data
    componentDidMount() {
        fetch(`http://localhost:5000/api/adventureChoice/${this.state.characterId}/${this.state.adventureId}`, {
            method: "GET",
            mode: "cors",
        })
            .then(r => r.json())
            .then(adventureData => {
                if (adventureData.length > 0) {
                    let prevChoiceObj = adventureData

                    this.setState({
                        previousChoiceId: prevChoiceObj.pathOptionId,
                    })
                }
                return adventureData
            })
            .then(() => {
                fetch(`http://localhost:5000/api/character/${this.state.characterId}`, {
                    method: "GET",
                    mode: "cors"
                })
                    .then(r => r.json())
                    .then(characterData => {
                        this.setState({
                            characterInfo: characterData
                        })
                    })
            })
        this.ForestAmbient.play();
        setTimeout(this.changeRoadBlock(), 1000)

    }

    //stop audio playback when component unmounts
    componentWillUnmount() {
        this.ForestAmbient.pause();
        this.IntroMusic.pause()
    }

    isUserLoggedIn() {
        return this.state.token !== null
    }


    //This method is used to change the roadblock to the next in the story path.
    changeRoadBlock(e) {
        //most paths are changed by grabbing the option id from the event
        if (e) {
            let classList = e.target.classList
            let eventId = e.target.id

            let previousChoice = e.target.id
            let advChoiceObj = {
                "AdventureId": this.state.adventureId,
                "CharacterId": this.state.characterId,
                "PathOptionId": parseInt(previousChoice)
            }
            fetch("http://localhost:5000/api/adventureChoice", {
                method: "POST",
                mode: "cors",
                headers: {
                    'Authorization': 'Bearer ' + this.state.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(advChoiceObj)
            }).then(r => {
                if (classList.contains("CombatOptionfalse")) {

                    this.setState({
                        previousChoiceId: previousChoice

                    }, () => {
                        let targetUrl = `http://localhost:5000/api/roadBlock/${this.state.previousChoiceId}`
                        fetch(targetUrl, {
                            method: "GET",
                            mode: "cors"
                        })
                            .then(r => r.json())
                            .then(data => {
                                let roadBlockData = data
                                if (roadBlockData.storyPaths) {
                                    this.setState({
                                        roadBlock: roadBlockData.description,
                                        pathOptions: roadBlockData.storyPaths
                                    })
                                } else {
                                    this.setState({
                                        roadBlock: roadBlockData.description,
                                        pathOptions: null,
                                        gameOver: true
                                    })
                                }
                            })
                    })


                }
                else {
                    if (classList.contains("CombatOptiontrue")) {
                        this.props.history.push(`/combat/${eventId}`)
                    }
                }
            })

        } else {
            //if the previousOptionId == 0 that means this tells the method to get the roadblock that is the starting point.
            if (this.state.previousChoiceId == 0) {
                let targetUrl = "http://localhost:5000/api/roadBlock"
                fetch(targetUrl, {
                    method: "GET",
                    mode: "cors"
                })
                    .then(r => r.json())
                    .then(data => {
                        let roadBlockData = data.filter(d => d.adventureId == this.state.adventureId && d.startingPoint == true)[0]
                        this.setState({
                            roadBlock: roadBlockData.description,
                            pathOptions: roadBlockData.storyPaths
                        })
                    })
            } else {
                //If the previous option id is any number other than 0 that option id will be used to get the next roadblock from the DB.
                let targetUrl = `http://localhost:5000/api/roadBlock/${this.state.previousChoiceId}`
                fetch(targetUrl, {
                    method: "GET",
                    mode: "cors"
                })
                    .then(r => r.json())
                    .then(data => {
                        let roadBlockData = data
                        if (roadBlockData.storyPaths) {
                            this.setState({
                                roadBlock: roadBlockData.description,
                                pathOptions: roadBlockData.storyPaths

                            })
                        } else {
                            this.setState({
                                roadBlock: roadBlockData.description,
                                gameOver: roadBlockData.gameOver
                            }, () => {
                                //if this is game over, the intro music plays instead of the forest ambient music.
                                if (this.state.gameOver === true) {
                                    this.ForestAmbient.pause()
                                    this.IntroMusic.play()
                                }
                            })

                        }
                    })
            }
        }


    }

    render() {
        if (this.state.pathOptions !== null) {
            return (
                <div>

                    <h3 className="text-center text-light container roadBlockDesc">{this.state.roadBlock}</h3>
                    <PlayerHud combat="false" characterData={this.state.characterInfo} pathOptions={this.state.pathOptions} changeRoadBlock={this.changeRoadBlock} />
                </div>

            )
        } else {
            if (this.state.gameOver == false) {
                return (
                    <h4 className="text-light text-center">Performing Action...</h4>
                )
            } else {
                return (
                    <div>
                        <nav>
                            <Logout />
                        </nav>
                        <h3 className="text-center text-light container roadBlockDesc">{this.state.roadBlock}</h3>
                        <div className="returnToHome"><Link to="/adventure"> Return to Adventure Select </Link></div>
                    </div>
                )
            }

        }

    }

}

export default RoadBlock