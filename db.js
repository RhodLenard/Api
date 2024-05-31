import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD, // Update with your MySQL root password if needed
    database: process.env.DATABASE, // Ensure this matches your database name
    port: process.env.PORT,
    multipleStatements: true,
  })
  .promise();

pool
  .getConnection()
  .then((conn) => {
    return conn.query("SELECT 1").then((res) => {
      conn.release();
      return res;
    });
  })
  .then(() => {
    console.log("Connected to MySQL DB");
  })
  .catch((err) => {
    console.log("Failed to connect to MySQL DB:", err);
  });

export default pool;