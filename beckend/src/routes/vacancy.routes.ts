import express from "express";
import { vacancyController } from "../controllers/vacancies.controller";

const router = express.Router();

router.route("/").post(vacancyController.createVacancy).get(vacancyController.getVacancies);

router
  .route("/:id")
  .get(vacancyController.getSingleVacancy)
  .patch(vacancyController.updateVacancy)
  .delete(vacancyController.deleteVacancy);

export default router;
