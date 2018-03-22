import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";
import Combat from "../components/Combat";
import PlayerHud from "../components/PlayerHud";
import ForestAmbient from "../Sound/ForestAmbient.mp3"

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


    componentWillMount() {
        this.ForestAmbient = new Audio(ForestAmbient)
    }
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

    componentWillUnmount() {
        this.ForestAmbient.pause();
    }

    isUserLoggedIn() {
        return this.state.token !== null
    }

    changeRoadBlock(e) {
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
                    if(classList.contains("CombatOptiontrue"))
                    {
                    this.props.history.push(`/combat/${eventId}`)
                    }
                }
            })

        } else {
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
                    <PlayerHud combat="false" characterData={this.state.characterInfo} pathOptions={this.state.pathOptions} changeRoadBlock={this.changeRoadBlock}/>
                </div>

            )
        } else {
            if (this.state.gameOver == false) {
                return (
                    <h4>Performing Action...</h4>
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