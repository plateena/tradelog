import request from 'supertest';
import server from '../index'; // Import server from index.ts

describe("API Tests", () => {
  it('should return "API is running"', async () => {
    const response = await request(server).get("/test-running");
    expect(response.status).toBe(200);
    expect(response.text).toBe("API is running");
  });
});
