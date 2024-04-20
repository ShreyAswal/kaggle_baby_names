import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import axios from "axios";
import { Client } from "@hubspot/api-client";

// fileURLToPath() and dirname() are used to get the directory name of the current module as ES6 modules don't have access to __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Function to send data to HubSpot
async function sendToHubSpot(records) {
  const API_KEY = process.env.API_KEY;
  const baseUrl = "https://api.hubapi.com";
  const endpoint = `${baseUrl}/crm/v3/objects/contacts/batch/create`; // Update endpoint for batch creation

  try {
    

    // Split records into batches
    const batchSize = 10000; // Adjust batch size as needed
    const batches = [];

    // Split records into batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      batches.push(batch);
    }

    try {
      // Iterate over batches
      for (const batch of batches) {
        const requestData = batch.map((record) => ({
          properties: {
            firstname: record.name,
            sex: record.sex,
          },
        }));

        // Make an HTTP POST request to create contacts in batch
        const response = await axios.post(
          endpoint,
          { inputs: requestData },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        console.log("Batch created:", response.data);
      }
    } catch (error) {
      console.error("Error creating contacts:", error);
    }
  } catch (error) {
    console.error("Error sending data to HubSpot:", error);
  }
}

export { sendToHubSpot };
