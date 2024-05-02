// Service level (Business Logic Layer):
// Description: Implements the logic for working with vacancy data.


import { Vacancy, VacancyType } from '../models/vacancy.model';
import { VacancyCreateModel } from '../models/vacancyCreateModel';

class VacancyService {
  async getAllVacancies() {
    return await Vacancy.find({}).sort('-createdAt');
  }

  async createVacancy(newVacancyData: VacancyCreateModel) {
    return await Vacancy.create(newVacancyData);
  }

  async getSingleVacancy(id: string) {
    return await Vacancy.findById(id);
  }

  async updateVacancy(id: string, updatedVacancyData: VacancyType) {
    return await Vacancy.findByIdAndUpdate(id, updatedVacancyData, { new: true });
  }

  async deleteVacancy(id: string) {
    return await Vacancy.findByIdAndDelete(id);
  }
}

export const vacancyService = new VacancyService();