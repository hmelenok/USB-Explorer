async function listFiles() {
    try {
        // Request access to USB devices
        const device = await navigator.usb.requestDevice({ filters: [{ classCode: 6 }] });
        console.log("USB device requested:", device);

        // Open a connection to the device
        await device.open();
        console.log("Connection opened to device:", device);

        // Claim an interface
        await device.claimInterface(0);
        console.log("Interface claimed:", device);

        // Send a command to the device to list files (GetObjectHandles operation)
        const command = new Uint8Array([
            0x10]);
        console.log("Command sent:", command);
        try {
            const r = await device.transferOut(1, command);
            console.log("Command successfully sent.", { r });
        } catch (error) {
            console.error("Error sending command:", error);
            throw error; // Rethrow error to propagate to the outer catch block
        }

        // Receive response from the device
        try {
            const response = await device.transferIn(2, 64); // Assuming the response is 64 bytes max
            console.log("Response received from device:", response);

            // Parse the response to extract file information
            const fileList = parseFileList(response.data);
            console.log("List of files:", fileList);
        } catch (error) {
            console.error("Error receiving response:", error);
            throw error; // Rethrow error to propagate to the outer catch block
        }

        // Release the interface and close the connection
        await device.releaseInterface(0);
        console.log("Interface released.");
        await device.close();
        console.log("Connection closed.");
    } catch (error) {
        console.error("Error:", error);
    }
}




function parseFileList(data) {
    console.log("Response DataView:", data);
    const fileList = [];
    let index = 0;

    while (index < data.byteLength) {
        // Extract file information from the response data
        const file = {};

        // Read the length of the file name
        const nameLength = data.getUint16(index, true); // Assuming little-endian format
        console.log("Index after reading name length:", index);
        index += 2;

        console.log("Response bytes:", Array.from(new Uint8Array(data.buffer)));


        // Read the file name bytes
        const fileNameBytes = new Uint8Array(data.buffer, index, nameLength);
        const fileName = new TextDecoder().decode(fileNameBytes);

        console.log("Index after reading file name:", index);
        file.name = fileName;
        index += nameLength;

        // Read the file size
        const fileSize = data.getUint32(index, true); // Assuming little-endian format
        console.log("Index after reading file size:", index);

        index += 4;
        file.size = fileSize;

        // Add file to the list
        fileList.push(file);
    }

    return fileList;
}
