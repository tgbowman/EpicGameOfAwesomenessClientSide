import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";
import RoadBlock from "../components/RoadBlock";
import PlayerHud from "../components/PlayerHud";
import EnemyPanel from "../components/EnemyPanel";

class Combat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            characterId: localStorage.getItem("characterId"),
            previousOptionId: null,
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
        // this.getEnemy = this.getCombatants.bind(this);
        // this.rollDice = this.rollDice.bind(this);
        this.combatMove = this.combatMove.bind(this);
        this.godMode = this.godMode.bind(this)
        this.getCombatants = this.getCombatants.bind(this)
    }
    componentDidMount() {

        fetch(`http://localhost:5000/api/adventureChoice/${this.state.characterId}/${localStorage.getItem("adventureId")}`, {
            method: "GET",
            mode: "cors"
        })
            .then(r => r.json())
            .then(previousAdvData => {
                console.log(previousAdvData)
                this.setState({
                    previousOptionId: previousAdvData.pathOptionId
                })
                return previousAdvData
            })
            .then(data => {
                console.log(data)
                fetch(`http://localhost:5000/api/pathOption/${data.pathOptionId}`, {
                    method: "GET",
                    mode: "cors",
                })
                    .then(r => r.json())
                    .then(data => {
                        console.log(data.enemyType)
                        this.setState({
                            enemyName: data.enemyType
                        })
                        return data
                    })
                    .then(d => {
                        this.getCombatants(this.state.characterId, d.enemyType)
                    })
            })
    }
    getCombatants(charId, enemy) {
        console.log(enemy)
        console.log(this.state.previousOptionId)
        if (this.state.enemyName !== null) {
            fetch("http://localhost:5000/api/enemy", {
                method: "GET",
                mode: "cors"
            })
                .then(r => r.json())
                .then(data => {
                    console.log(this.state.enemyName)
                    let enemyObj = data.filter(e => e.name == enemy)[0]
                    console.log(enemyObj)
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
        let playerDamage = e.target.id.split("!")[0]
        let playerAttackName = e.target.id.split("!")[1]
        console.log(playerAttackName)
        //variables to store the enemy and player rolls
        let eRoll = null;
        let pRoll = null

        //players turn

        setTimeout(() => {
            //roll the dice to get the enemies roll
            eRoll = this.rollDice()
            //update the state to reflect the combat changes
            this.setState({
                combatMessage: `The ${this.state.enemyName} rolled ${eRoll}`,
                enemyRoll: eRoll
            })
            //roll the dice to get the player's roll
            pRoll = this.rollDice()
            //update the state to reflect the combat changes
            setTimeout(() => {
                this.setState({
                    combatMessage: `You rolled ${pRoll}`,
                    playerRoll: pRoll
                })

                setTimeout(() => {
                    //if the player's roll is equal or higher than the enemies the players move is successful and the enemy takes damage
                    if (pRoll >= eRoll) {
                        let newEnemyHP = this.state.enemyHP -= playerDamage
                        if (newEnemyHP <= 0) {
                            fetch(`http://localhost:5000/api/character/${this.state.characterId}`, {
                                method: "PATCH",
                                mode: "cors",
                                headers: {
                                    'Authorization': 'Bearer ' + this.state.token,
                                    "Content-Type": "application/json"
                                },
                                body: {
                                    hp: this.state.playerHP
                                }
                            })
                                .then(d => {
                                    this.props.history.push(`/roadBlock/${this.state.previousOptionId}`)
                                })
                        } else {
                            this.setState({
                                combatMessage: `Your attack is succesful! You deal ${playerDamage} damage to the ${this.state.enemyName}!`,
                                enemyRoll: null,
                                playerRoll: null,
                                enemyHP: newEnemyHP
                            })
                        }
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
                                combatMessage: `The ${this.state.enemyName} rolled ${eRoll}`,
                                enemyRoll: eRoll

                            })
                            pRoll = this.rollDice()
                            setTimeout(() => {
                                this.setState({
                                    combatMessage: `You rolled ${pRoll}`,
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
                                    }, 1200)
                                    playerTurn = true

                                }, 1200)
                            }, 1200)
                        }, 1)

                    }, 1200)
                }, 1200)
            }, 1200)

        }, 10)
    }

    godMode() {
        let eHP = 0
        if (eHP <= 0) {
            this.props.history.push(`/roadBlock/${this.state.previousOptionId}`)

        }
    }
    render() {
        if (this.state.playerHP > 0 && this.state.enemyHP > 0) {
            return (
                <div className="text-light">
                    <audio id="Punch"><source src="PUNCH.mp3" /></audio>

                    {/************** Enemy Panel *******************/}
                    <EnemyPanel enemy={this.state.enemy} enemyHP={this.state.enemyHP} />
                    {/**************** Combat Message Panel ************/}
                    <div className="combatMessagePanel text-center">

                        <h2>{this.state.combatMessage}</h2>

                    </div>
                    {/***************** Player Panel ********************/}
                    <PlayerHud combat="true" player={this.state.player} combatMove={this.combatMove} playerHP={this.state.playerHP} />
                </div>
            )
        }
        if (this.state.previousOptionId == null || this.state.enemyName == "") {
            return (
                <div>
                    <h3>Preparing for battle!</h3>
                </div>
            )
        }

        if (this.state.playerHP <= 0 && this.state.previousOptionId != null) {

            return (
                <div className="text-light">
                    <h3>The {this.state.enemyName} has defeated you!</h3>
                    <Link to="/adventure">Return to Adventure Select</Link>
                </div>
            )
        }

    }

}

export default Combat;