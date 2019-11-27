/*!

*/
import React from "react";

import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter
  } from "reactstrap";

class GatewayModal extends React.Component {
  constructor(props){
    super(props)
  }
  
  render() {
    return (
      <>
        <Modal isOpen={this.props.isOpen}>
                <ModalHeader closeButton>Add a gateway</ModalHeader>

                <ModalBody><p>Use your Android phone as a gateway to connect your Bluetooth device to mm Cloud.</p>
                <ul>
                  <li>1. Download and install the gateway apk using the link below.</li>
                  <li>2. Launch the app.</li>
                  <li>3. When your gateway is connected, you will move to the next step.</li>
                </ul></ModalBody>
                <ModalFooter>
                <div className="btn-wrapper text-center">
                    
                    <a download href="https://github.com/vrandkode/marshmallows/blob/master/distributions/gateway.apk">
                    <img
                      className="btn-neutral btn-icon"
                      color="default"
                      style={{width: "50%"}}
                      src={require("assets/img/gplay.png")}>
                    </img>
                    </a>
                    </div> 
                    <div className="btn-wrapper text-center">
                      <Button variant="primary" onClick={this.props.handleClose}>
                          Close
                      </Button>
                    </div>
                </ModalFooter>
            </Modal>
      </>
    );
  }
}

export default GatewayModal;
