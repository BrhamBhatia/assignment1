import { test, expect } from "@playwright/test";

test("events API seeds and returns items", async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/case/events`);
  expect(res.ok()).toBeTruthy();
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThanOrEqual(3);
  expect(data[0]).toHaveProperty("initialMsg");
});
