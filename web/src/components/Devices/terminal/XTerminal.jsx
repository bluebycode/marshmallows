// References: https://www.linkedin.com/pulse/xtermjs-local-echo-ioannis-charalampidis/

import React from 'react';
import { FitAddon } from 'xterm-addon-fit';
import { Terminal} from 'xterm'
import { Writer, Channel } from '../../../services/channels'
import Configuration from '../../../services/configuration'

class MockWriter {
    write(message){
        console.log(">>>>>>>>>", message)
    }
}
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

        const mock = new MockWriter()
        const auth = new Channel(new Writer(mock))

        const channel = new Channel(new Writer(this.terminal))

        this.terminal.onKey((e) => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        
            if (ev.keyCode === 13) {
                this.terminal.prompt();
                channel.write('\r\n')
            } else if (ev.keyCode === 8) {
                if (this.terminal._core.buffer.x > 2) {
                    channel.write('\b \b')
                }
            } else if (printable) {
                channel.write(e.key)
            }
        });
        this.channel = channel
        this.auth = auth;
    }
    // TerminalHandler.connect("d3cd", () => { Connected!})
    connect = (deviceToken) => {

        /*this.auth.open({
            address: Configuration.brokerConnectApiAddress("/open/" + deviceToken),
        }, (response) => {
            console.log(response, "CONNECTED!!!")*/
            setTimeout(() => { 
                this.channel.open({
                    address: Configuration.brokerChannelAddress(deviceToken),
                    wrapped: true
                }, () => {
                    console.log("CONNECTED!!!")
                    this.connected = true;
                })
            }, 1500)
       // })
        
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
    }

    componentDidMount(){
        this.remote = new TerminalHandler(this.container)
        this.remote.connect(this.props.token, () => {
            console.log("[terminal] connected")
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
