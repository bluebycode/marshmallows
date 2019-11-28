
var bluetoothDevice;
var batteryLevelCharacteristic;

async function requestDevice() {
  console.log('Requesting any Bluetooth Device...');
  bluetoothDevice = await navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: ['00001805-0000-1000-8000-00805f9b34fb']});
  bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
  console.log('Getting Battery Level Characteristic...');
  
}

async function onDisconnected() {
  console.log('> Bluetooth Device disconnected');
}

function handleBatteryLevelChanged(event) {
  console.log('> Value Level1 is ', event.target.value);
  var key = new Array(32)
  for(var n=0;n<32;n++){
    key.push(event.target.value.getUint8(n));
  }
  
  console.log('> Value Level is ', key);
}

async function connectDeviceAndCacheCharacteristics() {
  if (bluetoothDevice.gatt.connected && batteryLevelCharacteristic) {
    return;
  }

  console.log('Connecting to GATT Server...');
  const server = await bluetoothDevice.gatt.connect();

  console.log('Getting Battery Service...');
  const service = await server.getPrimaryService('00001805-0000-1000-8000-00805f9b34fb');

  console.log('Getting Battery Level Characteristic...');
  batteryLevelCharacteristic = await service.getCharacteristic('00002a2b-0000-1000-8000-00805f9b34fb');
  batteryLevelCharacteristic.addEventListener('characteristicvaluechanged',
      handleBatteryLevelChanged);
}

async function getBattery() {
  try {
    if (!bluetoothDevice) {
      await requestDevice();
    }
    await connectDeviceAndCacheCharacteristics();

    console.log('Reading Battery Level...');
    await batteryLevelCharacteristic.readValue();
    
  } catch(error) {
    console.log('Argh! ' + error);
  }
}

async function setBattery() {
  try {
    if (!bluetoothDevice) {
      await requestDevice();
    }
    await connectDeviceAndCacheCharacteristics();

    console.log('Set Battery Level...');
    var val = Uint8Array.of(1);
    await batteryLevelCharacteristic.writeValue(val)
    console.log("Set battery level")
  } catch(error) {
    console.log('Argh! ' + error);
  }
}