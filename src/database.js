import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import Sequelize from "sequelize";
import fs from "fs";
import csvParser from "csv-parser";
import AdmZip from "adm-zip";
import { sendToHubSpot } from "./hubspot.js";

// fileURLToPath() and dirname() are used to get the directory name of the current module as ES6 modules don't have access to __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Database configuration
// console.log("DB name: "+process.env.DB_NAME);
const dbConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  dialect: "mysql",
};

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig);

// Define the BabyName model
const BabyName = sequelize.define("BabyName", {
  name: {
    type: Sequelize.STRING,
    allowNull: false, // Name cannot be null
  },
  sex: {
    type: Sequelize.STRING,
    allowNull: false, // Sex cannot be null
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

// This creates the table in the database if it doesn't already exist
// Using force: true will drop the existing table and recreate it
await BabyName.sync({ force: true });
// await BabyName.sync();

const zipFilePath = "C:/Users/world/Downloads/baby_names_data2.zip"; // Path to the ZIP file
const targetDir = "C:/Users/world/Downloads/baby_names_data2"; // Directory where the files will be extracted

console.log("Extracting ZIP file:", zipFilePath);

const zip = new AdmZip(zipFilePath);
zip.extractAllTo(targetDir, true); // Extract the contents of the ZIP file to the target directory

const csvFilePath = path.join(targetDir, "babyNamesUSYOB-full.csv"); // Path to the extracted CSV file
console.log("CSV file path:", csvFilePath);

// Read the CSV file and insert records into the database
const dataToInsert = [];
const LIMIT = 10000; // Set the limit to 1000

// create a read stream from the CSV file
fs.createReadStream(csvFilePath)
  .pipe(csvParser()) // pipe the stream to the CSV parser
  .on("data", (row) => {
    // executes for each row in the CSV file
    // Extract name and sex from the row
    const { Name, Sex } = row;
    dataToInsert.push({ name: Name, sex: Sex });

    if (dataToInsert.length >= LIMIT) {
      // Once the array reaches 100 records, insert them into the database using bulkCreate
      BabyName.bulkCreate(dataToInsert)
        .then(() => console.log("Records inserted successfully"))
        .catch((error) => console.error("Error inserting records:", error));
      // Clear the array for the next batch of records
      dataToInsert.length = 0;
    }
  })
  .on("end", async () => {
    // executes when the CSV parser finishes reading the file
    // Insert any remaining records
    if (dataToInsert.length > 0) {
      BabyName.bulkCreate(dataToInsert)
        .then(() => console.log("Records inserted successfully"))
        .catch((error) => console.error("Error inserting records:", error));
    }

    // Retrieve inserted records from the database and send them to HubSpot
    const insertedRecords = await BabyName.findAll();
    console.log("Inserted records:", insertedRecords.length);

    // Extract relevant data from Sequelize instances
    const formattedData = insertedRecords.map((record) => ({
      name: record.name, //  'name' is the property for first name
      sex: record.sex, //  'sex' is the property for sex
    }));

    // Format to see the data of each record
    // formattedData.forEach((data, index) => {
    //   console.log(`Record ${index + 1}:`);
    //   console.log("Name:", data.name);
    //   console.log("Sex:", data.sex);
    // });
    // console.log("formattedData: " + formattedData);

    console.log("formattedData length: " + formattedData.length);
    sendToHubSpot(formattedData);

    console.log("Sent to hubspot from database.js");
    console.log("Processing finished.");
    // Close the database connection after all records are inserted
    sequelize.close();
  })
  .on("error", (error) => {
    // executes if an error occurs during reading the CSV file
    console.error("Error reading CSV file:", error);
    // Close the database connection in case of error
    sequelize.close();
  });

export { BabyName, sequelize };

// total in excel = 1048576

// Stored in each iteration's in DB
// 1st = 1858000
