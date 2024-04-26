import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { app } from '../../app';

import { VacancyType } from '../../models/vacancy.model';
import { VacancyCreateModel } from '../../models/vacancyCreateModel';

describe('/vacancies', () => {
  it('should return 200 and check for data and msg keys', async () => {
    const response = await request(app).get('/vacancies');

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty(
      'msg',
      'All vacancies have been fetched!'
    );
  });

  it('should return 404 for not existing vacancy', async () => {
    const response = await request(app).get(
      '/vacancies/662b33c7b4777fcc2be383b3'
    );

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it('should not create vacancy with not complete data', async () => {
    const newVacancy = {
      title: 'Big Boss',
      salary: 10000,
    };
    const response = await request(app).post('/vacancies').send(newVacancy);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it('should create a vacancy, get it, update it and then delete it', async () => {
    const newVacancy: VacancyCreateModel = {
      title: 'IT specialist',
      wageRate: 1,
      education: 'Higher',
      experience: '10 years',
      additionalInformation: 'nothing interesting',
      salary: 3000,
    };
    const createResponse = await request(app)
      .post('/vacancies')
      .send(newVacancy)
      .expect(StatusCodes.CREATED);

    const createdVacancyId = await createResponse.body.data._id;

    const updatedVacancyData: VacancyType = {
      title: 'Updated IT specialist',
      wageRate: 2,
      education: 'Master',
      experience: '15 years',
      additionalInformation: 'something interesting',
      salary: 5000,
      _id: createdVacancyId,
    };

    const getResponse = await request(app).get(
      `/vacancies/${createdVacancyId}`
    );

    const updateResponse = await request(app)
      .patch(`/vacancies/${createdVacancyId}`)
      .send(updatedVacancyData);

    const dataAfterUpdate = updateResponse.body.data;

    const deleteResponse = await request(app).delete(
      `/vacancies/${createdVacancyId}`
    );

    expect(getResponse.status).toBe(StatusCodes.OK);

    expect(updateResponse.status).toBe(StatusCodes.OK);
    expect(dataAfterUpdate.title).toBe('Updated IT specialist');
    expect(dataAfterUpdate.wageRate).toBe(2);

    expect(deleteResponse.status).toBe(StatusCodes.OK);
  });
});
