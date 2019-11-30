/*!

*/
import React from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
import AuthApi from '../../services/auth';

import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter
  } from "reactstrap";

class DeviceModal extends React.Component {
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
        <Modal isOpen={this.props.isOpen} style={{width: "600px !important"}}>
                <ModalHeader closeButton>Download a distribution</ModalHeader>

                <ModalBody>
                <div className="shadow">
                    <img alt="dist" style={{width: "400px"}} src={require("../../assets/img/distro/raspbian.png")}></img>
                    <div className="btn-wrapper text-center">
                    <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      href="#pablo"
                      onClick={e => this.download(e)}>
                      <span className="btn-inner--text">Raspbian image</span>
                    </Button>
                    <br/>
                    <br/>
                    <span style={{fontSize:"17px", marginTop:"5px"}}>{ this.state.token ? "This is your personal token, which will be required during the isntallation. Do not share it with anyone: " : ""}</span>
                    <a href="https://raw.githubusercontent.com/vrandkode/marshmallows/master/distributions/rasbpian.valc31.gz" download><span style={{fontSize:"17px", marginTop:"5px", fontWeight: "bold"}}>{ this.state.token ? this.state.token : ""}</span></a>
                    </div>  
                  </div></ModalBody>
                <ModalFooter>
                
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
