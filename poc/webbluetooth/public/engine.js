
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
  // batteryLevelCharacteristic.addEventListener('characteristicvaluechanged',
  //     handleBatteryLevelChanged);
}

async function getPublicKey() {
  try {
    if (!bluetoothDevice) {
      await requestDevice();
    }
    await connectDeviceAndCacheCharacteristics();

    console.log('Reading Public Key...');
    
    var publicKey = await publicKeyCharacteristic.readValue();

    console.log(publicKey)
    
  } catch(error) {
    console.log('Argh! ' + error);
  }
}

// async function setBattery() {
//   try {
//     if (!bluetoothDevice) {
//       await requestDevice();
//     }
//     await connectDeviceAndCacheCharacteristics();

//     console.log('Set Battery Level...');
//     var val = Uint8Array.of(1);
//     await batteryLevelCharacteristic.writeValue(val)
//     console.log("Set battery level")
//   } catch(error) {
//     console.log('Argh! ' + error);
//   }
// }