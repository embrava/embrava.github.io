
document.getElementById('start-button').addEventListener('click', handleConnectClick);
document.getElementById('stop-button').addEventListener('click', handleDisconnectClick);

async function handleConnectClick() {
    let acolor = [ 255, 0, 255 ];  // purple
    let device = await openDevice();
    await turnToColor(device, acolor );
}

async function handleDisconnectClick() {
    let acolor = [ 0, 0, 0 ]; // off
    let device = await openDevice();
    if( !device ) return;
    await turnToColor(device, acolor);
    await device.close();
}

async function openDevice() {
    const vendorId = 0x2c0d; // Blyncusb Mini vid
    const productId = 0x000a;  // Blyncusb Mini pid

    const device_list = await navigator.hid.getDevices();
    console.log(device_list)
    
    let device = device_list.find(d => d.vendorId === vendorId && d.productId === productId);

    if (!device) {
        // this returns an array now
        let devices = await navigator.hid.requestDevice({
            filters: [{ vendorId, productId }],
        });
        console.log("devices:",devices);
        device = devices[0];
        if( !device ) return null;
    }

    if (!device.opened) {
        await device.open();
    }
    console.log("device opened:",device);
    return device;
}

async function turnToColor(device, [r, g, b] ) {
    if(!device) return;
    const reportId = 0;
    const data = Uint8Array.from([r, b, g, 0x08, 0x00, 0x00, 0xFF, 0x22 ]);
    try {
        await device.sendReport(reportId, data);
    } catch (error) {
        console.error('turnToColor: failed:', error);
    }
}
