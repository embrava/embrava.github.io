var DEVICE_NAME_BLYNCLIGHT_PLUS_30S = "Blynclight Plus (BLYNCUSB30S)";
var DEVICE_NAME_BLYNCLIGHT_PLUS_40S = "Blynclight Plus (BLYNCUSB40S)";
var DEVICE_NAME_BLYNCLIGHT_STANDARD_30 = "Blynclight Standard (BLYNCUSB30)";
var DEVICE_NAME_BLYNCLIGHT_STANDARD_40 = "Blynclight Standard (BLYNCUSB40)";
var DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S = "Blynclight Wireless (BLWRLS30)";
var DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S = "Blynclight Wireless (BLWRLS40)";
var DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED = "Embrava Embedded";
var DEVICE_NAME_BLYNCLIGHT_MINI_30S = "Blynclight Mini (BLMINI30)";
var DEVICE_NAME_BLYNCLIGHT_MINI_40S = "Blynclight Mini (BLMINI40)";
var DEVICE_NAME_BLYNCLIGHT_MINI_41S = "Blynclight Mini (BLMINI41)";

// Command Buffer for Blynclight Devices
var abyBlyncUsb30ReportBuffer = new Uint8Array(8);

var byRedValue = 0x00;
var byGreenValue = 0x00;
var byBlueValue = 0x00;
var byLightControl = 0x00;
var byMusicControl_1 = 0x00;
var byMusicControl_2 = 0x00;

var byMaskLightOnOff = 0x01;
var byMaskLightDimControl = 0x02;
var byMaskLightFlashOnOff = 0x04;
var byMaskLightFlashSpeed = 0x38;
var byMaskMusicSelect = 0x0F;
var byMaskMusicOnOff = 0x10;
var byMaskMusicRepeatOnOff = 0x20;
var byMaskBit6Bit7 = 0xC0;
var byMaskVolumeControl = 0x0F;
var byMaskMute = 0x80;
var numberOfDevices = 0;

/***************************************************************************************************************************************************/
// Functions called with in Embrava Library API Functions - Start
/***************************************************************************************************************************************************/

async function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function TimeOutFunction() {
    // An empty function
}

// Send the BlyncControl Command buffer to the device
async function SendBlyncUSB30ControlCommand(deviceInfo, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2) {

    try {
        var device = deviceInfo.device;

        await device.open();
        //await device.reset();

        if (device.configuration === null) {
            await device.selectConfiguration(1);
        }

		await device.claimInterface(0);
		
        abyBlyncUsb30ReportBuffer[0] = byRedValue;
        abyBlyncUsb30ReportBuffer[1] = byBlueValue;
        abyBlyncUsb30ReportBuffer[2] = byGreenValue;
        abyBlyncUsb30ReportBuffer[3] = byLightControl;
        abyBlyncUsb30ReportBuffer[4] = byMusicControl_1;
        abyBlyncUsb30ReportBuffer[5] = byMusicControl_2;
        abyBlyncUsb30ReportBuffer[6] = 0xFF;
        abyBlyncUsb30ReportBuffer[7] = 0x22;

        var result = await device.controlTransferOut( 
            {
                requestType: 'class',
                recipient: 'device',
                request: 0x09,
                value: 0x0200,
                index: 0x0000
            },
            abyBlyncUsb30ReportBuffer);

        await device.close();
    } catch (e) {
        console.log("Exception: " + e);
    }
}

// This function sets the Red level of the RGB LED
async function SetRedColorBrightnessLevel(device, byRedLevel) {
    console.log("SetRedColorBrightnessLevel Entry");
    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byRedValue = byRedLevel;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } 

    console.log("SetRedColorBrightnessLevel Exit");
}

// This function sets the Green level of the RGB LED
async function SetGreenColorBrightnessLevel(device, byGreenLevel) {
    console.log("SetGreenColorBrightnessLevel Entry");
    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byGreenValue = byGreenLevel;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } 

    console.log("SetGreenColorBrightnessLevel Exit");
}

