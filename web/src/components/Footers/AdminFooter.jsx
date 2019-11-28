
/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="6">
            <Nav className="nav-footer justify-content-center justify-content-xl-end">
              <NavItem>
                <NavLink
                  href="http://marshmallows.cloud/about"
                  rel="noopener noreferrer"
                  target="_blank">
                  About Us
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="https://github.com/vrandkode/marshmallows/blob/master/LICENSE.md"
                  rel="noopener noreferrer"
                  target="_blank">
                  MIT License
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </footer>
    );
  }
}

export default Footer;
