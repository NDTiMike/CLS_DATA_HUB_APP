const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Debugging Middleware - Logs Every Incoming Request
app.use((req, res, next) => {
    console.log(`🔍 ${req.method} request to ${req.url}`);
    console.log("Request Body:", req.body);
    next();
});

// ✅ Path to CSV file
const CSV_FILE_PATH = "C:\\CLS_DATA_HUB_APP\\form-data.csv";

// ✅ Ensure CSV file has headers if it doesn't exist
if (!fs.existsSync(CSV_FILE_PATH)) {
    fs.writeFileSync(
        CSV_FILE_PATH,
        'Hub Attended, Date Attended, Hub Worker, How Found, Coping, Connected, Control, Safe, Support, Satisfaction, Venue, Welcome, Accessibility, Info, Outcome, Recommend, Age Band, Postcode, Gender, Ethnicity, Ethnicity Detail, Conclusion1, Conclusion2, Conclusion3, Notes\n',
        'utf8'
    );
}

// ✅ API Route to Handle Form Submission (Only One Instance)
app.post('/submit', (req, res) => {
    console.log("🔍 Received Data from Frontend:", req.body);

    if (!req.body.hubAttended || !req.body.dateAttended) {
        console.error("🚨 Error: Required fields missing!", req.body);
        return res.status(400).json({ error: 'Hub Attended and Date Attended are required' });
    }

    console.log("✅ Data is valid! Preparing to save to CSV...");

    // ✅ Prepare data for CSV
    const values = [
        req.body.hubAttended || '',
        req.body.dateAttended || '',
        req.body.hubWorker || '',
        req.body.howFound || '',
        req.body.coping || '',
        req.body.connected || '',
        req.body.control || '',
        req.body.safe || '',
        req.body.support || '',
        req.body.satisfaction || '',
        req.body.venue || '',
        req.body.welcome || '',
        req.body.accessibility || '',
        req.body.info || '',
        req.body.outcome || '',
        req.body.recommend || '',
        req.body.ageBand || '',
        req.body.postcode || '',
        req.body.gender || '',
        req.body.ethnicity || '',
        req.body.ethnicityDetail || '',
        req.body.conclusion1 || '',
        req.body.conclusion2 || '',
        req.body.conclusion3 || '',
        req.body.notes || ''
    ];

    const newData = values.map(value => `"${value}"`).join(',') + '\n';

    // ✅ Check for duplicate entry before saving
    fs.readFile(CSV_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error("❌ Error reading CSV file:", err);
            return res.status(500).json({ error: 'Failed to read data' });
        }

        if (data.includes(newData.trim())) {
            console.log("⚠️ Duplicate entry detected, not saving again.");
            return res.status(200).json({ success: 'Duplicate entry ignored.' });
        }

        fs.appendFile(CSV_FILE_PATH, newData, (err) => {
            if (err) {
                console.error("❌ Error saving to CSV:", err);
                return res.status(500).json({ error: 'Failed to save data' });
            }
            console.log("✅ Data saved to CSV:", newData);
            res.json({ success: 'Form data saved successfully!' });
        });
    });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
