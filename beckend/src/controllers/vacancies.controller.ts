import { Request, Response } from "express";
import { Vacancy } from "../models/vacancy.model";
import { StatusCodes } from "http-status-codes";

class VacancyController {
  createVacancy = async (req: Request, res: Response) => {
    const { title, salary, wageRate, education } = req.body;

    if (!title || !salary || !education || !wageRate) {
      throw new Error(
        "Title, salary, education and wage rate must be provided."
      );
    }
 
    const newVacancy = await Vacancy.create(req.body);
    console.log("newVacancy ", newVacancy);
    res
      .status(StatusCodes.CREATED)
      .json({ vacancies: newVacancy, msg: "Vacancy has been created!" });
  };

  // get all vacancies
  getVacancies = async (req: Request, res: Response) => {
    const vacancies = await Vacancy.find({}).sort("-createdAt");

    res
      .status(StatusCodes.OK)
      .json({ vacancies, msg: "All vacancies have been fetched!" });
  };

  //Get a single vacancy
  getSingleVacancy = async (req: Request, res: Response) => {
    const { id } = req.params;
    const vacancy = await Vacancy.findById({ _id: id });

    if (!vacancy) {
      throw new Error("Requested vacancy not found!");
    }

    res.status(StatusCodes.OK).json({ vacancy, msg: "Success" });
  };

  // update vacancy
  updateVacancy = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedVacancy) {
      throw new Error("Requested vacancy not found!");
    }

    res
      .status(StatusCodes.OK)
      .json({ vacancies: updatedVacancy, msg: "Vacancy has been updated" });
  };

  // delete vacancy
  deleteVacancy = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedVacancy = await Vacancy.findByIdAndDelete({ _id: id });

    if (!deletedVacancy) {
      throw new Error("Requested vacancy not found!");
    }

    res
      .status(StatusCodes.OK)
      .json({ vacancies: deletedVacancy, msg: "Vacancy has been deleted" });
  };
}

export const vacancyController = new VacancyController();
