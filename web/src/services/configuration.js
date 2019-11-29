/**
 * Configuration. Represents the cloud static configuration with constants and variables.
 */
class Configuration {
    constructor(){
        const config = require('../configuration.dev.yaml');
    }
    authAddress = (path) => "http://192.168.43.104:3000" + path
    brokerApiAddress = (path) => "http://localhost:8080" + path // @todo: replace with brokerAddress, @obsolete
    brokerAddress = (path) => "http://localhost:8081" + path
    brokerChannelAddress = (token) =>  "ws://localhost:8081/channel/" + token + "/ws"
    brokerConnectApiAddress = (path) =>  "ws://localhost:8081" + path
}
export default new Configuration();