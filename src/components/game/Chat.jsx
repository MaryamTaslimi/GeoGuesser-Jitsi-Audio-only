import React, { Component } from "react";
// import sendImg from "../../assets/send.png";
// import socketIOClient from "socket.io-client";
import "./Game.css"
// const ENDPOINT="localhost:5000";
//Add username retrival and replace in chat  
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgList: [{
                user: "System",
                message: "Hey everybody! Let's Go!"
            }],
            textField: "Msg"
        }
    }
    componentDidMount() {
        this.props.socket.on("newmsg", data => {
            console.log(data)
            this.setState({
                msgList: [data, ...this.state.msgList]
            })

            this.props.socket.on("joinMsg", data => {
                console.log('Join msg aaya!!')
                this.setState({
                    msgList: this.state.msgList + '\n' + data.user + ' has joined the game'
                })
            })
        });
    }
    handleClick = (event) => {
        event.preventDefault();
        const curr_msg = event.target.msg.value;
        if (curr_msg === '') {
            event.target.reset()
            event.preventDefault();
            return;
        }
        this.props.socket.emit('msg', { message: curr_msg, user: this.props.username });
        event.target.reset()

    }
    render() {
        return (<div>
            <ul className="msg" style={{ marginBottom: "0px", borderBottom: "0px" }}>
                {this.state.msgList.map(msg => (msg.user === "System") ? (
                    <li style={{ backgroundColor: "#f5f5f5", borderBottom: "0px" }}>
                        <div style={{ color: "#005510", fontFamily: "Nunito-Bold", marginLeft: "0.5rem" }}>{msg.message}</div>
                    </li>
                ) : (
                    <li class="admin clearfix" style={{ backgroundColor: "#f5f5f5", borderBottom: "0px" }}>
                        <div class="chat-body clearfix">
                            <div class="header clearfix">
                                <strong class="left primary-font" style={{ color: "#9300ff", marginLeft: "0.5rem", marginRight:"0.5rem" }}>{msg.user}:</strong>
                                <p style={{ color: "#9300ff" }}>
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <form onSubmit={(e) => this.handleClick(e)} >
                    <input className="form-control" id="inputPassword2" type="text" name="msg" placeholder="Chat now" style={{ height: "18px", width:"100%", borderTop:"2px solid rgba(0, 0, 0, .25)" }} />
            </form>
        </div>);
    }
}

export default Chat;