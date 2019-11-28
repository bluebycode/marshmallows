
import React from "react";
import InputMask from 'react-input-mask';
import * as Credential from "../../services/credential";
import AuthApi from '../../services/auth';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {totp: false}
  }

  login = e => {
    console.log(e)
    e.preventDefault()
    AuthApi.login(this.state.username, (data) => {
      Credential.get("http://localhost:1414/login/callback", data);
    });
  }
  
  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            
            <CardHeader className="bg-transparent pb-5" style={{marginBottom: "-100px"}}>
              <div className="text-muted text-center mt-2 mb-3">
                <img alt="..." style={{width: "200px"}} src={require("../../assets/img/brand/marshmallow_brand.png")} />
                <span><h1>**** { AuthApi.u2fenabled ? "true" : "false" } { AuthApi.isLoggedIn ? "true" : "false" }</h1></span>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Id" type="email" 
                      onChange={event => this.setState({ username: event.target.value})}
                    />
                  </InputGroup>
                </FormGroup>
                { AuthApi.isLoggedIn ? <FormGroup>
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
                </FormGroup> : null }
                <div className="text-center">
                  <Button 
                    onClick={event => this.login(event)}
                    className="my-4" color="primary" type="button" 
                    style={{width: "300px", borderColor: "#33A7D9", backgroundColor: "#33A7D9", color: "#073763", fontSize: "25px"}}>
                    Go!
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            { !AuthApi.u2fenabled ? <Col xs="6">
              <a
                className="text-light"
                href="/auth/totp-registration"
                onClick={e => e.preventDefault()}
              >
                <small>TOTP registration</small>
              </a>
                </Col> : null}
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="/auth/register"
                onClick={e => e.preventDefault()}
              >
                <small>Nuevo registro</small>
              </a>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Login;
