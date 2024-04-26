import { Request, Response } from 'express';
import { Vacancy, VacancyType } from '../models/vacancy.model';
import { StatusCodes } from 'http-status-codes';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../types/types';
import { VacancyCreateModel } from '../models/vacancyCreateModel';
import { VacancyViewModel } from '../models/vacancyViewModel';

class VacancyController {
  createVacancy = async (
    req: RequestWithBody<VacancyCreateModel>,
    res: Response<VacancyViewModel<VacancyType>>
  ) => {
    const { title, salary, wageRate, education } = req.body;

    if (!title || !salary || !education || !wageRate) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Not enough information to create a vacancy!' });
    }

    const newVacancy = await Vacancy.create(req.body);

    res.status(StatusCodes.CREATED).json({
      data: newVacancy,
      msg: `Vacancy - ${title}, created successfully!`,
    });
  };

  // get all vacancies
  getVacancies = async (
    req: Request,
    res: Response<VacancyViewModel<VacancyType[]>>
  ) => {
    const vacancies = await Vacancy.find({}).sort('-createdAt');

    res
      .status(StatusCodes.OK)
      .json({ data: vacancies, msg: 'All vacancies have been fetched!' });
  };

  //Get a single vacancy
  getSingleVacancy = async (
    req: RequestWithParams<{ id: string }>,
    res: Response<VacancyViewModel<VacancyType>>
  ) => {
    const { id } = req.params;
    const vacancy = await Vacancy.findById({ _id: id });

    if (!vacancy) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested vacancy not found!' });
    } else {
      res.status(StatusCodes.OK).json({ data: vacancy, msg: 'Success' });
    }
  };

  // update vacancy
  updateVacancy = async (
    req: RequestWithParamsAndBody<{ id: string }, VacancyType>,
    res: Response<VacancyViewModel<VacancyType>>
  ) => {
    const { id } = req.params;
    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedVacancy) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested vacancy not found!' });
    } else
      res
        .status(StatusCodes.OK)
        .json({ data: updatedVacancy, msg: 'Vacancy successfully! updated ' });
  };

  // delete vacancy
  deleteVacancy = async (
    req: RequestWithParams<{ id: string }>,
    res: Response<VacancyViewModel<VacancyType>>
  ) => {
    const { id } = req.params;
    const deletedVacancy = await Vacancy.findByIdAndDelete({ _id: id });

    if (!deletedVacancy) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested vacancy not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ data: deletedVacancy, msg: ' Vacancy successfully deleted!' });
    }
  };
}

export const vacancyController = new VacancyController();
