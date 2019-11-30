
import React from "react";
import * as Credential from "../../services/credential";
import AuthApi from '../../services/auth';
import queryString from 'query-string';
import Configuration from "../../services/configuration"

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

class Register extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      token: queryString.parse(props.location.search).token
    }
  }

  // Calls the authentication to perform registration
  registration = (e) => {
    e.preventDefault()
    AuthApi.registration(this.state.username, this.state.token, (data) => {
      if(data.status === "error"){
        this.setState({error: data.message})
      } else{
        Credential.create(Configuration.authAddress("/registration/callback"), data, (response) => {
          if (response.error){
            this.setState({error: data.message})
          }else{
            this.props.history.push("/auth/login");
          }
        });
      }
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
                          this.registration(event)
                        }
                      }}
                    />
                  </InputGroup>
                  <p style={{fontSize:"20px", marginTop:"5px", color: "#CC0000", textAlign: "center"}}>
                    { this.state.error ? this.state.error : ""}
                  </p>
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
