import React from "react";
// import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";

class Combat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            enemyName: "",
            enemyHP: null,
            playerHP: null,
            enemyRoll: null,
            playerRoll: null,
            combatMessage: "Select an ability...",
            enemy: {},
            player: {
                unitClass: {
                    abilityOneDamage: "",
                    abilityTwoDamage: ""
                }
            }
        }
        this.getEnemy = this.getCombatants.bind(this);
        // this.rollDice = this.rollDice.bind(this);
        this.combatMove = this.combatMove.bind(this);
    }

    componentDidMount() {
        let combatId = this.props.match.params.combatOptionId.split("!")[0]
        let characterId = this.props.match.params.combatOptionId.split("!")[1]
        console.log(characterId)
        fetch(`http://localhost:5000/api/pathOption/${combatId}`, {
            method: "GET",
            mode: "cors",
        })
            .then(r => r.json())
            .then(data => {
                console.log(data)
                this.setState({
                    enemyName: data.enemyType
                }, this.getCombatants(characterId))
            })
    }
    getCombatants(charId) {
        if (this.state.enemyName !== null) {
            fetch("http://localhost:5000/api/enemy", {
                method: "GET",
                mode: "cors"
            })
                .then(r => r.json())
                .then(data => {
                    console.log(data)
                    let enemyObj = data.filter(e => e.name == this.state.enemyName)[0]
                    this.setState({
                        enemy: enemyObj,
                        enemyHP: enemyObj.hp
                    })
                })
                .then(d => {
                    console.log(charId)
                    fetch(`http://localhost:5000/api/character/${charId}`, {
                        method: "GET",
                        mode: "cors"
                    })
                        .then(r => r.json())
                        .then(data => {
                            console.log(data.unitClass.abilityOneDamage)
                            this.setState({
                                player: data,
                                playerHP: data.hp
                            })
                        })
                })
        }
    }
    //random number generator between 1 and 20
    rollDice() {
        return (Math.floor(Math.random() * 20) + 1)
    }
    combatMove(e) {
        let playerTurn = true
        let playerDamage = e.target.id
        //variables to store the enemy and player rolls
        let eRoll = null;
        let pRoll = null

        //players turn

        setTimeout(() => {
            //roll the dice to get the enemies roll
            eRoll = this.rollDice()
            //update the state to reflect the combat changes
            this.setState({
                combatMessage: `The enemy rolled a ${eRoll}`,
                enemyRoll: eRoll
            })
            //roll the dice to get the player's roll
            pRoll = this.rollDice()
            //update the state to reflect the combat changes
            setTimeout(() => {
                this.setState({
                    combatMessage: `You rolled a ${pRoll}`,
                    playerRoll: pRoll
                })

                setTimeout(() => {
                    //if the player's roll is equal or higher than the enemies the players move is successful and the enemy takes damage
                    if (pRoll >= eRoll) {
                        let newEnemyHP = this.state.enemyHP -= playerDamage
                        this.setState({
                            combatMessage: `Your attack is succesful! You deal ${playerDamage} damage to the ${this.state.enemyName}!`,
                            enemyRoll: null,
                            playerRoll: null,
                            enemyHP: newEnemyHP
                        })
                        //if the player's roll is less than the enemies the player's attack misses.
                    } else {
                        this.setState({
                            combatMessage: "Your attack missed!",
                            enemyRoll: null,
                            playerRoll: null
                        })
                    }

                    setTimeout(() => {
                        let enemyMoveIndex = Math.floor(Math.random() * 2) + 1

                        let enemyDamage = null;
                        if (enemyMoveIndex === 1) {
                            enemyDamage = this.state.enemy.unitClass.abilityOneDamage
                        }
                        else {
                            enemyDamage = this.state.enemy.unitClass.abilityTwoDamage
                        }
                        eRoll = this.rollDice()
                        setTimeout(() => {
                            this.setState({
                                combatMessage: `The enemy rolled a ${eRoll}`,
                                enemyRoll: eRoll

                            })
                            pRoll = this.rollDice()
                            setTimeout(() => {
                                this.setState({
                                    combatMessage: `You rolled a ${pRoll}`,
                                    playerRoll: pRoll

                                })
                                setTimeout(() => {
                                    if (eRoll >= pRoll) {
                                        let newPHP = this.state.playerHP -= enemyDamage
                                        this.setState({
                                            combatMessage: `The ${this.state.enemyName}'s attack is successful!  You take ${enemyDamage} damage!`,
                                            playerHP: newPHP,
                                            enemyRoll: null,
                                            playerRoll: null
                                        })
                                    }
                                    else {
                                        this.setState({
                                            combatMessage: `The ${this.state.enemyName}'s attack misses!`,
                                            enemyRoll: null,
                                            playerRoll: null
                                        })
                                    }
                                    setTimeout(() => {
                                        this.setState({
                                            combatMessage: "Select an ability..."
                                        })
                                    }, 1500)
                                    playerTurn = true

                                }, 2000)
                            }, 2000)
                        }, 1)

                    }, 2000)
                }, 2000)
            }, 2000)

        }, 1000)
    }
    render() {
        return (
            <div>
                <Logout />
                <h2>{this.state.enemyName}</h2>
                <img src={this.state.enemy.imageUrl} className="profilePic enemy" width="150" />
                <h4>Health: {this.state.enemyHP}</h4>
                <p>Enemy Roll: {this.state.enemyRoll}</p>
                <h2>{this.state.combatMessage}</h2>
                <p>Your Roll: {this.state.playerRoll}</p>
                <h2>{this.state.player.name}</h2>
                <img src={this.state.player.profileImgUrl} className="profilePic player" width="150" />
                <h4>Health: {this.state.playerHP}</h4>
                <div onClick={this.combatMove} className="abilityBox" id={this.state.player.unitClass.abilityOneDamage}>
                    <h4 id={this.state.player.unitClass.abilityOneDamage}>{this.state.player.unitClass.abilityOneName}</h4>
                    <p id={this.state.player.unitClass.abilityOneDamage}>{this.state.player.unitClass.abilityOneDescription}</p>
                    <p id={this.state.player.unitClass.abilityOneDamage}>Damage: {this.state.player.unitClass.abilityOneDamage}</p>
                </div>
                <div onClick={this.combatMove} className="abilityBox" id={this.state.player.unitClass.abilityTwoDamage}>
                    <h4 id={this.state.player.unitClass.abilityTwoDamage}>{this.state.player.unitClass.abilityTwoName}</h4>
                    <p id={this.state.player.unitClass.abilityTwoDamage}>{this.state.player.unitClass.abilityTwoDescription}</p>
                    <p id={this.state.player.unitClass.abilityTwoDamage}>Damage: {this.state.player.unitClass.abilityTwoDamage}</p>
                </div>
            </div>
        )
    }
}

export default Combat;