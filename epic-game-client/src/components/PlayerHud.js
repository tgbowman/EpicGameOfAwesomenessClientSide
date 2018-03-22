import React from "react";
import Logout from "../components/Logout"

class PlayerHud extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {

        if (this.props.combat === "false") {
            return (
                <div className="fixed-bottom align-bottom container-fluid playerHud">
                    <div className="row align-items-end">
                        <div className="col-2">
                            <img className="border border-dark profileImg rounded-circle" src={this.props.characterData.profileImgUrl} />
                        </div>
                        {this.props.pathOptions.map(o => {
                            return <div onClickCapture={this.props.changeRoadBlock} key={o.pathOption.id} id={o.pathOption.id} className={"col-4 align-self-center border border-light bg-dark text-center text-light clickable pathOptionBox" + " CombatOption" + o.pathOption.leadsToCombat}>
                                <h5 className={"CombatOption" + o.pathOption.leadsToCombat + " textbox"} id={o.pathOption.id} >{o.pathOption.description}</h5>
                            </div>
                        })}
                    </div>
                    <Logout />
                </div>
            )
        }
        else {
            return (
                <div className="fixed-bottom align-bottom container-fluid playerHud">
                    <div className="row align-items-end">
                        <div className="col-4">
                            <div className="row">
                                <div className="col-4">
                                    <img src={this.props.player.profileImgUrl} className="profilePic player border border-light" width="150" height="212" />
                                </div>
                                <h2 className="col-4">{this.props.player.name}</h2>
                                <h4 className="col-4 offset-4 health">Health: {this.props.playerHP}</h4>
                                <progress className="col-4 offset-4" id="healthBar" value={this.props.playerHP} max="100" />
                            </div>
                        </div>
                        {/*************Player Abilities *************/}
                        <div onClick={this.props.combatMove} className="abilityBox col-3 align-self-center border border-light bg-dark text-center text-light clickable pathOptionBox" id={this.props.player.unitClass.abilityOneDamage + "-" + this.props.player.unitClass.abilityOneHealing+ "!" + this.props.player.unitClass.abilityOneName}>
                            <h4 id={this.props.player.unitClass.abilityOneDamage + "-" + this.props.player.unitClass.abilityOneHealing+ "!" + this.props.player.unitClass.abilityOneName}>{this.props.player.unitClass.abilityOneName}</h4>
                            <p id={this.props.player.unitClass.abilityOneDamage + "-" + this.props.player.unitClass.abilityOneHealing+"!" + this.props.player.unitClass.abilityOneName}>{this.props.player.unitClass.abilityOneDescription}</p>
                            <p id={this.props.player.unitClass.abilityOneDamage + "-" + this.props.player.unitClass.abilityOneHealing+"!" + this.props.player.unitClass.abilityOneName}>Damage: {this.props.player.unitClass.abilityOneDamage}</p>
                        </div>
                        <div onClick={this.props.combatMove} className="abilityBox col-3 align-self-center border border-light bg-dark text-center text-light clickable pathOptionBox" id={this.props.player.unitClass.abilityTwoDamage + "!" + this.props.player.unitClass.abilityTwoName}>
                            <h4 id={this.props.player.unitClass.abilityTwoDamage + "-" + this.props.player.unitClass.abilityTwoHealing+"!" + this.props.player.unitClass.abilityTwoName}>{this.props.player.unitClass.abilityTwoName}</h4>
                            <p id={this.props.player.unitClass.abilityTwoDamage + "-" + this.props.player.unitClass.abilityTwoHealing+"!" + this.props.player.unitClass.abilityTwoName}>{this.props.player.unitClass.abilityTwoDescription}</p>
                            <p className="abilityData" id={this.props.player.unitClass.abilityTwoDamage + "-" + this.props.player.unitClass.abilityTwoHealing+"!" + this.props.player.unitClass.abilityTwoName}>Damage: {this.props.player.unitClass.abilityTwoDamage}</p>
                            <p className="abilityData" id={this.props.player.unitClass.abilityTwoDamage + "-" + this.props.player.unitClass.abilityTwoHealing+"!" + this.props.player.unitClass.abilityTwoName}> Healing: {this.props.player.unitClass.abilityTwoHealing}</p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default PlayerHud;