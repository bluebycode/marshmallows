
import React from "react";
import InputMask from 'react-input-mask';

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,

  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

class auth { // A implementar}

class Totp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {totp: false, code: null}
  }

  handleChange(event) {
    this.setState({totp: event.target.value})
  }

  handleTotp = () => {
    console.log("totp")
    auth.totp(this.state.code, (valid) => {
      if (valid) this.props.history.push('/cloud/index');
    })
  }

  
  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <img 
                  style={{width:"100%", marginBottom: "15px"}}
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example"></img>
                <FormGroup>
                  <InputGroup className="input-group-alternative" shows={this.state.totp.toString()}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-watch-time" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputMask {...this.props} mask="999 999" 
                      maskChar=" " placeholder="000 000" 
                      type="text" className="form-control totp"/>
                  </InputGroup>
                </FormGroup> 
                <div className="text-center">
                  <Button className="my-4" color="primary" type="button" 
                      style={{width: "300px", borderColor: "#33A7D9", 
                      backgroundColor: "#33A7D9", color: "#073763", fontSize: "25px"}}
                      onClick={this.handleTotp}>
                    Go!
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Totp;
