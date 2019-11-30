
var bluetoothDevice;
var publicKeyCharacteristic;

async function requestDevice() {
  console.log('Requesting any Bluetooth Device...');
  bluetoothDevice = await navigator.bluetooth.requestDevice({
    filters: [{
      name: 'Thingy 52 Authentication'
    }],
    optionalServices: ['00000001-710e-4a5b-8d75-3e5b444bc3cf']});
  
  bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
}

async function onDisconnected() {
  console.log('> Bluetooth Device disconnected');
}

// function handleBatteryLevelChanged(event) {
//   console.log('> Value Level1 is ', event.target.value);
//   var key = new Array(32)
//   for(var n=0;n<32;n++){
//     key.push(event.target.value.getUint8(n));
//   }
  
//   console.log('> Value Level is ', key);
// }

async function connectDeviceAndCacheCharacteristics() {
  if (bluetoothDevice.gatt.connected && publicKeyCharacteristic) {
    return;
  }

  console.log('Connecting to GATT Server...');
  const server = await bluetoothDevice.gatt.connect();

  console.log('Getting Authentication Service...');
  const service = await server.getPrimaryService('00000001-710e-4a5b-8d75-3e5b444bc3cf');

  console.log('Getting Public Key Characteristic...');
  publicKeyCharacteristic = await service.getCharacteristic('00000002-710e-4a5b-8d75-3e5b444bc3cf');
  challengeCharacteristic = await service.getCharacteristic('00000003-710e-4a5b-8d75-3e5b444bc3cf');
  // batteryLevelCharacteristic.addEventListener('characteristicvaluechanged',
  //     handleBatteryLevelChanged);
}

async function initLoginProcess() {
  var publicKey = await getPublicKey();
  var challenge = generateChallenge();

  color = challenge.split(",")

  console.log("rgb("+color[1].toString()+","+color[2].toString()+","+color[3].toString()+")")

  document.getElementById("myDIV").style.backgroundColor = "rgb("+color[1].toString()+","+color[2].toString()+","+color[3].toString()+")"


  var echallenge = await encryptChallenge(publicKey, challenge);
  setChallenge (echallenge)
  
}

async function setChallenge(echallenge) {
  try {
    var enc = new TextEncoder();
    encodedChallenge = enc.encode(echallenge);
    
    await challengeCharacteristic.writeValue(encodedChallenge)
  } catch(error) {
    console.log('Argh! ' + error);
  }

}

async function getPublicKey() {
  try {
    if (!bluetoothDevice) {
      await requestDevice();
    }
    await connectDeviceAndCacheCharacteristics();

    console.log('Reading Public Key...');
    
    var publicKey = await publicKeyCharacteristic.readValue();
    publicKey = new Uint8Array(publicKey.buffer);
    publicKey = String.fromCharCode.apply(null, publicKey);

    return publicKey;
    
  } catch(error) {
    console.log('Argh! ' + error);
  }

}

function generateChallenge() {
  var rnumber = randomInt(0,1024);
  var red = randomInt(0,256);
  var green = randomInt(0,256);
  var blue = randomInt(0,256);

  var challenge = rnumber.toString()+','+red.toString()+','+green.toString()+','+blue.toString();
  return challenge;
}

async function encryptChallenge(publicKey, challenge) {

  var enc = new TextEncoder();
  encodedChallenge = enc.encode(challenge);

  var importedKey = await importRsaKey (publicKey)

  var encryptedChallenge = await window.crypto.subtle.encrypt(
    {
    name: "RSA-OAEP"
    },
    importedKey,
    encodedChallenge
  )

  var base64encryptedchallenge = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedChallenge)));

  return base64encryptedchallenge

}

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}



function importRsaKey(pem) {

  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pem);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-1"
    },
    true,
    ["encrypt"]
  );
}

/*
Convert a string into an ArrayBuffer
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}