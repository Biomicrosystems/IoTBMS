import { storeInstace } from "../lib/store";
import { addFilteredSerialData } from "../lib/features/filteredSerialData/filteredSerialDataSlice";
import { createDataBlob } from "./FileProcessingUtils";
import { addRawSerialData } from "lib/features/rawSerialData/rawSerialDataSlice";
import { removeConectedDevice } from "lib/features/conectedDevices/conectedDevicesSlice";
import { addUnexpectedDisconnect } from "lib/features/unexpectedDisconnect/unexpectedDisconnectSlice";

/**
 * Requests access to a serial port from the user and attempts to open it using the specified baud rate.
 * This function is part of the Web Serial API, which allows websites to communicate with serial devices.
 * It will prompt the user to select a serial device and attempt to connect to it at the provided baud rate.
 *
 * @async
 * @param {number} baudRateSelected - The baud rate at which the serial connection should be established.
 * @returns {Promise<SerialPort>} A promise that resolves to the `SerialPort` object if the connection
 *          is successful, or rejects if the user does not select a port or the port cannot be opened.
 *
 * @example
 * async function setupSerialConnection() {
 *   try {
 *     const serialPort = await connectToSerial(9600);
 *     console.log('Connected to serial port:', serialPort);
 *   } catch (error) {
 *     console.error('Failed to connect to serial port:', error);
 *   }
 * }
 */
async function connectToSerial(baudRateSelected: number, deviceId: string) {
  try {
    const port = await navigator.serial.requestPort();
    if (!port) {
      return;
    }
    await port.open({ baudRate: baudRateSelected, bufferSize: 16777216 });
    port.addEventListener("disconnect", () => {
      const devicesList = storeInstace.getState().conectedDevice;
      const isConected = devicesList.find((item) => item.id === deviceId);
      if (isConected) {
        storeInstace.dispatch(addUnexpectedDisconnect(isConected));
        storeInstace.dispatch(removeConectedDevice(deviceId));
      }
    });
    return port;
  } catch (e: any) {
    if (e.name === "NotFoundError") {
      throw new Error("No se seleccionó ningún puerto.");
    } else if (e.name === "SecurityError") {
      throw new Error("Permiso denegado o bloqueado por política del sistema.");
    } else if (e.name === "InvalidStateError") {
      throw new Error("El puerto ya se encuentra abierto");
    } else if (e.name === "NetworkError") {
      throw new Error(
        "El puerto está siendo utilizado por otra aplicación o no está conectado.",
      );
    } else {
      throw new Error("No se puede establecer la conexión.");
    }
  }
}
/**
 * Writes a given message to the specified serial port using the Web Serial API. This function encodes the
 * message into a binary format using `TextEncoder` and sends it through the serial port if the port is available.
 * It assumes that the port is already opened and writable.
 *
 * @async
 * @param {SerialPort | undefined} port - The serial port object to which the message is to be written.
 *                                        The port must be already open and must not be undefined.
 * @param {string} message - The text message to be encoded and written to the serial port.
 * @returns {Promise<void>} A promise that resolves when the message has been successfully written to the port,
 *                          or resolves with no action if the port is undefined.
 *
 * @example
 * async function sendSerialMessage(port, message) {
 *   try {
 *     await writeToPort(port, "Hello, Serial!");
 *     console.log("Message sent successfully.");
 *   } catch (error) {
 *     console.error("Failed to send message:", error);
 *   }
 * }
 */
async function writeToPort(port: SerialPort | undefined, message: string) {
  const encoder = new TextEncoder();
  if (port) {
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(message));
    writer.releaseLock();
  }
}

/**
 * Retrieves a readable stream reader from the specified serial port using the Web Serial API.
 * This function assumes that the port is already opened and has a readable stream available.
 * If the port is provided and valid, it returns the stream reader associated with the port's readable stream.
 *
 * @async
 * @param {SerialPort | undefined} port - The serial port object from which the reader is to be retrieved.
 *                                        The port must be already open and must not be undefined.
 * @returns {Promise<ReadableStreamDefaultReader | undefined>} A promise that resolves to the readable stream
 *          reader if the port is defined and has a readable stream, or resolves to undefined if the port is undefined.
 *
 * @example
 * async function readFromPort(port) {
 *   try {
 *     const reader = await getReader(port);
 *     if (reader) {
 *       const { value, done } = await reader.read();
 *       if (!done) {
 *         console.log("Received data:", new TextDecoder().decode(value));
 *       }
 *     }
 *   } catch (error) {
 *     console.error("Failed to read from port:", error);
 *   }
 * }
 */

