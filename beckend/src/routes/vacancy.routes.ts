import express from "express";
//import passport from 'passport';

import { vacancyController } from "../controllers/vacancies.controller";

const router = express.Router();

router.route("/").post(vacancyController.createVacancy).get(vacancyController.getAllVacancies);

// Example with Passport
// .get(
//   passport.authenticate('jwt', { session: false }),
//   vacancyController.getVacancies
// );

router
  .route("/:id")
  .get(vacancyController.getSingleVacancy)
  .patch(vacancyController.updateVacancy)
  .delete(vacancyController.deleteVacancy);

export default router;