// This function sets the Blue level of the RGB LED
async function SetBlueColorBrightnessLevel(device, byBlueLevel) {
    console.log("SetBlueColorBrightnessLevel Entry");
    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byBlueValue = byBlueLevel;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }

    console.log("SetBlueColorBrightnessLevel Exit");
}
// TurnOnV30Light - Parameters: Device Information Object
// This function turns on the light of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnV30Light(device) {
    console.log("TurnOnV30Light Entry");
    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byLightControl &= ~byMaskLightOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }

    console.log("TurnOnV30Light Exit");
}

// TurnOffV30Light - Parameters: Device Information Object
// This function turns off the light of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOffV30Light(device) {
    console.log("TurnOffV30Light Entry");
    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byLightControl |= byMaskLightOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } 

    console.log("TurnOffV30Light Exit");
}

// Functions called with in Embrava Library API Functions - End
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
// Embrava Library API Calls - Start
/***************************************************************************************************************************************************/

// RequestUSBDevice
// Description:     This function gets the permission from the user to connect the Embrava Device to the Web application. 
//                  This function call is a must before using any other Embrava API library functions.
// Arguments:       None
// Return Value:    None
async function RequestUSBDevice() { 
    await navigator.usb.requestDevice({ filters: [{}] });
}

// EnumerateDevices
// Description:     This function gets device object information for the Embrava devices connected.
// Arguments:       None
// Return Value:    Array of device information object. Each item in the array represents the device information of each device. 
//                  The USB device object and device name would be returned in the device information object.
async function EnumerateDevices() {
    let devices = await navigator.usb.getDevices();

    numberOfDevices = 0;
    let detectedDevices = [];
    
    for (var device of devices) {
        do {
            var deviceName = null;

            if ((device.vendorId == 0x0E53 && device.productId == 0x2517) || (device.vendorId == 0x2C0D && device.productId == 0x0002)) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_PLUS_30S;
            } else if ((device.vendorId == 0x2C0D && device.productId == 0x0010)) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_PLUS_40S;
            } else if ((device.vendorId == 0x0E53 && device.productId == 0x2516) || (device.vendorId == 0x2C0D && device.productId == 0x0001)) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_STANDARD_30;
            } else if ((device.vendorId == 0x2C0D && device.productId == 0x000C)) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_STANDARD_40;
            } else if (device.vendorId == 0x2C0D && device.productId == 0x0006) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S;
            } else if (device.vendorId == 0x2C0D && device.productId == 0x000B) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S;
            } else if (device.vendorId == 0x2C0D && device.productId == 0x0009) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED;
            } else if ((device.vendorId == 0x0E53 && device.productId == 0x2519) || (device.vendorId == 0x2C0D && device.productId == 0x0003)) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_MINI_30S;
            } else if (device.vendorId == 0x2C0D && device.productId == 0x000A) {
                deviceName = DEVICE_NAME_BLYNCLIGHT_MINI_40S;
            } else if (device.vendorId == 0x2C0D && device.productId == 0x0011) {
				deviceName = DEVICE_NAME_BLYNCLIGHT_MINI_41S;
			}

            if (deviceName !== null) {

                var detectedDevice = new Object();
                detectedDevice.deviceName = deviceName;
                detectedDevice.device = device;
                detectedDevices[numberOfDevices] = detectedDevice;
            
                numberOfDevices++;
            }

        } while (false);
    }
    return detectedDevices;
}

// ResetLight
// Description:     This function resets the light to OFF state.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information
// Return Value:    None
async function ResetLight(device) {
    console.log("ResetLight Entry");
    var byBlyncControlCode = 0x00;
    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S ||  device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOffV30Light(device);
    } 
    console.log("ResetLight Exit");
}

// TurnOnRedLight
// Description:     This function lights up the selected Embrava device in Red color.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information 
// Return Value:    None
async function TurnOnRedLight(device) {
    console.log("TurnOnRedLight Entry");

    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
            device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await TurnOnRGBLights(device, 128, 0, 0);
        } else {
            await TurnOnRGBLights(device, 255, 0, 0);
        }
    }

    console.log("TurnOnRedLight Exit");
}

