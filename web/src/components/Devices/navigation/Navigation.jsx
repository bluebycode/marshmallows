import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import { Button, Modal,  ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.toggleBottom = this.toggleBottom.bind(this);
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

    render() {
        return (
        <SplitterLayout vertical={true} 
            secondaryInitialSize={40} 
            percentage={true}>
                <div className="bottom-panel shadow card">
                    top
                </div>
            {this.state.bottomVisible &&
            (
            <div className="bottom-panel shadow card">
                bottom
            </div>
            )}
        </SplitterLayout>
        );
    }
}
export default Navigation;