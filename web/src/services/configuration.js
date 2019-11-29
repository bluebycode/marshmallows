/**
 * Configuration. Represents the cloud static configuration with constants and variables.
 */
class Configuration {
    webAddress = "http://localhost:8080"
    authAddress = (path) => "https://auth.marshmallows.cloud" + path
    brokerApiAddress = (path) => "http://localhost:8080" + path // @todo: replace with brokerAddress, @obsolete
    brokerAddress = (path) => "http://localhost:8081" + path
    brokerChannelAddress = (token) =>  "ws://localhost:8081/channel/" + token + "/ws"
    brokerConnectApiAddress = (path) =>  "ws://localhost:8081" + path
}
export default new Configuration();