import * as WebAuthnJSON from "@github/webauthn-json"

function getCSRFToken() {
  var CSRFSelector = document.querySelector('meta[name="csrf-token"]')
  if (CSRFSelector) {
    return CSRFSelector.getAttribute("content")
  } else {
    return null
  }
}

function callback(url, onSuccess, body) {
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-CSRF-Token": getCSRFToken()
    },
    credentials: 'same-origin'
  }).then(function(response) {
    if (response.ok) {
      // window.location.replace("/")
      onSuccess("genial!")
    } else {
      console.log("error");
    }
  });
}

function create(callbackUrl, credentialOptions, onSuccess) {
  WebAuthnJSON.create({ "publicKey": credentialOptions }).then(credential => {
    const full_credential = {
      ...credential,
      user: credentialOptions.user,
      challenge: credentialOptions.challenge
    };
    callback(callbackUrl, onSuccess, full_credential);
  }).catch(function(error) {
    console.log(error);
  });
}

function get(callbackUrl, credentialOptions, onSuccess) {
  WebAuthnJSON.get({ "publicKey": credentialOptions }).then(function(credential) {
    const full_credential = {
      ...credential,
      user_id: credentialOptions.user_id,
      challenge: credentialOptions.challenge
    };
    callback(callbackUrl, onSuccess, full_credential);
  }).catch(function(error) {
    console.log(error);
  });
}

export { create, get }
