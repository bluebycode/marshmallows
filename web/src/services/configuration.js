/**
 * Configuration. Represents the cloud static configuration with constants and variables.
 */
class Configuration {
    authAddress = (path) => "http://192.168.43.104:3000" + path
    brokerAddress = (path) => "http://localhost:8081" + path
}
export default new Configuration();