import mysql from "mysql2/promise";

// ✅ Create a promise-based pool (best practice)
const db = mysql.createPool({
    host: '162.215.253.9',
    user: 'maasmh8k_aad001',
    password: 'Smile@123$',
    database: 'maasmh8k_aadas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log("✅ Connected to the MySQL database (Promise Pool).");

export default db;
