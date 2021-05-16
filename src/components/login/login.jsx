import React from "react";
import image from "../../assets/wfhomie-geoguesser.svg"
import "./style.scss";
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';

export class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      play: false,
      show: false,
      name: '',
      key: '',
      url: '/'
    }
    this.change = this.change.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  change = (e) => {
    if (e.target.value.length > 0) {
      this.setState({
        url: '/game'
      })
    }
    else {
      this.setState({
        url: '/'
      })
    }
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  setUsername = () => {
    if (this.state.name == null || this.state.name === '' || this.state.key == null || this.state.key == '') {
    }
    this.cookies = new Cookies();
    this.cookies.set('username', this.state.name, { path: '/' });
    this.cookies.set('key', this.state.key, { path: '/' });
  };

  render() {
    if (this.state.play) {
      window.location.href = "/game";
    }
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="row">
          <img src={image} alt="wfhomie-geoguesser Logo" style={{ height: "70px", width: "auto", margin: "auto" }} />
        </div>
        <div className="content">
          <div className="form" >
            <div className="form-group">
              <input onChange={this.change} type="text" name="name" placeholder="Type Your Name" id="username" required="required" />
              <input onChange={this.change} type="text" name="key" placeholder="Type the Room Name" id="key" required="required" />
            </div>
            {/* <label className="alert alert-danger" style={{ visibility: "hidden", fontSize: "15px" }} id="msg"></label> */}
          </div>
          <div className="footer">
            <Link to={{ pathname: this.state.url, nameprop: this.state.name, bclick: true }}>
              <button type="button" className="big-button" style={{ display: "table-cell", verticalAlign: "middle", marginBottom: "15px" }} onClick={
                this.setUsername
              }>
                Play!
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;