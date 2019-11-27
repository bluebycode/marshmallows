
import React from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import {
  Badge,

  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,


  UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";

class Dashboard extends React.Component {
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className=" mt--7" fluid>
           
              {/* Card stats */}
              <Row>
                <Col lg="6" xl="4">
                  <Card className="card-stats bg-gradient-default shadow mb-4 mb-xl-0 text-white">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-white text-muted mb-0"
                          >
                            Devices
                          </CardTitle>
                          <span className="h1 text-white font-weight-bold mb-0">
                            0
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-chart-bar" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats  bg-gradient-default shadow mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-white text-muted mb-0"
                          >
                            Gateways
                          </CardTitle>
                          <span className="h1 font-weight-bold mb-0 text-white">
                            0
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i className="fas fa-chart-pie" />
                          </div>
                        </Col>
                      </Row>
                      
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats  bg-gradient-default shadow mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0 text-white"
                          >
                            Connections
                          </CardTitle>
                          <span className="h1 font-weight-bold mb-0 text-white">0</span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                            <i className="fas fa-users" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row >
                <Col className="bg-gradient-info" 
                    style={{height:"500px", maxWidth: "130%", width: "130%", marginLeft:"-24px", marginRight:"-30px"}}>
                        &nbsp;</Col>
                </Row>                
          
          </Container>
              </>
    );
  }
}

export default Dashboard;
