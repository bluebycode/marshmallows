/*!

*/
import React from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";

import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter
  } from "reactstrap";

class DeviceModal extends React.Component {
  constructor(props){
    super(props)
  }
  
  render() {
    return (
      <>
        <Modal isOpen={this.props.isOpen}>
                <ModalHeader closeButton>Download a distribution</ModalHeader>

                <ModalBody>
                <div className="shadow">
                    <img alt="dist" style={{width: "200px"}} src={require("../../assets/img/distro/raspbian.png")}></img>
                    <div className="btn-wrapper text-center">
                    <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      href="#pablo"
                      onClick={e => e.preventDefault()}>
                      <span className="btn-inner--icon">
                        <img
                          alt="..."
                          src={require("../../assets/img/icons/common/github.svg")}
                        />
                      </span>
                      <span className="btn-inner--text">Raspbian image</span>
                    </Button>
                    </div>  
                  </div></ModalBody>
                <ModalFooter>
                <div className="btn-wrapper text-center">
                    
                    <a download href="https://github.com/vrandkode/marshmallows/blob/master/distributions/gateway.apk">
                    <img
                      className="btn-neutral btn-icon"
                      color="default"
                      style={{width: "50%"}}
                      src={require("../../assets/img/gplay.png")}>
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

export default DeviceModal;
