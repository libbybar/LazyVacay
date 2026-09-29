import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

describe("app fallbacks", () => {
  it("answers an unknown path with a 404 that carries only the error code", async () => {
    const app = createApp({ enableRateLimit: false });

    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "ENDPOINT_NOT_FOUND" });
  });
});
