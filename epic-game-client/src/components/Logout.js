import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";

class Logout extends React.Component
{
    constructor(props)
    {
        super(props)
        this.logout = this.logout.bind(this);
    }

    //Method called to remove the user token from local storage and redirect the user to the title screen
    logout() {
        if (localStorage.getItem("token")) {
            localStorage.removeItem("token")
           this.props.history.push(`/`)
        }
    }

    render()
    {
        return(
            <div>
                <Link to="/" id="logOutBtn" onClick= {this.logout}>Log Out</Link>
            </div>
        )
    }
}

export default withRouter(Logout);