// TurnOnGreenLight
// Description:     This function lights up the selected Embrava device in Green color.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information 
// Return Value:    None
async function TurnOnGreenLight(device) {
    console.log("TurnOnGreenLight Entry");

    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnRGBLights(device, 0, 150, 0);	        
    }

    console.log("TurnOnGreenLight Exit");
}

// TurnOnBlueLight
// Description:	    This function lights up the selected Embrava device in Blue color.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information
// Return Value:    None
async function TurnOnBlueLight(device) {
    console.log("TurnOnBlueLight Entry");

    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnRGBLights(device, 0, 0, 150);
    }

    console.log("TurnOnBlueLight Exit");
}

// TurnOnYellowLight
// Description:     This function lights up the selected Embrava device in Yellow color.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information 
// Return Value:    None
async function TurnOnYellowLight(device) {
    console.log("TurnOnYellowLight Entry");

    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
            await TurnOnRGBLights(device, 90, 60, 0);
        } else if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await TurnOnRGBLights(device, 100, 60, 0);
        } else {
            await TurnOnRGBLights(device, 255, 60, 0);
        }
    }

    console.log("TurnOnYellowLight Exit");
}

// TurnOnPurpleLight
// Description:     This function lights up the selected Embrava device in Purple color.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information 
// Return Value:    None
async function TurnOnPurpleLight(device) {
    console.log("TurnOnPurpleLight Entry");

    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await TurnOnRGBLights(device, 68, 0, 128);
        } else {
            await TurnOnRGBLights(device, 128, 0, 128);
        }
    }

    console.log("TurnOnPurpleLight Exit");
}

// TurnOnWhiteLight
// Description:     This function lights up the selected Embrava device in White color.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information 
// Return Value:    None
async function TurnOnWhiteLight(device) {
    console.log("TurnOnWhiteLight Entry");

    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnRGBLights(device, 255, 125, 50);
    }

    console.log("TurnOnWhiteLight Exit");
}

// TurnOnCyanLight
// Description:     This function lights up the selected Embrava device in Cyan color.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information 
// Return Value:    None
async function TurnOnCyanLight(device) {
    console.log("TurnOnCyanLight Entry");

    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnRGBLights(device, 0, 255, 255);
    }

    console.log("TurnOnCyanLight Exit");
}

// TurnOnOrangeLight
// Description:     This function lights up the selected Embrava device in Orange color.
//                  This function call can be used for all types of devices.	
// Arguments:       device – device information object that contains USB device object and device name information 
// Return Value:    None
async function TurnOnOrangeLight(device) {
    console.log("TurnOnOrangeLight Entry");

    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
            device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
            await TurnOnRGBLights(device, 90, 20, 0);
        } else if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await TurnOnRGBLights(device, 100, 15, 0);
        } else {
            await TurnOnRGBLights(device, 255, 15, 0);
        }
    }

    console.log("TurnOnOrangeLight Exit");
}

// TurnOnRGBLights
// Description: This function lights the selected Embrava device in the color which represents the combination of the red, green and blue color.
//              This function call can be used for all types of devices.
// Arguments:   device – device information object that contains USB device object and device name information 
//              byRedLevel – byte value - red color brightness level which ranges from 0 to 255
//              byGreenLevel – byte value - green color brightness level which ranges from 0 to 255
//              byBlueLevel – byte value - blue color brightness level which ranges from 0 to 255
// Return Value: None
async function TurnOnRGBLights(device, byRedLevel, byGreenLevel, byBlueLevel) {
    console.log("TurnOnRGBLights Entry");
    if (device == null) {
        return;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnV30Light(device);
        await SetRedColorBrightnessLevel(device, byRedLevel);
        await SetGreenColorBrightnessLevel(device, byGreenLevel);
        await SetBlueColorBrightnessLevel(device, byBlueLevel);
    }

    console.log("TurnOnRGBLights Exit");
}