async function getReader(port: SerialPort | undefined) {
  if (port) {
    const reader = port.readable.getReader();
    return reader;
  }
}

/**
 * Closes a given serial port and releases the associated reader using the Web Serial API.
 * This function ensures that any ongoing reading operations are cancelled, locks are released,
 * and then it closes the port. It handles operations gracefully if both `port` and `reader` are defined
 * and assumes that the port is already opened and the reader is obtained from this port.
 *
 * @async
 * @param {SerialPort | undefined} port - The serial port object to be closed.
 * @param {ReadableStreamDefaultReader | undefined} reader - The reader associated with the port's readable stream.
 * @returns {Promise<void>} A promise that resolves when the port has been successfully closed
 *          and the reader has been released, or resolves with no action if either the port or reader is undefined.
 *
 * @example
 * async function manageSerialConnection(port) {
 *   const reader = await getReader(port);
 *   // Perform read operations...
 *   await closePort(port, reader); // Ensures the port is properly closed.
 *   console.log("Port closed.");
 * }
 */

async function closePort(
  port: SerialPort | undefined,
  reader: ReadableStreamDefaultReader | undefined,
) {
  if (!port || !reader) {
    throw new Error("No port selected");
  }

  try {
    // Cancel the reader to stop data flow
    await reader.cancel();
  } catch (error) {
    console.error("Error canceling reader:", error);
  }

  // Release the lock on the reader
  reader.releaseLock();

  try {
    // Close the port
    await port.close();
  } catch (error) {
    console.error("Error closing port:", error);
  }
}

/**
 * Continuously reads data from a given serial port and processes it based on predefined triggers.
 * This function listens for data transmitted over a serial connection, accumulating it until a newline
 * character (LF, ASCII code 10) is encountered, which signifies the end of a data chunk. It checks
 * for special keywords "start" and "finish" to handle data accordingly: initiating data storage and
 * creation when "start" is detected, and stopping and optionally sending data when "finish" is detected.
 * The function utilizes the provided reader object associated with the serial port, assuming both are
 * valid and open. Data read is dispatched to a store and processed into blobs based on device identification.
 *
 * @async
 * @param {SerialPort | undefined} port - The serial port object from which data is read.
 * @param {ReadableStreamDefaultReader | undefined} reader - The reader object associated with the port's readable stream.
 * @param {string} deviceId - The device identifier used for data categorization and processing.
 * @returns {Promise<string>} A promise that resolves to an empty string once reading and processing are complete,
 *          or if the port or reader are undefined or an error occurs.
 *
 * @example
 * async function manageSerialData(port, reader, deviceId) {
 *   try {
 *     await startReading(port, reader, deviceId);
 *     console.log("Data reading and processing completed.");
 *   } catch (error) {
 *     console.error("An error occurred while reading data:", error);
 *   }
 * }
 */
async function startReading(
  port: SerialPort | undefined,
  reader: ReadableStreamDefaultReader | undefined,
  deviceId: string,
) {
  if (port && reader) {
    try {
      let word = "";
      let begin = false;
      let sended = false;
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const encodedData = value as Uint8Array;

        for (const data of encodedData) {
          if (data === 10) {
            if (word.includes("start")) {
              begin = true;
              sended = false;
            }
            if (word.includes("finish")) {
              begin = false;
              if (!sended) {
                createDataBlob(deviceId);
                sended = true;
              }
            }
            if (begin) {
              storeInstace.dispatch(
                addFilteredSerialData({
                  id: deviceId,
                  data: word,
                }),
              );
            }
            storeInstace.dispatch(
              addRawSerialData({
                id: deviceId,
                data: word,
              }),
            );
            word = "";
          } else {
            const decodedData = String.fromCharCode(data);
            word += decodedData;
          }
        }
      }
    } catch (error: any) {
      alert(
        `Error por favor desconecte el microcontrolador del dispositivo y vuelva a intentarlo`,
      );
    }
    return "";
  }
}

export { connectToSerial, writeToPort, closePort, getReader, startReading };
