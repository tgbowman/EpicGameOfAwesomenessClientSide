import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";
import Combat from "../components/Combat";

class RoadBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            token: localStorage.getItem("token"),
            //Get the adventure and character id's from the route params.  They come in one string separated by "!"
            adventureId: this.props.match.params.data.split("!")[0],
            characterId: this.props.match.params.data.split("!")[1],
            previousChoiceId: null,
            roadBlock: null,
            pathOptions: null
        }
        this.changeRoadBlock = this.changeRoadBlock.bind(this)
    }



    componentDidMount() {
        this.changeRoadBlock()

    }

    isUserLoggedIn() {
        return this.state.token !== null
    }

    changeRoadBlock(e) {
        if (e) {
            if(e.target.classList.contains("CombatOptionfalse"))
            {
            this.setState({
                previousChoiceId: e.target.id


            }, () => {
                let targetUrl = `http://localhost:5000/api/roadBlock/${this.state.previousChoiceId}`
                fetch(targetUrl, {
                    method: "GET",
                    mode: "cors"
                })
                    .then(r => r.json())
                    .then(data => {
                        console.log(data)
                        let roadBlockData = data
                        console.log(roadBlockData.description)
                        console.log(roadBlockData.storyPaths)
                        this.setState({
                            roadBlock: roadBlockData.description,
                            pathOptions: roadBlockData.storyPaths
                        })
                    })
            })}
            else{
                this.props.history.push(`/combat/${e.target.id}!${this.state.characterId}`)
            }
        } else {
            if (this.state.previousChoiceId == null) {
                let targetUrl = "http://localhost:5000/api/roadBlock"
                fetch(targetUrl, {
                    method: "GET",
                    mode: "cors"
                })
                    .then(r => r.json())
                    .then(data => {
                        console.log(data)
                        let roadBlockData = data.filter(d => d.adventureId == this.state.adventureId && d.startingPoint == true)[0]
                        console.log(roadBlockData.description)
                        console.log(roadBlockData.storyPaths)
                        this.setState({
                            roadBlock: roadBlockData.description,
                            pathOptions: roadBlockData.storyPaths
                        })
                    })
            }
        }
        // else {
        //     targetUrl = `http://localhost:5000/api/roadBlock/${this.state.previousChoiceId}`
        //     fetch(targetUrl, {
        //         method: "GET",
        //         mode: "cors"
        //     })
        //         .then(r => r.json())
        //         .then(data => {
        //             console.log(data)
        //             let roadBlockData = data
        //             console.log(roadBlockData.description)
        //             console.log(roadBlockData.storyPaths)
        //             this.setState({
        //                 roadBlock: roadBlockData.description,
        //                 pathOptions: roadBlockData.storyPaths
        //             })
        //         })
        // }

    }

    render() {
        if (this.state.pathOptions !== null) {
            return (
                <div>
                    <nav>
                        <Logout />
                    </nav>
                    <h3>{this.state.roadBlock}</h3>
                    {this.state.pathOptions.map(o => {
                        return <div onClick={this.changeRoadBlock} key={o.pathOption.id} id={o.pathOption.id} className="pathOptionBox">
                            <p className = {"CombatOption"+o.pathOption.leadsToCombat} id={o.pathOption.id} >{o.pathOption.description}</p>
                        </div>
                    })}
                </div>

            )
        } else {
            return (
                <h4>Performing Action...</h4>
            )
        }

    }

}

export default RoadBlock