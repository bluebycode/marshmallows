import * as WebAuthnJSON from "@github/webauthn-json"

function getCSRFToken() {
  var CSRFSelector = document.querySelector('meta[name="csrf-token"]')
  if (CSRFSelector) {
    return CSRFSelector.getAttribute("content")
  } else {
    return null
  }
}

function callback(url, body) {
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
      console.log("SI444");
    } else {
      console.log("NO1212");
    }
  });
}

function create(callbackUrl, credentialOptions) {
  console.log("--------------", credentialOptions);
  WebAuthnJSON.create({ "publicKey": credentialOptions }).then(credential => {
    const full_credential = {
      ...credential,
      user: credentialOptions.user,
      challenge: credentialOptions.challenge
    };
    callback(callbackUrl, full_credential);
  }).catch(function(error) {
    console.log(error);
  });

  console.log("Creating new public key credential...");
}

function get(callbackUrl, credentialOptions) {
  WebAuthnJSON.get({ "publicKey": credentialOptions }).then(function(credential) {
    const full_credential = {
      ...credential,
      user_id: credentialOptions.user_id,
      challenge: credentialOptions.challenge
    };
    console.log("object", full_credential);
    callback(callbackUrl, full_credential);
  }).catch(function(error) {
    console.log(error);
  });

  console.log("Getting public key credential...");
}

export { create, get }
