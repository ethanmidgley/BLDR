import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export class db {
  static connection: mysql.Connection;

  private constructor(connection: mysql.Connection) {
    db.connection = connection;
  }

  private static async createConnection() {
    return mysql.createConnection({
      host: process.env.DB_HOST || "",
      user: process.env.DB_USERNAME || "",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "",
    });
  }

  public static async getConnection(): Promise<mysql.Connection> {
    if (!db.connection) {
      db.connection = await db.createConnection();
    }
    return db.connection;
  }

  public static async query<T>(sql: string, values?: any[]) {
    const connection = await db.getConnection();
    return await connection.query<(T & RowDataPacket)[]>(sql, values);
  }

  public static async execute(sql: string, values?: any[]) {
    const connection = await db.getConnection();
    return await connection.execute<ResultSetHeader>(sql, values);
  }
}
