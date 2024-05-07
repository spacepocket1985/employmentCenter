// Controller Layer (Presentation Layer):
// Description: Processes requests and interacts with the service to manage vacancies

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { VacancyType } from '../models/vacancy.model';
import { VacancyCreateModel } from '../models/vacancyCreateModel';
import { VacancyViewModel } from '../models/vacancyViewModel';
import { vacancyService } from '../services/vacancy.service';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../types/types';

class VacancyController {
  async createVacancy(
    req: RequestWithBody<VacancyCreateModel>,
    res: Response<VacancyViewModel<VacancyType>>
  ): Promise<void> {
    const newVacancy = await vacancyService.createVacancy(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ data: newVacancy, msg: 'Vacancy successfully created!' });
  }

  async getAllVacancies(
    req: Request,
    res: Response<VacancyViewModel<VacancyType[]>>
  ): Promise<void> {
    const vacancies = await vacancyService.getAllVacancies();
    res
      .status(StatusCodes.OK)
      .json({ data: vacancies, msg: 'All vacancies have been fetched!' });
  }

  async getSingleVacancy(
    req: RequestWithParams<{ id: string }>,
    res: Response<VacancyViewModel<VacancyType>>
  ): Promise<void> {
    const { id } = req.params;
    const vacancy = await vacancyService.getSingleVacancy(id);

    if (!vacancy) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested vacancy not found!' });
    } else {
      res.status(StatusCodes.OK).json({ data: vacancy, msg: 'Success' });
    }
  }

  async updateVacancy(
    req: RequestWithParamsAndBody<{ id: string }, VacancyType>,
    res: Response<VacancyViewModel<VacancyType>>
  ): Promise<void> {
    const { id } = req.params;
    const updatedVacancy = await vacancyService.updateVacancy(id, req.body);

    if (!updatedVacancy) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested vacancy not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ data: updatedVacancy, msg: 'Vacancy successfully updated!' });
    }
  }

  async deleteVacancy(
    req: RequestWithParams<{ id: string }>,
    res: Response<VacancyViewModel<VacancyType>>
  ): Promise<void> {
    const { id } = req.params;
    const deletedVacancy = await vacancyService.deleteVacancy(id);

    if (!deletedVacancy) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Requested vacancy not found!' });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ data: deletedVacancy, msg: 'Vacancy successfully deleted!' });
    }
  }
}

export const vacancyController = new VacancyController();
