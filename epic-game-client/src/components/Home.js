import React from "react";
import { Link } from "react-router-dom";



class Home extends React.Component {

    goToAdventure()
    {
        this.props.history.push(`/adventure`)
    }

    render() {
        if (!localStorage.getItem("token")) {
            return (
                <div>
                    <h1>The Epic Game of Awesomeness</h1>
                    <Link to="/login">Login/Register</Link>
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