import React from "react";
import { Route, Switch } from "react-router-dom";
// import HoverImage from "react-hover-image"
import key from "../assets/img/key.png"
import keyHover from "../assets/img/key-hover.png"
import { Container, Row } from "reactstrap";

import AuthFooter from "../components/Footers/AuthFooter.jsx";
import { NotificationManager } from 'react-notifications';
import routes from "../routes.js";
import AuthApi from '../services/auth';
import { NotificationContainer } from 'react-notifications';

class Auth extends React.Component {
  constructor(props){
    super(props)
    this.state = {key : key}
  }
  componentDidMount() {
    document.body.classList.add("bg-default");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }
  toggleU2F = () => {
    AuthApi.toggleU2f();
    this.setState({key: (AuthApi.u2fenabled  ? keyHover : key)})
    
    if (AuthApi.u2fenabled){
      NotificationManager.success('U2F enabled', 'Authentication', 2000);
    }
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  render() {
    return (
      <>
        <div className="main-content">
        
          <div className="header bg-gradient-info py-7 py-lg-8">
            <div>
            <img alt="key"
              src={this.state.key}
              onClick={() => this.toggleU2F() }
              style={{ width: "48px", position: "absolute", top: "10px", pointerEvents: "all"}}
            />
            </div>  
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-default"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </div>
          {/* Page content */}
          <Container className="mt--8 pb-5">
            
            <Row className="justify-content-center">
              <Switch>{this.getRoutes(routes)}</Switch>
            </Row>
          </Container>
        </div>
        <NotificationContainer />
        <AuthFooter />
      </>
    );
  }
}

export default Auth;
