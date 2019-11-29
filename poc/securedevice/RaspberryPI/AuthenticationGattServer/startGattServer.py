#!/usr/bin/python3

import dbus
import base64
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
from Crypto.Cipher import AES, PKCS1_OAEP

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

class Crypto():
    def __init__(self):
        # Generate keys
        print ("generating keys")
        self.key = RSA.generate(1024)

        self.private_key = self.key.export_key()
        self.public_key = self.key.publickey().exportKey()

        print (self.public_key.decode("utf-8"))
        print (self.private_key.decode("utf-8"))
        

        self.public_key_ble = self.key.publickey().export_key().decode("utf-8") 
        self.public_key_ble = self.public_key_ble.replace('-----BEGIN PUBLIC KEY-----\n', '')
        self.public_key_ble = self.public_key_ble.replace('\n-----END PUBLIC KEY-----', '')
        self.public_key_ble = self.public_key_ble.replace("\n",'')


    def receiveChallenge (self, challenge):

        print ("Challenge received:")
        print (challenge)

        rsa_private_key = RSA.importKey(self.private_key)
        rsa_private_key = PKCS1_OAEP.new(rsa_private_key)

        try:
            decrypted_text = rsa_private_key.decrypt(base64.b64decode(challenge))
            print (decrypted_text.decode("utf-8"))
        except Exception as e:
            print (e)

        


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

class PublicKeyCharacteristic(Characteristic):
    PUBLICKEY_CHARACTERISTIC_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"


    def __init__(self, service):
        self.notifying = False

        Characteristic.__init__(
                self, self.PUBLICKEY_CHARACTERISTIC_UUID,
                ["read"], service)
        self.add_descriptor(PublickeyDescriptor(self))

    def ReadValue(self, options):
        value = []
        
        for c in crypto.public_key_ble:
            value.append(dbus.Byte(c.encode()))

        return value


class PublickeyDescriptor(Descriptor):
    PUBLICKEY_DESCRIPTOR_UUID = "2901"
    PUBLICKEY_DESCRIPTOR_VALUE = "Thingy52 Public Key"

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

        val = ""
        
        for v in value:
            # val.append(hex(int(v)))
            val += str(v)

        crypto.receiveChallenge (val)

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