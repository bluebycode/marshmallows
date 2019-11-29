/**
 * Configuration. Represents the cloud static configuration with constants and variables.
 */
class Configuration {
    webAddress = "http://localhost:8080"
    authAddress = (path) => "http://192.168.43.104:3000" + path
    brokerAddress = (path) => "http://localhost:8081" + path
    brokerChannelAddress = (token) =>  "ws://localhost:8081/channel/" + token + "/ws"
}
export default new Configuration();