// SetLightDim
// Description: 	This function makes the current light brightness to dim by 50% of the full brightness. 
//                  This function call can be used for all types of devices.
// Arguments: 	    device – device information object that contains USB device object and device name information 
// Return Value:	None
async function SetLightDim(device) {
    console.log("SetLightDim Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl |= byMaskLightDimControl;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);

    } 

    console.log("SetLightDim Exit");
}

// ClearLightDim
// Description: 	This function resets the light dimness and bring the light brightness to full level. 
//                  This function call can be used for all types of devices.
// Arguments:    	device – device information object that contains USB device object and device name information
// Return Value:    None
async function ClearLightDim(device) {
    console.log("ClearLightDim Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl &= ~byMaskLightDimControl;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } 

    console.log("ClearLightDim Exit");
}

// SelectLightFlashSpeed
// Description: 	This function selects the speed at which the light will blink. This function call can be used for all types of devices.
// Arguments: 	    device – device information object that contains USB device object and device name information
//                  bySelectedFlashSpeed – byte value - blinking speed, which takes three values
//                  for low speed, bySelectedFlashSpeed = 0x01
//                  for medium speed, bySelectedFlashSpeed = 0x02
//                  for high speed, bySelectedFlashSpeed = 0x03
// Return Value:	None
async function SelectLightFlashSpeed(device, bySelectedFlashSpeed) {
    console.log("SelectLightFlashSpeed Entry");

    if (bySelectedFlashSpeed >= 0x03 ) {
        bySelectedFlashSpeed = bySelectedFlashSpeed + 1;
    }

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl &= ~byMaskLightFlashSpeed;
        byLightControl |= ((bySelectedFlashSpeed & 0x0F) << 3);
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } 

    console.log("SelectLightFlashSpeed Exit");
}

// StartLightFlash
// Description:     This function starts the light to blink at the specified blinking speed. 
//                  This function call CAN BE used for all types of devices.
// Arguments: 	    device – device information object that contains USB device object and device name information
// Return Value:	None
async function StartLightFlash(device) {
    console.log("StartLightFlash Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl |= byMaskLightFlashOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } 

    console.log("StartLightFlash Exit");
}

// StopLightFlash
// Description: 	This function stops blinking the light. This function call can be used for all types of devices.
// Arguments: 	    device – device information object that contains USB device object and device name information
// Return Value:	None
async function StopLightFlash(device) {
    console.log("StopLightFlash Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl &= ~byMaskLightFlashOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } 

    console.log("StopLightFlash Exit");
}

// SelectMusicToPlay
// Description: 	This function selects the music to be played on the Blync light.
//                  This function call can be used only for the following types of devices namely 
//                  BlyncUSB30S/40S (Blynclight Plus), Blynclight Mini 30/40, Blynclight Wireless 30/40 devices. 
//                  The BlynUSB30S/40S can play 10 sounds, Blynclight Mini 30/40 and Wireless 30/40 devices can play 14 sounds.
//
// Arguments: 	    device – device information object that contains USB device object and device name information
//                  bySelectedMusic – byte value ranges from 1 to 10. The Blynclight Mini and Wireless devices can play 14 sounds, 
//                  for which the value of bySelectedMusic ranges from 1 to 14.
//
// Return Value:	None
async function SelectMusicToPlay(device, bySelectedMusic) {
    console.log("SelectMusicToPlay Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 &= ~byMaskMusicSelect;
        byMusicControl_1 |= (bySelectedMusic & 0x0F);
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await Sleep(100);
        }
    }
    console.log("SelectMusicToPlay Exit");
}

// StartMusicPlay
// Description: 	This function starts playing the selected music on the Blynclight. 
//                  This function call can be used only for the following types of devices namely
//                  BlyncUSB30S/40S (Blynclight Plus), Blynclight Mini 30/40, Blynclight Wireless 30/40 devices.
//
// Arguments: 	    device – device information object that contains USB device object and device name information
//
// Return Value:	None
async function StartMusicPlay(device) {
    console.log("StartMusicPlay Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 |= byMaskMusicOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await Sleep(100);
        }
    }
    console.log("StartMusicPlay Exit");
}

