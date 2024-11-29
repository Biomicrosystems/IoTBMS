import { addFileQueue } from "lib/features/fileQueue/fileQueueSlice";
import { storeInstace } from "../lib/store";
import { fileQueue } from "types/fileEnqueu";
import { updateFilteredSerialData } from "lib/features/filteredSerialData/filteredSerialDataSlice";
import { generateUUID } from "./uuidUtils";

interface GraphItem {
  [key: string]: number | string;
  index: number;
}

interface CardItem {
  title: string;
  data: number;
}

/**
 * Creates a CSV file Blob containing data specific to a given device ID.
 * The function retrieves serial data from a store instance, filters the data
 * to include only those that match the given device ID, and then constructs a
 * CSV file Blob from the filtered data.
 *
 * @param {string} deviceId - The device ID used to filter the serial data.
 * @returns {void} The function does not return a value but dispatches an action
 *         with the new file to the store instance.
 *
 * @example
 * createDataBlob("device123");
 */

function createDataBlob(deviceId: string) {
  const data = storeInstace.getState().filteredSerialData;

  const filteredData = data.map((value) => {
    if (value.id.includes(deviceId)) {
      return value.data;
    }
  });

  const newState = data.filter((value) => !value.id.includes(deviceId));
  storeInstace.dispatch(updateFilteredSerialData(newState));
  if (!filteredData) {
    return "No hay datos";
  }
  const filteredArray = filteredData.map((item) => `${item}\n`);
  const csvContent = filteredArray.join("");
  const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const payload: fileQueue = {
    id: generateUUID(),
    deviceId: deviceId,
    file: csvBlob,
    uploaded: false,
  };
  storeInstace.dispatch(addFileQueue(payload));
}

/**
 * Fetches data from a specified URL and reads it as a stream. This function uses the Streams API to read the data
 * incrementally, decoding it and appending to a string which is then returned when all data has been read.
 * If the data cannot be fetched or read (e.g., the body stream is not available), it returns a specific message.
 *
 * @async
 * @param {string} url - The URL from which data is to be fetched.
 * @returns {Promise<string>} A promise that resolves to the data read as a string, or a message indicating that
 *         no data is available.
 *
 * @example
 * async function exampleUsage() {
 *   const data = await fetchAndReadStreamData('https://api.example.com/data');
 *   console.log(data);
 * }
 */
async function fetchAndReadStreamData(url: string) {
  const resonse = await fetch(url);
  const reader = await resonse.body?.getReader();
  let data = "";
  if (!reader) {
    return "No hay datos";
  }
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      return data;
    }
    var decodedData = new TextDecoder().decode(value);
    data = data + decodedData;
  }
}

/**
 * Processes a string of data by splitting it into lines, filtering out any empty lines,
 * and then splitting each line by commas to collect all values into a single array.
 * This function is useful for parsing and extracting values from CSV formatted strings.
 *
 * @param {string} data - The raw string data, typically multi-line, to be processed.
 * @returns {string[]} An array of strings, where each string is a value extracted from
 *         the original data string.
 *
 * @example
 * const rawData = "name,age\nJohn,30\nJane,25\n,\nMike,35";
 * const formattedData = filterAndFormatData(rawData);
 * console.log(formattedData); // Output: ['name', 'age', 'John', '30', 'Jane', '25', 'Mike', '35']
 */
function filterAndFormatData(data: string) {
  let lines = data.split("\n");
  lines = lines.filter((line) => line.trim() !== "");
  let allValues: string[] = [];

  lines.forEach((line) => {
    let parts = line.split(",");
    allValues.push(...parts);
  });

  return allValues;
}
/**
 * Processes an array of string data to extract graph-related information. The function filters the data
 * for entries containing the ">" character, identifies unique variable names from these entries, formats
 * them for graph usage, and finally constructs an array of objects suitable for plotting in a graph.
 * The result includes both the structured graph data and the list of unique variable names used in the graph.
 *
 * @param {string[]} data - An array of strings from which the graph data is to be extracted.
 * @returns {{jsonResult: GraphItem[], variableNames: string[]}} An object containing two properties:
 *          `jsonResult` which is an array of objects each representing a graph point with properties
 *          dynamically named according to the variable names extracted, and `variableNames` which is
 *          an array of all unique variable names found in the data.
 *
 * @example
 * const rawData = [" >time:1", " >temp:22", " >time:2", " >temp:23"];
 * const graphData = getGraphData(rawData);
 * console.log(graphData);
 * // Output:
 * // {
 * //   jsonResult: [{ index: 1, time: 1, temp: 22 }, { index: 2, time: 2, temp: 23 }],
 * //   variableNames: ["time", "temp"]
 * // }
 */
// helper data structure
type DataPoint = {
  label: string;
  data: number[];
};

function getGraphData(rawData: string[]) {
  let filteredData = rawData.filter((data) => data.includes(">"));
  const dataPoints: { [key: string]: DataPoint } = {};
  let labels: string[] = [];
  filteredData.forEach((item) => {
    const trimmedItem = item.trim();
    const [label, value] = trimmedItem.split(":");

    const cleanLabel = label.replace(">", "").trim();
    const numericValue = parseFloat(value.trim());

    labels.push(cleanLabel);
    if (!dataPoints[cleanLabel]) {
      dataPoints[cleanLabel] = {
        label: cleanLabel,
        data: [],
      };
    }

    dataPoints[cleanLabel].data.push(numericValue);
  });
  const cleanLabels = [...new Set(labels)];
  return { dataPoints, cleanLabels };
}

export type graphData = ReturnType<typeof getGraphData>;

