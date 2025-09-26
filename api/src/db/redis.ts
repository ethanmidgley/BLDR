import { createClient } from "redis";

export class redis {
  private static client: ReturnType<typeof createClient>;

  private constructor() {}

  private static async createConnection() {
    const connection = createClient({
      url: process.env.REDIS_URL || "",
    }).connect();
    return connection;
  }

  public static async getConnection() {
    if (!redis.client) {
      redis.client = await redis.createConnection();
    }
    return redis.client;
  }
}
