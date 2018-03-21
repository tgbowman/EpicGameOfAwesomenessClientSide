import React from "react";

class EnemyPanel extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="enemyPanel fixed-top align-top container-fluid ">
                <div className="row align-items-start enemyRow">
                    <div className="col-4 offset-8 enemyRow">
                        <div className="row">
                            <div className="col-4 offset-6">
                                <img src={this.props.enemy.imageUrl} className="profilePic enemy border border-danger" width="250" height="250" />
                            </div>

                            <h2 className="col-4 offset-3 enemyName">{this.props.enemy.name}</h2>
                            <h4 className="col-4 offset-3 enemyHealth">Health: {this.props.enemyHP}</h4>
                            <progress className="col-4 offset-2" id="enemyHealthBar" value={this.props.enemyHP} max="100"></progress>


                        </div>

                    </div>
                </div>

            </div>
        )
    }

}

export default EnemyPanel