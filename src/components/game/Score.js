import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import "./Game.css";
import Modal from "../Modal/Modal";
import Game from "../game/Game.js"
// import winnerImage from "../../assets/winner.png"
class Score extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [

            ],
            showResult: false
        }
        this.cookies = new Cookies();
    }
    showModal = () => {
        this.setState({ showResult: true });
    };

    hideModal = () => {
        this.setState({ showResult: false });
        window.location.reload();
        // return <Game isConnected="true"></Game>
    };
    componentDidMount() {
        this.props.socket.on('scores', data => {
            this.setState({
                players: data
            })
        })
        this.props.socket.on('showresults', data => {
            this.setState({
                showResult: true
            })
            this.winnerFunc();
        })
        this.props.socket.on('newscore', data => {
            this.setState(state => {
                const list = [...state.players]
                list.forEach(i => {
                    if (i.name === data.username) {
                        i.score += data.score;
                    }
                })
                return list;

            })
        })
    }
    winnerFunc = () => {
        this.score = 0;
        this.winner = "Everyone";
        this.state.players.forEach(e => {
            if (e.score > this.score) {
                this.winner = e.name;
                this.score = e.score;
            }
        })
    }
    render() {
        return (
            <div>
                <ul style={{paddingLeft: "0px"}}>
                    {this.state.players.map(item => (
                        <li className="list" style={{  borderBottom: "2px solid rgba(0, 0, 0, .1)", paddingLeft: "30px"}}>
                            <div className="list-item" style={{flexDirection:"column"}}>
                                <div className="score_info">
                                    <div className="name">{item.name}</div>
                                </div>
                                <div className="scores" style={{fontSize:"16px"}}>{item.score} Points</div>
                                <div></div>
                            </div>
                        </li>
                    ))}
                </ul>
                <Modal show={this.state.showResult} imageCSS={"winnerModal"}>
                    <div className="modal-top">
                        <img class="modal-icon u-imgResponsive" src="https://dl.dropboxusercontent.com/s/e1t2hhowjcrs7f5/100daysui_100icon.png" alt="Trophy" />
                        <div class="modal-header">{this.winner} is the winner!!</div>
                        <button style={{ marginBottom: "0px", padding: "0.5rem 1rem 0.5rem 1rem" }} className="send-btn modal-icon" onClick={this.hideModal} id="modal-close">Close</button>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default Score;