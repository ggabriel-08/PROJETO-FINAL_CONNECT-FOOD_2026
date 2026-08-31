import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "10.144.170.134",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "connect_food",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
