#!/usr/bin/python3

import dbus
from Crypto.PublicKey import RSA

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

class Crypto():
    def __init__(self):
        # Generate keys
        print ("generating keys")
        self.keys = RSA.generate(1024)
        self.private_key = str(self.keys.export_key())
        self.private_key = self.private_key.replace('-----BEGIN RSA PRIVATE KEY-----\\n', '')
        self.private_key = self.private_key.replace('\\n-----END RSA PRIVATE KEY-----', '')

        self.public_key = str(self.keys.publickey().export_key())
        self.public_key = self.public_key.replace('-----BEGIN PUBLIC KEY-----\\n', '')
        self.public_key = self.public_key.replace('\\n-----END PUBLIC KEY-----', '')
        
        print (len(self.private_key))
        print()
        print (len(self.public_key))
        print()

    def getVkeyHex (self):
        # return self.vkey.to_string().hex()
        return None

    def setChallenge (self, challenge):
        # self.challenge = challenge
        return None

# Generating keys
crypto = Crypto()

class AuthenticationAdvertisement(Advertisement):
    def __init__(self, index):
        Advertisement.__init__(self, index, "peripheral")
        self.add_local_name("Thingy 52 Authentication")
        self.include_tx_power = True

class AuthenticationService(Service):
    AUTHENTICATION_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, index):
        Service.__init__(self, index, self.AUTHENTICATION_SVC_UUID, True)
        self.add_characteristic(PublicKeyCharacteristic(self))
        self.add_characteristic(ChallengeCharacteristic(self))
        self.add_characteristic(ChallengeResponseCharacteristic(self))



# PUBLIC KEY CHARACTERISTIC =====================================================

class PublicKey1Characteristic(Characteristic):
    PUBLICKEY_CHARACTERISTIC_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"


    def __init__(self, service):
        self.notifying = False

        Characteristic.__init__(
                self, self.PUBLICKEY_CHARACTERISTIC_UUID,
                ["read"], service)
        self.add_descriptor(PublickeyDescriptor(self))

    def ReadValue(self, options):
        value = []
        
        for c in crypto.getVkeyHex():
            value.append(dbus.Byte(c.encode()))

        return value


class Publickey1Descriptor(Descriptor):
    PUBLICKEY_DESCRIPTOR_UUID = "2901"
    PUBLICKEY_DESCRIPTOR_VALUE = "Thingy52 Public Key1"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.PUBLICKEY_DESCRIPTOR_UUID,
                ["read"], 
                characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.PUBLICKEY_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value





# CHALLENGE CHARACTERISTIC =====================================================

class ChallengeCharacteristic(Characteristic):
    UNIT_CHARACTERISTIC_UUID = "00000003-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        self.notifying = False

        Characteristic.__init__(
                self, self.UNIT_CHARACTERISTIC_UUID,
                ["write"], service)
        self.add_descriptor(ChallengeDescriptor(self))

    def WriteValue(self, value, options):

        val = []

        print ("received challenge")
        
        for v in value:
            val.append(hex(int(v)))

        crypto.setChallenge (val)

class ChallengeDescriptor(Descriptor):
    CHALLENGE_DESCRIPTOR_UUID = "2901"
    CHALLENGE_DESCRIPTOR_VALUE = "Auth Challenge"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.CHALLENGE_DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.CHALLENGE_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value



# CHALLENGE RESPONSE CHARACTERISTIC =====================================================

class ChallengeResponseCharacteristic(Characteristic):
    CHALLENGERESPONSE_CHARACTERISTIC_UUID = "00000004-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        self.notifying = False

        Characteristic.__init__(
                self, self.CHALLENGERESPONSE_CHARACTERISTIC_UUID,
                ["notify","read"], service)
        self.add_descriptor(ChallengeresponseDescriptor(self))

    # def get_temperature(self):
    #     value = []
    #     unit = "C"

    #     cpu = CPUTemperature()
    #     temp = cpu.temperature
    #     if self.service.is_farenheit():
    #         temp = (temp * 1.8) + 32
    #         unit = "F"

    #     strtemp = str(round(temp, 1)) + " " + unit
    #     for c in strtemp:
    #         value.append(dbus.Byte(c.encode()))

    #     return value

    # def set_temperature_callback(self):
    #     if self.notifying:
    #         value = self.get_temperature()
    #         self.PropertiesChanged(GATT_CHRC_IFACE, {"Value": value}, [])

    #     return self.notifying

    # def StartNotify(self):
    #     if self.notifying:
    #         return

    #     self.notifying = True

    #     value = self.get_temperature()
    #     self.PropertiesChanged(GATT_CHRC_IFACE, {"Value": value}, [])
    #     self.add_timeout(NOTIFY_TIMEOUT, self.set_temperature_callback)

    # def StopNotify(self):
    #     self.notifying = False

    # def ReadValue(self, options):
    #     value = self.get_temperature()

    #     return value

class ChallengeresponseDescriptor(Descriptor):
    CHALLENGERESPONSE_DESCRIPTOR_UUID = "2901"
    CHALLENGERESPONSE_DESCRIPTOR_VALUE = "Challenge Response"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.CHALLENGERESPONSE_DESCRIPTOR_UUID,
                ["read"], 
                characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.CHALLENGERESPONSE_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value


# MAIN =====================================================

app = Application()
app.add_service(AuthenticationService(0))
app.register()

adv = AuthenticationAdvertisement(0)
adv.register()

try:
    app.run()
except KeyboardInterrupt:
    app.quit()