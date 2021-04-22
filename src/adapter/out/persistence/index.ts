import { loadAllBooks, loadBook, persistNewBook, persistUpdatedBook } from '../../../application/port/out';
import { BookId, BookState } from '../../../domain/book';
import { ObjectNotFoundError } from '../../../application/common';

let books = [
  { id: '5VVGTSPMKHH3A8', author: 'Douglas Crockford', title: 'JavaScript: The Good Parts' },
  { id: '5VVGTSPMKHH3A9', author: 'Joshua Bloch', title: 'Effective Java' },
  { id: '5VVGTSPMKHH3A0', author: 'Robert C. Martin', title: 'Clean Code' },
  { id: '5VVGTSPMKHH3A1', author: 'Eric Evans', title: 'Domain-Driven Design' },
];

export function loadBookFactory(): loadBook {
  return function (id: BookId): Promise<BookState> {
    const book = books.find((book) => book.id === id.value);
    return book ? Promise.resolve(book) : Promise.reject(new ObjectNotFoundError<string>('Book', id.value));
  };
}

export function loadAllBooksFactory(): loadAllBooks {
  return function (): Promise<BookState[]> {
    return Promise.resolve([...books]);
  };
}

export function persistUpdatedBookFactory(): persistUpdatedBook {
  return function (bookToUpdate: BookState): Promise<void> {
    books = books.map((book) => (book.id === bookToUpdate.id ? bookToUpdate : book));
    return Promise.resolve();
  };
}

export function persistNewBookFactory(): persistNewBook {
  return function (bookToAdd: BookState): Promise<void> {
    books = [...books, bookToAdd];
    return Promise.resolve();
  };
}
