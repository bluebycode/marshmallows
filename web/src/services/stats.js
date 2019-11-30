class Stats {
    constructor(){
        this.devices = 1
        this.gateways = 0
        this.connections = 0
    }

    connections = () => this.connections
    gateways = () => this.gateways
    devices = () => this.devices

    setconnections = (n) => this.connections = n
    setgateways = (n) => this.gateways = n
    setdevices = (n) => this.devices = n
}
export default new Stats();