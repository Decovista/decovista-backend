const FormSubmission = require("../models/FormSubmission");
const sheets = require("../config/googleSheets");

const spreadsheetId = process.env.SPREADSHEET_ID;
const sheetName = "Sheet1";

exports.submitForm = async (req, res) => {
  const { name, phone, product, city, best_time, message } = req.body;
  if (!name || !phone || !product) {
    return res.status(400).json({ success: false, message: "Name, phone, and product are required." });
  }

  const submitted_at = new Date();

  try {
    // Save to Google Sheets
    const values = [[name, phone, product, city, best_time, message, submitted_at.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });

    // Save to MongoDB
    const newSubmission = new FormSubmission({
      name,
      phone,
      product,
      city,
      best_time,
      message,
      submitted_at,
    });

    await newSubmission.save();

    res.status(200).json({ success: true, message: "Form submitted successfully." });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ success: false, message: "Submission failed." });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ submitted_at: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch data." });
  }
};
