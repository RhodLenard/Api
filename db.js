import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: "portfolio-portfolio24.f.aivencloud.com.HOST",
    user: "avnadmin.USER",
    password: "AVNS_QwwToNO8ZyMZTSD178Y.PASSWORD", // Update with your MySQL root password if needed
    database: "defaultdb.DATABASE", // Ensure this matches your database name
    port: 13349,
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