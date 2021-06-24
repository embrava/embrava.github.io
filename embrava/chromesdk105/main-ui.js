(function() {
	
	var imported = document.createElement("script");
	imported.src = "embrava-lib.js";
	document.getElementsByTagName("head")[0].appendChild(imported);

    var ui = {
        deviceSelector: null,
	    displayLight: null,
	    redValue: null,
	    greenValue: null,
	    blueValue: null,
	    buttonSetLight: null,
	    dimLight: null,
	    flashLight: null,
	    flashSpeedSelector: null,
	    playMusic: null,
	    musicSelector: null,
	    volumeRange: null,
	    repeatMusic: null,
		volumeMute: null,
		
		buttonAddDevice:null
	};
  
	var arrMusicListForBlyncUSB30S = ["Music 1", "Music 2", "Music 3", "Music 4", "Music 5", 
									"Music 6", "Music 7", "Music 8", "Music 9", "Music 10"];
									
	var arrMusicListForBlyncMiniWireless = ["Music 1", "Music 2", "Music 3", "Music 4", "Music 5", 
									"Music 6", "Music 7", "Music 8", "Music 9", "Music 10", 
									"Music 11", "Music 12", "Music 13", "Music 14"];
									
	var arrFlashSpeed = ["Slow", "Med", "Fast", "Pulsating"];

	var bySelectedMusic = 1;
	var bySelectedFlashSpeed = 1;
	var byVolumeLevel = 5;

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

	let finalDevices = []; // has properties 'deviceName' a string value and 'device' an USB device object;                
	let selectedDeviceInfo; // USB device object
	var numberOfDevices = 0;
	var deviceName = "";


    // Update UI
	var initializeWindow = function() {
		console.log("initializeWindow is called");
	  
		for (var k in ui) {
		  var id = k;
		  //console.log(id);
		  var element = document.getElementById(id);
		  if (!element) {
			  throw "Missing UI element: " + k;
			}
			ui[k] = element;
			//console.log(ui[k]);
		}
		
		for (var k in ui) {
			console.log(ui[k]);
		}		
		
		// Add flash speed list
		addFlashSpeedList();
		
		// Add Music list
		addMusicList1();
	
		ui.deviceSelector.addEventListener('change', onDeviceSelectionChanged);
		ui.displayLight.addEventListener('change', onCheckboxDisplayLightChanged);
		ui.buttonSetLight.addEventListener('click', onButtonSetLightClicked);
		ui.dimLight.addEventListener('change', onCheckboxDimLightChanged);
		ui.flashLight.addEventListener('change', onCheckboxFlashLightChanged);
		ui.flashSpeedSelector.addEventListener('change', onFlashSpeedSelectionChanged);
		ui.playMusic.addEventListener('change', onCheckboxPlayMusicChanged);
		ui.musicSelector.addEventListener('change', onMusicSelectionChanged);
		ui.volumeRange.addEventListener('change', onVolumeRangeValueChanged);
		ui.repeatMusic.addEventListener('change', onCheckboxRepeatMusicChanged);
		ui.volumeMute.addEventListener('change', onCheckboxVolumeMuteChanged);

		ui.buttonAddDevice.addEventListener('click', onButtonAddDeviceClicked);
		
		enableIOControlsForBlyncUSB30_30S_Devices(false);
		
		navigator.usb.addEventListener('connect', event => {
			// event.device will bring the connected device
			enumerateDevices_ui();
		});

		navigator.usb.addEventListener('disconnect', event => {
			// event.device will bring the disconnected device
		    enumerateDevices_ui();	
		}); 
	};

	window.addEventListener('load', initializeWindow);

    // Add Device button click event
	var onButtonAddDeviceClicked = async function() {
		try {
			let device1 = await RequestUSBDevice();
			enumerateDevices_ui();		
		}
		catch (err) {
		    enumerateDevices_ui();	
		}
	};
	
    // Device selection change event
    var onDeviceSelectionChanged = function() { 
		var selectedItem = ui.deviceSelector.options[ui.deviceSelector.selectedIndex];
	    if (!selectedItem) {
	        return;
	    }

	    if (ui.deviceSelector.selectedIndex == -1) {
	        return;
	    }
		
		// Check for the device type and enable light / music or both functions
		enableIOControlsForLightForBlyncUSB30_30S_Devices(false);
	    enableIOControlsForMusicForBlyncUSB30S_Devices(false);
		
	    deviceName = finalDevices[ui.deviceSelector.selectedIndex].deviceName;
	    selectedDeviceInfo = finalDevices[ui.deviceSelector.selectedIndex];

	    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||  
            deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
				
	        enableIOControlsForLightForBlyncUSB30_30S_Devices(true);
	        enableIOControlsForMusicForBlyncUSB30S_Devices(true);

	        // Update music list combobox items based on the device type
	        if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S) {
	            clearMusicList();
	            addMusicList1();
	        } else {
	            clearMusicList();
	            addMusicList2();
	        }
	    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40) {
	        enableIOControlsForLightForBlyncUSB30_30S_Devices(true);
	        enableIOControlsForMusicForBlyncUSB30S_Devices(false);	        
	    }
	};
	
    // Display Light Checkbox state change event
    var onCheckboxDisplayLightChanged = async function () {
        var bDisplayLight = ui.displayLight.checked;
        
        if (bDisplayLight == true) {
            await SetRGBValues(selectedDeviceInfo);
        } else {
            await ResetLight(selectedDeviceInfo);
        } 
	}; 

    // Set Light button click event
    var onButtonSetLightClicked = async function () {
        if (ui.displayLight.checked == true) {
            await SetRGBValues(selectedDeviceInfo);
        }
	};
	
    // Dim Light Checkbox state change event
    var onCheckboxDimLightChanged = async function () {
        var bDimLight = ui.dimLight.checked;

        if (bDimLight == true) {
            await SetLightDim(selectedDeviceInfo);
        } else {
            await ClearLightDim(selectedDeviceInfo);
        }
	};
	
    // Flash Light Checkbox state change event
	var onCheckboxFlashLightChanged = async function() {
	    var bFlashLight = ui.flashLight.checked;

	    if (bFlashLight == true) {
	        await StartLightFlash(selectedDeviceInfo);
	        await SelectLightFlashSpeed(selectedDeviceInfo, bySelectedFlashSpeed);
	    } else {
	        await StopLightFlash(selectedDeviceInfo);
	    }
	};
	
    // Flash Speed selection change event
	var onFlashSpeedSelectionChanged = async function() {
	    bySelectedFlashSpeed = ui.flashSpeedSelector.selectedIndex + 1;
	    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S ||
            deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S ||
            deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
	        await SelectLightFlashSpeed(selectedDeviceInfo, bySelectedFlashSpeed);
	    }
	};
	
    // Play Music Checkbox state change event
	var onCheckboxPlayMusicChanged = async function() {
	    var bPlayMusic = ui.playMusic.checked;
	    byVolumeLevel = ui.volumeRange.value;

	    await StopMusicPlay(selectedDeviceInfo);
	    await SelectMusicToPlay(selectedDeviceInfo, bySelectedMusic);
	    await SetMusicVolume(selectedDeviceInfo, byVolumeLevel);
	    await ClearVolumeMute(selectedDeviceInfo);

	    if (bPlayMusic == true) {
	        if (ui.repeatMusic.checked == true) {
	            await SetMusicRepeat(selectedDeviceInfo);
	        } else {
	            await ClearMusicRepeat(selectedDeviceInfo);
	        }
	        await StartMusicPlay(selectedDeviceInfo);
	    } else {
	        await (selectedDeviceInfo);
	    }
	};
	
    // Music selection change event
	var onMusicSelectionChanged = async function() {
	    bySelectedMusic = ui.musicSelector.selectedIndex + 1;
	    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
	        if (ui.playMusic.checked == true) {
	            await StopMusicPlay(selectedDeviceInfo);
	            await SelectMusicToPlay(selectedDeviceInfo, bySelectedMusic);
	            if (ui.repeatMusic.checked == true) {
	                await SetMusicRepeat(selectedDeviceInfo);
	            } else {
	                await ClearMusicRepeat(selectedDeviceInfo);
	            }
	            await StartMusicPlay(selectedDeviceInfo);
	        }
	    }
	};
	
    // Volume level change event
	var onVolumeRangeValueChanged = async function() {
	    byVolumeLevel = ui.volumeRange.value;
	    bySelectedMusic = ui.musicSelector.selectedIndex + 1;
	    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_41S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
	        if (ui.playMusic.checked == true) {
	            await StopMusicPlay(selectedDeviceInfo);
	            await SelectMusicToPlay(selectedDeviceInfo, bySelectedMusic);
	            await SetMusicVolume(selectedDeviceInfo, byVolumeLevel);
	            if (ui.repeatMusic.checked == true) {
	                await SetMusicRepeat(selectedDeviceInfo);
	            } else {
	                await ClearMusicRepeat(selectedDeviceInfo);
	            }
	            await StartMusicPlay(selectedDeviceInfo);
	        }
	    }

	};
	
    // Repeat Music Checkbox state change event
	var onCheckboxRepeatMusicChanged = async function() {
	    var bMusicRepeat = ui.repeatMusic.checked;

	    if (bMusicRepeat == true) {
	        if (ui.playMusic.checked == true) {
	            await StopMusicPlay(selectedDeviceInfo);
	            await SelectMusicToPlay(selectedDeviceInfo, bySelectedMusic);
	            await SetMusicVolume(selectedDeviceInfo, byVolumeLevel);
	            await SetMusicRepeat(selectedDeviceInfo);
	            await StartMusicPlay(selectedDeviceInfo);
	        }
	    } else {
	        await StopMusicPlay(selectedDeviceInfo);
	        await ClearMusicRepeat(selectedDeviceInfo);
	        await StartMusicPlay(selectedDeviceInfo);
	        await StopMusicPlay(selectedDeviceInfo);
	    }
	};

	var onCheckboxVolumeMuteChanged = async function() {
	    var bVolumeMute = ui.volumeMute.checked;

	    if (bVolumeMute == true) {
			await SetVolumeMute(selectedDeviceInfo);
	    } else {
	        await ClearVolumeMute(selectedDeviceInfo);
	    }
	};	
	
    // Add Flash speed list
	var addFlashSpeedList = function () {
		for(var i = 0; i < arrFlashSpeed.length; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = arrFlashSpeed[i];
			opt.value = arrFlashSpeed[i];
			ui.flashSpeedSelector.appendChild(opt);
		}
	};
	
    // Add Music List (BLYNCUSB30S/40S devices) - 10 tones
	var addMusicList1 = function () {
		for(var i = 0; i < arrMusicListForBlyncUSB30S.length; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = arrMusicListForBlyncUSB30S[i];
			opt.value = arrMusicListForBlyncUSB30S[i];
			ui.musicSelector.appendChild(opt);
		}		
	};
	
    // Add Music List (BLMINI30/40/BLWRLS30/40) - 14 tones
	var addMusicList2 = function () {
		for(var i = 0; i < arrMusicListForBlyncMiniWireless.length; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = arrMusicListForBlyncMiniWireless[i];
			opt.value = arrMusicListForBlyncMiniWireless[i];
			ui.musicSelector.appendChild(opt);
		}		
	};
	
    // Clear Music List
	var clearMusicList = function () {
		while (ui.musicSelector.options.length > 0) {		
			ui.musicSelector.remove(0);
		}
	};

    // Update UI contorls for all v30 and v40 devices
	var enableIOControlsForBlyncUSB30_30S_Devices = function (bEnabled) {
		ui.displayLight.disabled = !bEnabled;
		ui.redValue.disabled = !bEnabled;
		ui.greenValue.disabled = !bEnabled;
		ui.blueValue.disabled = !bEnabled;
		ui.buttonSetLight.disabled = !bEnabled;
		ui.dimLight.disabled = !bEnabled;
		ui.flashLight.disabled = !bEnabled;
		ui.flashSpeedSelector.disabled = !bEnabled;
		ui.playMusic.disabled = !bEnabled;
		ui.musicSelector.disabled = !bEnabled;
		ui.volumeRange.disabled = !bEnabled;
		ui.repeatMusic.disabled = !bEnabled;
	};

    // Update UI contorls for all v30 and v40 devices for Light related controls
	var enableIOControlsForLightForBlyncUSB30_30S_Devices = function (bEnabled) {
		ui.displayLight.disabled = !bEnabled;
		ui.redValue.disabled = !bEnabled;
		ui.greenValue.disabled = !bEnabled;
		ui.blueValue.disabled = !bEnabled;
		ui.buttonSetLight.disabled = !bEnabled;
		ui.dimLight.disabled = !bEnabled;
		ui.flashLight.disabled = !bEnabled;
		ui.flashSpeedSelector.disabled = !bEnabled;
	};

    // Update UI contorls for all v30 and v40 devices for Music related controls
	var enableIOControlsForMusicForBlyncUSB30S_Devices = function (bEnabled) {
	    ui.playMusic.disabled = !bEnabled;
	    ui.musicSelector.disabled = !bEnabled;
	    ui.volumeRange.disabled = !bEnabled;
	    ui.repeatMusic.disabled = !bEnabled;
		ui.volumeMute.disabled = !bEnabled;
	};
	
    // Get all supported Embrava Devices
	var enumerateDevices_ui =  async function () {
	    console.log("enumerateDevices_ui start");
	    
	    finalDevices = await EnumerateDevices();

	    numberOfDevices = finalDevices.length;
		
		onDevicesEnumerated(finalDevices);
			
		console.log("enumerateDevices_ui exit");
	};

	var onDevicesEnumerated = function (devices) {
		
	    console.log("onDevicesEnumerated start");

	    do {			
			// Add all the devices detected
			UpdateDeviceList(devices);	        

	        if (devices.length < 1) {
	            ui.deviceSelector.disabled = true;
	        } else {
	            ui.deviceSelector.disabled = false;
	        }

	    } while (false);

	    
	    console.log("onDevicesEnumerated exit");
	}

    // Update Device List
	var UpdateDeviceList = function (devices) {
	    console.log("UpdateDeviceList start");
		
	    var listLength = ui.deviceSelector.length;

	    while (ui.deviceSelector.options.length) {
	        ui.deviceSelector.remove(0);
	    }
				
		for (var device of devices) {
		    do {
		        
		        var deviceName = device.deviceName;
		        var selectedIndex = ui.deviceSelector.selectedIndex;
		        var option = document.createElement('option');

				if (deviceName !== null) {
					option.text = deviceName;
					ui.deviceSelector.options.add(option);
					if (selectedIndex != -1) {
						ui.deviceSelector.selectedIndex = selectedIndex;
					}
				}				

			} while (false);
		}

		onDeviceSelectionChanged();
	    
	    console.log("UpdateDeviceList exit");
	};

    // Pass RGB values to device
	async function SetRGBValues(selectedDeviceInfo) {
	    var byRedLevel = 255;
	    var byGreenLevel = 255;
	    var byBlueLevel = 255;

	    try {
	        byRedLevel = parseInt(ui.redValue.value);
	        byGreenLevel = parseInt(ui.greenValue.value);
	        byBlueLevel = parseInt(ui.blueValue.value);

	        await TurnOnRGBLights(selectedDeviceInfo, byRedLevel, byGreenLevel, byBlueLevel);

	    } catch (e) {

	    }
	}

}());