/**
 * Authentication Api. Represents the client side service which calls to authentication API to perform login/register/2fa/u2f.
 */
class AuthApi 
{
    // Registration endpoint (localhost:1414/registrations/)
    registration = (username, callback) => {
        console.log("Registration done")
        fetch("http://localhost:1414/registration", {
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