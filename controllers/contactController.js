const Contact = require("../models/Contact");
const { google } = require("googleapis");

const saveToGoogleSheet = async (formData) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = "Sheet1";

  const values = [[
    formData.name,
    formData.phone,
    formData.product,
    formData.city,
    formData.best_time || "-",
    formData.message || "-",
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
};

exports.submitContact = async (req, res) => {
  const { name, phone, product, city, best_time, message } = req.body;

  if (!name || !phone || !product || !city) {
    return res.status(400).json({ success: false, message: "Required fields missing." });
  }

  try {
    // Save to DB
    const contact = new Contact({ name, phone, product, city, best_time, message });
    await contact.save();

    // Save to Google Sheet
    await saveToGoogleSheet(contact);

    res.status(200).json({ success: true, message: "Submitted successfully!" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
