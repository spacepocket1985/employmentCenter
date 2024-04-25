import request from "supertest";
import { app } from "../..";

describe("/vacancies", () => {
  it("should return 200 and check for data and msg keys", async () => {
    const response = await request(app).get("/vacancies");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty(
      "msg",
      "All vacancies have been fetched!"
    );
  });

  it("should return 404 for not existing vacancy", async () => {
    const response = await request(app).get(
      "/vacancies/662920c2e1a16e84fc747d7a"
    );

    expect(response.status).toBe(404);
  });

  it("should not create vacancy with not complete data", async () => {
    const newVacancy = {
      title: "Big Boss",
      salary: 10000,
    };
    const response = await request(app).post("/vacancies").send(newVacancy);
    expect(response.status).toBe(400);
  });
});