/**
 * Parses a structured text input into a CSV formatted string. This function first identifies
 * the starting index where data definitions begin, then extracts variable names from the first
 * line following this index and collects the corresponding data from subsequent lines. Lines and
 * entries are expected to be delimited by commas and variable definitions by colons. Handles special
 * cases where variable names may start with '>' or '<'.
 *
 * @param {string} input - The raw string input containing structured data.
 * @returns {string} A CSV formatted string containing variable names as headers and the extracted
 *          data as rows. Returns an empty string if no valid data start point is found.
 *
 * @example
 * const inputData = ">time:hours,<temperature:degrees\n1:12,20:30\n2:13,21:33";
 * const csvOutput = getDownloadData(inputData);
 * console.log(csvOutput);
 * // Output:
 * // "time,temperature\n12,30\n13,33"
 */

function getDownloadData(input: string) {
  let lines = input.split("\n").filter((line) => line.trim() !== "");

  let variableNames: string[] = [];
  let dataRows: string[] = [];

  let startIndex = lines.findIndex((line) => line.includes(":"));

  if (startIndex === -1) {
    return lines.join("");
  }

  lines.slice(startIndex).forEach((line, index) => {
    const parts = line.split(",");
    if (index === 0) {
      variableNames = parts.map((part) => {
        let key = part.split(":")[0].trim();
        if (key.startsWith(">")) {
          key = key.substring(1);
        }
        if (key.startsWith("<")) {
          key = key.substring(1);
        }
        return key;
      });
    }
    const data = parts.map((part) => part.split(":")[1]);
    dataRows.push(data.join(","));
  });

  const data = variableNames.join(",") + "\n" + dataRows.join("\n");

  return data;
}
/**
 * Extracts and formats data from an array of strings to create a structured list of card items.
 * Each card item is derived from string entries containing a special character ("<"). The function
 * first filters for relevant data lines, extracts variable names, and then formats the last valid
 * group of data into card items, each containing a title and associated numerical data.
 *
 * @param {string[]} data - The array of string data from which to extract card information.
 * @returns {CardItem[]} An array of card items, where each item is an object containing a `title`
 *          and `data` property. Returns an empty array if no relevant data is found.
 *
 * @example
 * const rawData = ["<title:42", "<content:Hello World", "<title:43"];
 * const cardData = getCardsData(rawData);
 * console.log(cardData);
 * // Output: [{ title: "title", data: 43 }]
 */

function getCardsData(data: string[]) {
  if (data.length === 0) {
    return []; // Return an empty array if no data is provided
  }
  let filteredData = data.filter((data) => data.includes("<"));
  let variableNames: string[] = [];

  filteredData.forEach((line) => {
    variableNames.push(line.split(":")[0].replace("<", ""));
  });
  variableNames = [...new Set(variableNames)];

  let joinFormatedData = [];

  for (let i = 0; i < filteredData.length; i++) {
    let group = [];
    for (let j = 0; j < variableNames.length; j++) {
      if (i + j < filteredData.length) {
        group.push(filteredData[i + j]);
      }
    }
    if (group.length === variableNames.length) {
      joinFormatedData.push(group.join(";"));
    }
    i += variableNames.length - 1;
  }

  const lastItem = joinFormatedData[joinFormatedData.length - 1];
  let result: CardItem[] = [];

  if (!lastItem) {
    return;
  }
  const pairs = lastItem.split(";");
  pairs.forEach((pair) => {
    const match = pair.match(/<([^:]+):(.+)/);
    if (match && variableNames.includes(match[1])) {
      const item: CardItem = {} as CardItem;
      item.title = match[1].toString();
      item.data = parseFloat(match[2]);
      result.push(item);
    }
  });

  return result;
}

function ejex(array: number[]) {
  var lista = array.map((data, index) => (index % 2 === 0 ? data : null));
  let filterList = lista.filter((data): data is number => data !== null);
  return filterList;
}
function generarListaNumeros(filterList: number[]) {
  let min = Math.min(...filterList);
  let max = Math.max(...filterList);
  var listaNumeros = [];
  var st = String(min);
  var st2 = String(max);
  if (st.includes(".") || st2.includes(".")) {
    for (let i = min; i <= max; i += 0.1) {
      listaNumeros.push(i);
    }
    listaNumeros = listaNumeros.map((numero) => parseFloat(numero.toFixed(1)));
  } else if (
    st.length == 2 ||
    (st2.length == 2 && !st.includes(".")) ||
    !st2.includes(".")
  ) {
    for (let i = min; i <= max; i += 1) {
      listaNumeros.push(i);
    }
  } else if (
    st.length == 3 ||
    (st2.length == 3 && !st.includes(".")) ||
    !st2.includes(".")
  ) {
    for (let i = min; i <= max; i += 10) {
      listaNumeros.push(i);
    }
  } else if (
    st.length == 4 ||
    (st2.length == 4 && !st.includes(".")) ||
    !st2.includes(".")
  ) {
    for (let i = min; i <= max; i += 100) {
      listaNumeros.push(i);
    }
  }
  var analizar = listaNumeros;
  var nums = [];
  for (let pos = 0; pos < filterList.length; pos++) {
    if (String(filterList[pos]).includes(".")) {
      nums.push(filterList[pos]);
    }
  }
  analizar.push(...nums);
  analizar.sort((a, b) => a - b);
  var listaFinal = analizar;
  return listaFinal;
}

export {
  createDataBlob,
  fetchAndReadStreamData,
  filterAndFormatData,
  getGraphData,
  getDownloadData,
  getCardsData,
  ejex,
  generarListaNumeros,
};
