import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import axios from "axios";

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
    const batchSize = 100; // Adjust batch size to avoid rate limiting
    const batches = [];
    let batchIteration = 0;

    // Split records into batches
    for (let i = 800; i < 1000; i += batchSize) {    // For all i = 0; i < records.length; i += batchSize
      const batch = records.slice(i, i + batchSize);
      batches.push(batch);
      batchIteration++;
      console.log(
        `Batch ${batchIteration} created with ${batch.length} records`
      );
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
              Authorization: `Bearer ${API_KEY}`, // Use the API key to authenticate the request
            },
          }
        );

        console.log("Batch created");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
    }
  } catch (error) {
    console.error("Error sending data to HubSpot:", error);
  }
}

export { sendToHubSpot };

// Already filled Contacts = 3705 before sending to final-Kaggle-baby-Name
// Target no of API call's for 1858689 records = 18,587

// 1st Iteraration - 1,000,604 records sent in 9,970 successful API calls and 1 failed API call
