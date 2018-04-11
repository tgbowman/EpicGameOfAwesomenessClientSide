//************** COMBAT COMPONENT ************************//
//This component gathers the character and enemy data from the DB and renders it in the DOM//
//It handles the combat functionality as well//


import React from "react";
import { Link, Redirect } from "react-router-dom";
import Logout from "../components/Logout";
import RoadBlock from "../components/RoadBlock";
import PlayerHud from "../components/PlayerHud";
import EnemyPanel from "../components/EnemyPanel";
import Punch from "../Sound/PUNCH.mp3";
import Slap from "../Sound/slap.mp3";
import Fireball from "../Sound/Fireball.mp3";
import FireballBig from "../Sound/FireballBig.mp3"
import BlackBlade from "../Sound/BlackBlade.mp3";
import ArcaneBarrier from "../Sound/ArcaneBarrier.mp3";
import QuickAttack from "../Sound/QuickAttack.mp3";
import SpikeArmor from "../Sound/SpikeArmor.mp3";
import Backstab from "../Sound/Backstab.mp3";
import Eviscerate from "../Sound/Eviscerate.mp3";
import RollDice from "../Sound/RollDice.mp3"

class Combat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            characterId: localStorage.getItem("characterId"),
            token: localStorage.getItem("token"),
            previousOptionId: null,
            inCombat: false,
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
                    abilityTwoDamage: "",
                    abilityOneHealing: "",
                    abilityTwoHealing: ""
                }
            }
        }
        // this.getEnemy = this.getCombatants.bind(this);
        // this.rollDice = this.rollDice.bind(this);
        this.combatMove = this.combatMove.bind(this);
        this.getCombatants = this.getCombatants.bind(this)
    }
    componentWillMount() {
        this.Punch = new Audio(Punch)
        this.Slap = new Audio(Slap)
        this.Fireball = new Audio(Fireball)
        this.FireballBig = new Audio(FireballBig)
        this.BlackBlade = new Audio(BlackBlade)
        this.ArcaneBarrier = new Audio(ArcaneBarrier)
        this.QuickAttack = new Audio(QuickAttack)
        this.SpikeArmor = new Audio(SpikeArmor)
        this.Backstab = new Audio(Backstab)
        this.Eviscerate = new Audio(Eviscerate)
        this.RollDice = new Audio(RollDice)
    }
    componentWillUnmount() {
        this.BlackBlade.pause()
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
                        this.BlackBlade.volume = 0.2
                        this.BlackBlade.play();
                    })
            })
    }
    //Get's the current character and enemy
    getCombatants(charId, enemy) {
        if (this.state.enemyName !== null) {
            fetch("http://localhost:5000/api/enemy", {
                method: "GET",
                mode: "cors"
            })
                .then(r => r.json())
                .then(data => {
                    let enemyObj = data.filter(e => e.name == enemy)[0]
                    this.setState({
                        enemy: enemyObj,
                        enemyHP: enemyObj.hp
                    })
                })
                .then(d => {
                    fetch(`http://localhost:5000/api/character/${charId}`, {
                        method: "GET",
                        mode: "cors"
                    })
                        .then(r => r.json())
                        .then(data => {
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
        // this.RollDice.play();
        // this.RollDice.pause()
        return (Math.floor(Math.random() * 20) + 1)
    }

    combatMove(e) {
        if (this.state.inCombat === false) {
            this.setState({
                inCombat: true
            })
            let playerTurn = true
            let playerMoveData = e.target.id.split("!")[0]
            console.log(playerMoveData)
            let playerDamage = parseInt(playerMoveData.split("-")[0])
            let playerHealing = parseInt(playerMoveData.split("-")[1])
            console.log(playerDamage)
            console.log(playerHealing)
            let playerAttackName = e.target.id.split("!")[1]
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
                            let newPlayerHP
                            if (this.state.playerHP + playerHealing > 100) {
                                newPlayerHP = 100
                            }
                            else {
                                newPlayerHP = this.state.playerHP += playerHealing
                            }
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
                                switch (playerAttackName) {
                                    case "Punch":
                                        this.Punch.play();
                                        break;
                                    case "Slap of Death":
                                        this.Slap.play();
                                        break;
                                    case "Fireball":
                                        this.Fireball.play();
                                        break;
                                    case "Arcane Barrier":
                                        this.ArcaneBarrier.play();
                                        break;
                                    case "Quick Attack":
                                        this.QuickAttack.play();
                                        break;
                                    case "Spiked Armor":
                                        this.SpikeArmor.play();
                                        break;
                                    case "Backstab":
                                        this.Backstab.play();
                                        break;
                                    case "Eviscerate":
                                        this.Eviscerate.play();
                                        break;


                                }
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
                        //ENEMY turn
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
                                            switch (this.state.enemyName) {
                                                case "Lich":
                                                    this.Fireball.play();
                                                    break;
                                                case "Dragon":
                                                    this.FireballBig.play();
                                                    break;
                                            }
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
                                                combatMessage: "Select an ability...",
                                                inCombat: false
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
                <div className="text-light text-center">
                    <h3>Preparing for battle!</h3>
                </div>
            )
        }

        if (this.state.playerHP <= 0 && this.state.previousOptionId !== null) {
            return (
                <div className="text-light text-center">
                    <h3>The {this.state.enemyName} has defeated you!</h3>
                    <Link to="/adventure">Return to Adventure Select</Link>
                </div>
            )
        }

    }

}

export default Combat;