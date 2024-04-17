import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import { chromium } from "playwright";

// fileURLToPath() and dirname() are used to get the directory name of the current module as ES6 modules don't have access to __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// import { BabyName , sequelize } from "./database.js";

(async () => {
  try {
    const browser = await chromium.launch({ headless: false }); // Launch Chromium browser
    const context = await browser.newContext(); // Create a new browser context
    const page = await context.newPage(); // Create a new page in the browser context

    // Simulate login to Kaggle (replace with your credentials if needed)
    await page.goto(
      "https://www.kaggle.com/account/login?phase=emailSignIn&returnUrl=%2F"
    );
    await page.fill("input[name='email']", process.env.KAGGLE_USER); // Replace with your username
    await page.fill("input[type='password']", process.env.KAGGLE_PASSWORD); // Replace with your password
    await page.click('button[type="submit"]'); // Submit login form

    // URL of the dataset to download
    const url =
      "https://www.kaggle.com/datasets/thedevastator/us-baby-names-by-year-of-birth?select=babyNamesUSYOB-full.csv"; // Placeholder for dataset URL

    // Navigate to the specific baby name dataset URL
    await page.waitForTimeout(2000); // Waiting for 2 seconds increases the likelihood of successful navigation from 33.3% to 99.9%
    await page.goto(url);
    try {
      // Download the CSV file
      console.log("Downloading dataset...");
      const button = await page.waitForSelector(
        "div.hPDFOD i[role='button']",
        { visible: true } // Wait for the element to become visible
    );
      console.log("Clicking download button...");
      await button.click();

      console.log("Clicking file save button using enter");
      await page.keyboard.press("Enter");

      console.log("Download complete!");
    } catch (error) {
      console.log("Error clicking download button: " + error);
    }
    // Wait for download to complete (implementation might vary)
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 5 seconds (adjust as needed)

    // Close the browser page, context and browser after download
    await page.close();
    await context.close();
    await browser.close();
  } catch (error) {
    console.log("Error in downloader: " + error);
  }
})(); 
