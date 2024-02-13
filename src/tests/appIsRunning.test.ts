import request, { Response } from "supertest";
import { Server } from "http";
import makeServer from "./makeApp";

let app: Server;

describe("App", () => {
  afterAll(() => {
    app.close();
  });

  it("is running app", async () => {
    app = await makeServer();
    let rs: Response = await request(app).get("/test-running");
    expect(rs.status).toBe(200);
    expect(rs.text).toBe("API is running");
  });
});
