async function enumerateDevices() {
    try {
        // Request access to USB devices
        const devices = await navigator.usb.getDevices();

        // Print information about each connected device
        devices.forEach((device, index) => {
            console.log(`Device ${index + 1}:`);
            console.log(`  Vendor ID: ${device.vendorId}`);
            console.log(`  Product ID: ${device.productId}`);
            console.log(`  Manufacturer: ${device.manufacturerName}`);
            console.log(`  Product: ${device.productName}`);
            console.log(`  Serial Number: ${device.serialNumber}`);
        });

        // Check if there are no connected devices
        if (devices.length === 0) {
            console.log("No USB devices connected.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
