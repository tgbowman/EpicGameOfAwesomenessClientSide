//************** HOME COMPONENT ************************//
//This component renders the Title screen for the app//
//It allows the user to login or register for an account to play the game//


import React from "react";
import { Link } from "react-router-dom";
import IntroMusic from "../Sound/IntroMusic.mp3"



class Home extends React.Component {

    componentWillMount(){
        this.IntroMusic = new Audio(IntroMusic)
    }

    componentDidMount(){
        this.IntroMusic.play()
    }
    componentWillUnmount(){
        this.IntroMusic.pause()
    }
    goToAdventure()
    {
        this.props.history.push(`/adventure`)
    }

    render() {
        if (!localStorage.getItem("token")) {
            return (
                <div className="text-center">
                    <h1 className="display-2 text-light">The Epic Game of Awesomeness</h1>
                    <Link className="light-link" to="/login">Login/Register</Link>
                </div>
            )
        }
        else
        {
            {this.goToAdventure()}
            return null
        }
    }

}

export default Home;