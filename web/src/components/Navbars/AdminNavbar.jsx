
import React from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Container,
} from "reactstrap";

class AdminNavbar extends React.Component {
  render() {
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >
              {this.props.brandText}
            </Link>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;
