
import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Table,
  Col
} from "reactstrap";
import Header from "../components/Headers/Header.jsx";

class Gateways extends React.Component {
  state = {};
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className=" mt--7" fluid>
          {/* Table */}
          <Row>
            <Col className="mb-5 mb-xl-0" xl="10">
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
                    <tr>
                      <th scope="row"><b>aaaa</b>/ccccc</th>
                      <td>rpi</td>
                      <td>2</td>
                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
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
export default Gateways;
