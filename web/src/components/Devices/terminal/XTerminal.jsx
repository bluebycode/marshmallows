// References: https://www.linkedin.com/pulse/xtermjs-local-echo-ioannis-charalampidis/

import React from 'react';
import { FitAddon } from 'xterm-addon-fit';
import { Terminal} from 'xterm'

class TerminalHandler {
    constructor(container){
        this.terminal = new Terminal({
            cursorBlink: true,
            rows: 12,
            cols: 80,
            fontSize: 11
          })
        this.terminal.open(container)
        this.fitAddon = new FitAddon();
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.prompt = () => {
            this.terminal.write('\r\n~$ ');
        }
        this.terminal.prompt()
        this.terminal.onKey((e) => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        
            if (ev.keyCode === 13) {
                this.terminal.prompt();
                this.terminal.write('\r\n') //@todo: replace with socket
            } else if (ev.keyCode === 8) {
                if (this.terminal._core.buffer.x > 2) {
                    this.terminal.write('\b \b') //@todo: replace with socket
                }
            } else if (printable) {
              this.terminal.write(e.key) //@todo: replace with socket
            }
        });
       
    }
    // TerminalHandler.connect("d3cd", () => { Connected!})
    connect = (device) => {
        // connection
        // ..
    }
}

// XTerminal
class XTerminal extends React.Component {

    constructor(props) {
        super(props);
        console.log("[terminal] Creating the object", this.props.token)
        this.state = {
            token: "",
        }
        this.onChange = this.onChange.bind(this);
        this.state.token = this.props.token;
        this.container = null
        this.terminalStyle = {
            margin: "10px"
        };
    }

    componentWillUnmount(){
        console.log("unmounted")
    }

    componentDidMount(){
        this.remote = new TerminalHandler(this.container)
        this.remote.connect("aaaaa", this.props.token, () => {
            console.log("connected")
        })  
    }

    toggle() {
        this.setState({
          foo: !this.state.foo
        });
      }

    onChange(e) {
        this.setState({
            name: e.target.value
        })
    }

    // The render function, where we actually tell the browser what it should show
    render() {
        return ( 
            <div id="terminal" className="terminal-container">
             <span>connecting to {this.state.token}</span>
                <div ref={ el => this.container = el } 
                    className="terminal" 
                    style={this.terminalStyle}></div>
            </div>
        )
    }
}

export default XTerminal;
