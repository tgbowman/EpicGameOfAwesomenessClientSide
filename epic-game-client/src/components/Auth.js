//************** AUTH COMPONENT ************************//
//This component handles the authentication.  Javascript Web Tokens are used to grant access to the API.//

import React from "react";
import Home from "./Home";

class Auth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userEmail: "",
            userPassword: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.userLogin = this.userLogin.bind(this);
        this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
        this.getSavedToken = this.getSavedToken.bind(this);
    }




    handleChange(e) {
        if (e.target.name === "userEmail") {
            this.setState({ userEmail: e.target.value })
        }
        else {
            this.setState({ userPassword: e.target.value })
        }
    }


    isUserLoggedIn() {
        return localStorage.getItem("token") !== null;
    }


    getSavedToken() {
        return localStorage.getItem("token");
    }

    userLogin() {
        let targetUrl = "http://localhost:5000/api/token"
        console.log(this.state.userEmail, this.state.userPassword);

        fetch(targetUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: this.state.userEmail, password: this.state.userPassword })
        })
            .then(r => {
                if (r.ok) {

                    return r.text()
                }
            })
            .then(token => {

                if (token) {
                    console.log(token)
                    localStorage.setItem("token", token);
                    console.log("User logged in and token stored to local storage")
                    this.props.history.push(`/adventure`)

                }
                else {
                    alert("The username/password combination is invalid.  Please try again.")
                }
            })
    }

    render() {

        return (
            <div className="text-light text-center Login">
                <h2>Login</h2>
                <p>If you don't have an account, entering an email and password will create one for you!</p>
                <input id="userName" type="text" name="userEmail" placeholder="Email" value={this.state.userEmail} onChange={this.handleChange} />
                <br />
                <input type="password" name="userPassword" placeholder="Password" value={this.state.userPassword} onChange={this.handleChange} />
                <br />
                <button id="loginBtn" onClick={this.userLogin}>Login/Register</button>
            </div>


        )
    }
}

export default Auth;