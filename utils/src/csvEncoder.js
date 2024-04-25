import fs from "fs";
import csv from "csv-parser";
import { createObjectCsvWriter } from "csv-writer";
import { encodeAttributes } from './encoder.js';

const inputCSV = "./src/attributes.csv";
const outputCSV = "./src/tokenId-encodedAttributes.csv";

// Function to process the CSV and create a new csv with `tokenId-encodedAttributes`
function processCSV(inputFilePath, outputFilePath) {
    console.log(`Current directory: ${process.cwd()}`);
  const results = [];

  // Create a CSV writer
  const csvWriter = createObjectCsvWriter({
    path: outputFilePath,
    header: [
      { id: "tokenId", title: "tokenId" },
      { id: "encodedAttributes", title: "encodedAttributes" },
    ],
  });

  // Read the CSV file
  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on("data", (data) => {
      // Extract necessary attributes
      const encoded = encodeAttributes(
        parseInt(data.Capacity),
        parseInt(data.Attack),
        parseInt(data.Speed),
        parseInt(data.Shield)
      );
      results.push({
        tokenId: data.tokenId,
        encodedAttributes: encoded,
      });
    })
    .on("end", () => {
      // Write the new CSV file
      csvWriter
        .writeRecords(results)
        .then(() => console.log("The CSV file was written successfully"));
    });
}

processCSV(inputCSV, outputCSV);
