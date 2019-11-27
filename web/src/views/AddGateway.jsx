
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
import Header from "components/Headers/Header.jsx";

class AddGateway extends React.Component {
  state = {};
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className=" mt--7" fluid>
            <Modal isOpen={true} toggle={this.handleClose}>
                <ModalHeader closeButton>Connecting confirmation</ModalHeader>

                <ModalBody>Already connected to device, closing and open</ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={this.open}>
                        Go!
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Abort
                    </Button>
                </ModalFooter>
            </Modal>
      </Container>
      </>
    );
  }
}
export default AddGateway;
