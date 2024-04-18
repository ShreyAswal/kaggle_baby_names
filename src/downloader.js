import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import { chromium } from "playwright";
import fs from "fs";
import { pipeline } from "stream";
import { createReadStream, createWriteStream } from "fs";
import { createGunzip } from "zlib";

// fileURLToPath() and dirname() are used to get the directory name of the current module as ES6 modules don't have access to __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

(async () => {
  try {
    const browser = await chromium.launch({ headless: false });

    // const browser = await chromium.launchPersistentContext('C:/Users/world/Downloads', {

    //   headless: false,
    //   acceptDownloads: true,
    //   // downloadsPath: 'C:/Users/world/Downloads',
    //   extraHTTPHeaders: { 'Content-Type': 'application/zip' }

    // });

    const context = await browser.newContext();

    const page = await context.newPage(); // Create a new page in the browser context

    // Simulate login to Kaggle 
    await page.goto(
      "https://www.kaggle.com/account/login?phase=emailSignIn&returnUrl=%2F"
    );
    await page.fill("input[name='email']", process.env.KAGGLE_USER); 
    await page.fill("input[type='password']", process.env.KAGGLE_PASSWORD); 
    await page.click('button[type="submit"]'); // Submit login form

    // URL of the dataset to download
    const url =
      "https://www.kaggle.com/datasets/thedevastator/us-baby-names-by-year-of-birth?select=babyNamesUSYOB-full.csv"; // Placeholder for dataset URL

    // Navigate to the specific baby name dataset URL
    await page.waitForTimeout(2000); // Waiting for 2 seconds increases the likelihood of successful navigation from 33.3% to 99.9%
    await page.goto(url); // Navigate to the dataset URL

    try {
      // Download the CSV file
      console.log("Downloading dataset...");
      const button = await page.waitForSelector(
        "div.hPDFOD i[role='button']",
        { visible: true } // Wait for the element to become visible
      );

      // Start waiting for the download event before clicking
      const downloadPromise = page.waitForEvent("download");

      console.log("Clicking download button...");
      await button.click();
      console.log("download button clicked!");

      // Wait for the download process to complete and obtain the Download object
      const download = await downloadPromise;
      // console.log("download.path: "+download.path);


      // // Wait for the download to complete
      await download.saveAs("C:/Users/world/Downloads/baby_names_data2.zip");

      // console.log("download.path: "+download.path.toString);

      // Extract the CSV file from the downloaded ZIP archive

      const unzipStream = createGunzip(); // Creates a Gunzip stream used to extract the CSV file from the ZIP archive

      // const csvFileName = "babyNamesUSYOB-full.csv"; // Name of the CSV file within the ZIP archive

      // Check if the entry is the CSV file we're looking for
      if (download) {
        // Save the CSV file
        await new Promise((resolve, reject) => {
          // Create a pipeline to extract the CSV file from the ZIP archive
          pipeline(
            createReadStream(download.path.toString()),
            unzipStream,
            async (err) => {
              if (err) {
                reject(err);
                return;
              } else {
                resolve();
              }
            }
          );
        });
      } else {
        throw new Error("Downloaded file is not a ZIP archive");
      }

      console.log("CSV file extracted and saved successfully.");

      console.log("Download complete!");
    } catch (error) {
      console.log("Error clicking download button: " + error);
    }
    // Wait for download to complete (implementation might vary)
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

    await page.close();
    await context.close();
    await browser.close();
  } catch (error) {
    console.log("Error in downloader: " + error);
  }
})();
