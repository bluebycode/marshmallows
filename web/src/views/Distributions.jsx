
import React from "react";
import AuthApi from '../services/auth';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col
} from "reactstrap";

import Header from "../components/Headers/Header.jsx";

class Distributions extends React.Component {
  state = {};

  download = e => {
    e.preventDefault()
    AuthApi.generateAgentToken( token => {
      this.setState({token})
    });
  }

  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className=" mt--7" fluid>
          {/* Table */}
          <Row>
          <Col xl="5">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Distribution
                      </h6>
                      <h2 className="mb-0">Raspbian</h2>
                      
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="shadow">
                    <span>Raspbian distribution</span>
                    <img alt="dist" style={{width: "400px"}} src={require("../assets/img/distro/raspbian.png")}></img>
                    <div className="btn-wrapper text-center">
                    <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      href="#pablo"
                      onClick={e => this.download(e)}>
                      <span className="btn-inner--icon">
                        <img
                          alt="..."
                          src={require("../assets/img/icons/common/github.svg")}
                        />
                      </span>
                      <span className="btn-inner--text">Raspbian image</span>
                    </Button>
                    <br/>
                    <br/>
                    <span style={{fontSize:"17px", marginTop:"5px"}}>{ this.state.token ? "This is your personal token, which will be required during the isntallation. Do not share it with anyone: " : ""}</span>
                    <span style={{fontSize:"17px", marginTop:"5px", fontWeight: "bold"}}>{ this.state.token ? this.state.token : ""}</span>
                    </div>  
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="5">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    sss
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
export default Distributions;