// StopMusicPlay
// Description: 	This function stops playing the music that’s being played on the Blynclight. 
//                  This function call can be used only for the following types of devices namely 
//                  BlyncUSB30S/40S (Blynclight Plus), Blynclight Mini 30/40, Blynclight Wireless 30/40 devices.
//
// Arguments: 	    device – device information object that contains USB device object and device name information
//
// Return Value:	None
async function StopMusicPlay(device) {
    console.log("StopMusicPlay Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 &= ~byMaskMusicOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await Sleep(100);
        }
    }
    console.log("StopMusicPlay Exit");
}

// SetMusicRepeat
// Description: 	This function enables the repeated playing of the music that is being played on the Blync light, till the repeat flag gets cleared. 
//                  This function call can be used only for the following types of devices namely BlyncUSB30S/40S (Blynclight Plus), 
//                  Blynclight Mini 30/40, Blynclight Wireless 30/40 devices.
//
// Arguments: 	    device – device information object that contains USB device object and device name information
//
//    Return Value:	None
async function SetMusicRepeat(device) {
    console.log("SetMusicRepeat Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 |= byMaskMusicRepeatOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await Sleep(100);
        }
    }
    console.log("SetMusicRepeat Exit");
}

// ClearMusicRepeat
// Description: 	This function clears repeated playing of the music that is being played on the Blynclight,
//                  so that any music to be played will be played once. This function call can be used only for the 
//                  following types of devices namely BlyncUSB30S/40S (Blynclight Plus), Blynclight Mini 30/40, Blynclight Wireless 30/40 devices.
//
// Arguments: 	    device – device information object that contains USB device object and device name information
//
// Return Value:	None
async function ClearMusicRepeat(device) {
    console.log("ClearMusicRepeat Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 &= ~byMaskMusicRepeatOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await Sleep(100);
        }
    }
    console.log("ClearMusicRepeat Exit");
}

// SetMusicVolume
// Description: 	This function sets the volume level of the music that is being played on the Blynclight. 
//                  This function selects the music to be played on the Blynclight. 
//                  This function call can be used only for the following types of devices namely 
//                  BlyncUSB30S/40S (Blynclight Plus), Blynclight Mini 30/40, Blynclight Wireless 30/40 devices.
//
// Arguments: 	    device – device information object that contains USB device object and device name information
//                  byVolumeLevel – byte value ranges from 1 to 10. If byVolumeLevel = 1, the volume level will be set to 10%. 
//                  If byVolumeLevel = 2, the volume level will be 20%, if byVolumeLevel = 10, the volume level will be set as 100 %.
//
// Return Value:	None
async function SetMusicVolume(device, byVolumeLevel) {
    console.log("SetMusicVolume Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_2 &= ~byMaskVolumeControl;
        byMusicControl_2 |= byVolumeLevel;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await Sleep(100);
        }
    }
    console.log("SetMusicVolume Exit");
}

// SetVolumeMute
// Description: 	This function mutes the volume level of the music that is being played on the Blync light, 
//                  so that if any music is being played it will not be audible. But this doesn’t stop playing the music.
//                  This function call can be used only for the following types of devices namely BlyncUSB30S/40S (Blynclight Plus), 
//                  Blynclight Mini 30/40, Blynclight Wireless 30/40 devices.
//
// Arguments: 	    device – device information object that contains USB device object and device name information.
//
// Return Value:	None
async function SetVolumeMute(device) {
    console.log("SetVolumeMute Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_2 |= byMaskMute;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await Sleep(100);
        }
    }
    console.log("SetVolumeMute Exit");
}

// This function clears the music volume mute on the Blynclight Plus, Mini and Wireless devices
async function ClearVolumeMute(device) {
    console.log("ClearVolumeMute Entry");

    if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S ||
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_2 &= ~byMaskMute;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
        if (device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || device.deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await Sleep(100);
        }
    }
    console.log("ClearVolumeMute Exit");
}

// Embrava Device Library API Calls - End
/***************************************************************************************************************************************************/

    
