
import React from "react";
import * as Credential from "../../services/credential";
import AuthApi from '../../services/auth';

import Configuration from "../../services/configuration"
import { NotificationManager } from 'react-notifications';

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


class Assign extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username: ''
    }
  }

  // Calls the authentication to perform registration
  generate = (e) => {
    e.preventDefault()
    AuthApi.generateToken(this.state.username, (token) => {
        this.setState({token: token})
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
                       onKeyDown={event => {
                        this.setState({ username: event.target.value})
                        if (event.key === 'Enter') {
                          this.generate(event) 
                        }
                       }
                      }
                    />
                  </InputGroup>
                </FormGroup>
                <h2>token={this.state.token}</h2>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Assign;
