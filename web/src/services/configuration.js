/**
 * Configuration. Represents the cloud static configuration with constants and variables.
 */
class Configuration {
    // authAddress = (path) => "http://192.168.43.104:3000" + path
    authAddress = (path) => "http://localhost:1414" + path
}
export default new Configuration();