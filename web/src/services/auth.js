

import Configuration from "./configuration"

/**
 * Authentication Api. Represents the client side service which calls to authentication API to perform login/register/2fa/u2f.
 */
class AuthApi 
{
    // Registration endpoint (localhost:1414/registrations/)
    registration = (username, token, callback) => {
        fetch(Configuration.authAddress("/registration"), {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({username, token})
        }).then(response => {
            return response.json();
        }).then(data => {
            callback(data)    
        });
    }

    isLoggedIn = () => {
        return true;
    }

    generateToken = (username, callback) => {
        fetch(Configuration.authAddress("/registration/invite"), {
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

    login = (username, callback) => {
        fetch(Configuration.authAddress("/login"), {
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