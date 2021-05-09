import React from "react";
import "./App.scss";
import { Login } from "./components/login/login.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="App container-fluid" >
        <div className="login" >
          <div className="container" style={{backgroundColor:"F4F3F0"}} ref={ref => (this.container = ref)}>
              <Login containerRef={ref => (this.current = ref)} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
