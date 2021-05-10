import React, { Component } from 'react';
import "./Game.css"
import Map from './Map';
import logo from "../../assets/CGuess.png"
import Score from './Score';
import Chat from './Chat.jsx'
import socketIOClient from "socket.io-client";
import Cookies from 'universal-cookie';
import Modal from "../Modal/Modal";
import { useJitsi } from 'react-jutsu'
const App = (props) => {
    const jitsiConfig = {
        roomName: 'testcguess',
        displayName: props.localDisplayname,
        password: 'dattebayo',
        subject: 'fan',
        parentNode: 'jitsi-container',
        allow: "microphone; camera",
        configOverwrite: { prejoinPageEnabled: false },
        interfaceConfigOverwrite: {
            TILE_VIEW_MAX_COLUMNS: 6,
            SHOW_CHROME_EXTENSION_BANNER: false,
            TOOLBAR_ALWAYS_VISIBLE: false,
            TOOLBAR_BUTTONS: ['microphone', 'camera'],
            HIDE_INVITE_MORE_HEADER: true
        }
    };
    const { loading, error, jitsi } = useJitsi(jitsiConfig);

    return (
        <div>
            {error && <p>{error}</p>}
            <div id={jitsiConfig.parentNode} />
        </div>
    );
}
class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            round: 0,
            city: "_a__s",
            fact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur velit nisl, finibus vel pulvinar at, cursus id urna.",
            pageTime: '--',
            showFact: "this.state.fact[3]",
            showModal: true,
            isConnected: false
        }
        this.ENDPOINT = "https://wfhomie-cguess-backecnd.herokuapp.com/";
        this.socket = socketIOClient(this.ENDPOINT, {
            transports: ['polling']
        });
        this.cookies = new Cookies();
        if (!this.cookies.get('username')) {
            this.cookies.set('username', 'anonymous', { path: '/' });
        }
        this.socket.emit('setkeyroom',{            
            key: this.cookies.get('key')
        })
        this.slide = 0;
    }

    plusSlides = (num) => {
        if (num === -1) {
            if (this.slide === 0) {
                this.setState({
                    showFact: this.state.fact[3]
                });
                this.slide = 3;
            }
            else {
                this.setState({
                    showFact: this.state.fact[--this.slide]
                });
            }
        }
        else {
            if (this.slide === 3) {
                this.setState({
                    showFact: this.state.fact[0]
                });
                this.slide = 0;
            }
            else {
                this.setState({
                    showFact: this.state.fact[++this.slide]
                });
            }
        }

    }

    componentDidMount() {

        this.socket.emit('setUsername', {
            username: this.cookies.get('username')
        })
        this.socket.on("connected", (data) => {
            this.setState({
                isConnected: true
            })
        })
        this.socket.on("updates", (data) => {
            var t = Number(data.timer)
            this.setState({
                city: data.city,
                fact: data.currentFact,
                showFact: data.currentFact[3],
                round: data.round,
            })

            var xx = setInterval(() => {

                if (t <= 0)
                    clearInterval(xx);
                this.setState({
                    pageTime: t--
                })

            }, 1000)

        })


        window.onbeforeunload = function () {
            this.socket.disconnect();
            return null;
        }.bind(this);
    }
    componentDidUpdate() {
        //back button handling
        window.onpopstate = (e) => {
            this.socket.disconnect();
        }
    }
    render() {
        if (this.state.isConnected)
            return (
                <div className="container-fluid">
                    <div className="row">
                        <img src={logo} alt="CGuess Logo" style={{ height: "50px", width: "auto", margin: "auto" }} />
                    </div>
                    <div className="row">
                        <div className="topRow">
                            <div className="gameRound">
                                {this.state.round}/4
                            </div>
                            <div style={{ margin: "auto", marginBotoom: "4%", background: "repeating-linear-gradient( 90deg, #eb553a 0, #eb553a 1ch, transparent 0, transparent 1.5ch ) 0 100%/100% 0.3rem no-repeat", font: "5ch consolas, monospace", letterSpacing: "0.5ch", color: "transparent", fontSize: "1.5rem" }}>
                                {this.state.city}
                            </div>
                            <div className="gameTimer">
                                {this.state.pageTime}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2 score" style={{ flex: "0 0 18%", maxWidth: "18%" }}>
                            <Score socket={this.socket} />
                        </div>
                        <div className="col-md map font-size" style={{paddingRight:"0px", paddingLeft:"0px"}}>
                            <Map style={{ position: "relative" }} socket={this.socket} />
                        </div>
                        <div className="col-md-3 chat" style={{ flex: "0 0 20%", maxWidth: "20%", paddingRight: "0px", paddingLeft: "0px" }}>
                            <Modal show={this.state.showModal} imageCSS={"modalImage"}>
                                <div className="modal-content" style={{ backgroundColor: "rgba(0, 0, 0, 0.005)" }}>
                                    <img alt="" style={{
                                        margin: "auto",
                                        display: "block",
                                        maxWidth: "100%",
                                        maxHeight: "20vh",
                                        objectFit: "contain",
                                        display: "inline-block",
                                        verticalAlign: "middle",
                                        height: "100%"
                                    }} src={this.state.showFact} />
                                    <a className="prev" onClick={() => this.plusSlides(-1)}>&#10094;</a>
                                    <a className="next" onClick={() => this.plusSlides(1)}>&#10095;</a>
                                </div>
                            </Modal>
                            <Chat socket={this.socket} username={this.cookies.get('username')} />
                        </div>
                    </div>
                    <div className="row" style={{ width: "100%", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                        <div style={{ paddingTop: "25px", width: "100%", height: "200px", margin: "auto", marginTop: "20px", background: "#fff", borderRadius: "15px" }}>
                            <App style={{}} localDisplayname={this.cookies.get('username')} />
                        </div>
                    </div>
                </div>
            )
        return (
            <div style={{ width: "100vw", height: "100vh" }}>
                <div className="loading-div">
                    <svg className="loading-svg">
                        <circle id="s8" class="sMove t" cx="45" cy="50" r="45" fill="#020205" />
                        <polygon id="s7" class="sMove t" points="45,05 16,16 1,42 6,73 30,92 60,92 84,73 89,42 74,16" fill="#230B09" />
                        <polygon id="s6" class="sMove t" points="45,04 12,17 0,50 12,83 45,96 78,83 90,50 78,17" fill="#46130C" />
                        <polygon id="s5" class="sMove t" points="45,04 9,22 1,60 25,92 65,92 89,60 81,22" fill="#631B0E" />
                        <polygon id="s4" class="sMove t" points="45,03 4,26 4,74 45,97 86,74 86,26" fill="#812211" />
                        <polygon id="s3" class="sMove t" points="45,03 1,35 18,88 72,88 89,35" fill="#992813" />
                        <rect id="s2" class="sMove t" x="10" y="15" width="70" height="70" fill="#BD3116" />
                        <polygon id="s1" class="sMove t" points="45,05 2,80 88,80" fill="#E43A19" />
                    </svg>
                    <h1 className="loading-text">LOADING</h1>
                </div>
            </div>

        )
    }
}
export default Game;