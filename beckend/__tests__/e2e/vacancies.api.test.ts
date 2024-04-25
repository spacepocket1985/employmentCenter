import request from 'supertest';
import { app } from '../../src';

describe('/vacancies', () => {
  it('should return 200 and check for data and msg keys', async () => {
    const response = await request(app).get('/vacancies');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty(
      'msg',
      'All vacancies have been fetched!'
    );
  });

  it('should return 200 for existing vacancy', async () => {
    const response = await request(app).get('/vacancies/662920c2e1a16e84fc747d7a');

    expect(response.status).toBe(200);
  });
});
