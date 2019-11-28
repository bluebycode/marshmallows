#!/usr/bin/python3

import dbus

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

class AuthenticationAdvertisement(Advertisement):
    def __init__(self, index):
        Advertisement.__init__(self, index, "peripheral")
        self.add_local_name("Thingy52Authentication")
        self.include_tx_power = True

class AuthenticationService(Service):
    AUTHENTICATION_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, index):
        Service.__init__(self, index, self.AUTHENTICATION_SVC_UUID, True)
        self.add_characteristic(PublicKeyCharacteristic(self))
        # self.add_characteristic(UnitCharacteristic(self))

class PublicKeyCharacteristic(Characteristic):
    PUBLICKEY_CHARACTERISTIC_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        self.notifying = False

        Characteristic.__init__(
                self, self.PUBLICKEY_CHARACTERISTIC_UUID,
                ["notify", "read"], service)
        self.add_descriptor(PublickeyDescriptor(self))

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

# class ChallengeDescriptor(Descriptor):
#     PUBLICKEY_DESCRIPTOR_UUID = "2902"
#     PUBLICKEY_DESCRIPTOR_VALUE = "Auth Module Challenge"

#     def __init__(self, characteristic):
#         Descriptor.__init__(
#                 self, self.PUBLICKEY_DESCRIPTOR_UUID,
#                 ["read"],
#                 characteristic)

#     def ReadValue(self, options):
#         value = []
#         desc = self.PUBLICKEY_DESCRIPTOR_VALUE

#         for c in desc:
#             value.append(dbus.Byte(c.encode()))

#         return value


app = Application()
app.add_service(AuthenticationService(0))
app.register()

adv = AuthenticationAdvertisement(0)
adv.register()

try:
    app.run()
except KeyboardInterrupt:
    app.quit()