/**
 * Authentication Api. Represents the client side service which calls to authentication API to perform login/register/2fa/u2f.
 */
class AuthApi 
{
    constructor(){  
    }

    // Registration endpoint (localhost:1414/registrations/)
    registration = (username, callback) => {
        console.log("Registration done")
        fetch("localhost:1414/registrations", {
            method: 'post',
            body: JSON.stringify({
                username: username
            })
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            callback(data)    
        });
    }

    isLoggedIn = () => {
        return true;
    }

    login = (userdomain, callback) => {
        callback(true)
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