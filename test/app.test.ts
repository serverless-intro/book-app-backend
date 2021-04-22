/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore: esModuleInterop flag set in tsconfig.json
import request from 'supertest';
// @ts-ignore: esModuleInterop flag set in tsconfig.json
import app from '../src/app';
import { BookState } from '../src/domain/book';

describe('App', () => {
  it('responds with 404 on /fake-url', (done) => {
    request(app).get('/fake-url').expect(404, done);
  });
  it('responds with a list of books on /api/books', (done) => {
    request(app)
      .get('/api/books')
      .expect(200)
      .then((response) => {
        const books: BookState[] = response.body;
        expect(books).toBeDefined();
        expect(books).toHaveLength(4);
        done();
      });
  });
});
