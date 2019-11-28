

/**
 * Authentication Api. Represents the client side service which calls to authentication API to perform login/register/2fa/u2f.
 */
class AuthApi 
{
    constructor(){
        this.buildUrl = (path) => { return "http://192.168.43.104:3000" + path}
    }
    
    // Registration endpoint (localhost:1414/registrations/)
    registration = (username, callback) => {
        console.log("Registration done")
        fetch(this.buildUrl("/registration"), {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({username: username})
        }).then(response => {
            return response.json();
        }).then(data => {
            callback(data)    
        });
    }

    isLoggedIn = () => {
        return true;
    }

    login = (username, callback) => {
        console.log(username);
        console.log("login done")
        fetch(this.buildUrl("/login"), {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({username: username})
        }).then(response => {
            return response.json();
        }).then(data => {
            callback(data)    
        });
    }

    totp = (totp, callback) => {
        callback(true)
    }

    u2fenabled = () => {
        return true
    }

    toggleU2f = () => {

    }
}

export default new AuthApi();