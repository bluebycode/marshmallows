import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import Nodes from './Nodes.jsx'
import XTerminal from '../terminal/XTerminal';
import { Button, Modal,  ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.toggleBottom = this.toggleBottom.bind(this);
        this.open = this.open.bind(this);
        this.state = {
            bottomVisible: false,
            show: false
        };

        this.handleClose = () => this.setState(state => ({ show: false }));
        this.handleShow = () => this.setState(state => ({ show: true }));
    }

    generate() {
        this.token = [...Array(4)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
    }

    toggleBottom(id) {
        this.token = id;
        if (this.state.bottomVisible){
            this.handleShow()
        }else{
            this.open()
        }
    }

    open(){
        this.handleClose()
        if (this.state.bottomVisible){
            this.setState(state => ({ bottomVisible: false }));
            const interval = setInterval(() => {
                this.setState(state => ({ bottomVisible: true }));
                clearInterval(interval)
            }, 100);
            return
        }
        this.setState(state => ({ bottomVisible: true }));
    }

    render() {
        return (
        <SplitterLayout vertical={true} 
            secondaryInitialSize={40} 
            percentage={true}>
            <div>
                <Nodes onClickNode={this.toggleBottom.bind(this)}/>

                <Modal isOpen={this.state.show} toggle={this.handleClose}>
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
            </div>
            {this.state.bottomVisible &&
            (
            <div className="bottom-panel shadow card">
                <XTerminal token={this.token}/>
            </div>
            )}
        </SplitterLayout>
        );
    }
}
export default Navigation;