const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ملف قاعدة البيانات
const DB_FILE = './db.json';

// قراءة DB
function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch(e) {
        return {
            players: Array.from({length: 15}, (_, i) => ({
                rank: i + 1,
                name: `المركز ${i + 1}`,
                status: 'متاح',
                wins: 0,
                losses: 0
            })),
            apps: [],
            msgs: [],
            results: []
        };
    }
}

// حفظ DB
function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// تهيئة أول مرة
if (!fs.existsSync(DB_FILE)) {
    saveDB(readDB());
}

// API
app.get('/api/data', (req, res) => {
    res.json(readDB());
});

app.post('/api/data', (req, res) => {
    saveDB(req.body);
    res.json({ success: true });
});

// الملفات الثابتة
app.use(express.static('public'));

// أي رابط غير API يروح للـ index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
