import express from 'express';
import { addGetAllBooksRoute, addGetBookRoute, addSaveBookRoute, addUpdateBookRoute } from '../../src/adapter/in/web';
import request from 'supertest';
import { addNewBook, getAllBooks, getBook, updateBook } from '../../src/application/port/in';
import { createAppWithFramesAround } from '../../src/app-frames';
import { Book, BookState } from '../../src/domain/book';
import { ObjectNotFoundError } from '../../src/application/common';
import { ValidationError } from '../../src/domain/common';

describe('Web Adapter', () => {
  let author: string, title: string, testBook: BookState;

  beforeEach(() => {
    author = 'Test author';
    title = 'Test title';
    testBook = Book.createNew({ author, title }).currentState();
  });

  describe('GET /api/books', () => {
    it('responds with all books', (done) => {
      // given
      const allBooks = [testBook];
      const app = createAppWithFramesAround((app) => {
        const bookRoutes = express.Router();
        const getAllBooksMock: getAllBooks = () => Promise.resolve(allBooks);
        addGetAllBooksRoute(bookRoutes, getAllBooksMock);
        app.use('/api', bookRoutes);
      });
      // when
      request(app)
        .get('/api/books')
        // then
        .expect(200, allBooks, done);
    });

    it('responds with Internal Server Error (500) if service rejects', (done) => {
      const app = createAppWithFramesAround((app) => {
        const bookRoutes = express.Router();
        const getAllBooksMock: getAllBooks = () => Promise.reject(new Error('Crash...'));
        addGetAllBooksRoute(bookRoutes, getAllBooksMock);
        app.use('/api', bookRoutes);
      });
      // when
      request(app)
        .get('/api/books')
        // then
        .expect(500, done);
    });
  });

  describe('GET /api/books/:id', () => {
    it('responds with a book', (done) => {
      // given
      const app = createAppWithFramesAround((app) => {
        const bookRoutes = express.Router();
        const getBookMock: getBook = () => Promise.resolve(testBook);
        addGetBookRoute(bookRoutes, getBookMock);
        app.use('/api', bookRoutes);
      });
      // when
      request(app)
        .get(`/api/books/${testBook.id}`)
        // then
        .expect(200, testBook, done);
    });

    it('responds with Not Found (404) if service rejects with ObjectNotFoundError', (done) => {
      // given
      const app = createAppWithFramesAround((app) => {
        const bookRoutes = express.Router();
        const getBookMock: getBook = () => Promise.reject(new ObjectNotFoundError<string>('Book', testBook.id));
        addGetBookRoute(bookRoutes, getBookMock);
        app.use('/api', bookRoutes);
      });
      // when
      request(app)
        .get(`/api/books/${testBook.id}`)
        //  then
        .expect(404, done);
    });
  });

  describe('POST /api/books', () => {
    it('responds with Created (201)', (done) => {
      // given
      const addNewBookMock: addNewBook = jest.fn(() => Promise.resolve());
      const newBook = { author, title };
      const app = createAppWithFramesAround((app) => {
        const bookRoutes = express.Router();
        addSaveBookRoute(bookRoutes, addNewBookMock);
        app.use('/api', bookRoutes);
      });
      // when
      request(app)
        .post('/api/books')
        .send(newBook)
        // then
        .expect(204)
        .then(() => {
          expect(addNewBookMock).toHaveBeenCalledWith(newBook);
          done();
        });
    });

    it('responds with Bad Request (400) if service rejects with ValidationError', (done) => {
      // given
      const addNewBookMock: addNewBook = jest.fn(() => Promise.reject(new ValidationError('Invalid content')));
      const app = createAppWithFramesAround((app) => {
        const bookRoutes = express.Router();
        addSaveBookRoute(bookRoutes, addNewBookMock);
        app.use('/api', bookRoutes);
      });
      // when
      request(app)
        .post('/api/books')
        .send({})
        // then
        .expect(400, done);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('responds with OK (200)', (done) => {
      // given
      const updateBookMock: updateBook = jest.fn(() => Promise.resolve());
      const app = createAppWithFramesAround((app) => {
        const bookRoutes = express.Router();
        addUpdateBookRoute(bookRoutes, updateBookMock);
        app.use('/api', bookRoutes);
      });
      // when
      request(app)
        .put(`/api/books/${testBook.id}`)
        .send(testBook)
        // then
        .expect(204)
        .then(() => {
          expect(updateBookMock).toHaveBeenCalledWith(testBook);
          done();
        });
    });
  });
});
