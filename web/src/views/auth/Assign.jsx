
import React from "react";
import AuthApi from '../../services/auth';
import Configuration from "../../services/configuration"
// reactstrap components
import {
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
    AuthApi.generateToken(this.state.username, (data) => {
        this.setState({token: data.token})
    });
  }

  render() {
    return (
      <>
        <Col lg="12" md="12">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup lg="3" md="3">
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
                <a style={{fontSize: "20px"}} href={ this.state.token ? Configuration.webAddress + "/auth/register?token=" + this.state.token : ""}>{ this.state.token ? Configuration.webAddress + "/auth/register?token=" + this.state.token : ""}</a>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Assign;
