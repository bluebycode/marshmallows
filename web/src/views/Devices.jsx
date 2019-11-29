
import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
    Button,
    Table,
  } from "reactstrap";

// core components
import Header from "../components/Headers/Header.jsx";
import Navigation from '../components/Devices/navigation/Navigation';

class Devices extends React.Component {
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className=" mt--7" fluid>
          {/* Table */}
          <Row>
            <Col xl="7">
                <Card className="shadow">
                  {/* <Navigation>sss</Navigation> */}
                  <CardHeader className="bg-transparent">
                    <Row className="align-items-center">
                      <div className="col">
                        <h2 className="mb-0" style={{float:"left"}}>Map</h2>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody style={{height:"600px", padding: "0px"}}>
                    <Navigation></Navigation>
                  </CardBody>
                </Card>
            </Col>
            
            <Col className="mb-5 mb-xl-0" xl="5">
              <Card className="shadow" style={{height:"100%", padding: "0px"}}>
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Overall</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Node</th>
                      <th scope="col">Type</th>
                      <th scope="col">Conn.</th>
                      <th scope="col">Cpu rate</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                      <th scope="row"><b>aaaa</b></th>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        
                      </td>
                    </tr>
                    <tr>
                      <th scope="row"><b>aaaa</b>/bbbbb</th>
                      <td>unix</td>
                      <td>1</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
      </Container>
      </>
    );
  }
}

export default Devices;
