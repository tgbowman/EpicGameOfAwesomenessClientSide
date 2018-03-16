import React from "react";
import {Link} from "react-router-dom";

class Home extends React.Component {

    render(){

        return (
            <div>
                <h1>The Epic Game of Awesomeness</h1>
                <Link to="/login">Login/Register</Link>
            </div>
        )
    }

}

export default Home;