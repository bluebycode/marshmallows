/**
 * Authentication Api. Represents the client side service which calls to authentication API to perform login/register/2fa/u2f.
 */
class AuthApi 
{
    constructor(){  
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