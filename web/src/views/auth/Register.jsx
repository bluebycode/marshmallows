
import React from "react";
import * as Credential from "../../services/credential";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col
} from "reactstrap";

import AuthApi from '../../services/auth';

class Register extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username: ''
    }
  }

  // Calls the authentication to perform registration
  registration = (e) => {
    console.log(e)
    e.preventDefault()
    AuthApi.registration(this.state.username, (data) => {
      Credential.create("http://localhost:1414/registration/callback", data);
      console.log("registered!");
    });
  }

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Username" type="text" 
                       onChange={event => this.setState({ username: event.target.value})}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="button" 
                    onClick={event => this.registration(event)}>
                    Create account
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

export default Register;
