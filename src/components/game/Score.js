import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import "./Game.css";
import Modal from "../Modal/Modal";

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
        this.props.socket.emit('restart',{username:this.cookies.get('username')})
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

    crownFunc = (score) => {
        var basescore = 0;
        this.state.players.forEach(e => {
            if (e.score > basescore) {
                basescore = e.score;
            }
        })
        return (basescore == score && basescore != 0) ? true : false;
    }
    render() {
        return (
            <div>
                <ul style={{ paddingLeft: "0px" }}>
                    {this.state.players.sort((a, b) => a.score > b.score ? -1 : 1).map(item => this.crownFunc(item.score) ? (
                        <li className="list" style={{ borderBottom: "2px solid rgba(0, 0, 0, .1)", paddingLeft: "40px" }}>
                            <div className="list-item" style={{ flexDirection: "column" }}>
                                <div>
                                    &#128081;
                                </div>
                                <div className="score_info">
                                    <div className="name">{item.name}</div>
                                </div>
                                <div className="scores" style={{ fontSize: "16px" }}>{item.score} Points</div>
                                <div></div>
                            </div>
                        </li>
                    ) : (
                        <li className="list" style={{ borderBottom: "2px solid rgba(0, 0, 0, .1)", paddingLeft: "40px" }}>
                            <div className="list-item" style={{ flexDirection: "column" }}>
                                <div className="score_info">
                                    <div className="name">{item.name}</div>
                                </div>
                                <div className="scores" style={{ fontSize: "16px" }}>{item.score} Points</div>
                                <div></div>
                            </div>
                        </li>
                    )
                    )}
                </ul>
                <Modal show={this.state.showResult} imageCSS={"winnerModal"}>
                    <div className="modal-top">
                        <div class="modal-header" style={{ fontSize: "32px" }}>{this.winner} is the winner!!</div>
                        <button style={{ marginBottom: "0px", padding: "0.5rem 1rem 0.5rem 1rem" }} className="send-btn modal-icon" onClick={this.hideModal} id="modal-close">Close</button>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default Score;